import express from 'express';
import cors from 'cors';
import routes from './routes/formularioRoutes.js';

const app = express();
const port = process.env.PORT || 7777;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', routes);

// Ruta de prueba para verificar el estado del servidor
app.get('/', (req, res) => {
    res.status(200).json({
      message: '♥Corriendo parchaito♥',
      timestamp: new Date(),
    });
  });

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
