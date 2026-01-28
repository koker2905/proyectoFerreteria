export function HistoryList({ items }: any) {
  return (
    <div>
      <h3>Historial de Predicciones</h3>
      {items.map((item: any, index: number) => (
        <div key={index}>
          <img src={item.imageUrl} width={100} />
          <p>{item.category}</p>
          <p>Predicciones: {item.result.labels.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
