import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Check } from 'lucide-react';

interface CountdownTimerProps {
  weddingDate: string;
  onUpdateWeddingDate: (newDate: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  weddingDate,
  onUpdateWeddingDate,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(weddingDate ? weddingDate.substring(0, 16) : '2021-09-25T10:30');

  useEffect(() => {
    if (weddingDate) {
      setTempDate(weddingDate.substring(0, 16));
    }
  }, [weddingDate]);

  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(weddingDate);
      if (isNaN(d.getTime())) return '';
      return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '';
    }
  }, [weddingDate]);

  useEffect(() => {
    const calculateTime = () => {
      const weddingTimestamp = new Date(weddingDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - weddingTimestamp);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const handleSaveDate = () => {
    if (tempDate) {
      onUpdateWeddingDate(new Date(tempDate).toISOString());
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-8 bg-wood-900/85 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-amber-600/30 max-w-2xl mx-auto shadow-2xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-left">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-terracotta fill-terracotta animate-pulse" />
            <span>Tempo de Amor desde o Nosso "SIM"</span>
          </p>
          {formattedDate && (
            <p className="text-[11px] text-amber-200/80 mt-0.5 font-sans">
              {formattedDate}
            </p>
          )}
        </div>

        <button
          onClick={() => {
            setTempDate(weddingDate ? weddingDate.substring(0, 16) : '2021-09-25T10:30');
            setIsEditing(!isEditing);
          }}
          className="self-start sm:self-auto text-amber-400 hover:text-amber-200 text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-wood-800/80 border border-amber-600/20 transition"
          title="Ajustar data e horário do casamento"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Fechar' : 'Ajustar Data'}</span>
        </button>
      </div>

      {isEditing && (
        <div className="mb-4 p-3 bg-wood-950/80 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center gap-2 text-xs">
          <label className="text-amber-200 text-xs whitespace-nowrap">
            Data e Hora do Casamento:
          </label>
          <input
            type="datetime-local"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
            className="bg-wood-800 text-amber-100 border border-amber-700/50 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400 w-full sm:w-auto"
          />
          <button
            onClick={handleSaveDate}
            className="w-full sm:w-auto bg-terracotta hover:bg-red-700 text-white px-3 py-1 rounded flex items-center justify-center gap-1 font-medium transition"
          >
            <Check className="w-3 h-3" /> Salvar
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-wood-800/80 p-2 sm:p-3 rounded-xl border border-amber-700/30 shadow-inner">
          <span className="block font-serif font-bold text-2xl sm:text-4xl text-amber-100">
            {timeRemaining.days}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider">
            Dias
          </span>
        </div>
        <div className="bg-wood-800/80 p-2 sm:p-3 rounded-xl border border-amber-700/30 shadow-inner">
          <span className="block font-serif font-bold text-2xl sm:text-4xl text-amber-100">
            {timeRemaining.hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider">
            Horas
          </span>
        </div>
        <div className="bg-wood-800/80 p-2 sm:p-3 rounded-xl border border-amber-700/30 shadow-inner">
          <span className="block font-serif font-bold text-2xl sm:text-4xl text-amber-100">
            {timeRemaining.minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider">
            Minutos
          </span>
        </div>
        <div className="bg-wood-800/80 p-2 sm:p-3 rounded-xl border border-amber-700/30 shadow-inner">
          <span className="block font-serif font-bold text-2xl sm:text-4xl text-amber-100">
            {timeRemaining.seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-300 uppercase tracking-wider">
            Segundos
          </span>
        </div>
      </div>
    </div>
  );
};
