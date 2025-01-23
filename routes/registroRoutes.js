import express from 'express';
import upload from '../middlewares/upload.js';
import { registro } from '../controllers/registroController.js';

const router = express.Router();

router.post('/registro', upload.single('pdf'), registro);

export default router;