import express from 'express';
import cors from 'cors';
import routes from './routes/formularioRoutes.js';

const app = express();
const port = process.env.PORT || 7777;

// Configuración de CORS
app.use(cors({ origin: '*' }));

// Middleware para procesar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', routes);

// Ruta principal
app.get('/', (req, res) => {
  res.status(200).json({ message: '♥Corriendo parchaito♥', timestamp: new Date() });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
