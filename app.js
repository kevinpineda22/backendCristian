import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import escaneoRoutes from './routes/escaneoRoutes.js';
import { obtenerResumenFruver } from './controllers/dashboardController.js';

dotenv.config();

const app = express();

// Configuración de CORS para permitir solicitudes desde orígenes específicos
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-frontend-dominio.com'], // Reemplaza con el dominio de producción
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middlewares
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear form-data para subir fotos

// Rutas
app.use('/', registroRoutes); // Rutas para formularios
app.use('/', historialRoutes); // Rutas para historial
app.use('/escaneo', escaneoRoutes); // Rutas para escáner
app.get('/resumen', obtenerResumenFruver); // Ruta para resumen de Fruver

// Endpoint para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('♥activo mi papacho♥');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error en el servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});