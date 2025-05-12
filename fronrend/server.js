import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Статические файлы для видео
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

// Настройка хранения видео
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Загрузка видео
app.post('/upload', upload.single('video'), (req, res) => {
  const videoUrl = `/uploads/${req.file.filename}`;
  res.json({ url: videoUrl });
});

// Запуск сервера для загрузки видео
app.listen(port, () => {
  console.log(`Сервер для загрузки видео запущен на http://localhost:${port}`);
});