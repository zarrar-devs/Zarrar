import Services from "./Services";

export const metadata = {
  title: "Website Development, Lead Generation & Social Media Services | Zarrar",
  description:
    "Custom website development, SEO optimization, social media management, and cold email lead generation that helps speakers, authors, coaches, consultants, and founders attract more clients.",
  alternates: {
    canonical: "https://zarrar.co/services",
  },
  keywords: [
    "Website Development",
    "Web Design",
    "Portfolio Website",
    "SEO",
    "Lead Generation",
    "Cold Email Outreach",
    "Social Media Management",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Website Development, Lead Generation & Social Media Services | Zarrar",
      description: "Custom website development, SEO optimization, social media management, and cold email lead generation that helps speakers, authors, coaches, consultants, and founders attract more clients.",
    url: "https://zarrar.co/services",
    type: "website",
    siteName: "Zarrar",
    images: [
      {
        url: "https://zarrar.co/zarrar.co.jfif",  // public folder ma ha logo
        width: 1200,
        height: 630,
        alt: "Zarrar Services",
      },
    ],
  },
};

export default function Page() {
  return <Services />;
}