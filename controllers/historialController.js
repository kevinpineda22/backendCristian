import { getRecordsByEmail, getAllRecords, updateRecordStatusAndObservation } from '../services/supabaseService.js';

const historial = async (req, res) => {
  try {
    const { correo } = req.params;

    const { data, error } = await getRecordsByEmail(correo);

    if (error) {
      console.error('Detailed Supabase Error:', {
        message: error.message,
        code: error.code,
        details: JSON.stringify(error),
        hint: error.hint,
        query: error.query
      });
      return res.status(500).json({ error: 'Error al obtener historial', details: error.message });
    }

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Historial de Registros</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            text-align: center;
            color: #210D65;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #89DC00;
            color:rgba(0, 0, 0, 0.94);
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Historial de Registros de ${correo}</h1>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Sede</th>
                <th>Fecha de Inicio</th>
                <th>Fecha Final</th>
                <th>Estado</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(item => `
                <tr>
                  <td>${item.descripcion}</td>
                  <td>${item.sede}</td>
                  <td>${item.fecha_inicial}</td>
                  <td>${item.fecha_final}</td>
                  <td>${item.estado}</td>
                  <td>${item.observacion}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    res.status(200).send(html);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const getAllHistorial = async (req, res) => {
  try {
    const { data, error } = await getAllRecords();

    if (error) {
      console.error('Error al obtener todos los registros:', error);
      return res.status(500).json({ error: 'Error al obtener todos los registros', details: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const updateHistorialStatus = async (req, res) => {
  try {
    const { id, estado, observacion } = req.body;

    if (!id || !estado || !observacion) {
      return res.status(400).json({ error: 'ID, estado y observación son requeridos' });
    }

    const { data, error } = await updateRecordStatusAndObservation(id, estado, observacion);

    if (error) {
      console.error('Error al actualizar el estado y la observación:', error);
      return res.status(500).json({ error: 'Error al actualizar el estado y la observación', details: error.message });
    }

    res.status(200).json({ message: 'Estado y observación actualizados exitosamente' });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

export { historial, getAllHistorial, updateHistorialStatus };