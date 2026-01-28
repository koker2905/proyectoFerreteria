export function ProductCard({ p }: any) {
  return (
    <div className="card">
      <img src={p.imageUrl} />
      <h3>{p.name}</h3>
      <p>{p.category}</p>
      <b>${p.price}</b>
    </div>
  );
}
