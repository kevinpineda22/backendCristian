import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';
import historialRoutes from './routes/historialRoutes.js';

import { obtenerResumenFruver } from './controllers/dashboardController.js';

dotenv.config();

const app = express();
// Configuración de CORS para permitir solicitudes desde cualquier origenAdd commentMore actions
app.use(cors());

app.use(express.json());  // Permite manejar solicitudes con body JSON
app.use(express.urlencoded({ extended: true }));  // Permite manejar datos de formularios URL encoded

// Usar las rutas definidas
app.use('/', registroRoutes);  // Ruta para registrar formularios
app.use('/', historialRoutes);  // Ruta para el historial de formularios

app.get('/resumen', obtenerResumenFruver);  // Ruta para obtener el resumen de Fruver

// Endpoint para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('♥activo mi papacho♥');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;  // Usa el puerto de entorno si está disponible

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});