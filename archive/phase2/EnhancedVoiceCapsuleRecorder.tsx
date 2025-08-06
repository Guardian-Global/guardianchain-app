import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload,
  Radio
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

interface AudioState {
  isRecording: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}

interface VoiceRecordingResult {
  audioBlob: Blob;
  audioUrl: string;
  transcription?: string;
  emotionalAnalysis?: {
    primary: string;
    confidence: number;
    griefScore: number;
  };
}

export default function EnhancedVoiceCapsuleRecorder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    isPaused: false,
    isPlaying: false,
    duration: 0,
    currentTime: 0
  });
  
  const [recording, setRecording] = useState<VoiceRecordingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecording({ audioBlob, audioUrl });
        
        // Process recording with AI
        await processRecording(audioBlob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(1000); // Collect 1s chunks
      setAudioState(prev => ({ ...prev, isRecording: true }));
      
      toast({
        title: "Recording started",
        description: "Capturing your voice capsule...",
      });
      
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && audioState.isRecording) {
      mediaRecorderRef.current.stop();
      setAudioState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-capsule.webm');
      
      const response = await fetch('/api/ai/voice-analysis', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.transcription || result.emotionalAnalysis) {
        setRecording(prev => prev ? {
          ...prev,
          transcription: result.transcription,
          emotionalAnalysis: result.emotionalAnalysis
        } : null);
        
        toast({
          title: "AI Analysis complete",
          description: `Detected: ${result.emotionalAnalysis?.primary || 'Processing...'}`
        });
      }
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayPause = () => {
    if (!recording || !audioElementRef.current) return;

    if (audioState.isPlaying) {
      audioElementRef.current.pause();
    } else {
      audioElementRef.current.play();
    }
  };

  const handleUploadCapsule = async () => {
    if (!recording || !user) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', recording.audioBlob, 'voice-capsule.webm');
      formData.append('transcription', recording.transcription || '');
      formData.append('emotionalAnalysis', JSON.stringify(recording.emotionalAnalysis));
      formData.append('type', 'voice');
      formData.append('userId', user.id);

      await fetch('/api/capsules/voice', {
        method: 'POST',
        body: formData,
      });

      toast({
        title: "Voice capsule created",
        description: "Your memory has been sealed on the blockchain.",
      });

      // Reset state
      setRecording(null);
      setAudioState({
        isRecording: false,
        isPaused: false,
        isPlaying: false,
        duration: 0,
        currentTime: 0
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Unable to create voice capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Audio element event handlers
  useEffect(() => {
    if (!recording || !audioElementRef.current) return;

    const audio = audioElementRef.current;
    
    const handleLoadedMetadata = () => {
      setAudioState(prev => ({ ...prev, duration: audio.duration }));
    };
    
    const handleTimeUpdate = () => {
      setAudioState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    
    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };
    
    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [recording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-purple-500" />
          Voice Capsule Recorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex justify-center">
          {!audioState.isRecording ? (
            <Button
              onClick={handleStartRecording}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600"
              disabled={isProcessing || isUploading}
            >
              <Mic className="w-8 h-8" />
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              className="w-20 h-20 rounded-full bg-gray-500 hover:bg-gray-600"
            >
              <Square className="w-8 h-8" />
            </Button>
          )}
        </div>

        {/* Recording Status */}
        {audioState.isRecording && (
          <div className="text-center">
            <Badge variant="destructive" className="animate-pulse">
              <MicOff className="w-3 h-3 mr-1" />
              Recording...
            </Badge>
          </div>
        )}

        {/* Audio Playback */}
        {recording && (
          <>
            <audio
              ref={audioElementRef}
              src={recording.audioUrl}
              className="hidden"
            />
            
            <div className="space-y-3">
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  disabled={isProcessing}
                >
                  {audioState.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
                </span>
              </div>

              {/* Progress Bar */}
              <Progress 
                value={(audioState.currentTime / audioState.duration) * 100 || 0}
                className="w-full"
              />

              {/* AI Analysis Results */}
              {recording.emotionalAnalysis && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">AI Analysis:</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">
                      {recording.emotionalAnalysis.primary}
                    </Badge>
                    <span className="text-muted-foreground">
                      Grief Score: {recording.emotionalAnalysis.griefScore}
                    </span>
                  </div>
                </div>
              )}

              {/* Transcription */}
              {recording.transcription && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Transcription:</div>
                  <p className="text-sm text-muted-foreground">
                    {recording.transcription}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = recording.audioUrl;
                    link.download = 'voice-capsule.webm';
                    link.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                
                <Button
                  onClick={handleUploadCapsule}
                  disabled={isUploading || !user}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1" />
                      Create Capsule
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing voice with AI...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}