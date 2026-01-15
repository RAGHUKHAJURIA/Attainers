import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'Attainers - Best Mock Tests for JKSSB, SSC, and More';
    const siteDescription = 'Start your exam preparation with Attainers. Practice high-quality mock tests for JKSSB, SSC, and other competitive exams. Get detailed analytics and improve your score.';
    const siteKeywords = 'Attainers, attainers, ATTAINERS, JKSSB, SSC, Mock Tests, Exam Preparation, Online Tests, Junior Assistant, SI, Study Material';
    const siteUrl = 'https://attainers.vercel.app';
    const siteImage = 'https://attainers.vercel.app/logo.jpg'; // Needs absolute URL for SEO

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Attainers",
        "url": siteUrl,
        "description": siteDescription,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Attainers",
        "url": siteUrl,
        "logo": siteImage,
        "sameAs": [
            "https://www.facebook.com/attainers", // Replace with actual social links if available
            "https://www.instagram.com/attainers",
            "https://www.youtube.com/@attainers"
        ]
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | Attainers` : siteTitle}</title>
            <meta name="description" content={description || siteDescription} />
            <meta name="keywords" content={keywords ? `${keywords}, ${siteKeywords}` : siteKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || siteDescription} />
            <meta property="og:image" content={image || siteImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url || siteUrl} />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || siteDescription} />
            <meta name="twitter:image" content={image || siteImage} />

            {/* Canonical */}
            <link rel="canonical" href={url || siteUrl} />

            {/* JSON-LD Schema.org Structure */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
