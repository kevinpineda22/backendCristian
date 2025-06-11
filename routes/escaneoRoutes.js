import express from 'express';
import {
  registrarEscaneo,
  iniciarInventario,
  obtenerHistorialInventario,
  eliminarRegistroInventario,
  obtenerCategorias
} from '../controllers/scannerController.js';

const router = express.Router();

// 🚀 Iniciar un nuevo inventario
router.post('/iniciar-inventario', iniciarInventario);

// 🚀 Registrar un escaneo (código de barras + cantidad)
router.post('/registrar-escaneo', registrarEscaneo);

// 📄 Obtener historial de escaneos de un inventario específico
router.get('/historial/:inventario_id', obtenerHistorialInventario);

// ❌ Eliminar un registro específico del historial
router.delete('/registro/:id', eliminarRegistroInventario);

// 🆕 Ruta para listar categorías
router.get('/categorias', obtenerCategorias); 


export default router;
