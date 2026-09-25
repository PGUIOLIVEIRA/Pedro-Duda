import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { TimelineCard } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface BatchPhotoUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineCard[];
  onApplyPhotos: (updatedTimeline: TimelineCard[]) => void;
}

interface SlotInfo {
  yearIndex: number;
  photoIndex: number;
  yearTitle: string;
  defaultTitle: string;
  previewUrl: string;
  fileName?: string;
}

const DEFAULT_SLOTS = [
  { yearIndex: 0, photoIndex: 0, yearTitle: 'Ano 1', title: 'O Início e a Bênção (Igreja)' },
  { yearIndex: 0, photoIndex: 1, yearTitle: 'Ano 1', title: 'Nosso Casamento no Altar (25/09/2021)' },
  { yearIndex: 1, photoIndex: 0, yearTitle: 'Ano 2', title: 'Viagens & Momentos sob as Luzes' },
  { yearIndex: 1, photoIndex: 1, yearTitle: 'Ano 2', title: 'Dias Ensolarados no Mar' },
  { yearIndex: 2, photoIndex: 0, yearTitle: 'Ano 3', title: 'Celebrando o Aniversário de Casamento' },
  { yearIndex: 2, photoIndex: 1, yearTitle: 'Ano 3', title: 'Passeio Romântico das Sombrinhas' },
  { yearIndex: 3, photoIndex: 0, yearTitle: 'Ano 4', title: 'A Mari veio para ser LUZ (Hospital)' },
  { yearIndex: 3, photoIndex: 1, yearTitle: 'Ano 4', title: 'O Sorriso mais Lindo do Mundo' },
  { yearIndex: 4, photoIndex: 0, yearTitle: 'Ano 5', title: 'Alegria e Momentos em Família' },
  { yearIndex: 4, photoIndex: 1, yearTitle: 'Ano 5', title: 'Pedro, Duda & Mari: Amor Eterno' },
];

