import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// Inicializar Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configuración de multer para subir imágenes
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("file");

// 🚀 Registrar escaneo
export const registrarEscaneo = async (req, res) => {
  console.log("🔍 Datos recibidos en registrarEscaneo:", req.body); // 👈 Esto imprime todo el body

  const { codigo, cantidad, inventario_id, usuario } = req.body;

  if (!codigo || !cantidad || !inventario_id) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const cantidadSumar = parseInt(cantidad);
  if (isNaN(cantidadSumar) || cantidadSumar <= 0) {
    return res.status(400).json({ success: false, message: "Cantidad inválida" });
  }

  // Verificar que exista el inventario
  const { data: inventario, error: inventarioError } = await supabase
    .from("inventarios")
    .select("id")
    .eq("id", inventario_id)
    .maybeSingle();

  if (inventarioError || !inventario) {
    return res.status(404).json({ success: false, message: "Inventario no encontrado" });
  }

  // Buscar el producto
  const { data: producto, error: productoError } = await supabase
    .from("productos")
    .select("*")
    .eq("codigo_barras", codigo)
    .single();

  if (productoError || !producto) {
    return res.status(404).json({ success: false, message: "Producto no encontrado" });
  }

  // Actualizar cantidad
  const nuevaCantidad = producto.cantidad + cantidadSumar;
  const { error: updateError } = await supabase
    .from("productos")
    .update({ cantidad: nuevaCantidad })
    .eq("id", producto.id);

  // Insertar en detalles_inventario
  const { error: insertError } = await supabase
    .from("detalles_inventario")
    .insert([{
      inventario_id,
      producto_id: producto.id,
      cantidad: cantidadSumar,
      usuario: usuario || null
    }]);

  if (updateError || insertError) {
    console.error("❌ Error al actualizar o insertar:", updateError || insertError);
    return res.status(500).json({ success: false, message: "Error al registrar escaneo" });
  }

  res.json({
    success: true,
    descripcion: producto.descripcion,
    cantidad: nuevaCantidad
  });
};

// 🟢 Iniciar inventario
export const iniciarInventario = async (req, res) => {
  const { categoria, descripcion, foto_url, usuario_email } = req.body;

  if (!categoria || !descripcion || !foto_url || !usuario_email) {
    return res.status(400).json({ success: false, message: "Datos incompletos" });
  }

  const { data, error } = await supabase
    .from("inventarios")
    .insert([{ categoria, descripcion, foto_url, usuario_email }])
    .select()
    .single();

  if (error) {
    console.error("Error al insertar inventario:", error.message);
    return res.status(500).json({ success: false, message: "Error al iniciar inventario" });
  }

  res.json({ success: true, inventario_id: data.id });
};

// 🔼 Subir foto al bucket 'inventario'
export const subirFoto = async (req, res) => {
  const archivo = req.file;
  const nombreArchivo = req.body.filename;

  if (!archivo || !nombreArchivo) {
    return res.status(400).json({ success: false, message: "Archivo o nombre faltante" });
  }

  const { error: uploadError } = await supabase.storage
    .from("inventario")
    .upload(nombreArchivo, archivo.buffer, {
      contentType: archivo.mimetype,
      upsert: true
    });

  if (uploadError) {
    return res.status(500).json({ success: false, message: "Error al subir archivo" });
  }

  const { data: publicUrl } = supabase
    .storage
    .from("inventario")
    .getPublicUrl(nombreArchivo);

  res.json({ success: true, url: publicUrl.publicUrl });
};

// 📄 Historial de escaneos
export const obtenerHistorialInventario = async (req, res) => {
  const { inventario_id } = req.params;

  const { data, error } = await supabase
    .from("detalles_inventario")
    .select("id, cantidad, created_at, producto:producto_id(descripcion, codigo_barras)")
    .eq("inventario_id", inventario_id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: "Error al obtener historial" });
  }

  res.json({ success: true, historial: data });
};

// ❌ Eliminar registro individual
export const eliminarRegistroInventario = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("detalles_inventario")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ success: false, message: "Error al eliminar registro" });
  }

  res.json({ success: true, message: "Registro eliminado correctamente" });
};

// 📂 Obtener categorías
export const obtenerCategorias = async (req, res) => {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  if (error) {
    return res.status(500).json({ success: false, message: "Error al obtener categorías" });
  }

  res.json(data);
};
