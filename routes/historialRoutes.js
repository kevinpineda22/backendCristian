import express from 'express';
import { historial } from '../controllers/historialController.js';

const router = express.Router();

router.get('/historial/:correo', historial);

export default router;