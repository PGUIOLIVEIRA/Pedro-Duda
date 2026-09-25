import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { TimelineCard } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  timeline: TimelineCard[];
  yearIndex: number;
  photoIndex: number;
  onClose: () => void;
  onNavigate: (yearIndex: number, photoIndex: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  timeline,
  yearIndex,
  photoIndex,
  onClose,
  onNavigate,
}) => {
  const currentYear = timeline[yearIndex];
  const photos = currentYear?.photos || [];
  const totalPhotosInYear = photos.length;
  const currentPhoto = photos[photoIndex];

  const handlePrev = React.useCallback(() => {
    if (totalPhotosInYear <= 0) return;
    const newPhotoIndex = (photoIndex - 1 + totalPhotosInYear) % totalPhotosInYear;
    onNavigate(yearIndex, newPhotoIndex);
  }, [photoIndex, totalPhotosInYear, onNavigate, yearIndex]);

  const handleNext = React.useCallback(() => {
    if (totalPhotosInYear <= 0) return;
    const newPhotoIndex = (photoIndex + 1) % totalPhotosInYear;
    onNavigate(yearIndex, newPhotoIndex);
  }, [photoIndex, totalPhotosInYear, onNavigate, yearIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !currentYear || totalPhotosInYear === 0 || !currentPhoto) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center p-4 backdrop-blur-sm select-none"
    >
      {/* Lightbox Header */}
      <div className="w-full flex justify-between items-center text-white px-2 sm:px-6 py-2 z-20">
        <div>
          <span className="text-xs sm:text-sm font-light text-amber-200 block">
            {currentYear.yearTitle}
          </span>
          <span className="text-xs text-amber-400/80">
            Foto {photoIndex + 1} de {totalPhotosInYear}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentPhoto?.url && (
            <a
              href={currentPhoto.url}
              download={currentPhoto.title || 'foto-bodas-de-madeira.jpg'}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-amber-300 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              title="Baixar imagem"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="text-white/90 hover:text-amber-400 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-2xl focus:outline-none"
            title="Fechar (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lightbox Main Content */}
      <div className="relative flex-grow flex items-center justify-center w-full max-w-6xl px-2 my-auto">
        {totalPhotosInYear > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 text-white/90 hover:text-amber-300 bg-black/50 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition border border-white/20 shadow-lg"
            title="Foto Anterior"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        <div className="text-center max-h-[82vh] flex flex-col items-center justify-center w-full">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title || 'Foto de memória'}
            className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl border border-amber-700/40 select-none animate-fadeIn"
          />
          {currentPhoto.title && (
            <p className="text-amber-100 font-serif text-base sm:text-xl mt-3 max-w-2xl px-4 italic drop-shadow-md">
              "{currentPhoto.title}"
            </p>
          )}
        </div>

        {totalPhotosInYear > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 text-white/90 hover:text-amber-300 bg-black/50 hover:bg-black/80 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition border border-white/20 shadow-lg"
            title="Próxima Foto"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Lightbox Footer */}
      <div className="w-full text-center py-2 text-xs text-amber-300/60">
        Use as setas do teclado (← / →) para navegar • Pressione ESC para fechar
      </div>
    </div>
  );
};
