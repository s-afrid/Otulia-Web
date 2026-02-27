import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, name = 'Otulia', type = 'website', image, url }) {
  const defaultDescription = 'The premier destination for buying and selling editorial-grade luxury assets worldwide.';
  const defaultImage = 'https://otulia.com/images/exclusive_club_bg.jpg'; // Using one of your existing images as a fallback
  const defaultUrl = 'https://otulia.com';

  const seoTitle = title ? `${title} | Otulia` : 'Otulia - Buy & Sell Luxury Assets Worldwide';

  // Structured Data for Google Sitelinks
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Otulia",
    "url": defaultUrl,
    "logo": "https://otulia.com/logos/logo.png",
    "sameAs": [
      "https://facebook.com/otulia",
      "https://instagram.com/otulia",
      "https://twitter.com/otulia"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-123-456-7890",
      "contactType": "customer service"
    }
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "SiteNavigationElement", "position": 1, "name": "Shop", "url": `${defaultUrl}/shop` },
      { "@type": "SiteNavigationElement", "position": 2, "name": "Rent", "url": `${defaultUrl}/rent` },
      { "@type": "SiteNavigationElement", "position": 3, "name": "Community", "url": `${defaultUrl}/community` },
      { "@type": "SiteNavigationElement", "position": 4, "name": "Login", "url": `${defaultUrl}/login` }
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(navSchema)}
      </script>

      {/* OpenGraph tags for Facebook, LinkedIn, etc. */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:image" content={image || defaultImage} />
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
