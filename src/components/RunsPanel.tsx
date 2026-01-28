export function RunsPanel({ runs }: any) {
  return (
    <div>
      {runs.map((r: any) => (
        <div key={r.id}>
          {r.arch} – epochs {r.epochs} – mAP {r.mAP}
        </div>
      ))}
    </div>
  );
}
