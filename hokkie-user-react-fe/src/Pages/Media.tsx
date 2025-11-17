import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useBlocker } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, X, RotateCcw, Check, ArrowLeft, VideoOff } from 'lucide-react';

const Container = styled.div`
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;

const PhotoCount = styled.div`
  background: #1976d2;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CameraContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${props => props.show ? 'block' : 'none'};
  transform: ${props => props.mirror ? 'scaleX(-1)' : 'scaleX(1)'};
`;

const Canvas = styled.canvas`
  display: none;
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Viewfinder = styled.div`
  width: 300px;
  height: 300px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

const Controls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
`;

const CaptureButton = styled.button`
  background: white;
  border: 4px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.8);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 32px;
    height: 32px;
    color: #333;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const PreviewContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  display: flex;
  flex-direction: column;
  z-index: 20;
`;

const PreviewImage = styled.img`
  flex: 1;
  width: 100%;
  object-fit: contain;
  background: black;
`;

const PreviewControls = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewButton = styled.button<{ variant: 'accept' | 'reject' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'accept' ? `
    background: #2e7d32;
    color: white;

    &:hover {
      background: #1b5e20;
    }
  ` : `
    background: #d32f2f;
    color: white;

    &:hover {
      background: #c62828;
    }
  `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

const GallerySection = styled.div`
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GalleryTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-align: center;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-height: 100px;
  overflow-y: auto;
`;

const GalleryImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyGallery = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  padding: 1rem;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 300px;
  border: 1px solid #d32f2f;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.125rem;
  text-align: center;
`;

const DebugInfo = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: monospace;
  z-index: 5;
`;

const CameraStatus = styled.div<{ active: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.active ? '#2e7d32' : '#d32f2f'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
// `;
// import { useState, useRef, useEffect } from 'react';
// import { useNavigate, useLocation, useBlocker } from 'react-router-dom';
// import styled from 'styled-components';
// import { Camera, X, RotateCcw, Check, ArrowLeft, VideoOff } from 'lucide-react';

// ... (keep all your existing styled components exactly as they were)

export function Media() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [videoReady, setVideoReady] = useState(false);

  // Get callback from navigation state
  const onImagesCapture = location.state?.onImagesCapture;
  const initialImages = location.state?.initialImages || [];

  // Use React Router's blocker to catch navigation attempts
  // const blocker = useBlocker(({ currentLocation, nextLocation }) => {
  //   // If we're navigating away from this page
  //   if (currentLocation.pathname === '/media' && nextLocation.pathname !== '/media') {
  //     cleanupCamera();
  //   }
  //   return false; // Allow navigation
  // });

  // Initialize camera after component mounts and refs are available
  useEffect(() => {
    // Small delay to ensure refs are set
    const timer = setTimeout(() => {
      startCamera();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupCamera();
    };
  }, []);

  // Enhanced cleanup that's more aggressive
  const cleanupCamera = () => {
    console.log('Cleaning up camera...');
    
    if (stream) {
      console.log('Stopping media stream tracks');
      stream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind} - ${track.readyState}`);
        track.stop(); // This should stop the camera
        track.enabled = false; // Disable the track
      });
      setStream(null);
    }
    
    // Also try to stop any video playback
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      video.load(); // Reset the video element
    }
    
    // Clean up object URLs
    imagePreviews.forEach(url => {
      URL.revokeObjectURL(url);
    });

    setIsCameraActive(false);
    setVideoReady(false);
    
    console.log('Camera cleanup completed');
  };

  // Handle page visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden (user switched tabs or minimized window)
        console.log('Page hidden - cleaning up camera');
        cleanupCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle beforeunload (page refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log('Page unloading - cleaning up camera');
      cleanupCamera();
      // Optional: prevent the unload to ensure cleanup completes
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handle popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      console.log('Browser navigation detected - cleaning up camera');
      cleanupCamera();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Periodic cleanup check - as a safety net
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we're still on the media page
      if (!window.location.pathname.includes('/media') && stream) {
        console.log('No longer on media page but camera still active - emergency cleanup');
        cleanupCamera();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stream]);

  const setupVideo = (mediaStream: MediaStream) => {
    if (!videoRef.current) {
      setDebugInfo('Video ref is not available yet');
      return false;
    }

    const video = videoRef.current;
    video.srcObject = mediaStream;

    return new Promise<void>((resolve, reject) => {
      const onCanPlay = () => {
        video.removeEventListener('canplay', onCanPlay);
        setDebugInfo('Video can play - starting playback...');
        video.play()
          .then(() => {
            setDebugInfo('Video playback started successfully!');
            setVideoReady(true);
            setIsCameraActive(true);
            setIsLoading(false);
            resolve();
          })
          .catch(reject);
      };

      const onError = (error: any) => {
        video.removeEventListener('canplay', onCanPlay);
        reject(new Error(`Video error: ${error}`));
      };

      const timeout = setTimeout(() => {
        video.removeEventListener('canplay', onCanPlay);
        reject(new Error('Video setup timeout'));
      }, 10000);

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);

      // Cleanup
      Promise.resolve().then(() => {
        clearTimeout(timeout);
      });
    });
  };

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      setDebugInfo('Requesting camera access...');

      // Check if video ref is available
      if (!videoRef.current) {
        setDebugInfo('Waiting for video element...');
        // Try again after a short delay
        setTimeout(startCamera, 100);
        return;
      }

      // Stop existing stream if any
      cleanupCamera();

      // Try with basic constraints first
      const constraints = {
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      setDebugInfo(`Getting user media with ${facingMode} camera...`);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setDebugInfo('Camera access granted! Setting up video...');

      // Set up the video element with the stream
      await setupVideo(mediaStream);
      
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setDebugInfo(`Camera error: ${error.message}`);
      setCameraError(`Cannot access camera: ${error.message}`);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    cleanupCamera();
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setDebugInfo(`Switching camera to: ${newMode}`);
    
    // Restart camera with new facing mode
    setTimeout(startCamera, 100);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setDebugInfo('Canvas context not available');
        return;
      }

      // Set canvas dimensions to match video
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      setDebugInfo(`Capturing photo: ${width}x${height}`);

      try {
        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, width, height);

        // Convert canvas to blob and create File object
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `property-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });

            // Create preview URL
            const previewUrl = URL.createObjectURL(blob);
            
            // Update state
            const newImages = [...capturedImages, file];
            const newPreviews = [...imagePreviews, previewUrl];
            
            setCapturedImages(newImages);
            setImagePreviews(newPreviews);
            setDebugInfo(`Photo captured! Total: ${newImages.length}`);
            
            // Show preview
            setCurrentPreview(previewUrl);
          } else {
            setDebugInfo('Failed to create blob from canvas');
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        setDebugInfo(`Capture error: ${error}`);
      }
    } else {
      setDebugInfo(`Camera not ready: ref=${!!videoRef.current}, active=${isCameraActive}`);
    }
  };

  const acceptPhoto = () => {
    setCurrentPreview(null);
    setDebugInfo('Photo accepted');
  };

  const rejectPhoto = () => {
    if (currentPreview) {
      // Remove the last captured image
      const newImages = capturedImages.slice(0, -1);
      const newPreviews = imagePreviews.slice(0, -1);
      
      setCapturedImages(newImages);
      setImagePreviews(newPreviews);
      
      // Revoke the object URL for the rejected image
      URL.revokeObjectURL(currentPreview);
      setDebugInfo('Photo rejected and removed');
    }
    setCurrentPreview(null);
  };

  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setCapturedImages(newImages);
    setImagePreviews(newPreviews);
    
    // Revoke the object URL
    URL.revokeObjectURL(imagePreviews[index]);
    setDebugInfo(`Removed photo at index ${index}`);
  };

  const handleBack = () => {
    console.log('Back button clicked - cleaning up camera');
    cleanupCamera();
    navigate(-1);
  };

  const handleDone = () => {
    console.log('Done button clicked - cleaning up camera');
    cleanupCamera();
    if (onImagesCapture) {
      onImagesCapture(capturedImages);
    }
    navigate(-1);
  };

  const retryCamera = () => {
    setCameraError('');
    startCamera();
  };

  // Show preview if we have a current preview image
  if (currentPreview) {
    return (
      <PreviewContainer>
        <PreviewImage src={currentPreview} alt="Captured preview" />
        <PreviewControls>
          <PreviewButton variant="reject" onClick={rejectPhoto}>
            <X />
            Retake
          </PreviewButton>
          <PreviewButton variant="accept" onClick={acceptPhoto}>
            <Check />
            Use Photo
          </PreviewButton>
        </PreviewControls>
      </PreviewContainer>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeft />
        </BackButton>
        <Title>Take Photos</Title>
        <PhotoCount>{capturedImages.length}</PhotoCount>
      </Header>

      <CameraContainer>
        {/* Debug Information */}
        <DebugInfo>
          <div>Status: {debugInfo}</div>
          <div>Video Ref: {videoRef.current ? 'AVAILABLE' : 'NULL'}</div>
          <div>Stream: {stream ? 'ACTIVE' : 'INACTIVE'}</div>
          <div>Video Ready: {videoReady ? 'YES' : 'NO'}</div>
        </DebugInfo>

        <CameraStatus active={isCameraActive}>
          {isCameraActive ? 'CAMERA ACTIVE' : 'CAMERA INACTIVE'}
        </CameraStatus>

        {isLoading && !cameraError && (
          <LoadingMessage>
            <div>Starting camera...</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Please allow camera permissions
            </div>
          </LoadingMessage>
        )}

        {cameraError && (
          <ErrorMessage>
            <VideoOff size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <div style={{ marginBottom: '1rem' }}>{cameraError}</div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                onClick={retryCamera}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button
                onClick={handleBack}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
            </div>
          </ErrorMessage>
        )}

        {/* Video element - always rendered but only shown when ready */}
        <VideoElement
          ref={videoRef}
          autoPlay
          playsInline
          muted
          show={isCameraActive}
          mirror={facingMode === 'user'}
        />

        {isCameraActive && !cameraError && (
          <>
            <CameraOverlay>
              <Viewfinder />
            </CameraOverlay>
            
            <Controls>
              <ControlButton onClick={switchCamera}>
                <RotateCcw />
              </ControlButton>
              
              <CaptureButton onClick={capturePhoto}>
                <Camera />
              </CaptureButton>
              
              <ControlButton 
                onClick={handleDone}
                disabled={capturedImages.length === 0}
                style={{ 
                  opacity: capturedImages.length === 0 ? 0.5 : 1,
                  cursor: capturedImages.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <Check />
              </ControlButton>
            </Controls>
          </>
        )}
        
        <Canvas ref={canvasRef} />
      </CameraContainer>

      {capturedImages.length > 0 && (
        <GallerySection>
          <GalleryTitle>Captured Photos</GalleryTitle>
          <GalleryGrid>
            {imagePreviews.map((preview, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <GalleryImage 
                  src={preview} 
                  alt={`Captured ${index + 1}`}
                  onClick={() => setCurrentPreview(preview)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'white'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </GalleryGrid>
        </GallerySection>
      )}

      {capturedImages.length === 0 && !isLoading && !cameraError && (
        <GallerySection>
          <GalleryTitle>No photos yet</GalleryTitle>
          <GalleryGrid>
            <EmptyGallery>Tap the camera button to start capturing</EmptyGallery>
          </GalleryGrid>
        </GallerySection>
      )}
    </Container>
  );
}