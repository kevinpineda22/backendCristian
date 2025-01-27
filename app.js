// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';  // Ruta para manejar el registro
import historialRoutes from './routes/historialRoutes.js';  // Ruta para manejar el historial de registros
import './cronJob.js';  // Importa el archivo que contiene el cron job para actualizar los registros vencidos

dotenv.config();

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(express.json());  // Permite manejar solicitudes con body JSON
app.use(express.urlencoded({ extended: true }));  // Permite manejar datos de formularios URL encoded

// Usar las rutas definidas
app.use('/', registroRoutes);  // Ruta para registrar formularios
app.use('/', historialRoutes);  // Ruta para el historial de formularios

// Endpoint para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('♥activo mi papacho♥');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;  // Usa el puerto de entorno si está disponible
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
