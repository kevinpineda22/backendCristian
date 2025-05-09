import express from 'express';
import { historial, getAllHistorial, updateHistorialStatus, } from '../controllers/historialController.js';
import { obtenerResumenFruver } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/historial/:correo', historial);
router.get('/historial', getAllHistorial);
router.put('/historial', updateHistorialStatus);
router.get('/resumen', obtenerResumenFruver);

export default router;