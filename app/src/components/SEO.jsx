import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, image }) => {
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
      '/transparency': 'Transparency',
      '/our-team': 'Our Team'
    };

    // Use props if provided, otherwise default to route-based title
    let matchedTitle = title || 'Best NGO in Odisha';
    
    if (!title) {
        for (const [path, t] of Object.entries(routeTitles)) {
          if (location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`))) {
            matchedTitle = t;
            break;
          }
        }
    }

    const pageTitle = `Fularani Foundation | ${matchedTitle}`;
    
    // Use description prop or default
    const defaultDesc = 'Fularani Foundation is the best operating NGO in Odisha, India. We are dedicated to #EducationForAll, #MissionHealthcare, #MissionGreen, and Mission Thalassemia. Join us in uplifting lives and empowering communities across Odisha.';
    const pageDescription = description || defaultDesc;

    // Use image prop or default logo/banner
    const pageImage = image || 'https://fularanifoundation.org/logo.png'; // Fallback to a default logo if none provided

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

    // Image Meta
    setMetaTag(`property="og:image"`, 'og:image', pageImage);
    setMetaTag(`property="twitter:image"`, 'twitter:image', pageImage);
    setMetaTag(`property="twitter:card"`, 'twitter:card', 'summary_large_image');

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

  }, [location.pathname, title, description, image]);

  return null;
};

export default SEO;
