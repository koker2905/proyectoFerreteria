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
      alert("Error: Revisa que el micrófono y la cámara estén conectados en Kubuntu.");
    }
  };

  const startRecording = async () => {
    if (!cameraActive) {
      alert("Primero enciende la cámara.");
      return;
    }

    try {
      // CAPTURA SIMPLIFICADA: Pedimos un nuevo stream solo de audio para la grabadora
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];

      // No especificamos mimeType para que el navegador elija el que mejor le funcione
      mediaRecorderRef.current = new MediaRecorder(audioStream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mediaRecorderRef.current?.mimeType });
        console.log("Grabación finalizada. Tipo detectado:", audioBlob.type);
        
        if (audioBlob.size > 1000) {
          enviarAlBackend(audioBlob);
        }
        
        // Cerramos el stream de audio para liberar el micro
        audioStream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Fallo al iniciar grabación:", error);
      alert("No se pudo iniciar el micrófono. Asegúrate de que no esté siendo usado por otra app.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Damos un margen para capturar el final de la voz
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }, 400);
    }
  };

  const enviarAlBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    // Enviamos el blob con el nombre 'audio'
    formData.append("audio", audioBlob, "grabacion.audio");

    try {
      const response = await fetch("http://localhost:3001/test-stt", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        alert("Asistente Ferretería: " + data.text);
      }
    } catch (err) {
      console.error("Error conectando al servidor:", err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '320px', borderRadius: '12px', background: '#1e293b' }} />
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button 
          onClick={iniciarCamara} 
          style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', background: '#fff', border: '1px solid #cbd5e1' }}
        >
          {cameraActive ? "📷 Cámara OK" : "Encender Cámara"}
        </button>
        <button 
          onMouseDown={startRecording} 
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          style={{ 
            padding: '10px 25px', 
            backgroundColor: isRecording ? '#ef4444' : '#3b82f6', 
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {isRecording ? "🎤 SOLTAR PARA ENVIAR" : "🎤 MANTENER PARA HABLAR"}
        </button>
      </div>
    </div>
  );
};

export default ScannerMultimodal;