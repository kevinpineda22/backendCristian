import express from 'express';
import { registro } from '../controllers/registroController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/registro', upload.single('pdf'), registro);

export default router;