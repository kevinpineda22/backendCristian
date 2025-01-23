import express from 'express';
import multer from 'multer';
import { registro } from '../controllers/registroController.js';

const router = express.Router();
const upload = multer();

router.post('/registro', upload.single('pdf'), registro);

export default router;