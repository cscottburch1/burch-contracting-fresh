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
import EmergencyBanner from '@/components/EmergencyBanner';

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
      
      {/* Emergency Services Banner */}
      <EmergencyBanner />

      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-24 md:py-40 overflow-hidden">{/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10 animate-pulse"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

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
                <div className="bg-blue-900 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs">
                  A+
                </div>
                <span className="font-medium">BBB A+ Rated</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="Star" size={24} className="text-yellow-400" />
                <span className="font-medium">5.0 Google Rating</span>
              </div>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <Icon name="ShieldCheck" size={24} className="text-green-400" />
                <span className="font-medium">30 Years Experience</span>
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
                href={`/services/${service.id}`}
                compact
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Service Areas</span> We're Proud to Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Delivering quality home services throughout the Upstate. Click on your city to learn more about our local expertise.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <a href="/service-areas/simpsonville" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-blue-600">
              <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Simpsonville</h3>
              <p className="text-sm text-gray-600 mb-3">Our Home Base</p>
              <div className="flex items-center justify-center text-blue-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/greenville" className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-green-600">
              <Icon name="MapPin" size={32} className="text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Greenville</h3>
              <p className="text-sm text-gray-600 mb-3">Upstate's Hub</p>
              <div className="flex items-center justify-center text-green-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/five-forks" className="group">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-sky-600">
              <Icon name="MapPin" size={32} className="text-sky-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Five Forks</h3>
              <p className="text-sm text-gray-600 mb-3">Family Friendly</p>
              <div className="flex items-center justify-center text-sky-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/woodruff" className="group">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-orange-600">
              <Icon name="MapPin" size={32} className="text-orange-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Woodruff</h3>
              <p className="text-sm text-gray-600 mb-3">Historic Charm</p>
              <div className="flex items-center justify-center text-orange-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/gray-court" className="group">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-teal-600">
              <Icon name="MapPin" size={32} className="text-teal-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Gray Court</h3>
              <p className="text-sm text-gray-600 mb-3">Rural Living</p>
              <div className="flex items-center justify-center text-teal-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/fountain-inn" className="group">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-red-600">
              <Icon name="MapPin" size={32} className="text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Fountain Inn</h3>
              <p className="text-sm text-gray-600 mb-3">Historic Town</p>
              <div className="flex items-center justify-center text-red-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/mauldin" className="group">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-cyan-600">
              <Icon name="MapPin" size={32} className="text-cyan-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Mauldin</h3>
              <p className="text-sm text-gray-600 mb-3">Established</p>
              <div className="flex items-center justify-center text-cyan-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          <a href="/service-areas/laurens" className="group">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-center hover-lift transition-all duration-200 border-2 border-transparent group-hover:border-amber-600">
              <Icon name="MapPin" size={32} className="text-amber-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-1">Laurens</h3>
              <p className="text-sm text-gray-600 mb-3">County Seat</p>
              <div className="flex items-center justify-center text-amber-600 text-sm font-semibold">
                Learn More
                <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Serving the greater Greenville-Spartanburg area and surrounding communities
          </p>
          <Button variant="outline" href="/contact">
            <Icon name="Phone" size={20} />
            Call for Service Availability
          </Button>
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don't just take our word for it - hear from homeowners we've helped
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {/* BBB A+ Badge */}
            <a 
              href="https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  A+
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">BBB Accredited</div>
                  <div className="text-xs text-gray-600">A+ Rating Since 2014</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Google Reviews Badge */}
            <a 
              href="https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z/data=!4m7!3m6!1s0x88578d1a6ee3c001:0x147295d161e89612!8m2!3d34.6341746!4d-82.0744941!16s%2Fg%2F11bbrjh0dt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-gray-200 rounded-lg px-6 py-4 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">5.0 Rating</div>
                  <div className="text-xs text-gray-600">Google Reviews</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

        {/* Google Reviews Embed */}
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">See All Our Google Reviews</h3>
              <p className="text-gray-600">Read what our customers are saying about their experience with Burch Contracting</p>
            </div>
            
            {/* Google Reviews iframe */}
            <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-lg" style={{ minHeight: '450px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.6779645891234!2d-82.07669228475948!3d34.63417468045845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88578d1a6ee3c001%3A0x147295d161e89612!2sBurch%20Contracting!5e0!3m2!1sen!2sus!4v1735325000000!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Burch Contracting Google Reviews and Location"
              ></iframe>
            </div>
            
            <div className="mt-6 text-center">
              <a
                href="https://g.page/r/ERI2mdFh0pJE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Leave Us a Review on Google
              </a>
            </div>
          </div>
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
