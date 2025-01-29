import express from 'express';
import { historial, getAllHistorial, updateHistorialStatus } from '../controllers/historialController.js';

const router = express.Router();

router.get('/historial/:correo', historial);
router.get('/historial', getAllHistorial);
router.put('/historial', updateHistorialStatus);

export default router;