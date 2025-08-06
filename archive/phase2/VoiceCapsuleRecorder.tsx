import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  RotateCcw,
  Trash2,
  Download,
  Waveform,
  Volume2,
  Brain,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface VoiceRecording {
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
  transcription?: string;
  emotionAnalysis?: {
    primary: string;
    confidence: number;
    emotions: Record<string, number>;
  };
  enhancedTranscription?: string;
}

interface VoiceCapsuleRecorderProps {
  onRecordingComplete: (recording: VoiceRecording) => void;
  onRecordingDelete: () => void;
  maxDuration?: number;
  autoTranscribe?: boolean;
  enableEmotionAnalysis?: boolean;
  enableAIEnhancement?: boolean;
}

export default function VoiceCapsuleRecorder({
  onRecordingComplete,
  onRecordingDelete,
  maxDuration = 300, // 5 minutes default
  autoTranscribe = true,
  enableEmotionAnalysis = true,
  enableAIEnhancement = true
}: VoiceCapsuleRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [currentRecording, setCurrentRecording] = useState<VoiceRecording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const initializeAudioVisualization = (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateWaveform = () => {
        if (analyserRef.current && isRecording && !isPaused) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setVolume(average);
          
          // Update waveform data (simplified)
          setWaveformData(prev => [...prev.slice(-50), average].slice(0, 51));
        }
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
    } catch (error) {
      console.warn('Audio visualization not available:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      initializeAudioVisualization(stream);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        const recording: VoiceRecording = {
          blob,
          url,
          duration: recordingTime,
          timestamp: new Date()
        };
        
        setCurrentRecording(recording);
        
        if (autoTranscribe || enableEmotionAnalysis || enableAIEnhancement) {
          await processRecording(recording);
        } else {
          onRecordingComplete(recording);
        }
      };
      
      mediaRecorder.start(100); // Record in 100ms chunks
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
      
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const processRecording = async (recording: VoiceRecording) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Transcription
      if (autoTranscribe) {
        setProcessingStage('Transcribing audio...');
        const transcriptionResponse = await fetch('/api/ai/transcribe', {
          method: 'POST',
          body: createFormData(recording.blob),
        });
        
        if (transcriptionResponse.ok) {
          const { transcription } = await transcriptionResponse.json();
          recording.transcription = transcription;
        }
      }
      
      // Step 2: Emotion Analysis
      if (enableEmotionAnalysis && recording.transcription) {
        setProcessingStage('Analyzing emotions...');
        const emotionResponse = await fetch('/api/ai/emotion-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: recording.transcription }),
        });
        
        if (emotionResponse.ok) {
          recording.emotionAnalysis = await emotionResponse.json();
        }
      }
      
      // Step 3: AI Enhancement
      if (enableAIEnhancement && recording.transcription) {
        setProcessingStage('Enhancing with AI...');
        const enhancementResponse = await fetch('/api/ai/enhance-transcription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            transcription: recording.transcription,
            emotion: recording.emotionAnalysis?.primary 
          }),
        });
        
        if (enhancementResponse.ok) {
          const { enhanced } = await enhancementResponse.json();
          recording.enhancedTranscription = enhanced;
        }
      }
      
      setCurrentRecording(recording);
      onRecordingComplete(recording);
      
      toast({
        title: "Recording Processed",
        description: "Voice analysis complete with AI enhancements",
      });
      
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Recording saved but AI processing failed",
        variant: "destructive",
      });
      onRecordingComplete(recording);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const createFormData = (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    return formData;
  };

  const playRecording = () => {
    if (currentRecording && !isPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentRecording.url);
        audioRef.current.ontimeupdate = () => {
          setPlaybackTime(audioRef.current?.currentTime || 0);
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setPlaybackTime(0);
        };
      }
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setCurrentRecording(null);
    setRecordingTime(0);
    setPlaybackTime(0);
    setWaveformData([]);
    if (audioRef.current) {
      audioRef.current.src = '';
      audioRef.current = null;
    }
    onRecordingDelete();
  };

  const downloadRecording = () => {
    if (currentRecording) {
      const a = document.createElement('a');
      a.href = currentRecording.url;
      a.download = `voice-capsule-${Date.now()}.webm`;
      a.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeColor = () => {
    if (volume < 50) return 'bg-green-500';
    if (volume < 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Voice Capsule Recorder
          {currentRecording && (
            <Badge className="ml-2 bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Recorded
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isRecording && !currentRecording && (
            <Button
              onClick={startRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
              data-testid="start-recording"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          )}
          
          {isRecording && (
            <>
              <Button
                onClick={pauseRecording}
                variant="outline"
                className="rounded-full"
                data-testid="pause-recording"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 rounded-full"
                data-testid="stop-recording"
              >
                <Square className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {currentRecording && !isRecording && (
            <>
              <Button
                onClick={isPlaying ? pausePlayback : playRecording}
                className="bg-blue-600 hover:bg-blue-700 rounded-full"
                data-testid="play-recording"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={resetRecording}
                variant="outline"
                className="rounded-full"
                data-testid="reset-recording"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={downloadRecording}
                variant="outline"
                className="rounded-full"
                data-testid="download-recording"
              >
                <Download className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={resetRecording}
                variant="destructive"
                className="rounded-full"
                data-testid="delete-recording"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Recording Status */}
        <div className="text-center space-y-2">
          <div className="text-2xl font-mono text-white">
            {isRecording || isPlaying ? formatTime(isRecording ? recordingTime : playbackTime) : 
             currentRecording ? formatTime(currentRecording.duration) : '0:00'}
          </div>
          
          {maxDuration && isRecording && (
            <Progress 
              value={(recordingTime / maxDuration) * 100} 
              className="w-64 mx-auto h-2"
            />
          )}
          
          {isRecording && (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-sm text-gray-400">
                {isPaused ? 'Paused' : 'Recording...'}
              </span>
            </div>
          )}
        </div>

        {/* Volume Indicator */}
        {isRecording && !isPaused && (
          <div className="flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-32 h-2 bg-gray-700 rounded">
              <div 
                className={`h-full rounded transition-all ${getVolumeColor()}`}
                style={{ width: `${Math.min(volume, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Waveform Visualization */}
        {(isRecording || currentRecording) && waveformData.length > 0 && (
          <div className="flex items-end justify-center gap-1 h-16 bg-gray-900/50 rounded p-2">
            {waveformData.map((amplitude, index) => (
              <div
                key={index}
                className="bg-cyan-400 rounded-t transition-all duration-100"
                style={{
                  height: `${Math.max(2, (amplitude / 255) * 60)}px`,
                  width: '3px',
                  opacity: isRecording ? 1 : 0.6
                }}
              />
            ))}
          </div>
        )}

        {/* Processing Status */}
        {isProcessing && (
          <div className="text-center p-4 bg-purple-500/10 border border-purple-500/30 rounded">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-purple-300">Processing Recording...</span>
            </div>
            <p className="text-sm text-gray-400">{processingStage}</p>
          </div>
        )}

        {/* Recording Analysis Results */}
        {currentRecording && !isProcessing && (
          <div className="space-y-4">
            {currentRecording.transcription && (
              <div className="p-4 bg-gray-700/50 rounded border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Waveform className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Transcription</span>
                </div>
                <p className="text-gray-300 text-sm">{currentRecording.transcription}</p>
              </div>
            )}
            
            {currentRecording.emotionAnalysis && (
              <div className="p-4 bg-gray-700/50 rounded border border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Emotion Analysis</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-600">
                    {currentRecording.emotionAnalysis.primary}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {Math.round(currentRecording.emotionAnalysis.confidence * 100)}% confident
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(currentRecording.emotionAnalysis.emotions).map(([emotion, score]) => (
                    <div key={emotion} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{emotion}</span>
                      <span className="text-gray-300">{Math.round(score * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentRecording.enhancedTranscription && (
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">AI Enhanced Version</span>
                </div>
                <p className="text-gray-300 text-sm">{currentRecording.enhancedTranscription}</p>
              </div>
            )}
          </div>
        )}

        {/* Features Info */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div className={`p-2 rounded ${autoTranscribe ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800/50'}`}>
            <Brain className={`w-4 h-4 mx-auto mb-1 ${autoTranscribe ? 'text-green-400' : 'text-gray-400'}`} />
            <span className={autoTranscribe ? 'text-green-300' : 'text-gray-400'}>
              Auto Transcription
            </span>
          </div>
          
          <div className={`p-2 rounded ${enableEmotionAnalysis ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-gray-800/50'}`}>
            <Zap className={`w-4 h-4 mx-auto mb-1 ${enableEmotionAnalysis ? 'text-purple-400' : 'text-gray-400'}`} />
            <span className={enableEmotionAnalysis ? 'text-purple-300' : 'text-gray-400'}>
              Emotion Analysis
            </span>
          </div>
          
          <div className={`p-2 rounded ${enableAIEnhancement ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-gray-800/50'}`}>
            <Sparkles className={`w-4 h-4 mx-auto mb-1 ${enableAIEnhancement ? 'text-cyan-400' : 'text-gray-400'}`} />
            <span className={enableAIEnhancement ? 'text-cyan-300' : 'text-gray-400'}>
              AI Enhancement
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}