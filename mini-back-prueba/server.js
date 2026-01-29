// 1. PARCHE DE COMPATIBILIDAD PARA NODE 18
const { File } = require('node:buffer');
if (!globalThis.File) {
    globalThis.File = File;
}

// 2. IMPORTACIONES
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// 3. CONFIGURACIÓN
app.use(cors({ origin: 'http://localhost:5173' }));

// Configuración de almacenamiento para archivos .webm
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.webm');
    }
});
const upload = multer({ storage: storage });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!fs.existsSync('uploads')) { 
    fs.mkdirSync('uploads'); 
}

// 4. RUTA DE PROCESAMIENTO
app.post('/test-stt', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No hay audio" });

        console.log("🎤 Procesando archivo:", req.file.filename);

        // CONVERSIÓN CRÍTICA: Convertimos el stream a un archivo válido para OpenAI
        const audioFile = await OpenAI.toFile(
            fs.createReadStream(req.file.path),
            `grabacion.webm`,
            { type: 'audio/webm' }
        );

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
            language: "es"
        });

        console.log("📝 Transcripción exitosa:", transcription.text);
        
        // Limpieza de archivos temporales
        fs.unlinkSync(req.file.path);
        
        res.json({ text: transcription.text });
    } catch (error) {
        console.error("❌ Error OpenAI:", error.message);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
});

// 5. INICIO DEL SERVIDOR
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Ferretería corriendo en http://localhost:${PORT}`);
});