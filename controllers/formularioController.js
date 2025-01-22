import supabase from '../services/supabaseService.js';
import multer from 'multer';
import { sendEmail } from '../services/emailService.js';  // Asegúrate de que la ruta sea correcta

// Configuración de Multer para procesar la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf');  // Usamos .single('pdf') para un solo archivo PDF

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
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdf-cristian/${data.path}`;


    // Configuración del correo
    const htmlContent = `
      <p><strong>Descripción:</strong> ${descripcion}</p>
      <p><strong>Sede:</strong> ${sede}</p>
      <p><strong>Fecha Inicial:</strong> ${fecha_inicial}</p>
      <p><strong>Fecha Final:</strong> ${fecha_final}</p>
      <p><strong>Puedes descargar el PDF desde este enlace:</strong> <a href="${fileUrl}">Ver PDF</a></p>
    `;

    // Enviar el correo con la URL del archivo
    await sendEmail(correo_asignado, 'Detalles del formulario', htmlContent, fileUrl);

    // Responder al cliente indicando que todo ha ido bien
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
      enviarCorreo(req, res);  // Llamamos la función que maneja el correo
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
