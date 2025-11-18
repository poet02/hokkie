// context/CameraContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface CameraContextType {
  activeStream: MediaStream | null;
  isCameraActive: boolean;
  setActiveStream: (stream: MediaStream | null) => void;
  stopCamera: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera from context...');
    if (activeStream) {
      activeStream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
        track.enabled = false;
      });
    }
    setActiveStream(null);
    setIsCameraActive(false);
  }, [activeStream]);

  const setStream = useCallback((stream: MediaStream | null) => {
    setActiveStream(stream);
    setIsCameraActive(!!stream);
  }, []);

  // Auto-stop camera when component unmounts (safety)
  useEffect(() => {
    return () => {
      if (activeStream) {
        stopCamera();
      }
    };
  }, [activeStream, stopCamera]);

  const value = {
    activeStream,
    isCameraActive,
    setActiveStream: setStream,
    stopCamera,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}