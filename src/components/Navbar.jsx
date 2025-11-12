// src/components/Navbar.jsx
import React from "react";
//importacion de logo
import logo from "../assets/images/evlogo1.png";


const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
        <img
  src="/src/assets/images/evlogo1.png"
  alt="ErgoVision Logo"
  className="w-30 h-30 object-contain"
/>
                 
          <span className="font-semibold text-lg text-gray-900">
            Protege tu vista!
          </span>
        </div>

        {/* Menú */}
    {/* Menú */}
<ul className="hidden md:flex items-center gap-6 text-gray-700">
  {["Inicio", "Catálogo", "Blog", "Asesoría", "Contacto"].map((item) => (
    <li key={item} className="relative group font-medium">
      <a
        href="#"
        className="transition-all duration-300 text-gray-700 group-hover:text-sky-500 group-hover:font-bold"
      >
        {item}
      </a>
      {/* Rayita animada */}
      <span
        className="absolute left-0 -bottom-1 w-0 h-[2px] bg-sky-500 transition-all duration-300 group-hover:w-full"
      ></span>
    </li>
  ))}
</ul>


        {/* Carrito */}
<button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-4 py-2 rounded-md text-sm font-bold hover:bg-sky-500 hover:text-white transition-all duration-300">
  <span className="text-lg">🛒</span>
  <span>Carrito</span>
</button>

      </div>
    </nav>
  );
};

export default Navbar;

