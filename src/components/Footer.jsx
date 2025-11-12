import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-10 border-t">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} Tienda Online - Todos los derechos reservados
      </p>
    </footer>
  );
}

export default Footer;
