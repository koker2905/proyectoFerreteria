export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export type PredictLabel = {
  label: string;
  confidence: number;
};

export type PredictResponse = {
  request_id: string;
  model: { name: string; stage: string; version: string };
  labels: PredictLabel[];
  low_confidence: boolean;
  created_at: string;
};

export type HistoryItem = {
  id: string;
  image: string;
  response: PredictResponse;
};

export type MlflowRun = {
  id: string;
  arch: string;
  epochs: number;
  mAP: number;
  status: "RUNNING" | "FINISHED";
};
