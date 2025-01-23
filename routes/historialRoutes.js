import express from 'express';
import { historial, actualizarHistorial } from '../controllers/historialController.js';

const router = express.Router();

router.get('/historial/:correo', historial);
router.put('/historial/:id', actualizarHistorial);

export default router;