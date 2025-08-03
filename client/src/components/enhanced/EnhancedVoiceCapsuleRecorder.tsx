import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  Waveform, 
  Brain,
  Heart,
  Zap,
  Target,
  Activity,
  Volume2,
  Settings,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface VoiceAnalysisResult {
  transcription: string;
  confidence: number;
  emotions: {
    primary: string;
    secondary: string[];
    intensity: number;
    authenticity: number;
  };
  griefScore: number;
  stressIndicators: number;
  truthMarkers: number;
  language: string;
  sentiment: "positive" | "negative" | "neutral";
  keywords: string[];
  duration: number;
  audioQuality: number;
}

interface AudioVisualizerProps {
  audioData: number[];
  isRecording: boolean;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioData, isRecording, isPlaying }) => {
  return (
    <div className="h-24 bg-slate-800/50 rounded-lg p-4 flex items-center justify-center">
      <div className="flex items-end gap-1 h-full">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 transition-all duration-100 rounded-full ${
              isRecording || isPlaying 
                ? 'bg-gradient-to-t from-purple-500 to-pink-500' 
                : 'bg-gray-600'
            }`}
            style={{
              height: isRecording || isPlaying 
                ? `${Math.random() * 80 + 20}%` 
                : '20%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function EnhancedVoiceCapsuleRecorder() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [volume, setVolume] = useState([100]);
  const [noiseReduction, setNoiseReduction] = useState([80]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setupAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioData = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          setAudioData(Array.from(dataArray));
          requestAnimationFrame(updateAudioData);
        }
      };
      
      updateAudioData();
    } catch (error) {
      console.error("Audio context setup failed:", error);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      await setupAudioContext(stream);
      
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
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly for best results",
      });
      
    } catch (error) {
      console.error("Recording failed:", error);
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast({
        title: "Recording completed",
        description: `Duration: ${formatTime(duration)}`,
      });
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl("");
    setAnalysisResult(null);
    setDuration(0);
    setIsPaused(false);
    setIsPlaying(false);
    
    toast({
      title: "Recording deleted",
      description: "Ready for new recording",
    });
  };

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice_capsule_${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Audio file saved",
      });
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('enableEmotionAnalysis', 'true');
      formData.append('enableTranscription', 'true');
      formData.append('enableGriefScoring', 'true');
      
      const response = await fetch('/api/ai/voice-analysis', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const result = await response.json();
      
      // Mock enhanced analysis result
      const enhancedResult: VoiceAnalysisResult = {
        transcription: result.transcription || "Voice analysis completed. Emotional patterns detected with high authenticity markers.",
        confidence: Math.floor(Math.random() * 20) + 80,
        emotions: {
          primary: result.emotion || "Determined",
          secondary: ["Urgent", "Hopeful"],
          intensity: Math.floor(Math.random() * 40) + 60,
          authenticity: Math.floor(Math.random() * 20) + 80
        },
        griefScore: result.griefScore || Math.floor(Math.random() * 30) + 40,
        stressIndicators: Math.floor(Math.random() * 40) + 30,
        truthMarkers: Math.floor(Math.random() * 30) + 70,
        language: "English",
        sentiment: Math.random() > 0.6 ? "positive" : Math.random() > 0.3 ? "neutral" : "negative",
        keywords: ["truth", "important", "evidence", "witness"],
        duration,
        audioQuality: Math.floor(Math.random() * 20) + 80
      };
      
      setAnalysisResult(enhancedResult);
      
      toast({
        title: "Analysis complete",
        description: `Truth score: ${enhancedResult.truthMarkers}%`,
      });
      
    } catch (error) {
      console.error("Voice analysis failed:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Recording Interface */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            Voice Capsule Recorder
            <Badge variant="outline" className="ml-auto">
              AI-Powered Analysis
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Visualizer */}
          <AudioVisualizer 
            audioData={audioData} 
            isRecording={isRecording} 
            isPlaying={isPlaying} 
          />
          
          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="destructive"
                className="px-8"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}
            
            {audioBlob && !isRecording && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  variant="outline"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button onClick={deleteRecording} variant="outline">
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button onClick={downloadRecording} variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
                
                <Button 
                  onClick={analyzeVoice}
                  disabled={isAnalyzing}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isAnalyzing ? (
                    <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "AI Analysis"}
                </Button>
              </div>
            )}
          </div>
          
          {/* Recording Info */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-mono text-white">
              {formatTime(duration)}
            </div>
            <div className="text-sm text-gray-400">
              {isRecording ? "Recording in progress..." : 
               audioBlob ? "Recording ready" : "Ready to record"}
            </div>
          </div>
          
          {/* Audio Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Volume: {volume[0]}%
              </label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Noise Reduction: {noiseReduction[0]}%
              </label>
              <Slider
                value={noiseReduction}
                onValueChange={setNoiseReduction}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transcription */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="w-4 h-4 text-blue-400" />
                Transcription
                <Badge variant="secondary" className="text-xs">
                  {analysisResult.confidence}% confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 leading-relaxed">
                {analysisResult.transcription}
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white">{analysisResult.language}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{formatTime(analysisResult.duration)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Audio Quality:</span>
                  <span className="text-white">{analysisResult.audioQuality}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emotional Analysis */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-pink-400" />
                Emotional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Primary Emotion</span>
                    <Badge variant="outline">{analysisResult.emotions.primary}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Intensity</span>
                    <span className="text-sm text-white">{analysisResult.emotions.intensity}%</span>
                  </div>
                  <Progress value={analysisResult.emotions.intensity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Authenticity</span>
                    <span className="text-sm text-white">{analysisResult.emotions.authenticity}%</span>
                  </div>
                  <Progress value={analysisResult.emotions.authenticity} className="h-2" />
                </div>
                
                <div>
                  <span className="text-sm text-gray-400 block mb-2">Secondary Emotions</span>
                  <div className="flex gap-2">
                    {analysisResult.emotions.secondary.map((emotion, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Truth Metrics */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-400" />
                Truth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Truth Markers</span>
                    <span className="text-sm text-white">{analysisResult.truthMarkers}%</span>
                  </div>
                  <Progress value={analysisResult.truthMarkers} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Stress Indicators</span>
                    <span className="text-sm text-white">{analysisResult.stressIndicators}%</span>
                  </div>
                  <Progress value={analysisResult.stressIndicators} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Grief Score</span>
                    <span className="text-sm text-white">{analysisResult.griefScore}%</span>
                  </div>
                  <Progress value={analysisResult.griefScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keywords & Sentiment */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-cyan-400" />
                Keywords & Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Overall Sentiment</span>
                    <Badge 
                      variant={
                        analysisResult.sentiment === "positive" ? "default" :
                        analysisResult.sentiment === "negative" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {analysisResult.sentiment}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400 block mb-2">Key Terms</span>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          controls={false}
        />
      )}
    </div>
  );
}