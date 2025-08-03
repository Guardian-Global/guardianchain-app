import { useEffect, useRef, useState } from "react";

export default function VoiceCapsuleRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const handleStop = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <h3 className="font-semibold">🎙️ Voice Capsule Recorder</h3>
      <div className="flex space-x-2">
        {!recording ? (
          <button onClick={handleStart} className="px-4 py-2 bg-blue-600 text-white rounded">
            Start Recording
          </button>
        ) : (
          <button onClick={handleStop} className="px-4 py-2 bg-red-600 text-white rounded">
            Stop Recording
          </button>
        )}
      </div>
      {audioURL && (
        <div>
          <audio controls src={audioURL} className="mt-2" />
        </div>
      )}
    </div>
  );
}
