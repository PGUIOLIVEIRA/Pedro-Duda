import React from 'react';
import { Heart, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="wood-texture text-amber-200/80 text-center py-10 px-4 mt-16 border-t border-amber-700/40">
      <div className="max-w-xl mx-auto space-y-3">
        <p className="font-script text-4xl sm:text-5xl text-amber-100 flex items-center justify-center gap-2">
          <span>Pedro &amp; Duda</span>
          <Heart className="w-5 h-5 text-terracotta fill-terracotta inline animate-pulse" />
        </p>

        <p className="text-xs uppercase tracking-widest text-amber-400/90 font-medium">
          Bodas de Madeira • 5 Anos Te Amando Eternamente
        </p>

        <p className="font-serif italic text-sm text-amber-200/70 max-w-md mx-auto">
          "Eu escolheria você ontem, hoje, amanhã e por todos os dias da minha vida."
        </p>

        <div className="pt-4 border-t border-amber-800/40 text-[11px] text-amber-300/60 flex items-center justify-center gap-2">
          <span>🔒 Homenagem protegida e preservada com amor</span>
        </div>
      </div>
    </footer>
  );
};
