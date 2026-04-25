import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { inputCls } from './shared';

// Generic bullet-list editor used for the product Benefits and Uses sections.
// Stores values as a flat string[] in form state — empty trailing rows are
// filtered out at submit time by useProductManage.
export default function BulletListEditor({ value = [], onChange, placeholder, addLabel = 'Add bullet' }) {
  const items = value.length ? value : [''];

  const setAt = (idx, next) => {
    const copy = [...items];
    copy[idx] = next;
    onChange(copy);
  };

  const addRow = () => onChange([...items, '']);

  const removeRow = (idx) => {
    if (items.length === 1) {
      onChange([]);
      return;
    }
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-semibold flex items-center justify-center shrink-0">
            {idx + 1}
          </span>
          <input
            value={item}
            onChange={(e) => setAt(idx, e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={() => removeRow(idx)}
            className="text-slate-400 hover:text-red-600 p-1.5"
            aria-label="Remove bullet"
          >
            <FiX size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="text-xs font-medium text-[#007074] hover:underline flex items-center gap-1"
      >
        <FiPlus size={12} /> {addLabel}
      </button>
    </div>
  );
}
