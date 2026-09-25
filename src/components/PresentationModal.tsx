import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Heart, TreePine, Sparkles } from 'lucide-react';
import { TimelineCard } from '../types';

interface PresentationModalProps {
  isOpen: boolean;
  timeline: TimelineCard[];
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  timeline,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  // Slides:
  // 0: Romantic Intro
  // 1: Love excerpt & Mari Tribute
  // 2+: Each Timeline Card
  const totalSlides = 2 + timeline.length;

  const handlePrev = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoplay || !isOpen) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoplay, isOpen, handleNext]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
      setIsAutoplay(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoplay((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-gradient-to-br from-wood-950 via-wood-900 to-wood-950 flex flex-col justify-between p-4 sm:p-8 md:p-12 text-amber-50 select-none overflow-hidden"
    >
      {/* Presentation Top Bar */}
      <div className="flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-wood-400" />
          <span className="font-script text-2xl sm:text-3xl text-amber-200">
            Pedro &amp; Duda • Bodas de Madeira
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition ${
              isAutoplay
                ? 'bg-terracotta text-white border border-red-400/50'
                : 'bg-wood-800 text-amber-200 hover:bg-wood-700'
            }`}
            title="Reprodução automática a cada 6 segundos"
          >
            {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoplay ? 'Pausar Slides' : 'Auto Play'}</span>
          </button>

          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white text-xl p-2 bg-wood-800 hover:bg-wood-700 rounded-lg transition"
            title="Sair (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Slide Content Area */}
      <div className="my-auto max-w-4xl mx-auto text-center px-4 w-full flex flex-col items-center justify-center transition-all duration-500">
        {currentSlide === 0 && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div className="inline-block p-4 rounded-full bg-wood-800/80 border border-amber-600/40 mb-2 shadow-inner">
              <Heart className="w-12 h-12 text-terracotta fill-terracotta animate-pulse" />
            </div>

            <h2 className="font-script text-6xl sm:text-7xl md:text-8xl text-amber-100 drop-shadow-lg">
              Pedro &amp; Duda
            </h2>

            <p className="font-serif italic text-2xl sm:text-3xl text-amber-200/90 font-light max-w-2xl mx-auto">
              "Para minha princesa, a mulher que mudou toda a minha vida em 5 anos."
            </p>

            <div className="mt-8 p-6 sm:p-8 bg-wood-900/90 rounded-2xl border border-amber-600/30 font-serif text-lg sm:text-xl text-amber-100 leading-relaxed shadow-2xl">
              "Tudo o que vivemos antes foi apenas o ponto de partida para uma vida inteira juntos. E hoje essa vida já completa 5 anos. Bodas de Madeira, né? ❤️"
            </div>
          </div>
        )}

        {currentSlide === 1 && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 text-sm tracking-widest uppercase">
              <Sparkles className="w-4 h-4 inline mr-1 text-amber-400" /> A Nossa Maior Vitória
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-amber-100">
              A Mari veio para ser LUZ
            </h2>

            <div className="p-6 sm:p-8 bg-wood-900/90 rounded-2xl border border-amber-600/30 font-serif text-lg sm:text-xl text-amber-100 leading-relaxed shadow-2xl space-y-4">
              <p className="italic">
                "Ver você se tornar mãe foi, sem dúvida, uma das coisas que mais me transformou. Ver a sua força, a sua garra e a sua coragem diante da dor intensa e do cansaço extremo me fez entender que eu precisava sempre buscar ser melhor por vocês."
              </p>
              <p className="text-amber-300 font-semibold pt-2">
                "Obrigado por me transformar no homem que sou e por me dar a capacidade de ser Pai. Obrigado por me lembrar que o nosso SIM é eterno."
              </p>
            </div>
          </div>
        )}

        {currentSlide >= 2 && (
          <div className="space-y-5 max-w-4xl w-full animate-fadeIn">
            {(() => {
              const yearObj = timeline[currentSlide - 2];
              if (!yearObj) return null;

              return (
                <>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">
                    {yearObj.yearTitle}
                  </h2>

                  {yearObj.photos && yearObj.photos.length > 0 ? (
                    <div className="flex flex-wrap justify-center items-center gap-4 my-4 max-h-[50vh] overflow-y-auto p-2 scrollbar-thin">
                      {yearObj.photos.map((p) => (
                        <div key={p.id} className="relative group rounded-xl overflow-hidden shadow-2xl border border-amber-600/40">
                          <img
                            src={p.url}
                            alt={p.title || 'Foto de memória'}
                            className="h-48 sm:h-64 max-w-full object-cover rounded-xl"
                          />
                          {p.title && (
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 p-2 text-xs text-amber-100 italic truncate">
                              {p.title}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-wood-800/50 rounded-xl border border-amber-700/30 text-amber-300 italic">
                      Memórias e histórias deste capítulo lindo...
                    </div>
                  )}

                  <p className="font-serif text-lg sm:text-xl text-amber-200 max-w-2xl mx-auto italic leading-relaxed">
                    "{yearObj.caption}"
                  </p>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Presentation Bottom Navigation */}
      <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto w-full z-20">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-full bg-wood-800 text-amber-100 hover:bg-amber-700 transition flex items-center gap-2 border border-amber-700/30"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span className="text-xs sm:text-sm text-amber-300 font-medium">
            Slide {currentSlide + 1} de {totalSlides}
          </span>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-full bg-terracotta text-white hover:bg-red-700 transition flex items-center gap-2 font-medium shadow-lg"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-terracotta' : 'w-2 bg-wood-700 hover:bg-wood-500'
              }`}
              title={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
