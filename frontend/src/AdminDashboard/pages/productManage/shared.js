import { Quill } from 'react-quill-new';

// Extra font families exposed on the Quill picker. Must be kept in sync with
// the `.ql-font-*` selectors in index.css.
export const FONT_WHITELIST = [
  'sans-serif', 'serif', 'monospace', 'inter', 'poppins', 'playfair', 'roboto', 'lora',
];

// Register both Font and Header on import. The default Quill build only ships
// header levels 1/2 — explicitly registering the format with the levels we
// want fixes the "headings have no effect" bug in the description editor.
const Font = Quill.import('formats/font');
Font.whitelist = FONT_WHITELIST;
Quill.register(Font, true);

const Header = Quill.import('formats/header');
Quill.register(Header, true);

// Block paste of inline `style="font-weight: bold"` runs from Word/Docs/etc.
// Quill keeps semantic `<strong>` and class-based formatting; the style attr
// was the source of the "every paste comes in bold" report.
const Clipboard = Quill.import('modules/clipboard');
const Delta = Quill.import('delta');

export class CleanClipboard extends Clipboard {
  onPaste(e) {
    // Quill's default onPaste already runs through `convert()`; we hook the
    // result via a paste matcher below. Nothing to do here.
    super.onPaste(e);
  }
}

// Strip any inline color/font-weight/size styles on paste so the editor
// preserves heading/paragraph structure but not foreign theming. Whitelisted
// formats survive (bold via <strong>, italic via <em>, lists, links, headings).
const STRIPPABLE_INLINE_STYLES = ['font-weight', 'font-size', 'font-family', 'color', 'background-color', 'line-height'];

export const PASTE_MATCHERS = [
  // Strip inline styling on every element that comes through the paste pipe.
  ['*', (node, delta) => {
    if (!node.style) return delta;
    STRIPPABLE_INLINE_STYLES.forEach((prop) => {
      try { node.style.removeProperty(prop); } catch { /* noop */ }
    });
    return delta;
  }],
  // <span> with no remaining attributes adds noise — flatten to plain text.
  ['SPAN', (node, delta) => {
    if (!node.attributes || node.attributes.length === 0) {
      return new Delta().insert(node.textContent || '');
    }
    return delta;
  }],
];

// Strip the bold attribute coming from pasted content into the *short*
// description editor specifically — short descriptions should never be bold.
export const SHORT_PASTE_MATCHERS = [
  ...PASTE_MATCHERS,
  ['*', (_node, delta) => {
    delta.ops = (delta.ops || []).map((op) => {
      if (op.attributes && op.attributes.bold) {
        const { bold, ...rest } = op.attributes;
        return Object.keys(rest).length ? { ...op, attributes: rest } : { insert: op.insert };
      }
      return op;
    });
    return delta;
  }],
];

export const QUILL_FORMATS = [
  'header', 'font', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent', 'align',
  'link', 'image', 'video',
];

// Short description deliberately excludes `header`, `font`, `align`, `color` —
// it's a one-line blurb in listings. Excluding `bold` from this list ALSO
// disables the toolbar bold button, which is intentional: the previous
// behaviour was that `<p>` tags were getting auto-promoted to `<strong>` on
// some browsers and there was no way to undo it from the toolbar.
export const SHORT_QUILL_FORMATS = [
  'italic', 'underline', 'list', 'bullet', 'link',
];

export const slugify = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const emptyVariant = () => ({
  sku: '',
  size: '',
  packSize: '',
  color: '',
  ingredients: '',
  originalPrice: '',
  salePrice: '',
  stock: '',
});

export const emptyItemDetails = () => ({
  itemForm: '',
  containerType: '',
  ageRange: '',
  dosageForm: '',
});

export const emptyForm = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  barcode: '',
  benefits: [],
  uses: [],
  itemDetails: emptyItemDetails(),
  category: '',
  categories: [],
  brand: '',
  status: 'draft',
  isFeatured: false,
  isTrending: false,
  isDeal: false,
  variants: [emptyVariant()],
  thumbnail: null,
  media: [],
};

export const stripHtmlLen = (html) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().length;

export const inputCls =
  'w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074] transition-colors';
