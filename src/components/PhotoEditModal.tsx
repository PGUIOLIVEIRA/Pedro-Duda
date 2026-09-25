import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, Check, Image as ImageIcon, Link, AlertTriangle } from 'lucide-react';
import { PhotoItem } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface PhotoEditModalProps {
  isOpen: boolean;
  photo: PhotoItem | null;
  yearTitle: string;
  onSave: (updatedPhoto: PhotoItem) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  photo,
  yearTitle,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || '');
      setPreviewUrl(photo.url || '');
      setUrlInput(photo.url || '');
    }
  }, [photo]);

  if (!isOpen || !photo) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 1280, 0.85);
      setPreviewUrl(compressed);
      setUrlInput(compressed);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      alert('Não foi possível carregar a imagem. Tente outro arquivo.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = () => {
    if (!previewUrl) {
      alert('A foto precisa de uma imagem válida.');
      return;
    }
    onSave({
      ...photo,
      title: title.trim(),
      url: previewUrl,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Tem certeza de que deseja excluir esta foto da memória?')) {
      onDelete();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-wood-900 shadow-2xl border-2 border-wood-300 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-wood-200 pb-3 mb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-wood-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-terracotta" />
              <span>Editar Imagem</span>
            </h3>
            <p className="text-xs text-wood-600 font-medium">{yearTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-wood-400 hover:text-wood-800 p-1.5 rounded-lg hover:bg-wood-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Image Preview */}
        <div className="mb-4">
          <div className="relative rounded-xl overflow-hidden border-2 border-wood-200 bg-wood-50 h-52 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Pré-visualização"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-xs text-wood-400">Nenhuma imagem selecionada</p>
            )}

            {isCompressing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-medium">
                Otimizando imagem...
              </div>
            )}
          </div>
        </div>

        {/* Replace Image Actions */}
        <div className="space-y-3 mb-5">
          {/* File Upload Button */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wood-700 mb-1">
              1. Trocar Imagem do Computador ou Celular:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing}
              className="w-full py-2.5 px-4 rounded-xl bg-wood-100 hover:bg-wood-200 text-wood-800 font-medium transition flex items-center justify-center gap-2 border border-wood-300 text-sm shadow-sm"
            >
              <Upload className="w-4 h-4 text-terracotta" />
              <span>{isCompressing ? 'Processando...' : 'Carregar Nova Foto (Substituir)'}</span>
            </button>
          </div>

          {/* Or URL Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wood-700 mb-1">
              2. Ou Inserir Link / URL da Imagem:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Link className="w-4 h-4 text-wood-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-wood-200 rounded-lg focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          {/* Caption / Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wood-700 mb-1">
              3. Legenda da Foto:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nossa primeira viagem, almoço especial..."
              className="w-full px-3 py-2 text-sm border border-wood-200 rounded-lg focus:outline-none focus:border-terracotta font-serif"
            />
          </div>
        </div>

        {/* Modal Actions: Save & Close (Photos protected against accidental deletion) */}
        <div className="flex items-center justify-between pt-3 border-t border-wood-200">
          <p className="text-[11px] text-wood-500 italic">
            🔒 Fotos preservadas e protegidas
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-terracotta hover:bg-red-800 text-white text-xs font-medium transition flex items-center gap-1.5 shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
