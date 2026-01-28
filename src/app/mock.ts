import type{ Product, PredictResponse, MlflowRun } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Taladro Percutor",
    category: "Herramientas",
    price: 59.9,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8"
  },
  {
    id: "2",
    name: "Guantes de Seguridad",
    category: "EPP",
    price: 3.5,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1615485737651-199fcf6b10b6"
  }
];

export function mockPrediction(): PredictResponse {
  return {
    request_id: "req_001",
    model: { name: "ferreteria-det-seg", stage: "Prod", version: "v1" },
    labels: [
      { label: "taladro", confidence: 0.86 },
      { label: "broca", confidence: 0.42 }
    ],
    low_confidence: false,
    created_at: new Date().toISOString()
  };
}

export const RUNS: MlflowRun[] = [
  { id: "run_01", arch: "YOLOv8-seg", epochs: 50, mAP: 0.78, status: "FINISHED" },
  { id: "run_02", arch: "SegFormer", epochs: 30, mAP: 0.81, status: "RUNNING" }
];
