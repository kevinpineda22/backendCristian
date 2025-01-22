// /api/formulario/enviar-email.js

import { enviarCorreo } from '../../controllers/formularioController.js';  // Importa la lógica del controlador
import { upload } from '../../services/multerConfig.js';  // Importa la configuración de Multer

export const config = {
  api: {
    bodyParser: false, // Deshabilitamos el body parser, ya que Multer maneja la carga de archivos
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Multer maneja la carga de archivos
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }
      enviarCorreo(req, res);  // Llamamos al controlador para procesar la solicitud
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
