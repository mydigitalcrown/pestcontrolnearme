const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const services = require('./data/services');
const locations = require('./data/locations');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance Middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      frameSrc: ["'self'", "https://maps.google.com", "https://www.google.com"],
      connectSrc: ["'self'"],
    },
  },
}));

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true
}));

// Form parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pass data to all views
app.use((req, res, next) => {
  res.locals.services = services;
  res.locals.locations = locations;
  res.locals.siteName = "PestControlNearMe";
  res.locals.siteUrl = "https://www.pestcontrolnearme.in";
  res.locals.phone = "+91 94533 94533";
  res.locals.phone2 = "+91 94533 94533";
  res.locals.email = "jitendra.gupta700@gmail.com";
  res.locals.currentPath = req.path;
  next();
});

// ── HOME ──
app.get('/', (req, res) => {
  const page = {
    title: "Best Pest Control Services in Mumbai | #1 Pest Control Near Me",
    metaDesc: "Mumbai's most trusted pest control company. Professional cockroach, termite, mosquito, rodent & bed bug control. Same-day service | 3-month guarantee | Free inspection. Call now!",
    keywords: "pest control mumbai, pest control near me, best pest control service mumbai, cockroach control mumbai, termite control mumbai",
    canonical: "https://www.pestcontrolnearme.in/",
    ogTitle: "Best Pest Control Services in Mumbai | PestControlNearMe",
    ogDesc: "Mumbai's most trusted pest control company. Professional services for all pests. Same-day service & 3-month guarantee.",
    heroTitle: "Mumbai's #1 Pest Control Service",
    heroSubtitle: "Professional, Safe & Guaranteed Pest Elimination for Your Home & Business",
    heroLocation: "Mumbai",
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "PestControlNearMe",
      "@id": "https://www.pestcontrolnearme.in",
      "url": "https://www.pestcontrolnearme.in",
      "telephone": "+91-9453394533",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400001",
        "addressCountry": "IN"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 19.0760, "longitude": 72.8777 },
      "openingHours": "Mo-Su 06:00-22:00",
      "priceRange": "₹₹",
      "image": "https://www.pestcontrolnearme.in/images/logo.png",
      "description": "Mumbai's most trusted pest control company offering professional pest management services for homes and businesses."
    }),
    breadcrumbs: [{ name: "Home", url: "/" }],
    mapEmbed: "https://maps.google.com/maps?q=Mumbai,Maharashtra&output=embed"
  };
  res.render('pages/home', { page });
});

// ── ABOUT ──
app.get('/about', (req, res) => {
  const page = {
    title: "About PestControlNearMe | Best Pest Control Company in Mumbai",
    metaDesc: "Learn about PestControlNearMe – Mumbai's leading pest management company. 10+ years experience, 50,000+ satisfied customers, certified technicians.",
    keywords: "about pest control company mumbai, pest control company history",
    canonical: "https://www.pestcontrolnearme.in/about",
    heroTitle: "About PestControlNearMe",
    heroSubtitle: "10+ Years of Trusted Pest Management Excellence in Mumbai",
    heroLocation: "Mumbai",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About Us", url: "/about" }]
  };
  res.render('pages/about', { page });
});

// ── CONTACT ──
app.get('/contact', (req, res) => {
  const page = {
    title: "Contact Pest Control Mumbai | Free Inspection & Quote",
    metaDesc: "Contact PestControlNearMe in Mumbai for free inspection and instant quote. Call +91 94533 94533 or fill our online form. Same-day response guaranteed!",
    keywords: "contact pest control mumbai, pest control phone number mumbai",
    canonical: "https://www.pestcontrolnearme.in/contact",
    heroTitle: "Contact Us – Free Pest Inspection",
    heroSubtitle: "Get a Free Quote Within 30 Minutes – Same Day Service Available",
    heroLocation: "Mumbai",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }]
  };
  res.render('pages/contact', { page });
});

// Contact form handler
app.post('/contact', (req, res) => {
  // In production, integrate with email service / CRM
  res.redirect('/contact?success=1');
});

// ── SERVICES LISTING ──
app.get('/services', (req, res) => {
  const page = {
    title: "All Pest Control Services in Mumbai | Complete Pest Management",
    metaDesc: "Explore all pest control services in Mumbai – cockroach, termite, mosquito, rodent, bed bug, ant, fly control & more. Professional & affordable. Call now!",
    keywords: "pest control services mumbai, all pest control services near me",
    canonical: "https://www.pestcontrolnearme.in/services",
    heroTitle: "Our Pest Control Services",
    heroSubtitle: "Comprehensive Pest Management Solutions for Every Need",
    heroLocation: "Mumbai",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]
  };
  res.render('pages/services', { page });
});

