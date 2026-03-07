/**
 * Generator script — creates one EJS page file per location
 * Run once: node generate-location-pages.js
 */

const fs   = require('fs');
const path = require('path');
const locations = require('./data/locations');

const OUT_DIR = path.join(__dirname, 'views', 'pages', 'locations');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const routeLines = []; // will print routes to paste into server.js

locations.forEach(loc => {
  const metaTitle = `Pest Control in ${loc.name} | Best Pest Management Services ${loc.state}`;
  const metaDesc  = `Top-rated pest control in ${loc.name}, ${loc.state}. Cockroach, termite, mosquito, rodent & all pest services. Certified experts, same-day service, 3-month guarantee. Call now!`;

  const content = `<%
/* ============================================================
   LOCATION PAGE — ${loc.name}, ${loc.state}
   URL: /pest-control-in/${loc.slug}
   ============================================================ */
locals.location = {
  slug:       "${loc.slug}",
  name:       "${loc.name}",
  state:      "${loc.state}",
  lat:        ${loc.lat},
  lng:        ${loc.lng},
  population: "${loc.population}",
  mapEmbed:   "${loc.mapEmbed}",
  desc:       "${loc.desc.replace(/"/g, '\\"')}"
};

locals.page = {
  title:       "${metaTitle}",
  metaDesc:    "${metaDesc}",
  keywords:    "pest control ${loc.name}, pest management ${loc.name}, cockroach control ${loc.name}, termite control ${loc.name}, mosquito control ${loc.name}, rodent control ${loc.name}",
  canonical:   siteUrl + "/pest-control-in/${loc.slug}",
  ogImage:     siteUrl + "/images/og-image.jpg",
  heroTitle:   "Pest Control in ${loc.name}",
  heroSubtitle:"Professional pest management services for homes \\u0026 businesses in ${loc.name}, ${loc.state}. Certified technicians, safe products, guaranteed results.",
  breadcrumbs: [
    { name: "Home",      url: "/" },
    { name: "Locations", url: "/locations" },
    { name: "Pest Control in ${loc.name}", url: "/pest-control-in/${loc.slug}" }
  ],
  schema: {
    "@context":    "https://schema.org",
    "@type":       "LocalBusiness",
    "name":        siteName + " – ${loc.name}",
    "description": "${metaDesc}",
    "url":         siteUrl + "/pest-control-in/${loc.slug}",
    "telephone":   phone,
    "address": {
      "@type":           "PostalAddress",
      "addressLocality": "${loc.name}",
      "addressRegion":   "${loc.state}",
      "addressCountry":  "IN"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": ${loc.lat}, "longitude": ${loc.lng} },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "312" }
  },
  faqSchema: {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is the best pest control company in ${loc.name}?", "acceptedAnswer": { "@type": "Answer", "text": "PestControlNearMe is rated the #1 pest control company in ${loc.name} with a 4.9-star rating, certified technicians, and a 3-month service guarantee." } },
      { "@type": "Question", "name": "How much does pest control cost in ${loc.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Pest control costs in ${loc.name} vary by service, property size, and infestation severity. Contact us for a free, no-obligation quote." } },
      { "@type": "Question", "name": "Do you offer same-day pest control in ${loc.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, same-day pest control service is available in ${loc.name} subject to technician availability. Call us for emergencies." } },
      { "@type": "Question", "name": "Which areas of ${loc.name} do you cover?", "acceptedAnswer": { "@type": "Answer", "text": "We cover all residential, commercial, and industrial areas across ${loc.name} and its surrounding localities." } },
      { "@type": "Question", "name": "Is your service safe for children and pets in ${loc.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. All treatments in ${loc.name} use WHO-approved, government-certified, low-toxicity products that are safe for families, children, and pets." } }
    ]
  }
};
%>
<%- include('../../partials/head') %>
<%- include('../../partials/header') %>

<%- include('../../partials/hero') %>

<!-- Trust Bar -->
<div class="trust-bar">
  <div class="container trust-bar-inner">
    <div class="trust-item"><strong>✅</strong><span>Certified Experts</span></div>
    <div class="trust-item"><strong>⚡</strong><span>Same-Day Service</span></div>
    <div class="trust-item"><strong>🛡️</strong><span>3-Month Guarantee</span></div>
    <div class="trust-item"><strong>💰</strong><span>Best Price Promise</span></div>
    <div class="trust-item"><strong>4.9 ★</strong><span>Rated in ${loc.name}</span></div>
  </div>
</div>

<!-- About Section -->
<%- include('../../partials/about-section') %>

<!-- Services in ${loc.name} -->
<section class="services-section section-pad bg-light" aria-label="Services in ${loc.name}">
  <div class="container">
    <div class="section-header text-center">
      <p class="section-tag">Our Services</p>
      <h2 class="section-title">Pest Control Services in ${loc.name}</h2>
      <p class="section-desc">Complete pest management for homes and businesses in ${loc.name}, ${loc.state}.</p>
    </div>
    <div class="services-grid">
      <% services.forEach(function(svc) { %>
      <article class="service-card" itemscope itemtype="https://schema.org/Service">
        <div class="service-card-icon"><%= svc.icon %></div>
        <div class="service-card-body">
          <h3 class="service-card-title" itemprop="name"><%= svc.name %> in ${loc.name}</h3>
          <p class="service-card-desc" itemprop="description"><%= svc.shortDesc %></p>
        </div>
        <a href="/services/<%= svc.slug %>" class="service-card-link btn btn-outline" aria-label="<%= svc.name %> in ${loc.name}">Know More →</a>
      </article>
      <% }); %>
    </div>
  </div>
</section>

<!-- CTA 1 -->
<% var ctaVariant = 'primary'; var ctaLocation = '${loc.name}'; %>
<%- include('../../partials/cta') %>

<!-- Location Content -->
<section class="section-pad">
  <div class="container">
    <div class="content-grid">
      <div class="content-main">
        <h2>Pest Control in ${loc.name}, ${loc.state}</h2>
        <p>${loc.desc}</p>
        <p>PestControlNearMe provides professional pest management services across all areas of ${loc.name}. Our team of certified technicians is well-acquainted with the pest pressures specific to ${loc.name}'s climate, building types, and urban environment.</p>

        <h3>Why Pest Control is Important in ${loc.name}?</h3>
        <p>With a population of approximately ${loc.population}, ${loc.name} presents unique pest management challenges. Dense urban living, humid climate, and rapid construction activity create ideal conditions for cockroaches, termites, mosquitoes, rodents, and other pests to thrive.</p>

        <h3>Areas We Serve in ${loc.name}</h3>
        <p>Our technicians serve all residential societies, commercial complexes, and industrial areas across ${loc.name} and surrounding areas. Same-day service is available for most locations in the city.</p>

        <h3>What Makes Our Service Different in ${loc.name}?</h3>
        <ul>
          <li>Local experts with deep knowledge of ${loc.name}'s pest characteristics</li>
          <li>Treatments customised for ${loc.name}'s specific climate and building types</li>
          <li>Fast response – most bookings confirmed within 30 minutes</li>
          <li>All services come with a 3-month guarantee</li>
          <li>Transparent pricing – no hidden charges</li>
        </ul>
      </div>
      <div>
        <div class="why-choose-box">
          <h3>Book Pest Control in ${loc.name}</h3>
          <%- include('../../partials/contact-form', { compact: true }) %>
        </div>
        <div class="why-choose-box" style="margin-top:1.5rem;">
          <h3>Quick Info – ${loc.name}</h3>
          <ul class="why-list">
            <li><span>🏙️</span> ${loc.name}, ${loc.state}</li>
            <li><span>👥</span> Population: ~${loc.population}</li>
            <li><span>⚡</span> Same-Day Service Available</li>
            <li><span>🛡️</span> 3-Month Guarantee</li>
            <li><span>💰</span> Best Price In ${loc.name}</li>
            <li><span>📞</span> 24/7 Emergency Support</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA 2 -->
<% ctaVariant = 'secondary'; ctaLocation = '${loc.name}'; %>
<%- include('../../partials/cta') %>

<!-- FAQ -->
<section class="faq-section section-pad" aria-label="FAQ">
  <div class="container">
    <div class="section-header text-center">
      <p class="section-tag">FAQs</p>
      <h2 class="section-title">Pest Control in ${loc.name} – Frequently Asked Questions</h2>
    </div>
    <div class="faq-wrapper">
      <% var locationFaqs = [
        { q: 'What is the best pest control company in ${loc.name}?', a: 'PestControlNearMe is rated the #1 pest control company in ${loc.name} with a 4.9-star rating, 200+ certified technicians, and a 3-month service guarantee.' },
        { q: 'How much does pest control cost in ${loc.name}?', a: 'Pest control costs in ${loc.name} depend on the type of service, property size, and severity of infestation. We offer transparent pricing. Contact us for a free quote.' },
        { q: 'Do you provide same-day pest control service in ${loc.name}?', a: 'Yes, we offer same-day pest control in ${loc.name} for most treatments. Call us for emergency services.' },
        { q: 'Which areas in ${loc.name} do you cover?', a: 'We cover all areas across ${loc.name} and surrounding regions including residential, commercial, and industrial zones.' },
        { q: 'Is your pest control service safe for kids and pets in ${loc.name}?', a: 'Yes! All treatments in ${loc.name} use WHO-approved, government-certified, low-toxicity products that are safe for families, children, and pets.' },
        { q: 'How do I book pest control in ${loc.name}?', a: 'Call us, WhatsApp us, or fill the online form above. We confirm appointments in ${loc.name} within 30 minutes.' }
      ]; %>
      <% locationFaqs.forEach(function(item, i) { %>
      <div class="faq-item" itemscope itemtype="https://schema.org/Question">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-<%= i %>" itemprop="name">
          <span><%= item.q %></span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" id="faq-<%= i %>" hidden itemscope itemtype="https://schema.org/Answer">
          <p itemprop="text"><%= item.a %></p>
        </div>
      </div>
      <% }); %>
    </div>
  </div>
</section>

<!-- Google Map -->
<% var mapEmbedUrl = '${loc.mapEmbed}'; var mapLocation = '${loc.name}'; %>
<%- include('../../partials/google-map') %>

<!-- CTA 3 -->
<% ctaVariant = 'tertiary'; ctaLocation = '${loc.name}'; %>
<%- include('../../partials/cta') %>

<!-- Nearby Locations -->
<section class="section-pad bg-light">
  <div class="container">
    <div class="section-header text-center">
      <p class="section-tag">Nearby Services</p>
      <h2 class="section-title">Pest Control in Nearby Cities</h2>
    </div>
    <div class="location-nearby">
      <% locations.filter(function(l){ return l.slug !== '${loc.slug}'; }).slice(0, 20).forEach(function(loc) { %>
      <a href="/pest-control-in/<%= loc.slug %>" class="location-card">
        <div class="location-card-pin">📍</div>
        <div class="location-card-info">
          <h3 class="location-name"><%= loc.name %></h3>
          <p class="location-state"><%= loc.state %></p>
        </div>
        <span class="location-arrow">→</span>
      </a>
      <% }); %>
    </div>
  </div>
</section>

<%- include('../../partials/clients') %>
<%- include('../../partials/reviews') %>

<!-- Final CTA -->
<% ctaVariant = 'primary'; ctaLocation = '${loc.name}'; %>
<%- include('../../partials/cta') %>

<%- include('../../partials/footer') %>
`;

  const filePath = path.join(OUT_DIR, `${loc.slug}.ejs`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: views/pages/locations/${loc.slug}.ejs`);

  routeLines.push(`app.get('/pest-control-in/${loc.slug}', (req, res) => res.render('pages/locations/${loc.slug}'));`);
});

console.log('\n──── Routes to add to server.js ────');
routeLines.forEach(l => console.log(l));
console.log(`\nTotal: ${locations.length} pages generated`);
