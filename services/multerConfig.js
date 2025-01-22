// /services/multerConfig.js

import multer from 'multer';

// Configuración para almacenamiento en memoria (sin guardar archivos localmente)
const storage = multer.memoryStorage(); // Usamos memoryStorage para que los archivos estén en memoria

// Exportar la configuración de multer
export const upload = multer({ storage });
