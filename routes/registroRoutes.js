import express from 'express';
import { registro } from '../controllers/registroController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Ruta para el registro del formulario
router.post('/registro', upload.single('pdf'), registro);

export default router;
