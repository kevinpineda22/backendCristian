import express from 'express';
import { registrarEscaneo } from '../controllers/scannerController.js';

const router = express.Router();

// 🚀 Nueva ruta para registrar escaneo
router.post('/registrar-escaneo', registrarEscaneo);

export default router;
