// routes/registroRoutes.js
import express from 'express';
import multer from 'multer';  // Necesitamos usar multer para manejar la carga del archivo
import { registro } from '../controllers/registroController.js';

const router = express.Router();

// Configuración de multer para el manejo del archivo PDF
const upload = multer();

// Ruta POST para el registro del formulario
router.post('/registro', upload.single('pdf'), registro);

export default router;
