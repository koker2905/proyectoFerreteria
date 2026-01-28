import axios from "axios";

const BASE_URL = "http://localhost:8000"; // URL del backend (FastAPI)

export const apiPredict = async (imageData: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/predict`, { image: imageData });
    return response.data;
  } catch (error) {
    console.error("Error al hacer la predicción", error);
    throw error;
  }
};
