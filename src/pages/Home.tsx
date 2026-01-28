import React, { useState } from "react";
import { UploadBox } from "../components/UploadBox";
import { ResultsPanel } from "../components/ResultsPanel";
import { HistoryList } from "../components/HistoryList";
import { apiPredict } from "../api";  // Suponiendo que apiPredict ya está configurado
import type { HistoryItem } from "../app/types";

// Rutas de las imágenes para cada categoría
const hammerImages = [
  "/src/images/Hammer/000030.jpg",
  "/src/images/Hammer/000031.jpg",
  "/src/images/Hammer/000140.jpg",
  "/src/images/Hammer/000202.jpg",
  "/src/images/Hammer/000212.jpg",
  "/src/images/Hammer/000282.jpg",
  "/src/images/Hammer/000379.jpg",
  "/src/images/Hammer/Hammer (855).JPEG",
  "/src/images/Hammer/Hammer (871).JPEG",
  "/src/images/Hammer/Hammer (872).JPEG",
];

const screwDriverImages = [
  "/src/images/Screw Driver/000016.jpg",
  "/src/images/Screw Driver/000027.jpg",
  "/src/images/Screw Driver/000096.jpg",
  "/src/images/Screw Driver/000138.jpg",
  "/src/images/Screw Driver/000161.jpg",
  "/src/images/Screw Driver/000231.jpg",
  "/src/images/Screw Driver/000254.jpg",
  "/src/images/Screw Driver/000263.jpg",
];

const wrenchImages = [
  "/src/images/Wrench/000032.jpg",
  "/src/images/Wrench/000035.jpg",
  "/src/images/Wrench/000043.jpg",
  "/src/images/Wrench/000056.jpg",
  "/src/images/Wrench/000065.jpg",
  "/src/images/Wrench/000085.jpg",
  "/src/images/Wrench/000107.jpg",
  "/src/images/Wrench/000111.jpg",
  "/src/images/Wrench/000136.jpg",
  "/src/images/Wrench/000144.jpg",
];

// Lista de productos con las imágenes de las tres categorías
const allImages = [
  ...hammerImages,
  ...screwDriverImages,
  ...wrenchImages,
];

export function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [catalogVisible, setCatalogVisible] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showUpload, setShowUpload] = useState(true);

  const handleCatalogToggle = () => {
    setCatalogVisible(!catalogVisible); // Alternar visibilidad del catálogo
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Seleccionar imagen
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      alert("Por favor selecciona una imagen para predecir.");
      return;
    }

    try {
      const response = await apiPredict(selectedImage);
      setResult(response);
      setHistory((prev) => [
        ...prev,
        { id: crypto.randomUUID(), image: selectedImage, response: response },
      ]);
      setShowUpload(false); // Ocultar la opción de cargar imagen después de predecir
    } catch (error) {
      console.error("Error al predecir", error);
    }
  };

  const handleAddImage = (newImageUrl: string) => {
    allImages.push(newImageUrl); // Agregar la nueva imagen al catálogo
  };

  return (
    <div>
      <header>
        <h1>Reconocimiento de Productos</h1>
        <p>Asistente inteligente para la clasificación y predicción de productos en ferretería.</p>
      </header>

      <main>
        {/* Botón de mostrar el catálogo */}
        <section>
          <h2>Opciones</h2>
          <button onClick={handleCatalogToggle}>
            {catalogVisible ? "Cerrar Catálogo" : "Ver Catálogo"}
          </button>
        </section>

        {/* Mostrar catálogo de imágenes como miniaturas */}
        {catalogVisible && (
          <section>
            <h2>Catálogo</h2>
            <div className="grid">
              {allImages.map((image, index) => (
                <div key={index} className="productCard" onClick={() => handleImageSelect(image)}>
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mostrar imagen seleccionada en tamaño grande */}
        {selectedImage && (
          <section>
            <h2>Imagen Seleccionada</h2>
            <img
              src={selectedImage}
              alt="Imagen seleccionada"
              style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
            />
          </section>
        )}

        {/* Botones de acciones */}
        <section className="buttons-section">
          <button onClick={() => setShowUpload(true)}>Subir Imagen</button>
          <button onClick={handlePredict} disabled={!selectedImage}>
            Predecir
          </button>
        </section>

        {/* Subir imagen */}
        {showUpload && (
          <section>
            <h2>Sube una imagen para agregarla al catálogo</h2>
            <UploadBox onFakePredict={handleAddImage} />
          </section>
        )}

        {/* Mostrar el resultado de la predicción */}
        {result && (
          <section>
            <h2>Resultado de la Predicción</h2>
            <ResultsPanel result={result} />
          </section>
        )}

        {/* Mostrar historial de predicciones */}
        <section>
          <h2>Historial de Predicciones</h2>
          <HistoryList items={history} />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Ferretería Hub - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
