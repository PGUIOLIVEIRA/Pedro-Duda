import React, { useRef, useState } from 'react';
import { ImagePlus, Maximize2, Edit3, Camera } from 'lucide-react';
import { TimelineCard, PhotoItem } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { PhotoEditModal } from './PhotoEditModal';

interface TimelineSectionProps {
  timeline: TimelineCard[];
  onUpdateTimeline: (newTimeline: TimelineCard[]) => void;
  onOpenLightbox: (yearIndex: number, photoIndex: number) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timeline,
  onUpdateTimeline,
  onOpenLightbox,
}) => {
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const [editingContext, setEditingContext] = useState<{
    yearIndex: number;
    photoIndex: number;
  } | null>(null);

  const handleUpdateTitle = (yearIndex: number, newTitle: string) => {
    const updated = [...timeline];
    updated[yearIndex].yearTitle = newTitle;
    onUpdateTimeline(updated);
  };

  const handleUpdateCaption = (yearIndex: number, newCaption: string) => {
    const updated = [...timeline];
    updated[yearIndex].caption = newCaption;
    onUpdateTimeline(updated);
  };

  const handleFileUpload = async (yearIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedUrl = await compressImage(file, 1000, 0.78);
        const titleWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        newPhotos.push({
          id: `photo_${Date.now()}_${i}`,
          url: compressedUrl,
          title: titleWithoutExt || `Foto ${timeline[yearIndex].photos.length + i + 1}`,
        });
      } catch (err) {
        console.error('Erro ao processar imagem:', err);
      }
    }

    if (newPhotos.length > 0) {
      const updated = [...timeline];
      updated[yearIndex].photos = [...updated[yearIndex].photos, ...newPhotos];
      onUpdateTimeline(updated);
    }

    e.target.value = '';
  };

  const handleOpenEdit = (yearIndex: number, photoIndex: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingContext({ yearIndex, photoIndex });
  };

  const handleSaveEditedPhoto = (updatedPhoto: PhotoItem) => {
    if (!editingContext) return;
    const { yearIndex, photoIndex } = editingContext;
    const updated = [...timeline];
    if (updated[yearIndex]?.photos?.[photoIndex]) {
      updated[yearIndex].photos[photoIndex] = updatedPhoto;
      onUpdateTimeline(updated);
    }
  };

  const currentEditingPhoto =
    editingContext &&
    timeline[editingContext.yearIndex]?.photos?.[editingContext.photoIndex]
      ? timeline[editingContext.yearIndex].photos[editingContext.photoIndex]
      : null;

  const currentEditingYearTitle =
    editingContext && timeline[editingContext.yearIndex]
      ? timeline[editingContext.yearIndex].yearTitle
      : '';

  return (
    <section>
      <div className="text-center mb-8">
        <span className="font-script text-3xl sm:text-4xl text-terracotta block">
          Nossas Memórias &amp; Momentos
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wood-900 mt-1">
          Linha do Tempo dos Nossos 5 Anos
        </h2>
        <p className="text-sm text-wood-600 max-w-xl mx-auto mt-2 font-sans">
          Cada momento registra o nosso amor e os passos da nossa história de 2021 a 2026.
        </p>
        <div className="w-16 h-1 bg-terracotta mx-auto mt-2 rounded-full"></div>
      </div>

      {/* TIMELINE CARDS */}
      <div className="space-y-12">
        {timeline.map((item, yearIndex) => (
          <div
            key={item.id || yearIndex}
            className={`bg-white/95 rounded-3xl p-6 sm:p-8 rustic-border relative transition-all hover:shadow-xl ${
              yearIndex === 0 ? 'ring-2 ring-amber-500/50' : ''
            }`}
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-wood-200 pb-4 mb-4 gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-wood-200 text-wood-900 font-serif font-bold flex items-center justify-center text-sm border border-wood-300">
                  {yearIndex + 1}
                </span>
                <input
                  type="text"
                  value={item.yearTitle}
                  onChange={(e) => handleUpdateTitle(yearIndex, e.target.value)}
                  className="font-serif text-2xl font-bold text-wood-900 bg-transparent border-b border-transparent hover:border-wood-300 focus:border-terracotta focus:outline-none w-full sm:w-auto px-1 transition"
                  placeholder="Título do ano ou momento..."
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-wood-100 hover:bg-wood-200 text-wood-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-wood-300 shadow-xs">
                  <Camera className="w-3.5 h-3.5 text-terracotta" />
                  <span>Adicionar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(yearIndex, e)}
                  />
                </label>
              </div>
            </div>

            {/* Multi Photo Grid */}
            {item.photos && item.photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-4">
                {item.photos.map((photo, photoIndex) => {
                  const globalPhotoNumber = yearIndex * 2 + photoIndex + 1;
                  return (
                    <div
                      key={photo.id || photoIndex}
                      onClick={() => onOpenLightbox(yearIndex, photoIndex)}
                      className="rounded-2xl overflow-hidden border-2 border-wood-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                    >
                      {/* Photo Badge */}
                      <div className="p-3 bg-wood-50/80 border-b border-wood-100 flex items-center justify-between">
                        <span className="bg-wood-200 text-wood-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-wood-300">
                          Foto {globalPhotoNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-semibold text-wood-800">
                            {photo.title || `Foto ${photoIndex + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(yearIndex, photoIndex, e)}
                            className="p-1 rounded hover:bg-wood-200 text-wood-600 transition"
                            title="Editar título"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Image Box */}
                      <div className="relative h-64 sm:h-72 overflow-hidden bg-wood-100">
                        <img
                          src={photo.url}
                          alt={photo.title || 'Memória'}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />

                        {/* Expand Button Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white">
                          <span className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-xs text-xs font-medium flex items-center gap-1.5 shadow-lg">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                            Ampliar Foto
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                onClick={() => fileInputRefs.current[yearIndex]?.click()}
                className="p-8 text-center border-2 border-dashed border-wood-300 hover:border-terracotta rounded-xl bg-wood-50/60 hover:bg-amber-50/60 my-4 text-wood-600 cursor-pointer transition"
              >
                <ImagePlus className="w-8 h-8 mx-auto mb-2 text-wood-400" />
                <p className="text-sm font-medium">Nenhuma foto adicionada para este momento ainda.</p>
                <p className="text-xs text-wood-500 mt-1">Clique aqui para carregar fotos do seu celular ou computador.</p>
              </div>
            )}

            {/* Caption Textarea */}
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-wider text-wood-700 font-semibold mb-1 flex items-center gap-1">
                <span>Descrição / Memórias deste Período:</span>
              </label>
              <textarea
                value={item.caption}
                onChange={(e) => handleUpdateCaption(yearIndex, e.target.value)}
                className="w-full text-sm font-serif text-wood-900 bg-wood-50/70 border border-wood-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition"
                rows={2}
                placeholder="Escreva aqui lembranças deste ano..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* PHOTO EDIT MODAL */}
      <PhotoEditModal
        isOpen={editingContext !== null}
        photo={currentEditingPhoto}
        yearTitle={currentEditingYearTitle}
        onSave={handleSaveEditedPhoto}
        onDelete={() => {}}
        onClose={() => setEditingContext(null)}
      />
    </section>
  );
};
