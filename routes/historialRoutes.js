import express from 'express';
import { historial, getAllHistorial, updateHistorialStatus,obtenerResumenFruver } from '../controllers/historialController.js';

const router = express.Router();

router.get('/historial/:correo', historial);
router.get('/historial', getAllHistorial);
router.put('/historial', updateHistorialStatus);
router.get('/resumen', obtenerResumenFruver);

export default router;