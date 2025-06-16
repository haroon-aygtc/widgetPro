import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface LoadingState {
  id: string;
  message?: string;
  progress?: number;
}

interface LoadingContextType {
  isLoading: boolean;
  loadingStates: Record<string, LoadingState>;
  loadingMessage?: string;
  setLoading: (loading: boolean, message?: string) => void;
  setLoadingMessage: (message?: string) => void;
  // Unified loading state management
  startLoading: (id: string, message?: string) => void;
  stopLoading: (id: string) => void;
  updateLoadingProgress: (id: string, progress: number) => void;
  updateLoadingMessage: (id: string, message: string) => void;
  isLoadingId: (id: string) => boolean;
  getLoadingState: (id: string) => LoadingState | undefined;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const setLoading = useCallback((loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (!loading) {
      setLoadingMessage(undefined);
    } else if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const startLoading = useCallback((id: string, message?: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: { id, message, progress: 0 }
    }));
  }, []);

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  }, []);

  const updateLoadingProgress = useCallback((id: string, progress: number) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: { ...prev[id], progress: Math.max(0, Math.min(100, progress)) }
    }));
  }, []);

  const updateLoadingMessage = useCallback((id: string, message: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: { ...prev[id], message }
    }));
  }, []);

  const isLoadingId = useCallback((id: string) => {
    return id in loadingStates;
  }, [loadingStates]);

  const getLoadingState = useCallback((id: string) => {
    return loadingStates[id];
  }, [loadingStates]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingStates,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        startLoading,
        stopLoading,
        updateLoadingProgress,
        updateLoadingMessage,
        isLoadingId,
        getLoadingState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// Unified loading hook for specific operations
export function useOperationLoading(operationId: string) {
  const {
    startLoading,
    stopLoading,
    updateLoadingProgress,
    updateLoadingMessage,
    isLoadingId,
    getLoadingState
  } = useLoading();

  const start = useCallback((message?: string) => {
    startLoading(operationId, message);
  }, [operationId, startLoading]);

  const stop = useCallback(() => {
    stopLoading(operationId);
  }, [operationId, stopLoading]);

  const updateProgress = useCallback((progress: number) => {
    updateLoadingProgress(operationId, progress);
  }, [operationId, updateLoadingProgress]);

  const updateMessage = useCallback((message: string) => {
    updateLoadingMessage(operationId, message);
  }, [operationId, updateLoadingMessage]);

  return {
    isLoading: isLoadingId(operationId),
    loadingState: getLoadingState(operationId),
    start,
    stop,
    updateProgress,
    updateMessage,
  };
}
