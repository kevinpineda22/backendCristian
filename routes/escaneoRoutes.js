import express from 'express';
import {
  registrarEscaneo,
  iniciarInventario,
  subirFoto,
  obtenerHistorialInventario,
  eliminarRegistroInventario,
  obtenerCategorias,
  upload // middleware de multer para subir fotos
} from '../controllers/scannerController.js';

const router = express.Router();

// 🚀 Registrar escaneo de producto
router.post('/registrar-escaneo', registrarEscaneo);

// 🟢 Iniciar un nuevo inventario
router.post('/iniciar-inventario', iniciarInventario);

// 🔼 Subir foto de zona al bucket 'inventario'
router.post('/subir-foto', upload, subirFoto);

// 📄 Obtener historial de escaneos por inventario
router.get('/historial/:inventario_id', obtenerHistorialInventario);

// ❌ Eliminar registro específico del inventario
router.delete('/eliminar/:id', eliminarRegistroInventario);

// 📂 Obtener lista de categorías
router.get('/categorias', obtenerCategorias);

export default router;
