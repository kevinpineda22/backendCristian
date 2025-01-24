import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';
import historialRoutes from './routes/historialRoutes.js';
import './cronJob.js'; // Importar el cron job para que se inicie

dotenv.config();

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas
app.use('/', registroRoutes);
app.use('/', historialRoutes);

// Endpoint para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('♥activo mi papacho♥');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});