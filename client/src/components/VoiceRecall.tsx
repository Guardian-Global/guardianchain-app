import { useState, useRef } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VoiceRecallProps {
  onSearch: (query: string) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceRecall({ onSearch }: VoiceRecallProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setSearchQuery(result);
      onSearch(result);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTextSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        🎤 Voice Memory Recall
      </h3>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe what you're looking for..."
            className="bg-slate-800 border-cyan-500/30 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
            data-testid="input-voice-search"
          />
        </div>
        
        <Button
          onClick={handleTextSearch}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          data-testid="button-text-search"
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
          }`}
          data-testid="button-voice-recording"
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      </div>
      
      {transcript && (
        <div className="text-sm text-cyan-400 bg-slate-800/50 p-3 rounded-lg">
          <strong>Transcript:</strong> "{transcript}"
        </div>
      )}
      
      {isRecording && (
        <div className="text-sm text-cyan-400 animate-pulse">
          🎙️ Listening... Speak now to search your capsules
        </div>
      )}
    </div>
  );
}