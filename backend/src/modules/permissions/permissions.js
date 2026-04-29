// Canonical permission catalogue. Each entry is a key (used in code) plus a
// human label and a group (used by the admin UI). Adding a new permission
// here automatically surfaces it in the Super Admin → Staff editor.
//
// Convention: `<resource>:<action>` (lowercase, snake-case for resource).

export const PERMISSION_GROUPS = [
  {
    group: "Products",
    permissions: [
      { key: "products:read", label: "View products" },
      { key: "products:write", label: "Create / edit / delete products" },
    ],
  },
  {
    group: "Categories & Brands",
    permissions: [
      { key: "categories:write", label: "Manage categories" },
      { key: "brands:write", label: "Manage brands" },
      { key: "ingredients:write", label: "Manage ingredients" },
    ],
  },
  {
    group: "Orders",
    permissions: [
      { key: "orders:read", label: "View orders" },
      { key: "orders:update", label: "Update order status / shipping" },
    ],
  },
  {
    group: "Customers",
    permissions: [
      { key: "customers:read", label: "View customers" },
      { key: "customers:manage", label: "Block / unblock customers" },
    ],
  },
  {
    group: "Reviews",
    permissions: [
      { key: "reviews:moderate", label: "Approve / hide reviews" },
    ],
  },
  {
    group: "Analytics",
    permissions: [
      { key: "analytics:read", label: "View dashboard analytics" },
    ],
  },
  {
    group: "Settings",
    permissions: [
      { key: "settings:write", label: "Edit site settings" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

export const isValidPermission = (key) => ALL_PERMISSIONS.includes(key);
