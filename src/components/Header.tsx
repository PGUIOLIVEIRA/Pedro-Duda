import React from 'react';
import { TreePine, Play, Printer, Download, Upload } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { CountdownTimer } from './CountdownTimer';

interface HeaderProps {
  weddingDate: string;
  onUpdateWeddingDate: (date: string) => void;
  onStartPresentation: () => void;
  onExportBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  weddingDate,
  onUpdateWeddingDate,
  onStartPresentation,
  onExportBackup,
}) => {

  return (
    <header className="wood-texture text-amber-50 py-12 px-4 shadow-2xl text-center relative overflow-hidden">
      {/* Subtle wood knot ring glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-terracotta/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Anniversary Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs sm:text-sm tracking-widest uppercase shadow-md mb-4">
          <TreePine className="w-4 h-4 text-wood-400" />
          <span>Bodas de Madeira • 5 Anos de Casados</span>
        </div>

        {/* Script Couple Names */}
        <h1 className="font-script text-6xl sm:text-8xl md:text-9xl text-amber-100 drop-shadow-md my-2 select-none">
          Pedro &amp; Duda
        </h1>

        {/* Romantic Subtitle Quote */}
        <p className="font-serif italic text-lg sm:text-2xl text-amber-200/95 font-light max-w-2xl mx-auto mt-2 drop-shadow">
          "Para minha princesa, a mulher que mudou toda a minha vida em 5 anos."
        </p>

        {/* Live Marriage Time Counter */}
        <CountdownTimer
          weddingDate={weddingDate}
          onUpdateWeddingDate={onUpdateWeddingDate}
        />

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm no-print">
          <AudioPlayer />

          <button
            onClick={onStartPresentation}
            className="px-4 py-2 rounded-full bg-terracotta hover:bg-red-800 text-white font-medium transition flex items-center gap-2 shadow-lg hover:shadow-xl"
            title="Apresentação em tela cheia com fotos e textos"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Modo Apresentação</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full bg-wood-800/90 hover:bg-wood-700 text-amber-100 transition flex items-center gap-2 border border-amber-500/30 shadow"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Guardar / Imprimir</span>
          </button>

          {/* Backup Download Button */}
          <button
            onClick={onExportBackup}
            className="px-4 py-2 rounded-full bg-wood-800/90 hover:bg-wood-700 text-amber-200 hover:text-amber-100 transition flex items-center gap-2 border border-amber-500/30 shadow text-xs sm:text-sm"
            title="Baixar cópia de segurança das fotos e textos"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Baixar Cópia</span>
          </button>
        </div>
      </div>
    </header>
  );
};
