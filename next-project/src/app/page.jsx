import App from "../components/App";

// TODO: layout.jsx ke SITE_URL jaisa hi domain yahan daalein
const SITE_URL = "https://your-domain.com";

// Structured data (JSON-LD) — search engines ko site/company ke baare
// mein machine-readable info deta hai, rich results ke chances badhata
// hai. Page ke visible output pe koi asar nahi (invisible script tag).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "a-lign studio",
  url: SITE_URL,
  description:
    "We design, build, and send everything your brand needs to grow — websites, email marketing, and the strategy that ties them together.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <App />
    </>
  );
}
