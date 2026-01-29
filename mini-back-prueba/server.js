const { File } = require('node:buffer');
if (!globalThis.File) {
    globalThis.File = File;
}

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

// Guardamos con la extensión .wav para asegurar compatibilidad
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.wav');
    }
});
const upload = multer({ storage: storage });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!fs.existsSync('uploads')) { fs.mkdirSync('uploads'); }

app.post('/test-stt', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No hay audio" });

        console.log("🎤 Procesando archivo:", req.file.filename);

        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-1",
            language: "es"
        });

        console.log("📝 Transcripción:", transcription.text);
        fs.unlinkSync(req.file.path);
        res.json({ text: transcription.text });
    } catch (error) {
        console.error("❌ Error OpenAI:", error.message);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => console.log("🚀 Servidor en http://localhost:3001"));