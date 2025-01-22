import formidable from 'formidable';
import { enviarCorreo } from '../../controllers/formularioController.js';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar el body parser
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Crear un formulario y parsear los datos
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Error al procesar el formulario', details: err.message });
      }

      // Asignar el archivo y los campos a la solicitud
      req.body = fields;
      req.file = files.pdf;

      try {
        // Llamar al controlador para enviar el correo
        await enviarCorreo(req, res);
      } catch (e) {
        return res.status(500).json({ error: 'Error al procesar el correo', details: e.message });
      }
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