// ── SERVICE DETAIL PAGES ──
app.get('/services/:slug', (req, res) => {
  const service = services.find(s => s.slug === req.params.slug);
  if (!service) return res.status(404).render('pages/404');
  
  const page = {
    title: service.metaTitle,
    metaDesc: service.metaDesc,
    keywords: service.keywords,
    canonical: `https://www.pestcontrolnearme.in/services/${service.slug}`,
    heroTitle: service.heroTitle,
    heroSubtitle: service.heroSubtitle,
    heroLocation: "Mumbai",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.name, url: `/services/${service.slug}` }
    ],
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.name + " in Mumbai",
      "description": service.shortDesc,
      "provider": {
        "@type": "LocalBusiness",
        "name": "PestControlNearMe",
        "url": "https://www.pestcontrolnearme.in"
      },
      "areaServed": { "@type": "City", "name": "Mumbai" }
    }),
    faqSchema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": service.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    })
  };
  res.render('pages/service-detail', { page, service });
});

// ── LOCATION PAGES — individual route per city ──
app.get('/pest-control-in/mumbai', (req, res) => res.render('pages/locations/mumbai'));
app.get('/pest-control-in/delhi', (req, res) => res.render('pages/locations/delhi'));
app.get('/pest-control-in/bangalore', (req, res) => res.render('pages/locations/bangalore'));
app.get('/pest-control-in/hyderabad', (req, res) => res.render('pages/locations/hyderabad'));
app.get('/pest-control-in/chennai', (req, res) => res.render('pages/locations/chennai'));
app.get('/pest-control-in/kolkata', (req, res) => res.render('pages/locations/kolkata'));
app.get('/pest-control-in/pune', (req, res) => res.render('pages/locations/pune'));
app.get('/pest-control-in/ahmedabad', (req, res) => res.render('pages/locations/ahmedabad'));
app.get('/pest-control-in/jaipur', (req, res) => res.render('pages/locations/jaipur'));
app.get('/pest-control-in/lucknow', (req, res) => res.render('pages/locations/lucknow'));
app.get('/pest-control-in/kanpur', (req, res) => res.render('pages/locations/kanpur'));
app.get('/pest-control-in/nagpur', (req, res) => res.render('pages/locations/nagpur'));
app.get('/pest-control-in/indore', (req, res) => res.render('pages/locations/indore'));
app.get('/pest-control-in/thane', (req, res) => res.render('pages/locations/thane'));
app.get('/pest-control-in/bhopal', (req, res) => res.render('pages/locations/bhopal'));
app.get('/pest-control-in/visakhapatnam', (req, res) => res.render('pages/locations/visakhapatnam'));
app.get('/pest-control-in/patna', (req, res) => res.render('pages/locations/patna'));
app.get('/pest-control-in/vadodara', (req, res) => res.render('pages/locations/vadodara'));
app.get('/pest-control-in/ghaziabad', (req, res) => res.render('pages/locations/ghaziabad'));
app.get('/pest-control-in/ludhiana', (req, res) => res.render('pages/locations/ludhiana'));
app.get('/pest-control-in/agra', (req, res) => res.render('pages/locations/agra'));
app.get('/pest-control-in/nashik', (req, res) => res.render('pages/locations/nashik'));
app.get('/pest-control-in/faridabad', (req, res) => res.render('pages/locations/faridabad'));
app.get('/pest-control-in/meerut', (req, res) => res.render('pages/locations/meerut'));
app.get('/pest-control-in/rajkot', (req, res) => res.render('pages/locations/rajkot'));
app.get('/pest-control-in/varanasi', (req, res) => res.render('pages/locations/varanasi'));
app.get('/pest-control-in/aurangabad', (req, res) => res.render('pages/locations/aurangabad'));
app.get('/pest-control-in/amritsar', (req, res) => res.render('pages/locations/amritsar'));
app.get('/pest-control-in/navi-mumbai', (req, res) => res.render('pages/locations/navi-mumbai'));
app.get('/pest-control-in/prayagraj', (req, res) => res.render('pages/locations/prayagraj'));
app.get('/pest-control-in/ranchi', (req, res) => res.render('pages/locations/ranchi'));
app.get('/pest-control-in/howrah', (req, res) => res.render('pages/locations/howrah'));
app.get('/pest-control-in/coimbatore', (req, res) => res.render('pages/locations/coimbatore'));
app.get('/pest-control-in/jabalpur', (req, res) => res.render('pages/locations/jabalpur'));
app.get('/pest-control-in/gwalior', (req, res) => res.render('pages/locations/gwalior'));
app.get('/pest-control-in/vijayawada', (req, res) => res.render('pages/locations/vijayawada'));
app.get('/pest-control-in/jodhpur', (req, res) => res.render('pages/locations/jodhpur'));
app.get('/pest-control-in/madurai', (req, res) => res.render('pages/locations/madurai'));
app.get('/pest-control-in/raipur', (req, res) => res.render('pages/locations/raipur'));
app.get('/pest-control-in/kota', (req, res) => res.render('pages/locations/kota'));
app.get('/pest-control-in/chandigarh', (req, res) => res.render('pages/locations/chandigarh'));
app.get('/pest-control-in/guwahati', (req, res) => res.render('pages/locations/guwahati'));
app.get('/pest-control-in/solapur', (req, res) => res.render('pages/locations/solapur'));
app.get('/pest-control-in/hubli', (req, res) => res.render('pages/locations/hubli'));
app.get('/pest-control-in/tiruchirappalli', (req, res) => res.render('pages/locations/tiruchirappalli'));
app.get('/pest-control-in/bareilly', (req, res) => res.render('pages/locations/bareilly'));
app.get('/pest-control-in/mysore', (req, res) => res.render('pages/locations/mysore'));
app.get('/pest-control-in/thiruvananthapuram', (req, res) => res.render('pages/locations/thiruvananthapuram'));
app.get('/pest-control-in/tiruppur', (req, res) => res.render('pages/locations/tiruppur'));
app.get('/pest-control-in/gurgaon', (req, res) => res.render('pages/locations/gurgaon'));
app.get('/pest-control-in/noida', (req, res) => res.render('pages/locations/noida'));
app.get('/pest-control-in/bhubaneswar', (req, res) => res.render('pages/locations/bhubaneswar'));
app.get('/pest-control-in/kochi', (req, res) => res.render('pages/locations/kochi'));
app.get('/pest-control-in/salem', (req, res) => res.render('pages/locations/salem'));
app.get('/pest-control-in/surat', (req, res) => res.render('pages/locations/surat'));
app.get('/pest-control-in/mira-road', (req, res) => res.render('pages/locations/mira-road'));

