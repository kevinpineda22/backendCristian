import express from 'express';
import { enviarCorreo } from '../controllers/formularioController.js';
import { upload } from '../services/multerConfig.js';

const router = express.Router();

// Ruta para guardar datos y enviar correo
router.post('/enviar-email', upload.single('pdf'), enviarCorreo);

export default router;
