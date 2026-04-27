import Order from "../orders/order.model.js";
import { User } from "../users/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendEmail } from '../../utils/email.js';

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "partially_shipped",
  "delivered",
  "cancelled",
  "returned",
];

const fmtPKR = (n) => `Rs ${Math.round(n || 0).toLocaleString()}`;

// Lists orders for the admin dashboard. Supports status filter, free-text search
// across customer name/email and order id, and pagination.
export const listOrders = async (query = {}) => {
  const { status = "all", search = "", page = 1, limit = 25, from, to } = query;

  const filter = {};
  if (VALID_STATUSES.includes(status)) filter.status = status;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  // Search: matches against customer name/email/phone AND the order id —
  // both the full 24-char ObjectId (if pasted) and the visible 6-char tail
  // shown in the UI (#A1B2C3). `_id` is an ObjectId, so we have to stringify
  // it via $expr + $toString to run a regex against it.
  if (search) {
    const trimmed = search.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(escaped, "i");
    const or = [];

    // Customer matches
    const userIds = await User.find({
      $or: [{ name: rx }, { email: rx }, { phone: rx }],
    }).distinct("_id");
    if (userIds.length) or.push({ user: { $in: userIds } });

    // Order id matches — supports full id or any hex substring (tail / prefix).
    if (/^[0-9a-fA-F]+$/.test(trimmed)) {
      // Full 24-char ObjectId — direct equality is cheaper than $expr.
      if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
        or.push({ _id: trimmed });
      }
      // Hex substring (e.g. last 6 of #A1B2C3) — match against the
      // string form of _id. Anchored to end of id so trailing-tail searches
      // are stable; falls back to anywhere-in-id otherwise.
      if (trimmed.length >= 4) {
        or.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: escaped,
              options: "i",
            },
          },
        });
      }
    }

    // No matchable predicate (e.g. empty search after trimming) — leave the
    // filter unconstrained instead of returning zero rows for everything.
    if (or.length) filter.$or = or;
  }

  const pageNum = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 100);

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page: pageNum, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
  };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id).lean();
  if (!order) throw new ApiError(404, "Order not found");
  return order;
};

const renderItemsBlock = (heading, accent, items) => {
  if (!items.length) return "";
  const rows = items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 6px;font-size:13px;color:#222;border-bottom:1px solid #f0f0f0;">
            <div style="font-weight:600;">${it.name}</div>
            <div style="font-size:11px;color:#888;">SKU ${it.sku} · qty ${it.quantity}</div>
          </td>
          <td style="padding:8px 6px;font-size:13px;color:#222;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">
            ${fmtPKR(it.subtotal ?? it.price * it.quantity)}
          </td>
        </tr>`
    )
    .join("");
  return `
    <div style="background:#fff;border:1px solid #e9e9e9;border-radius:10px;padding:14px;margin-bottom:14px;">
      <h3 style="margin:0 0 10px 0;font-size:13px;color:${accent};text-transform:uppercase;letter-spacing:1px;">
        ${heading} (${items.length})
      </h3>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
};

const renderTrackingBlock = (order) => {
  if (!order.trackingCompany && !order.trackingLink && !order.trackingId) return "";
  return `
    <div style="background:#f0fdfa;border-radius:10px;padding:16px;margin-bottom:14px;border:1px solid #ccfbf1;text-align:left;">
      <h3 style="margin:0 0 12px 0;font-size:13px;color:#007074;text-transform:uppercase;letter-spacing:1px;">Tracking Information</h3>
      ${order.trackingCompany ? `<p style="margin:0 0 8px 0;font-size:13px;color:#444;"><b>Courier:</b> ${order.trackingCompany}</p>` : ''}
      ${order.trackingId ? `
        <div style="margin:12px 0;">
          <p style="margin:0 0 4px 0;font-size:12px;color:#666;">Tracking Number:</p>
          <div style="background:#fff;border:1px dashed #2dd4bf;padding:8px 12px;border-radius:6px;display:inline-block;font-family:monospace;font-size:16px;color:#007074;font-weight:bold;letter-spacing:1px;">
            ${order.trackingId}
          </div>
        </div>
      ` : ''}
      ${order.trackingLink ? `<div style="margin-top:14px;"><a href="${order.trackingLink}" target="_blank" style="background:#007074;color:#fff;padding:8px 16px;text-decoration:none;border-radius:6px;font-size:12px;font-weight:bold;display:inline-block;">Track Package Online</a></div>` : ''}
    </div>`;
};

