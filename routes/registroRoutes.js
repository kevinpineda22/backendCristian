import express from 'express';
import { registro } from '../controllers/registroController.js';
import { registrarEscaneo } from '../controllers/scannerController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Ruta para el registro del formulario
router.post('/registro', upload.single('pdf'), registro);

// 🚀 Nueva ruta para registrar escaneo
router.post('/registrar-escaneo', registrarEscaneo);

export default router;
