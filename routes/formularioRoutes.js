import express from 'express';
import { enviarCorreo } from '../controllers/formularioController.js';
import { upload } from '../services/multerConfig.js';

const router = express.Router();

router.post('/enviar-email', upload.single('pdf'), enviarCorreo);

export default router;