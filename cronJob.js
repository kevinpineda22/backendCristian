import { getRecordsToUpdate, updateRecordStatus } from './services/supabaseService.js';
import cron from 'node-cron';

// Configurar el cron job para ejecutar cada día a la medianoche
cron.schedule('0 0 * * *', async () => {
  try {
    const { data: records, error } = await getRecordsToUpdate();

    if (error) {
      console.error('Error al obtener los registros para actualizar:', error.message);
      return;
    }

    for (const record of records) {
      const { id } = record;
      const { data, error } = await updateRecordStatus(id, 'Completado');

      if (error) {
        console.error(`Error al actualizar el estado del registro con ID ${id}:`, error.message);
      } else {
        console.log(`Estado del registro con ID ${id} actualizado a 'Completado'`);
      }
    }
  } catch (error) {
    console.error('Error inesperado en el cron job:', error.message);
  }
});