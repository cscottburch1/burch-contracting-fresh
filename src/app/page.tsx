import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Badge } from '@/components/ui/Badge';
import { businessConfig } from '@/config/business';
import Script from 'next/script';

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Burch Contracting",
    "image": "https://burchcontracting.com/og-image.jpg",
    "@id": "https://burchcontracting.com",
    "url": "https://burchcontracting.com",
    "telephone": "(864) 724-4600",
    "email": "estimates@burchcontracting.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Simpsonville",
      "addressRegion": "SC",
      "postalCode": "29681",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.7371,
      "longitude": -82.2543
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/burchcontracting"
    ],
    "description": "Professional residential and light commercial contracting services in Simpsonville, SC. Quality craftsmanship, clear communication, and dependable service.",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 34.7371,
        "longitude": -82.2543
      },
      "geoRadius": "50000"
    },
    "serviceType": [
      "Home Repair",
      "Remodeling",
      "Renovation",
      "General Contracting",
      "Handyman Services",
      "Commercial Contracting"
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-24 md:py-40 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10 animate-pulse"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
              <span className="block">{businessConfig.tagline.split(' ').slice(0, 3).join(' ')}</span>
              <span className="block gradient-text">{businessConfig.tagline.split(' ').slice(3).join(' ')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed animate-fade-in-up stagger-1 opacity-0">
              Professional residential and light commercial contracting services. Quality craftsmanship, clear communication, and dependable service for all your home improvement needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up stagger-2 opacity-0">
              <Button variant="primary" size="lg" href="/contact" className="group">
                Request Free Estimate
                <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="glass border-white/30 text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {businessConfig.contact.phone}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 md:gap-8 text-base animate-fade-in-up stagger-3 opacity-0">
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="ShieldCheck" size={24} className="text-green-400" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="Star" size={24} className="text-yellow-400" />
                <span className="font-medium">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="MapPin" size={24} className="text-blue-400" />
                <span className="font-medium">Local & Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">{businessConfig.name}</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering exceptional service and quality workmanship on every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessConfig.features.map((feature, index) => (
            <div key={feature.title} className={`animate-scale-in opacity-0 stagger-${index + 1}`}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon as any}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive home improvement solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.services.map((service, index) => (
            <div key={service.id} className={`animate-fade-in-up opacity-0 stagger-${(index % 3) + 1} hover-lift`}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={<Icon name={service.icon as any} size={40} className="text-blue-600" />}
                href="/contact"
                compact
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Service Areas
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {businessConfig.serviceArea.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up stagger-1 opacity-0">
          {businessConfig.serviceArea.locations.map((location, index) => (
            <Badge key={index} variant="blue" className="text-lg px-6 py-3 hover:scale-110 transition-transform cursor-default shadow-md">
              {location}
            </Badge>
          ))}
        </div>
      </Section>

      <Section background="blue" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the quality and craftsmanship we bring to every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.projects.slice(0, 6).map((project, index) => (
            <div key={project.id} className={`animate-scale-in opacity-0 stagger-${(index % 3) + 1} hover-lift`}>
              <ProjectCard
                title={project.title}
                category={project.category}
                description={project.description}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from homeowners we've helped
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className={`animate-fade-in-up opacity-0 stagger-${index + 1} hover-lift`}>
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                text={testimonial.text}
                rating={testimonial.rating}
                project={testimonial.project}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Get a free, no-obligation estimate for your home improvement project. We'll work with you to bring your vision to life.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-1 opacity-0">
            <Button variant="primary" size="lg" href="/contact" className="group shadow-2xl">
              Get Your Free Estimate
              <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl">
              <Icon name="Phone" size={20} />
              Call Now
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
