import React from 'react';
import { FiImage, FiLoader, FiUploadCloud, FiX } from 'react-icons/fi';
import { SectionTitle } from './fields';

// Thumbnail + gallery upload panels. Extracted so the ProductForm file stays
// lean. Each label carries an explicit recommended image size so the admin
// knows what to ship to the storefront.
export default function MediaUploader({
  form,
  onThumbnailUpload,
  onRemoveThumbnail,
  onMediaUpload,
  onRemoveMedia,
  uploadingOne,
  uploadingMany,
}) {
  return (
    <>
      <Panel title="Thumbnail">
        <UploadHint>
          Recommended <strong>1000 × 1000&nbsp;px</strong> square · JPG / PNG / WebP · up to 10&nbsp;MB.
          Used on list cards and the cart.
        </UploadHint>
        {form.thumbnail ? (
          <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
            <img
              src={form.thumbnail.url}
              alt={form.thumbnail.alt}
              width="400"
              height="400"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onRemoveThumbnail}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow hover:bg-white"
            >
              <FiX size={14} />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/70 to-transparent text-xs text-white p-2 truncate">
              /{form.thumbnail.slug}
            </div>
          </div>
        ) : (
          <UploadLabel isLoading={uploadingOne} onChange={onThumbnailUpload}>
            Upload thumbnail (stored as webp)
          </UploadLabel>
        )}
      </Panel>

      <Panel title="Gallery images">
        <UploadHint>
          Recommended <strong>1000 × 1000&nbsp;px</strong> (min 800&nbsp;px on longest side) ·
          up to <strong>12 images</strong> per product.
        </UploadHint>
        <UploadLabel isLoading={uploadingMany} onChange={onMediaUpload} multiple>
          Click to upload (multiple, webp)
        </UploadLabel>

        {form.media.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {form.media.map((m, idx) => (
              <div key={m.url} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group">
                <img
                  src={m.url}
                  alt={m.alt || `image ${idx + 1}`}
                  width="200"
                  height="200"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[10px] font-semibold rounded px-1.5 py-0.5">
                  {idx + 1}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveMedia(m.url)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-slate-600 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <SectionTitle icon={<FiImage size={14} />}>{title}</SectionTitle>
      {children}
    </div>
  );
}

export function UploadHint({ children }) {
  return (
    <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-3 py-2 leading-relaxed">
      {children}
    </p>
  );
}

function UploadLabel({ isLoading, onChange, multiple, children }) {
  return (
    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-[#007074] transition-colors">
      {isLoading ? (
        <FiLoader className="animate-spin text-[#007074]" size={22} />
      ) : (
        <>
          <FiUploadCloud size={22} className="text-[#007074] mb-1" />
          <span className="text-xs text-slate-500">{children}</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
