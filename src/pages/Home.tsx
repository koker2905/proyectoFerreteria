import React, { useState } from "react";
import { UploadBox } from "../components/UploadBox";
import { ResultsPanel } from "../components/ResultsPanel";
import { HistoryList } from "../components/HistoryList";
import ScannerMultimodal from "../components/ScannerMultimodal";
import { apiPredict } from "../api";
import type { HistoryItem } from "../app/types";

const hammerImages = [
  "/src/images/Hammer/000030.jpg", "/src/images/Hammer/000031.jpg", "/src/images/Hammer/000140.jpg",
  "/src/images/Hammer/000202.jpg", "/src/images/Hammer/000212.jpg", "/src/images/Hammer/000282.jpg",
  "/src/images/Hammer/000379.jpg", "/src/images/Hammer/Hammer (855).JPEG", "/src/images/Hammer/Hammer (871).JPEG",
  "/src/images/Hammer/Hammer (872).JPEG",
];

const screwDriverImages = [
  "/src/images/Screw Driver/000016.jpg", "/src/images/Screw Driver/000027.jpg", "/src/images/Screw Driver/000096.jpg",
  "/src/images/Screw Driver/000138.jpg", "/src/images/Screw Driver/000161.jpg", "/src/images/Screw Driver/000231.jpg",
  "/src/images/Screw Driver/000254.jpg", "/src/images/Screw Driver/000263.jpg",
];

const wrenchImages = [
  "/src/images/Wrench/000032.jpg", "/src/images/Wrench/000035.jpg", "/src/images/Wrench/000043.jpg",
  "/src/images/Wrench/000056.jpg", "/src/images/Wrench/000065.jpg", "/src/images/Wrench/000085.jpg",
  "/src/images/Wrench/000107.jpg", "/src/images/Wrench/000111.jpg", "/src/images/Wrench/000136.jpg",
  "/src/images/Wrench/000144.jpg",
];

const allImages = [...hammerImages, ...screwDriverImages, ...wrenchImages];

export function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [catalogVisible, setCatalogVisible] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showUpload, setShowUpload] = useState(true);

  const handleCatalogToggle = () => setCatalogVisible(!catalogVisible);
  const handleImageSelect = (imageUrl: string) => setSelectedImage(imageUrl);

  const handlePredict = async () => {
    if (!selectedImage) {
      alert("Por favor selecciona una imagen para predecir.");
      return;
    }
    try {
      const response = await apiPredict(selectedImage);
      setResult(response);
  if (!selectedImage) {
    alert("Por favor selecciona una imagen para predecir.");
    return;
  }

  try {
    // Hacer la solicitud a FastAPI con la imagen seleccionada
    const formData = new FormData();
    formData.append("image", selectedImage); // Aquí usas el archivo de imagen que seleccionaste

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.prediction) {
      setResult(data.prediction); // Asignamos el resultado al estado
      setHistory((prev) => [
        ...prev,
        { id: crypto.randomUUID(), image: selectedImage, response: data.prediction },
      ]);
      setShowUpload(false);
    } catch (error) {
      console.error("Error al predecir", error);
    }
  };
      setShowUpload(false); // Ocultar la opción de cargar imagen después de predecir
    } else {
      alert("Error en la predicción");
    }
  } catch (error) {
    console.error("Error al predecir", error);
  }
};


  const handleAddImage = (newImageUrl: string) => {
    allImages.push(newImageUrl);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Ferretería Hub</h1>
        <p style={{ color: '#666' }}>Asistente inteligente para la clasificación y predicción de productos.</p>
      </header>

      <main>
        {/* SECCIÓN DEL ASISTENTE MULTIMODAL */}
        <section style={{ marginBottom: '40px', border: '2px dashed #3b82f6', borderRadius: '15px', padding: '20px' }}>
          <h2 style={{ textAlign: 'center', color: '#3b82f6' }}>🎤 Asistente por Voz</h2>
          <ScannerMultimodal />
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h2>Opciones de Catálogo</h2>
          <button onClick={handleCatalogToggle} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            {catalogVisible ? "Cerrar Catálogo" : "Ver Catálogo"}
          </button>
        </section>

        {catalogVisible && (
          <section style={{ marginBottom: '30px' }}>
            <h2>Catálogo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
              {allImages.map((image, index) => (
                <div key={index} onClick={() => handleImageSelect(image)} style={{ cursor: 'pointer' }}>
                  <img src={image} alt={`Imagen ${index + 1}`} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedImage && (
          <section style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h2>Imagen Seleccionada</h2>
            <img src={selectedImage} alt="Seleccionada" style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: '10px' }} />
          </section>
        )}

        <section style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <button onClick={() => setShowUpload(true)} style={{ padding: '10px 20px' }}>Subir Nueva Imagen</button>
          <button onClick={handlePredict} disabled={!selectedImage} style={{ padding: '10px 20px' }}>Predecir Producto</button>
        </section>

        {showUpload && (
          <section style={{ marginBottom: '30px' }}>
            <h2>Subir imagen al catálogo</h2>
            <UploadBox onFakePredict={handleAddImage} />
          </section>
        )}

        {result && (
          <section style={{ marginBottom: '30px' }}>
            <h2>Resultado de la Predicción</h2>
            <ResultsPanel result={result} />
          </section>
        )}

        <section>
          <h2>Historial de Predicciones</h2>
          <HistoryList items={history} />
        </section>
      </main>

      <footer style={{ marginTop: '50px', textAlign: 'center', color: '#999' }}>
        <p>&copy; 2026 Ferretería Hub - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}