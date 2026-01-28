import React, { useState } from "react";

export function UploadBox({ onFakePredict }: any) {
  const [category, setCategory] = useState<string>("Herramientas");
  const [image, setImage] = useState<File | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (image) {
      // Procesar la imagen y predecir (esto llamaría a la API)
      const url = URL.createObjectURL(image);
      onFakePredict(url, category); // Pasamos la imagen y categoría
    }
  };

  return (
    <div className="upload-box">
      <div>
        <label>Categoría:</label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="Herramientas">Herramientas</option>
          <option value="Materiales">Materiales</option>
          <option value="EPP">EPP</option>
        </select>
      </div>

      <div>
        <label>Subir Imagen:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button onClick={handleSubmit}>Subir y Predecir</button>
    </div>
  );
}
