import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BIBLE_API_BASE = 'https://bible.helloao.org/api';

export interface Translation {
  id: string;
  name: string;
  shortName: string;
}

export interface DownloadedBible {
  id: string;
  translationId: string;
  name: string;
  shortName: string;
  downloadedAt: string;
}

export interface Verse {
  number: number;
  text: string;
}

interface BibleContextType {
  currentTranslation: DownloadedBible | null;
  setCurrentTranslation: (bible: DownloadedBible) => void;
  downloadedBibles: DownloadedBible[];
  refreshDownloaded: () => Promise<void>;
  downloadBible: (translation: Translation) => Promise<void>;
  removeBible: (translationId: string) => Promise<void>;
  allTranslations: Translation[];
  loadTranslations: () => Promise<void>;
  loading: boolean;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

const CURRENT_TRANSLATION_KEY = '@holy_scriptures_current';
const DOWNLOADED_BIBLES_KEY = '@holy_scriptures_downloaded';

export function BibleProvider({ children }: { children: ReactNode }) {
  const [currentTranslation, setCurrentTranslationState] = useState<DownloadedBible | null>(null);
  const [downloadedBibles, setDownloadedBibles] = useState<DownloadedBible[]>([]);
  const [allTranslations, setAllTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await refreshDownloaded();
    await loadCurrentTranslation();
  };

  const loadCurrentTranslation = async () => {
    try {
      const saved = await AsyncStorage.getItem(CURRENT_TRANSLATION_KEY);
      if (saved) {
        setCurrentTranslationState(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading current translation:', error);
    }
  };

  const setCurrentTranslation = async (bible: DownloadedBible) => {
    try {
      setCurrentTranslationState(bible);
      await AsyncStorage.setItem(CURRENT_TRANSLATION_KEY, JSON.stringify(bible));
    } catch (error) {
      console.error('Error saving current translation:', error);
    }
  };

  const refreshDownloaded = async () => {
    try {
      const saved = await AsyncStorage.getItem(DOWNLOADED_BIBLES_KEY);
      const bibles = saved ? JSON.parse(saved) : [];
      setDownloadedBibles(bibles);
    } catch (error) {
      console.error('Error refreshing downloaded:', error);
    }
  };

  const downloadBible = async (translation: Translation) => {
    try {
      const newBible: DownloadedBible = {
        id: `${translation.id}-${Date.now()}`,
        translationId: translation.id,
        name: translation.name,
        shortName: translation.shortName,
        downloadedAt: new Date().toISOString(),
      };
      
      const saved = await AsyncStorage.getItem(DOWNLOADED_BIBLES_KEY);
      const bibles = saved ? JSON.parse(saved) : [];
      bibles.push(newBible);
      
      await AsyncStorage.setItem(DOWNLOADED_BIBLES_KEY, JSON.stringify(bibles));
      await refreshDownloaded();
      
      if (bibles.length === 1) {
        setCurrentTranslation(newBible);
      }
    } catch (error: any) {
      throw new Error('Download fallito');
    }
  };

  const removeBible = async (translationId: string) => {
    try {
      const saved = await AsyncStorage.getItem(DOWNLOADED_BIBLES_KEY);
      const bibles = saved ? JSON.parse(saved) : [];
      const filtered = bibles.filter((b: DownloadedBible) => b.translationId !== translationId);
      
      await AsyncStorage.setItem(DOWNLOADED_BIBLES_KEY, JSON.stringify(filtered));
      await refreshDownloaded();
      
      if (currentTranslation?.translationId === translationId) {
        setCurrentTranslationState(null);
        await AsyncStorage.removeItem(CURRENT_TRANSLATION_KEY);
      }
    } catch (error: any) {
      throw new Error('Rimozione fallita');
    }
  };

  const loadTranslations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BIBLE_API_BASE}/available_translations.json`);
      const translations = response.data.translations || [];
      setAllTranslations(translations);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BibleContext.Provider
      value={{
        currentTranslation,
        setCurrentTranslation,
        downloadedBibles,
        refreshDownloaded,
        downloadBible,
        removeBible,
        allTranslations,
        loadTranslations,
        loading,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}
