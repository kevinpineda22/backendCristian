import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadFile = async (file) => {
  // Generamos un nombre único para el archivo
  const uniqueFileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;

  // Comprobamos si ya existe un archivo con ese nombre en el almacenamiento
  const { data: existingFiles, error: listError } = await supabase
    .storage
    .from('pdf-cristian')
    .list('pdfs', { search: uniqueFileName });

  if (existingFiles && existingFiles.length > 0) {
    console.log('El archivo ya existe, no se sube nuevamente');
    return { data: null, error: { message: 'El archivo ya existe' } };
  }

  // Si no existe, subimos el archivo
  const { data, error } = await supabase.storage.from('pdf-cristian').upload(`pdfs/${uniqueFileName}`, file.buffer);

  // Si ocurre un error al subir, lo manejamos
  if (error) {
    console.error('Error al subir el archivo:', error.message);
    return { data: null, error };
  }

  console.log('Archivo subido correctamente');
  return { data, error: null };
};

const getPublicUrl = (path) => {
  const { publicURL, error } = supabase.storage.from('pdf-cristian').getPublicUrl(path);
  return { publicURL, error };
};

const insertRecord = async (record) => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .insert([record]);

  return { data, error };
};

const getRecordsByEmail = async (email) => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .select('*')
    .eq('correo_asignado', email);

  return { data, error };
};

const getAllRecords = async () => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .select('*');

  return { data, error };
};

const updateRecordStatusAndObservation = async (id, estado, observacion) => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .update({ estado, observacion })
    .eq('id', id);

  return { data, error };
};

const getRecordsToUpdate = async () => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .select('*')
    .eq('estado', 'Pendiente');

  return { data, error };
};

const updateRecordStatus = async (id, estado) => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .update({ estado })
    .eq('id', id);

  return { data, error };
};

export { uploadFile, getPublicUrl, insertRecord, getRecordsByEmail, getAllRecords, updateRecordStatusAndObservation, getRecordsToUpdate, updateRecordStatus };
