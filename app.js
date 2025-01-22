import express from 'express';
import cors from 'cors';
import routes from './routes/formularioRoutes.js';

const app = express();
const port = process.env.PORT || 7777;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: '♥Corriendo parchaito♥', timestamp: new Date() });
});

app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor. Intenta nuevamente más tarde.' });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
