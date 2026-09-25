// IndexedDB storage for couple's custom uploaded song
const DB_NAME = 'PedroDudaBodasAudioDB';
const STORE_NAME = 'audioStore';
const AUDIO_KEY = 'custom_song';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredAudio {
  name: string;
  type: string;
  blob: Blob;
}

export async function saveAudioToDB(file: File): Promise<StoredAudio> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const audioData: StoredAudio = {
      name: file.name,
      type: file.type || 'audio/mpeg',
      blob: file,
    };
    const req = store.put(audioData, AUDIO_KEY);
    req.onsuccess = () => resolve(audioData);
    req.onerror = () => reject(req.error);
  });
}

export async function getAudioFromDB(): Promise<StoredAudio | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(AUDIO_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not access IndexedDB for audio:', e);
    return null;
  }
}

export async function deleteAudioFromDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(AUDIO_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Could not delete audio from IndexedDB:', e);
  }
}
