import express from 'express';
import { enviarFormulario } from '../controllers/formularioController.js'; // Cambiado
import { upload } from '../services/multerConfig.js';

const router = express.Router();

// Ruta para guardar datos y enviar correo
router.post('/enviar-email', upload.single('pdf'), enviarFormulario); // Cambiado

export default router;
