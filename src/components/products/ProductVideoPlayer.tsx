'use client';

import { useEffect, useState } from 'react';
import { FiPlay, FiX } from 'react-icons/fi';

interface Props {
  src: string;
  poster?: string;
}

/* Convert various YouTube URL forms → embed URL with autoplay */
function youtubeEmbed(src: string): string | null {
  const m = src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{6,})/
  );
  if (!m) return null;
  return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&modestbranding=1`;
}

function youtubeThumb(src: string): string | null {
  const m = src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{6,})/
  );
  if (!m) return null;
  return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
}

/* Convert Google Drive share URL → preview embed URL */
function drivePreview(src: string): string | null {
  const m = src.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (!m) return null;
  return `https://drive.google.com/file/d/${m[1]}/preview`;
}

export default function ProductVideoPlayer({ src, poster }: Props) {
  const [open, setOpen] = useState(false);

  const yt = youtubeEmbed(src);
  const drive = drivePreview(src);
  const ytThumb = youtubeThumb(src);
  const thumb = poster || ytThumb;

  // Lock body scroll when modal open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Thumbnail trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-md hover:shadow-xl transition-shadow"
        aria-label="Play product video"
      >
        {thumb ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={thumb} alt="Product video preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 group-hover:bg-amber-500 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
            <FiPlay size={28} className="text-slate-900 group-hover:text-white ml-1 transition-colors" />
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/55 backdrop-blur-sm rounded-md text-white text-xs font-medium uppercase tracking-wider">
          ▶ Watch Video
        </div>
      </button>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <FiX size={22} />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {yt ? (
              <iframe
                src={yt}
                title="Product video"
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : drive ? (
              <iframe
                src={drive}
                title="Product video"
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                src={src}
                poster={poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
