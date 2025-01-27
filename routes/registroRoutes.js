import express from 'express';
import { registro } from '../controllers/registroController.js';
import upload from '../middlewares/upload.js';  // Usamos el middleware 'upload' desde 'middlewares/upload.js'

const router = express.Router();

// Ruta POST para el registro del formulario
router.post('/registro', upload.single('pdf'), registro);

export default router;
