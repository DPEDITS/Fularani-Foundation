import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    // Dynamic titles based on paths
    const routeTitles = {
      '/': 'Best NGO in Odisha',
      '/missions': 'Our Missions | Best NGO',
      '/csr-partnership': 'CSR Partnership',
      '/gallery': 'Gallery | Events in Odisha',
      '/donor-login': 'Donor Login',
      '/donor-register': 'Donor Registration',
      '/contact': 'Contact Us',
      '/volunteer-login': 'Volunteer Login',
      '/volunteer-register': 'Volunteer Registration',
      '/legal-policy': 'Legal Policy',
      '/terms': 'Terms & Conditions',
      '/transparency': 'Transparency'
    };

    // If param is present, default to a base string
    let matchedTitle = 'Best NGO in Odisha';
    for (const [path, title] of Object.entries(routeTitles)) {
      // exact match or prefix for dynamic routes
      if (location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`))) {
        matchedTitle = title;
        break;
      }
    }

    const pageTitle = `Fularani Foundation | ${matchedTitle}`;
    
    // Fallback description
    const defaultDesc = 'Fularani Foundation is the best operating NGO in Odisha, India. We are dedicated to #EducationForAll, #MissionHealthcare, #MissionGreen, and Mission Thalassemia. Join us in uplifting lives and empowering communities across Odisha.';
    const pageDescription = defaultDesc;

    // Update document title
    document.title = pageTitle;

    // Helper to set or create meta tags
    const setMetaTag = (selector, nameOrProperty, value) => {
      let meta = document.querySelector(`meta[${selector}]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (selector.startsWith('name=')) {
          meta.setAttribute('name', nameOrProperty);
        } else {
          meta.setAttribute('property', nameOrProperty);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    };

    // Description Meta
    setMetaTag(`name="description"`, 'description', pageDescription);
    setMetaTag(`property="og:description"`, 'og:description', pageDescription);
    setMetaTag(`property="twitter:description"`, 'twitter:description', pageDescription);

    // Title Meta
    setMetaTag(`name="title"`, 'title', pageTitle);
    setMetaTag(`property="og:title"`, 'og:title', pageTitle);
    setMetaTag(`property="twitter:title"`, 'twitter:title', pageTitle);

    // Dynamic Canonical URL handling
    const currentUrl = `https://fularanifoundation.org${location.pathname}`;
    setMetaTag(`property="og:url"`, 'og:url', currentUrl);
    setMetaTag(`property="twitter:url"`, 'twitter:url', currentUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [location.pathname]);

  return null;
};

export default SEO;
