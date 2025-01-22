import supabase from '../services/supabaseService.js';
import multer from 'multer';
import { sendEmail } from '../services/emailService.js';

// Configuración de Multer para la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf'); // Solo un archivo PDF

// Función para manejar el envío del correo y el almacenamiento en Supabase
export const enviarCorreo = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const pdfFile = req.file;

    // Validaciones de los campos
    if (!descripcion || !sede || !fecha_inicial || !fecha_final || !correo_asignado || !pdfFile) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios, incluido el archivo PDF.' });
    }

    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'El archivo debe ser un PDF.' });
    }

    // Subir el archivo PDF a Supabase Storage
    const fileName = `pdfs/${Date.now()}-${pdfFile.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf-cristian')
      .upload(fileName, pdfFile.buffer, { contentType: pdfFile.mimetype });

    if (uploadError) {
      return res.status(500).json({ error: 'Error al subir el archivo a Supabase Storage', details: uploadError.message });
    }

    const pdfUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdf-cristian/${uploadData.path}`;

    // Guardar los datos en la base de datos
    const { error: dbError } = await supabase
      .from('Automatizacion_cristian')
      .insert([{ descripcion, sede, fecha_inicial, fecha_final, correo_asignado, pdf: pdfUrl, estado: 'Pendiente', observacion: '' }]);

    if (dbError) {
      return res.status(500).json({ error: 'Error al guardar los datos en la base de datos', details: dbError.message });
    }

    // Configuración del correo
    const htmlContent = `
      <p><strong>Descripción:</strong> ${descripcion}</p>
      <p><strong>Sede:</strong> ${sede}</p>
      <p><strong>Fecha Inicial:</strong> ${fecha_inicial}</p>
      <p><strong>Fecha Final:</strong> ${fecha_final}</p>
      <p><strong>Puedes descargar el PDF desde este enlace:</strong> <a href="${pdfUrl}">Ver PDF</a></p>
    `;

    // Enviar el correo
    await sendEmail(correo_asignado, 'Detalles del formulario', htmlContent, pdfUrl);

    res.status(200).json({ message: 'Correo enviado y datos guardados exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: `Hubo un error al procesar la solicitud: ${error.message}` });
  }
};

// Exportación por defecto (si necesitas un handler adicional)
export default {
  enviarCorreo,
};
