import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const uploadFile = async (fileName, fileBuffer) => {
  const { data, error } = await supabase.storage
    .from('pdf-cristian')
    .upload(`pdfs/${fileName}`, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
  return { data, error };
};

const getPublicUrl = (fileName) => {
  return supabase.storage
    .from('pdf-cristian')
    .getPublicUrl(`pdfs/${fileName}`);
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
  
  const updateRecordStatus = async (id, estado) => {
    const { data, error } = await supabase
      .from('Automatizacion_cristian')
      .update({ estado })
      .eq('id', id);
    return { data, error };
  };
  
  export { uploadFile, getPublicUrl, insertRecord, getRecordsByEmail, getAllRecords, updateRecordStatus };
