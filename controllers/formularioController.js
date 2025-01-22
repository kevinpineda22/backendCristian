import supabase from '../services/supabaseService.js';
import nodemailer from 'nodemailer';
import multer from 'multer';

// Configuración de Multer para procesar la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf');

// Función para manejar el envío del correo y el almacenamiento en Supabase
export const enviarCorreo = async (req, res) => {
  try {
    // Obtener los datos del formulario
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const pdfFile = req.file;

    // Validar que todos los campos requeridos están presentes
    if (!descripcion || !sede || !fecha_inicial || !fecha_final || !correo_asignado) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar que el archivo subido sea un PDF
    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    // Subir el archivo PDF a Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from('pdf-cristian')  // Asegúrate de que este sea el nombre correcto del bucket
      .upload(`pdfs/${Date.now()}-${pdfFile.originalname}`, pdfFile.buffer, {
        contentType: pdfFile.mimetype,
        upsert: true,  // Esto reemplaza el archivo si ya existe
      });

    if (uploadError) {
      return res.status(500).json({ error: 'Error al subir el archivo a Supabase Storage', details: uploadError.message });
    }

    // Obtener la URL pública del archivo subido
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${data.path}`;

    // Configuración de Nodemailer para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // O el servicio que prefieras
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo_asignado,
      subject: 'Detalles del formulario',
      text: `Descripción: ${descripcion}\nSede: ${sede}\nFecha Inicial: ${fecha_inicial}\nFecha Final: ${fecha_final}\n\nPuedes descargar el PDF desde este enlace: ${fileUrl}`,
      attachments: [
        {
          filename: pdfFile.originalname,
          path: fileUrl,  // Usamos la URL del archivo en Supabase
        },
      ],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: `Hubo un error al enviar el correo: ${error.message}` });
  }
};

// Exportar el handler para la ruta API
export default function handler(req, res) {
  if (req.method === 'POST') {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error al subir el archivo' });
      }
      enviarCorreo(req, res);
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
