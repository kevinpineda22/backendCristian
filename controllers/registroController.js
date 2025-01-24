import { createClient } from '@supabase/supabase-js';
import { insertRecord } from '../services/supabaseService.js';

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
      console.error('Error al insertar el registro:', error.message);
      return res.status(500).json({ error: 'Error al insertar el registro', details: error.message });
    }

    res.status(200).json({ message: 'Registro creado exitosamente', data });
  } catch (error) {
    console.error('Error inesperado:', error.message);
    res.status(500).json({ error: 'Error inesperado', details: error.message });
  }
};

export { registro };