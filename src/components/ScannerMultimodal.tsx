import React, { useRef, useState } from 'react';

const ScannerMultimodal: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const audioChunks = useRef<Blob[]>([]);

  const iniciarCamara = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Error de permisos de cámara/micro");
    }
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    
    // Forzamos un formato estándar
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      // Usamos audio/wav para máxima compatibilidad con el backend
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      enviarAlBackend(audioBlob);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const enviarAlBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    // Importante: nombre 'audio' y nombre de archivo con .wav
    formData.append("audio", audioBlob, "grabacion.wav");

    try {
      const response = await fetch("http://localhost:3001/test-stt", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        alert("Escuché: " + data.text);
      } else {
        alert("Error: " + (data.error || "No se pudo transcribir"));
      }
    } catch (err) {
      console.error("Error conectando al back:", err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#f4f4f4', borderRadius: '10px' }}>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '350px', borderRadius: '10px', background: '#000' }} />
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={iniciarCamara} style={{ padding: '10px' }}>
          {cameraActive ? "📷 Cámara OK" : "Encender Cámara"}
        </button>
        <button 
          onMouseDown={startRecording} 
          onMouseUp={stopRecording}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: isRecording ? '#ef4444' : '#22c55e', 
            color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' 
          }}
        >
          {isRecording ? "🎤 Grabando..." : "Mantener para hablar"}
        </button>
      </div>
    </div>
  );
};

export default ScannerMultimodal;