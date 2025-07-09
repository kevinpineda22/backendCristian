// src/routes/historialRoutes.js
import express from 'express';
import { historial, getAllHistorial, updateHistorialStatus, deleteHistorialRecord } from '../controllers/historialController.js'; // Asegúrate de importar deleteHistorialRecord
import { obtenerResumenFruver } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/historial/:correo', historial);
router.get('/historial', getAllHistorial);
router.put('/historial', updateHistorialStatus);
router.get('/resumen', obtenerResumenFruver);
router.delete('/historial/:id', deleteHistorialRecord); 

export default router;