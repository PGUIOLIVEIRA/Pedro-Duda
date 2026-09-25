import React from 'react';
import { HeartHandshake, Sun, Stethoscope } from 'lucide-react';

export const HighlightsSection: React.FC = () => {
  return (
    <section className="bg-wood-900 text-amber-50 rounded-2xl p-6 sm:p-10 md:p-12 rustic-border relative overflow-hidden shadow-2xl">
      <div className="text-center mb-8 relative z-10">
        <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
          Pilar dos Nossos 5 Anos
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mt-1">
          Nossa História em Três Verdades Eternas
        </h2>
        <div className="w-12 h-0.5 bg-amber-500/50 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-xl bg-wood-800/60 border border-amber-700/30 backdrop-blur-sm hover:border-amber-500/50 transition shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-full bg-terracotta/20 flex items-center justify-center mb-4 border border-terracotta/40">
            <HeartHandshake className="w-6 h-6 text-terracotta" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-amber-200">Nosso Amor</h3>
          <p className="text-xs sm:text-sm text-amber-300/85 mt-2 leading-relaxed font-sans">
            Fortalecido a cada perrengue, viagem e conquista ao longo de meia década. Cresce, se renova e renasce todos os dias.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-wood-800/60 border border-amber-700/30 backdrop-blur-sm hover:border-amber-500/50 transition shadow-lg relative">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-400/40">
            <Sun className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-amber-200">A Chegada da Mari</h3>
          <p className="text-xs sm:text-sm text-amber-300/85 mt-2 leading-relaxed font-sans">
            A nossa LUZ que brilha todos os dias e renova o nosso SIM eterno. Nossa força e a maior transformação das nossas vidas.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-wood-800/60 border border-amber-700/30 backdrop-blur-sm hover:border-amber-500/50 transition shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-400/40">
            <Stethoscope className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-amber-200">Orgulho Profundo</h3>
          <p className="text-xs sm:text-sm text-amber-300/85 mt-2 leading-relaxed font-sans">
            Orgulho da Duda incrível, enfermeira dedicada e reconhecida, e da mãe corajosa que você é. Te escolheria eternamente.
          </p>
        </div>
      </div>
    </section>
  );
};
