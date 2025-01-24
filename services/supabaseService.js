import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const insertRecord = async (record) => {
  const { data, error } = await supabase
    .from('Automatizacion_cristian')
    .insert([record]);

  return { data, error };
};

export { insertRecord };