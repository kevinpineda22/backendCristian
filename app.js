import express from 'express';
import cors from 'cors';
import registroRoutes from './routes/registroRoutes.js';
import historialRoutes from './routes/historialRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', registroRoutes);
app.use('/', historialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});