const renderStatusEmail = ({ order, status, customerName, shortOrderId }) => {
  const shipped = (order.items || []).filter((i) => i.shipped);
  const pending = (order.items || []).filter((i) => !i.shipped);

  // Only the shipping-related transitions get the per-item breakdown — the
  // rest fall back to the original concise template.
  const isShipTransition = status === "shipped" || status === "partially_shipped";
  const greetingLine = isShipTransition
    ? status === "shipped"
      ? "Great news — every item in your order has been dispatched."
      : "Part of your order has been dispatched. The remaining items are still being prepared."
    : `The status of your order <b>#${shortOrderId}</b> has been updated.`;

  const itemsSection = isShipTransition
    ? `
      ${renderItemsBlock("Shipped now", "#007074", shipped)}
      ${renderItemsBlock("Still pending", "#b45309", pending)}
    `
    : "";

  return `
    <div style="background:#f9fafb;padding:15px;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:720px;margin:auto;background:#fff;border-radius:14px;border:1px solid #eee;overflow:hidden">
        <div style="height:4px;background:linear-gradient(to right,#007074,#2dd4bf,#007074)"></div>
        <div style="padding:18px">
          <div style="text-align:center">
            <h2 style="font-size:18px;font-weight:800;color:#222;margin-bottom:6px">Order Update</h2>
            <p style="color:#666;font-size:12px;line-height:1.4;margin-bottom:16px">
              Hello <b>${customerName}</b>, ${greetingLine}
            </p>

            <div style="background:#f3f4f6;border-radius:10px;padding:14px;margin-bottom:14px;border:1px dashed #007074">
              <p style="font-size:11px;color:#999;margin:0 0 5px 0;text-transform:uppercase;letter-spacing:1px">Current Status</p>
              <span style="font-size:22px;font-weight:900;letter-spacing:4px;color:#007074;font-family:monospace;text-transform:uppercase">
                ${status.replace(/_/g, " ")}
              </span>
            </div>

            ${itemsSection}
            ${renderTrackingBlock(order)}
          </div>

          <div style="border-top:1px solid #eee;padding-top:12px">
            <p style="color:#999;font-size:11px;line-height:1.4;text-align:center">
              Thank you for shopping with us! If you have any questions, please contact our customer support.
            </p>
          </div>
        </div>

        <div style="background:#222;padding:12px;text-align:center">
          <p style="color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;margin-bottom:4px">Stylogist</p>
          <p style="color:#777;font-size:9px">Bahawalpur • Pakistan</p>
        </div>
      </div>
    </div>`;
};

export const updateOrderStatus = async (id, status, trackingCompany, trackingLink, trackingId, shippedItemIndexes) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Use one of: ${VALID_STATUSES.join(", ")}`);
  }

  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) throw new ApiError(404, "Order not found");

  if (trackingCompany !== undefined) order.trackingCompany = trackingCompany;
  if (trackingLink !== undefined) order.trackingLink = trackingLink;
  if (trackingId !== undefined) order.trackingId = trackingId;

  // Apply per-item shipping selection when transitioning into a shipped
  // state. The admin can mark a subset of items; the order-level status is
  // promoted to "shipped" only if everything is now shipped, otherwise it
  // settles into the partial state.
  let derivedStatus = status;
  if (status === "shipped" || status === "partially_shipped") {
    const total = order.items.length;
    const indexes = Array.isArray(shippedItemIndexes) ? shippedItemIndexes : null;

    order.items.forEach((item, idx) => {
      // Explicit selection wins. If no selection was sent and the admin
      // chose "shipped" outright, treat all items as shipped.
      const willShip = indexes
        ? indexes.includes(idx)
        : status === "shipped";

      if (willShip && !item.shipped) {
        item.shipped = true;
        item.shippedAt = new Date();
      }
      if (!willShip && status === "partially_shipped") {
        // Don't unship items that were previously marked. Partial shipments
        // are additive — once dispatched, an item stays dispatched.
      }
    });

    const shippedCount = order.items.filter((i) => i.shipped).length;
    if (shippedCount === 0) {
      throw new ApiError(400, "Select at least one item to mark as shipped.");
    }
    derivedStatus = shippedCount === total ? "shipped" : "partially_shipped";
  } else {
    // Non-shipping transitions: clear per-item flags only on cancel/return so
    // the customer-facing breakdown stays consistent.
    if (status === "cancelled" || status === "returned") {
      // Leave shipped flags alone — they reflect history.
    }
  }

  order.status = derivedStatus;
  await order.save();

  const customerEmail = order.user?.email || order.guest?.email;
  const customerName = order.user?.name || order.guest?.name || 'Valued Customer';
  const shortOrderId = String(order._id).slice(-6).toUpperCase();

  if (customerEmail) {
    try {
      await sendEmail({
        email: customerEmail,
        subject: `Stylogist - Order #${shortOrderId} Update`,
        message: renderStatusEmail({
          order,
          status: derivedStatus,
          customerName,
          shortOrderId,
        }),
      });
    } catch (error) {
      console.error(`[Order Update] Failed to send email to ${customerEmail}:`, error);
    }
  }

  return order.toObject();
};
