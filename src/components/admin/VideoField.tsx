'use client';

import { useState } from 'react';
import { adminUpload } from '@/lib/admin-auth';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiVideo, FiYoutube } from 'react-icons/fi';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function VideoField({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!(f.type || '').startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    setUploading(true);
    try {
      const d = await adminUpload([f]);
      if (d.success && d.data?.[0]) {
        onChange(d.data[0]);
        toast.success('Video uploaded');
      } else {
        toast.error(d.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload error');
    }
    setUploading(false);
  };

  const isYouTube = /youtu(?:be\.com|\.be)/.test(value);
  const isDataUrl = value.startsWith('data:video/');
  const isFileUrl = !!value && !isYouTube;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Product Video (optional)</label>

      {value ? (
        <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            {isYouTube ? <FiYoutube size={18} /> : <FiVideo size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800">
              {isYouTube ? 'YouTube video' : isDataUrl ? 'Uploaded video file' : 'External video URL'}
            </p>
            <p className="text-xs text-slate-500 truncate">{isDataUrl ? '(stored as data URL)' : value}</p>
            {isFileUrl && !isDataUrl && (
              <video src={value} className="mt-2 max-w-xs rounded-lg" controls preload="metadata" />
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            title="Remove video"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-sm whitespace-nowrap">
          <FiUpload size={14} /> {uploading ? 'Uploading…' : 'Upload File'}
          <input type="file" accept="video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste YouTube / Drive / Cloudinary URL"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">
        Direct uploads ≤ 20 MB. For longer videos, host on YouTube / Drive / Cloudinary and paste the URL.
      </p>
    </div>
  );
}
