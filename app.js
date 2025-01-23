import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';
import historialRoutes from './routes/historialRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' })); // Esto permite cualquier dominio

app.use((req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*');  // Permite solicitudes de cualquier origen
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH');  // Permite métodos específicos
  res.header('Access-Control-Allow-Headers', 'Content-Type');  // Permite encabezados específicos
  next();  // Continúa al siguiente middleware o ruta
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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