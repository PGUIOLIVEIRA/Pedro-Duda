import React, { useState, useRef } from 'react';
import { Edit3, Check, X, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { INITIAL_LETTER_HTML } from '../constants/defaultData';

interface LoveLetterProps {
  letterHtml: string;
  onSaveLetter: (newHtml: string) => void;
  onResetLetter: () => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  letterHtml,
  onSaveLetter,
  onResetLetter,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement | null>(null);

  const handleStartEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (editableRef.current) {
        editableRef.current.focus();
      }
    }, 50);
  };

  const handleSave = () => {
    if (editableRef.current) {
      onSaveLetter(editableRef.current.innerHTML);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (editableRef.current) {
      editableRef.current.innerHTML = letterHtml;
    }
    setIsEditing(false);
  };

  return (
    <section className="relative">
      <div className="text-center mb-6">
        <span className="font-script text-3xl sm:text-4xl text-terracotta block">
          Carta do Meu Coração
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-900 mt-1 flex items-center justify-center gap-2">
          <span>Para Minha Esposa</span>
          <Heart className="w-6 h-6 text-terracotta fill-terracotta inline animate-pulse" />
        </h2>
        <div className="w-16 h-1 bg-terracotta mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="letter-paper rounded-2xl p-6 sm:p-10 md:p-12 relative rustic-border transition-all">
        <div className="flex flex-wrap justify-between items-center mb-6 border-b border-wood-200 pb-4 gap-2">
          <div className="text-xs text-wood-600 font-medium uppercase tracking-widest flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-terracotta" />
            <span>5 Anos de Casados</span>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="text-xs bg-wood-100 hover:bg-wood-200 text-wood-800 px-3 py-1.5 rounded-lg border border-wood-300 transition flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5 text-terracotta" />
                <span>Editar Texto</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center gap-1 transition"
                >
                  <X className="w-3.5 h-3.5" /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="text-xs px-3 py-1.5 bg-terracotta hover:bg-red-800 text-white rounded-lg flex items-center gap-1 transition font-medium shadow"
                >
                  <Check className="w-3.5 h-3.5" /> Salvar Carta
                </button>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mb-4 p-3 bg-amber-100/70 border border-amber-400/40 rounded-xl text-xs text-wood-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Você pode clicar diretamente no texto abaixo e digitar para editar a carta com suas palavras de amor.
            </span>
          </div>
        )}

        {!isEditing ? (
          <div
            key="letter-display"
            className="font-serif text-lg sm:text-xl text-wood-900 leading-relaxed space-y-5 focus:outline-none"
            dangerouslySetInnerHTML={{ __html: letterHtml }}
          />
        ) : (
          <div
            key="letter-edit"
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            className="font-serif text-lg sm:text-xl text-wood-900 leading-relaxed space-y-5 focus:outline-none p-4 bg-amber-50/90 rounded-xl border-2 border-dashed border-terracotta shadow-inner"
            dangerouslySetInnerHTML={{ __html: letterHtml }}
          />
        )}

        {isEditing && (
          <div className="mt-6 pt-4 border-t border-wood-300 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-terracotta text-white rounded-lg text-sm hover:bg-red-800 shadow flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Salvar Carta
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
