import supabase from '../services/supabaseService.js';
import multer from 'multer';
import { sendEmail } from '../services/emailService.js';

// Configuración de Multer para la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf'); // Solo un archivo PDF

// Función para manejar el envío del formulario
export const enviarFormulario = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const pdfFile = req.file;

    // Validar que todos los campos requeridos están presentes
    if (!descripcion || !sede || !fecha_inicial || !fecha_final || !correo_asignado) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!pdfFile || pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    // Subir el archivo PDF a Supabase Storage
    const fileName = `pdfs/${Date.now()}-${pdfFile.originalname}`;
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('pdf-cristian')
      .upload(fileName, pdfFile.buffer, { contentType: pdfFile.mimetype });

    if (uploadError) {
      return res.status(500).json({ error: 'Error al subir el archivo a Supabase Storage', details: uploadError.message });
    }

    const pdfUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdf-cristian/${storageData.path}`;

    // Guardar los datos en la base de datos
    const { data: dbData, error: dbError } = await supabase
      .from('Automatizacion_cristian')
      .insert([{ descripcion, sede, fecha_inicial, fecha_final, correo_asignado, pdf_url: pdfUrl, estado: 'pendiente', observacion: '' }])
      .select('*') // Devolver los datos insertados para usarlos en el correo
      .single();

    if (dbError) {
      return res.status(500).json({ error: 'Error al guardar los datos en la base de datos', details: dbError.message });
    }

    // Datos guardados correctamente, enviar el correo
    const htmlContent = `
      <p><strong>Descripción:</strong> ${dbData.descripcion}</p>
      <p><strong>Sede:</strong> ${dbData.sede}</p>
      <p><strong>Fecha Inicial:</strong> ${dbData.fecha_inicial}</p>
      <p><strong>Fecha Final:</strong> ${dbData.fecha_final}</p>
      <p><strong>Puedes descargar el PDF desde este enlace:</strong> <a href="${dbData.pdf_url}">Ver PDF</a></p>
    `;

    await sendEmail(dbData.correo_asignado, 'Detalles del formulario', htmlContent, dbData.pdf_url);

    res.status(200).json({ message: 'Datos guardados y correo enviado exitosamente.', data: dbData });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: `Hubo un error al procesar la solicitud: ${error.message}` });
  }
};

// Función handler para manejar la solicitud de API
export default function handler(req, res) {
  if (req.method === 'POST') {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error al subir el archivo.' });
      }
      enviarFormulario(req, res);
    });
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
