import React, { useState, useEffect } from 'react';
import { AppState, TimelineCard } from './types';
import { INITIAL_LETTER_HTML, DEFAULT_TIMELINE, DEFAULT_WEDDING_DATE } from './constants/defaultData';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Header } from './components/Header';
import { LoveLetter } from './components/LoveLetter';
import { TimelineSection } from './components/TimelineSection';
import { HighlightsSection } from './components/HighlightsSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { PresentationModal } from './components/PresentationModal';

const STORAGE_KEY = 'pedro_duda_bodas_data';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    return {
      letter: INITIAL_LETTER_HTML,
      timeline: DEFAULT_TIMELINE,
      weddingDate: DEFAULT_WEDDING_DATE,
    };
  });

  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    yearIndex: number;
    photoIndex: number;
  }>({
    isOpen: false,
    yearIndex: 0,
    photoIndex: 0,
  });

  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Sync to localStorage
  const saveStateToStorage = (newState: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Armazenamento local cheio ou indisponível:', e);
    }
  };

  const handleUpdateLetter = (newHtml: string) => {
    setAppState((prev) => {
      const updated = { ...prev, letter: newHtml };
      saveStateToStorage(updated);
      return updated;
    });
  };

  const handleResetLetter = () => {
    setAppState((prev) => {
      const updated = { ...prev, letter: INITIAL_LETTER_HTML };
      saveStateToStorage(updated);
      return updated;
    });
  };

  const handleUpdateTimeline = (newTimeline: TimelineCard[]) => {
    setAppState((prev) => {
      const updated = { ...prev, timeline: newTimeline };
      saveStateToStorage(updated);
      return updated;
    });
  };

  const handleUpdateWeddingDate = (newDate: string) => {
    setAppState((prev) => {
      const updated = { ...prev, weddingDate: newDate };
      saveStateToStorage(updated);
      return updated;
    });
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar as fotos e textos originais do site de Bodas de Madeira?'
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
      const defaultState: AppState = {
        letter: INITIAL_LETTER_HTML,
        timeline: DEFAULT_TIMELINE,
        weddingDate: DEFAULT_WEDDING_DATE,
      };
      setAppState(defaultState);
    }
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'bodas-de-madeira-pedro-e-duda.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          const restoredState: AppState = {
            letter: parsed.letter || INITIAL_LETTER_HTML,
            timeline: Array.isArray(parsed.timeline) ? parsed.timeline : DEFAULT_TIMELINE,
            weddingDate: parsed.weddingDate || DEFAULT_WEDDING_DATE,
          };
          setAppState(restoredState);
          saveStateToStorage(restoredState);
          window.alert('Memórias restauradas com sucesso!');
        }
      } catch (err) {
        window.alert('Arquivo JSON inválido. Não foi possível restaurar.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleOpenLightbox = (yearIndex: number, photoIndex: number) => {
    setLightbox({
      isOpen: true,
      yearIndex,
      photoIndex,
    });
  };

  const handleCloseLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigateLightbox = (yearIndex: number, photoIndex: number) => {
    setLightbox({
      isOpen: true,
      yearIndex,
      photoIndex,
    });
  };

  return (
    <div className="font-sans antialiased selection:bg-amber-300 selection:text-wood-900 min-h-screen relative overflow-x-hidden">
      {/* Floating hearts and sparkles background */}
      <ParticlesBackground />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header / Hero Section */}
        <Header
          weddingDate={appState.weddingDate}
          onUpdateWeddingDate={handleUpdateWeddingDate}
          onStartPresentation={() => setIsPresentationOpen(true)}
          onExportBackup={handleExportBackup}
        />

        {/* Main Content */}
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-12 space-y-16">
          {/* Section 1: Carta do Meu Coração */}
          <LoveLetter
            letterHtml={appState.letter}
            onSaveLetter={handleUpdateLetter}
            onResetLetter={handleResetLetter}
          />

          {/* Section 2: Linha do Tempo e Galerias Multi-Fotos */}
          <TimelineSection
            timeline={appState.timeline}
            onUpdateTimeline={handleUpdateTimeline}
            onOpenLightbox={handleOpenLightbox}
          />

          {/* Section 3: Destaques & Pilares do Amor */}
          <HighlightsSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightbox.isOpen}
        timeline={appState.timeline}
        yearIndex={lightbox.yearIndex}
        photoIndex={lightbox.photoIndex}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />

      {/* Presentation Mode Slideshow */}
      <PresentationModal
        isOpen={isPresentationOpen}
        timeline={appState.timeline}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
