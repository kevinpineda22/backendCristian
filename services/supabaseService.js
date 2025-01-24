import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadFile = async (file) => {
  const { data, error } = await supabase.storage.from('pdf-cristian').upload(`public/${file.name}`, file);
  return { data, error };
};

const getPublicUrl = (path) => {
  const { publicURL, error } = supabase.storage.from('pdf-cristian').getPublicUrl(path);
  return { publicURL, error };
};

const insertRecord = async (record) => {
  const { data, error } = await supabase.from('Automatizacion_cristian').insert([record]);
  return { data, error };
};

const getRecordsByEmail = async (email) => {
  const { data, error } = await supabase.from('Automatizacion_cristian').select('*').eq('correo_asignado', email);
  return { data, error };
};

const getAllRecords = async () => {
  const { data, error } = await supabase.from('Automatizacion_cristian').select('*');
  return { data, error };
};

const updateRecordStatusAndObservation = async (id, estado, observacion) => {
  const { data, error } = await supabase.from('Automatizacion_cristian').update({ estado, observacion }).eq('id', id);
  return { data, error };
};

// Nueva función para obtener registros que necesitan ser actualizados
const getRecordsToUpdate = async () => {
  const { data, error } = await supabase.from('Automatizacion_cristian')
    .select('*')
    .lt('fecha_final', new Date().toISOString())
    .eq('estado', 'Pendiente');
  return { data, error };
};

// Nueva función para actualizar el estado de los registros
const updateRecordStatus = async (id, estado) => {
  const { data, error } = await supabase.from('Automatizacion_cristian').update({ estado }).eq('id', id);
  return { data, error };
};

export { uploadFile, getPublicUrl, insertRecord, getRecordsByEmail, getAllRecords, updateRecordStatusAndObservation, getRecordsToUpdate, updateRecordStatus };