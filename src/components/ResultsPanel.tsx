export function ResultsPanel({ result }: any) {
  if (!result) return <p>Sube una imagen</p>;

  return (
    <div>
      <h3>Resultados</h3>
      {result.labels.map((l: any) => (
        <div key={l.label}>{l.label} – {(l.confidence*100).toFixed(1)}%</div>
      ))}
    </div>
  );
}
