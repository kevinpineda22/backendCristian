import cron from 'node-cron';
import { getRecordsToUpdate, updateRecordStatus } from './services/supabaseService.js';

const checkAndUpdateRecords = async () => {
  try {
    const { data, error } = await getRecordsToUpdate();
    if (error) {
      console.error('Error al obtener registros para actualizar:', error);
      return;
    }

    for (const record of data) {
      const { id } = record;
      const { data: updateData, error: updateError } = await updateRecordStatus(id, 'No Completado');
      if (updateError) {
        console.error(`Error al actualizar el estado del registro con ID ${id}:`, updateError);
      } else {
        console.log(`Estado del registro con ID ${id} actualizado a "No Completado"`);
      }
    }
  } catch (error) {
    console.error('Error en el cron job:', error);
  }
};

// Programar el cron job para que se ejecute cada día a medianoche
cron.schedule('0 0 * * *', checkAndUpdateRecords);

console.log('Cron job programado para verificar y actualizar registros diariamente a medianoche.');