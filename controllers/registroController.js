import { createClient } from '@supabase/supabase-js';
import { insertRecord } from '../services/supabaseService.js';
import { sendEmail } from '../services/emailService.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const registro = async (req, res) => {
  try {
    const { descripcion, sede, fecha_inicial, fecha_final, correo_asignado } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Archivo PDF es requerido' });
    }

    // Subir el archivo a Supabase Storage
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `pdfs/${Date.now()}-${safeFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf-cristian')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      console.error('Error al subir el archivo:', uploadError.message);
      return res.status(500).json({ error: 'Error al subir el archivo', details: uploadError.message });
    }

    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadData.path}`;

    // Insertar el registro en la base de datos con la URL del archivo
    const { data, error } = await insertRecord({
      descripcion,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      pdf: publicURL // Usar el nombre de columna correcto "pdf"
    });

    if (error) {
      console.error('Error al insertar el registro:', {
        message: error.message,
        code: error.code,
        details: JSON.stringify(error),
        hint: error.hint,
        query: error.query
      });
      return res.status(500).json({ error: 'Error al guardar registro', details: error.message });
    }

    // Enviar el correo electrónico
    await sendEmail({
      to: correo_asignado,
      subject: 'Nuevo Proceso',
      descripcion,
      sede,
      fecha_inicial,
      fecha_final,
      correo_asignado,
      file
    });

    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en registro', details: error.message });
  }
};

export { registro };