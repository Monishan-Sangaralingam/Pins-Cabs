export function ShortLinkPage({ label, href }: { label: string; href: string }) {
  const redirectScript = `window.location.replace(${JSON.stringify(href)});`;

  return (
    <main className="not-found">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <h1>Opening {label}</h1>
      <p>If it does not open automatically, use the button below.</p>
      <a className="button button--lime" href={href}>Open {label}</a>
    </main>
  );
}
