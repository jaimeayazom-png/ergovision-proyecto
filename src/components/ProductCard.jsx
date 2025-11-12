// src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ image, name, description, price }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="font-bold text-gray-900 mb-3">${price}</p>
        <button className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition">
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
