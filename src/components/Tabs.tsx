export function Tabs({ active, onChange }: any) {
  const tabs = ["catalogo", "reconocer", "historial", "training"];
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={active === t ? "active" : ""}>
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
