export function Layout({ title, subtitle, children }: any) {
  return (
    <div className="app">
      <header>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
