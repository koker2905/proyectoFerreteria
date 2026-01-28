import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <Layout
      title="Ferretería Hub"
      subtitle="Asistente de Reconocimiento de Productos (ML Multiagente)"
    >
      <Home />
    </Layout>
  );
}