// ── ALL LOCATIONS PAGE ──
app.get('/locations', (req, res) => {
  const page = {
    title: "Pest Control Services Across India | All Locations",
    metaDesc: "PestControlNearMe provides professional pest control services across 50+ cities in India. Find expert pest control near you today!",
    keywords: "pest control near me india, pest control all cities india",
    canonical: "https://www.pestcontrolnearme.in/locations",
    heroTitle: "Our Service Locations Across India",
    heroSubtitle: "Professional Pest Control in 50+ Cities Across India",
    heroLocation: "India",
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Locations", url: "/locations" }]
  };
  res.render('pages/locations', { page });
});

// ── SITEMAP ──
app.get('/sitemap.xml', async (req, res) => {
  try {
    res.header('Content-Type', 'application/xml');
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.8 },
      { url: '/services', changefreq: 'weekly', priority: 0.9 },
      { url: '/locations', changefreq: 'weekly', priority: 0.9 },
      ...services.map(s => ({ url: `/services/${s.slug}`, changefreq: 'weekly', priority: 0.85 })),
      ...locations.map(l => ({ url: `/pest-control-in/${l.slug}`, changefreq: 'weekly', priority: 0.85 }))
    ];
    const stream = new SitemapStream({ hostname: 'https://www.pestcontrolnearme.in' });
    const data = await streamToPromise(Readable.from(links).pipe(stream));
    res.send(data.toString());
  } catch (e) {
    res.status(500).end();
  }
});

// ── ROBOTS ──
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://www.pestcontrolnearme.in/sitemap.xml\nDisallow: /private/\n`);
});

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', {
    page: { title: "404 – Page Not Found", metaDesc: "Page not found", breadcrumbs: [] }
  });
});

app.listen(PORT, () => {
  console.log(`✅ PestControlNearMe server running at http://localhost:${PORT}`);
});

module.exports = app;
