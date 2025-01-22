import supabase from '../services/supabaseService.js';
import multer from 'multer';
import { sendEmail } from '../services/emailService.js'; // Ajustamos a named export

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf');

// Función para manejar el envío de correos
const enviarCorreo = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const pdfFile = req.file;

    if (!descripcion || !sede || !fecha_inicial || !fecha_final || !correo_asignado) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    const { data, error: uploadError } = await supabase
      .storage
      .from('pdf-cristian')
      .upload(`pdfs/${Date.now()}-${pdfFile.originalname}`, pdfFile.buffer, {
        contentType: pdfFile.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({
        error: 'Error al subir el archivo a Supabase Storage',
        details: uploadError.message,
      });
    }

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.path}`;

    const htmlContent = `
      <p><strong>Descripción:</strong> ${descripcion}</p>
      <p><strong>Sede:</strong> ${sede}</p>
      <p><strong>Fecha Inicial:</strong> ${fecha_inicial}</p>
      <p><strong>Fecha Final:</strong> ${fecha_final}</p>
      <p><strong>Enlace al PDF:</strong> <a href="${fileUrl}" target="_blank">Descargar</a></p>
    `;

    await sendEmail(correo_asignado, 'Detalles del formulario', htmlContent, fileUrl);

    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error en enviarCorreo:', error);
    res.status(500).json({ error: `Error en el servidor: ${error.message}` });
  }
};

const handler = (req, res) => {
  if (req.method === 'POST') {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error al procesar el archivo' });
      }
      enviarCorreo(req, res);
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};

export default handler;
