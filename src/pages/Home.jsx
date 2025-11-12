import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

// Importar imágenes locales (para fallback si no hay productos en Firebase)
import blueglasses1 from "../assets/images/blueglasses1.png";
import blueglasses2 from "../assets/images/blueglasses2.png";
import blueglasses3 from "../assets/images/blueglasses3.png";
import blueglasses4 from "../assets/images/blueglasses4.png";
import blueglasses5 from "../assets/images/blueglasses5.png";
import blueglasses6 from "../assets/images/blueglasses6.png";
import imagehero1 from "../assets/images/imagehero1.png";
import imagehero2 from "../assets/images/imagehero2.png";

const Home = () => {
  // 🔹 Estado para productos desde Firestore
  const [productos, setProductos] = useState([]);

  // 🔹 Productos locales (solo por si Firebase está vacío)
  const productosLocales = [
    {
      name: "ErgoFrame Classic",
      description: "Elegante diseño atemporal para el uso diario.",
      price: "79.99",
      image: blueglasses1,
    },
    {
      name: "ErgoSport Active",
      description: "Ligereza y durabilidad para tu estilo de vida activo.",
      price: "89.99",
      image: blueglasses2,
    },
    {
      name: "ErgoChic Deluxe",
      description: "Un toque de sofisticación para cualquier ocasión.",
      price: "99.99",
      image: blueglasses3,
    },
    {
      name: "ErgoClear Lite",
      description: "Ultra-ligeras y discretas para máxima comodidad.",
      price: "69.99",
      image: blueglasses4,
    },
    {
      name: "ErgoWork Pro",
      description: "Confort superior para largas jornadas frente a la pantalla.",
      price: "84.99",
      image: blueglasses5,
    },
    {
      name: "ErgoKids Play",
      description: "Protección divertida y segura para los más pequeños.",
      price: "59.99",
      image: blueglasses6,
    },
  ];

  // 🔹 Escucha en tiempo real a la colección "productos"
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

  // 🔹 Hero rotativo
  const imagenesHero = [imagehero1, imagehero2];
  const [indice, setIndice] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndice((prev) => (prev + 1) % imagenesHero.length);
        setFade(true);
      }, 3000);
    }, 8000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="bg-[#f6faff] min-h-screen">
      {/* SECCIÓN HERO */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-20 px-6">
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Protege tus ojos, <br /> y trabaja mejor
          </h1>
          <p className="text-gray-600 mb-6">
            Descubre la colección de gafas ErgoVision diseñadas para reducir la
            fatiga visual y mejorar tu concentración frente a las pantallas.
          </p>
          <button className="bg-[#0f172a] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1e293b] transition">
            Explorar colección →
          </button>
        </div>

        {/* Imagen rotativa */}
        <div className="mt-10 md:mt-0 relative flex flex-col items-center">
          <img
            src={imagenesHero[indice]}
            alt="Gafas ergonómicas ErgoVision"
            className={`rounded-xl shadow-lg w-[400px] md:w-[450px] object-cover transition-opacity duration-3000 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Indicadores */}
          <div className="flex gap-2 mt-4">
            {imagenesHero.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i === indice
                    ? "bg-[#0f172a] scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE COLECCIÓN */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Nuestra Colección</h2>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(productos.length > 0 ? productos : productosLocales).map(
            (product, index) => (
              <ProductCard
                key={product.id || index}
                name={product.nombre || product.name}
                description={product.descripcion || product.description}
                price={product.precio || product.price}
                image={product.imagenUrl || product.image}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