export const BatchPhotoUploader: React.FC<BatchPhotoUploaderProps> = ({
  isOpen,
  onClose,
  timeline,
  onApplyPhotos,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const singleSlotInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [slots, setSlots] = useState<SlotInfo[]>(() => {
    return DEFAULT_SLOTS.map((slot) => {
      const existingPhoto = timeline[slot.yearIndex]?.photos?.[slot.photoIndex];
      return {
        yearIndex: slot.yearIndex,
        photoIndex: slot.photoIndex,
        yearTitle: slot.yearTitle,
        defaultTitle: slot.title,
        previewUrl: existingPhoto?.url || '',
        fileName: '',
      };
    });
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const naturalSortFiles = (files: File[]): File[] => {
    return [...files].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );
  };

  const handleMultipleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);

    try {
      const files = naturalSortFiles(Array.from(fileList));
      const updatedSlots = [...slots];

      for (let i = 0; i < Math.min(files.length, 10); i++) {
        const file = files[i];
        const compressedUrl = await compressImage(file, 1000, 0.78);
        updatedSlots[i] = {
          ...updatedSlots[i],
          previewUrl: compressedUrl,
          fileName: file.name,
        };
      }

      setSlots(updatedSlots);
    } catch (err) {
      console.error('Erro ao processar fotos em lote:', err);
      alert('Houve um erro ao processar as imagens. Tente carregar novamente.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSingleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedSlotIndex === null) return;

    try {
      setIsProcessing(true);
      const compressedUrl = await compressImage(file, 1000, 0.78);
      const updated = [...slots];
      updated[selectedSlotIndex] = {
        ...updated[selectedSlotIndex],
        previewUrl: compressedUrl,
        fileName: file.name,
      };
      setSlots(updated);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
    } finally {
      setIsProcessing(false);
      setSelectedSlotIndex(null);
      if (singleSlotInputRef.current) {
        singleSlotInputRef.current.value = '';
      }
    }
  };

  const handleApplyToTimeline = () => {
    const newTimeline = timeline.map((card, yIdx) => {
      const updatedPhotos = [...card.photos];
      // Check slot 0 and slot 1 for this year
      const slot0 = slots.find((s) => s.yearIndex === yIdx && s.photoIndex === 0);
      const slot1 = slots.find((s) => s.yearIndex === yIdx && s.photoIndex === 1);

      if (slot0 && slot0.previewUrl) {
        updatedPhotos[0] = {
          id: updatedPhotos[0]?.id || `p_${yIdx}_1`,
          url: slot0.previewUrl,
          title: slot0.defaultTitle,
        };
      }

      if (slot1 && slot1.previewUrl) {
        updatedPhotos[1] = {
          id: updatedPhotos[1]?.id || `p_${yIdx}_2`,
          url: slot1.previewUrl,
          title: slot1.defaultTitle,
        };
      }

      return {
        ...card,
        photos: updatedPhotos,
      };
    });

    onApplyPhotos(newTimeline);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 text-wood-900 shadow-2xl border-2 border-wood-300 relative my-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-wood-200 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-terracotta">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-wood-900 leading-tight">
                Carregar as 10 Fotos das Bodas
              </h3>
              <p className="text-xs sm:text-sm text-wood-600 font-sans">
                Selecione as 10 fotos de uma só vez (foto 1 a foto 10). Elas serão distribuídas perfeitamente nos 5 anos!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-wood-400 hover:text-wood-800 p-2 rounded-xl hover:bg-wood-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Drag and Drop / Upload Button */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleMultipleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
            dragOver
              ? 'border-terracotta bg-amber-50 scale-[1.01]'
              : 'border-wood-300 bg-wood-50/70 hover:bg-amber-50/50 hover:border-wood-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleMultipleFiles(e.target.files)}
          />
          <div className="w-12 h-12 rounded-full bg-wood-200/70 text-terracotta flex items-center justify-center mx-auto mb-3">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <p className="text-base sm:text-lg font-serif font-bold text-wood-900">
            {isProcessing
              ? 'Processando e otimizando fotos...'
              : 'Clique aqui para selecionar as 10 fotos (ou arraste-as para cá)'}
          </p>
          <p className="text-xs text-wood-600 mt-1 max-w-md mx-auto">
            Você pode selecionar as fotos <strong>"foto 1.jpeg" até "foto 10.jpeg"</strong> juntas. O sistema organiza cada uma no ano correspondente automaticamente.
          </p>
        </div>

        {/* 10 Slots Preview Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-wood-700">
              Distribuição nos 5 Anos (10 Fotos):
            </span>
            <span className="text-xs text-wood-500">
              {slots.filter((s) => s.previewUrl).length} de 10 fotos prontas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto p-1">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="bg-wood-50 rounded-xl border border-wood-200 p-2 flex flex-col relative group hover:border-terracotta transition"
              >
                <div className="flex justify-between items-center text-[10px] text-wood-600 font-medium mb-1">
                  <span className="bg-wood-200 px-1.5 py-0.5 rounded text-wood-800 font-semibold">
                    {slot.yearTitle} • F{index + 1}
                  </span>
                  {slot.fileName && (
                    <span className="truncate max-w-[60px]" title={slot.fileName}>
                      {slot.fileName}
                    </span>
                  )}
                </div>

                <div
                  onClick={() => {
                    setSelectedSlotIndex(index);
                    singleSlotInputRef.current?.click();
                  }}
                  className="w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-wood-100 border border-wood-200 cursor-pointer relative flex items-center justify-center"
                >
                  {slot.previewUrl ? (
                    <img
                      src={slot.previewUrl}
                      alt={slot.defaultTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-5 h-5 text-wood-400 mx-auto mb-1" />
                      <span className="text-[10px] text-wood-400">Sem foto</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition">
                    Trocar
                  </div>
                </div>

                <p className="text-[11px] font-serif text-wood-900 font-semibold truncate mt-1.5" title={slot.defaultTitle}>
                  {slot.defaultTitle}
                </p>
              </div>
            ))}
          </div>

          <input
            ref={singleSlotInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSingleSlotUpload}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-wood-200">
          <p className="text-xs text-wood-500 text-center sm:text-left">
            Ao confirmar, todas as fotos selecionadas serão salvas no site e no backup do navegador.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApplyToTimeline}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-terracotta hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar Fotos na Linha do Tempo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
