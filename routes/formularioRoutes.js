import express from 'express';
import { enviarCorreo } from '../controllers/formularioController.js'; // Asegúrate de que el nombre coincida
import { upload } from '../services/multerConfig.js';

const router = express.Router();

// Ruta para guardar datos y enviar correo
router.post('/enviar-email', upload.single('pdf'), enviarCorreo); // Usa el nombre correcto

export default router;
