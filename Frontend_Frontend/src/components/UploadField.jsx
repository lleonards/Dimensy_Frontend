import { UploadCloud } from 'lucide-react';

export function UploadField({ label, helper, previewUrl, onChange, accept = 'image/*' }) {
  return (
    <label className="flex cursor-pointer flex-col gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-500">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {previewUrl ? (
        <img src={previewUrl} alt={label} className="h-36 w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-2xl bg-white text-slate-400 dark:bg-slate-950">
          <UploadCloud className="h-8 w-8" />
        </div>
      )}
      <span className="text-xs text-slate-500 dark:text-slate-400">{helper}</span>
      <input type="file" accept={accept} className="hidden" onChange={onChange} />
    </label>
  );
}
