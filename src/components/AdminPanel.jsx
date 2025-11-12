import { useEffect, useState } from "react";
import { logout } from "../auth";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
  });
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  // 🧠 Escuchar productos en tiempo real
  useEffect(() => {
    const q = query(collection(db, "productos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(items);
    });
    return () => unsubscribe();
  }, []);

  // 🔐 Cerrar sesión
  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  // 🧩 Subir imagen a Firebase Storage
  const subirImagen = async (archivo) => {
    const imagenRef = ref(storage, `imagenes/${archivo.name}`);
    await uploadBytes(imagenRef, archivo);
    const url = await getDownloadURL(imagenRef);
    return { url, path: imagenRef.fullPath };
  };

  // 🟢 Agregar o actualizar producto
  const handleGuardarProducto = async (e) => {
    e.preventDefault();

    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.descripcion ||
      !nuevoProducto.precio ||
      (!editando && !nuevoProducto.imagen)
    ) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      setSubiendo(true);
      let urlImagen = nuevoProducto.imagenUrl || "";
      let pathImagen = nuevoProducto.imagenPath || "";

      if (nuevoProducto.imagen instanceof File) {
        // Si se selecciona nueva imagen
        const { url, path } = await subirImagen(nuevoProducto.imagen);
        urlImagen = url;
        pathImagen = path;
      }

      if (editando) {
        // ✏️ Actualizar producto existente
        const refProducto = doc(db, "productos", editando);
        await updateDoc(refProducto, {
          nombre: nuevoProducto.nombre,
          descripcion: nuevoProducto.descripcion,
          precio: parseFloat(nuevoProducto.precio),
          imagenUrl: urlImagen,
          imagenPath: pathImagen,
          actualizadoEn: new Date(),
        });
        setMensaje("✅ Producto actualizado correctamente.");
      } else {
        // 🟢 Agregar nuevo producto
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          descripcion: nuevoProducto.descripcion,
          precio: parseFloat(nuevoProducto.precio),
          imagenUrl: urlImagen,
          imagenPath: pathImagen,
          creadoEn: new Date(),
        });
        setMensaje("✅ Producto agregado correctamente.");
      }

      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: null,
      });
      setEditando(null);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setMensaje("❌ Error: " + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  // 🗑️ Eliminar producto
  const handleEliminar = async (id, imagenPath) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      if (imagenPath) {
        const imgRef = ref(storage, imagenPath);
        await deleteObject(imgRef);
      }
      setMensaje("🗑️ Producto eliminado correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  // ✏️ Cargar producto en el formulario para editar
  const handleEditar = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl,
      imagenPath: producto.imagenPath,
    });
    setEditando(producto.id);
    setMensaje("✏️ Editando producto: " + producto.nombre);
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </header>

      {/* FORMULARIO */}
      <form onSubmit={handleGuardarProducto} className="max-w-md mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editando ? "Editar Producto" : "Agregar Producto"}
        </h2>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nuevoProducto.nombre}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
          }
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
          }
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, precio: e.target.value })
          }
          className="border w-full p-2 mb-3 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNuevoProducto({ ...nuevoProducto, imagen: e.target.files[0] })
          }
          className="border w-full p-2 mb-3 rounded"
        />

        <button
          type="submit"
          disabled={subiendo}
          className={`${
            subiendo ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded w-full`}
        >
          {subiendo
            ? "Subiendo..."
            : editando
            ? "Actualizar producto"
            : "Agregar producto"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={() => {
              setNuevoProducto({
                nombre: "",
                descripcion: "",
                precio: "",
                imagen: null,
              });
              setEditando(null);
              setMensaje("");
            }}
            className="w-full mt-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar edición
          </button>
        )}
      </form>

      {mensaje && (
        <p className="text-center mb-6 text-gray-700 font-medium">{mensaje}</p>
      )}

      {/* LISTA DE PRODUCTOS */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        Productos guardados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="border p-4 rounded shadow-md text-center bg-white"
          >
            <img
              src={p.imagenUrl}
              alt={p.nombre}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="font-semibold text-lg">{p.nombre}</h3>
            <p className="text-gray-600">{p.descripcion}</p>
            <p className="text-blue-600 font-bold">${p.precio}</p>

            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => handleEditar(p)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(p.id, p.imagenPath)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
