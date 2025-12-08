export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Mon Projet Android</h1>
      <p>Bienvenue sur la page de test !</p>

      <h2>Télécharger l'application</h2>
      <a
        href="/app-release.apk"
        download
        style={{
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Télécharger l'APK
      </a>

      <h2 style={{ marginTop: 40 }}>Tester l'API</h2>
      <a href="/api/hello">/api/hello</a>
    </main>
  );
}
