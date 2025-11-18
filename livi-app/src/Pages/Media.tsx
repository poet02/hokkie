import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, X, RotateCcw, Check, ArrowLeft, VideoOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useCamera } from '../context/CameraContext';

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
  bottom: ${props => props.hasImages ? '100px' : '2rem'}; /* Move up when gallery is present */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
  transition: bottom 0.3s ease;
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
  // height: 100vh;
`;

const PreviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
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

// Updated Gallery Section as Expandable Drawer
const GalleryDrawer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px 16px 0 0;
  transition: all 0.3s ease;
  z-index: 10;
  height: ${props => props.isOpen ? '100vh' : '60px'}; /* Reduced closed height */
  max-height: ${props => props.isOpen ? '80vh' : '60px'}; /* Reduced closed height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  padding: 0rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  min-height: 60px; /* Reduced height */

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DrawerTitle = styled.h3`
  margin: 0;
  font-size: 1rem; /* Slightly smaller font */
  font-weight: 600;
  color: white;
`;

const DrawerToggle = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 20px; /* Smaller icons */
    height: 20px;
  }
`;

const DrawerContent = styled.div`
  flex: 1;
  padding: 1rem 1.5rem;
  overflow-y: auto;
`;

const GalleryGrid = styled.div`
  display: flex;
  // flex: 1;
  height: 100%;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  padding-bottom: 1rem;
`;

const GalleryImageContainer = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const EmptyGallery = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  padding: 2rem;
  width: 100%;
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
`;

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Get callback from navigation state
  const onImagesCapture = location.state?.onImagesCapture;
  const initialImages = location.state?.initialImages || [];

  const { setActiveStream, stopCamera: globalStopCamera } = useCamera();

  // Initialize camera after component mounts and refs are available
  useEffect(() => {
    const timer = setTimeout(() => {
      startCamera();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupCamera();
    };
  }, []);

  // Restart video when returning from preview
  useEffect(() => {
    if (!currentPreview && stream && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.play().catch(error => {
        console.error('Failed to restart video after preview:', error);
        setDebugInfo(`Failed to restart video: ${error.message}`);
      });
    }
  }, [currentPreview, stream]);

  // Clean up ALL object URLs when component unmounts
  useEffect(() => {
    return () => {
      console.log('Cleaning up all object URLs');
      imagePreviews.forEach(url => {
        URL.revokeObjectURL(url);
      });
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, []);

  const cleanupCamera = () => {
    console.log('Cleaning up camera...');

    if (stream) {
      console.log('Stopping media stream tracks');
      stream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind} - ${track.readyState}`);
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }

    globalStopCamera();

    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      video.load();
    }

    setIsCameraActive(false);
    setVideoReady(false);
    console.log('Camera cleanup completed');
  };

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
            setActiveStream(mediaStream);
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

      if (!videoRef.current) {
        setDebugInfo('Waiting for video element...');
        setTimeout(startCamera, 100);
        return;
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

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

      await setupVideo(mediaStream);

    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setDebugInfo(`Camera error: ${error.message}`);
      setCameraError(`Cannot access camera: ${error.message}`);
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setDebugInfo(`Switching camera to: ${newMode}`);
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

      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      setDebugInfo(`Capturing photo: ${width}x${height}`);

      try {
        context.drawImage(video, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `property-photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });

            const previewUrl = URL.createObjectURL(blob);

            const newImages = [...capturedImages, file];
            const newPreviews = [...imagePreviews, previewUrl];

            setCapturedImages(newImages);
            setImagePreviews(newPreviews);
            setDebugInfo(`Photo captured! Total: ${newImages.length}`);

            // REMOVED auto-open gallery - gallery stays closed
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
    setDebugInfo('Photo accepted - returning to camera');
  };

  const rejectPhoto = () => {
    if (currentPreview) {
      const newImages = capturedImages.slice(0, -1);
      const newPreviews = imagePreviews.slice(0, -1);

      setCapturedImages(newImages);
      setImagePreviews(newPreviews);

      URL.revokeObjectURL(currentPreview);
      setDebugInfo('Photo rejected and removed');
    }
    setCurrentPreview(null);
    setDebugInfo('Photo rejected - returning to camera');
  };

  const removeImage = (index: number) => {
    const newImages = capturedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);

    setCapturedImages(newImages);
    setImagePreviews(newPreviews);
    
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

  const toggleGallery = () => {
    setIsGalleryOpen(!isGalleryOpen);
  };

  // Show preview if we have a current preview image
  if (currentPreview) {
    return (
      <PreviewContainer>
        <PreviewContent>
          <PreviewImage src={currentPreview} alt="Captured preview" />
        </PreviewContent>
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
          <div>Preview Active: {currentPreview ? 'YES' : 'NO'}</div>
          <div>Photos: {capturedImages.length}</div>
          <div>Previews: {imagePreviews.length}</div>
        </DebugInfo>

        <CameraStatus active={isCameraActive && !currentPreview}>
          {isCameraActive && !currentPreview ? 'CAMERA ACTIVE' : 'CAMERA INACTIVE'}
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

        {/* Video element */}
        <VideoElement
          ref={videoRef}
          autoPlay
          playsInline
          muted
          show={isCameraActive && !currentPreview}
          mirror={facingMode === 'user'}
        />

        {isCameraActive && !cameraError && !currentPreview && (
          <>
            <CameraOverlay>
              <Viewfinder />
            </CameraOverlay>

            {/* Fixed: Controls now adjust position based on whether images exist */}
            <Controls hasImages={capturedImages.length > 0}>
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

        {/* Gallery Drawer */}
        {capturedImages.length > 0 && (
          <GalleryDrawer isOpen={isGalleryOpen}>
            <DrawerHeader onClick={toggleGallery}>
              <DrawerTitle>Captured Photos ({capturedImages.length})</DrawerTitle>
              <DrawerToggle>
                {isGalleryOpen ? <ChevronDown /> : <ChevronUp />}
              </DrawerToggle>
            </DrawerHeader>
            
            {isGalleryOpen && (
              <DrawerContent>
                <GalleryGrid>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <GalleryImageContainer
                        onClick={() => setCurrentPreview(preview)}
                      >
                        <GalleryImage
                          src={preview}
                          alt={`Captured ${index + 1}`}
                          onError={(e) => {
                            console.error(`Failed to load image preview ${index}:`, preview);
                            e.currentTarget.style.backgroundColor = '#ff000020';
                          }}
                        />
                      </GalleryImageContainer>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
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
              </DrawerContent>
            )}
          </GalleryDrawer>
        )}
      </CameraContainer>
    </Container>
  );
}