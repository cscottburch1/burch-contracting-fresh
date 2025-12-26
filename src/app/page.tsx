import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Badge } from '@/components/ui/Badge';
import { businessConfig } from '@/config/business';

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {businessConfig.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Professional residential and light commercial contracting services. Quality craftsmanship, clear communication, and dependable service for all your home improvement needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="primary" size="lg" href="/contact">
                Request Free Estimate
                <Icon name="ArrowRight" size={20} />
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {businessConfig.contact.phone}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="ShieldCheck" size={20} className="text-green-400" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Star" size={20} className="text-yellow-400" />
                <span>5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-blue-400" />
                <span>Local & Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose {businessConfig.name}?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering exceptional service and quality workmanship on every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessConfig.features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon as any}
            />
          ))}
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive home improvement solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon as any}
              href="/contact"
              compact
            />
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Service Areas
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {businessConfig.serviceArea.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {businessConfig.serviceArea.locations.map((location, index) => (
            <Badge key={index} variant="blue" className="text-base px-4 py-2">
              {location}
            </Badge>
          ))}
        </div>
      </Section>

      <Section background="blue" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the quality and craftsmanship we bring to every project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.projects.slice(0, 6).map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              description={project.description}
            />
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from homeowners we've helped
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessConfig.testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              location={testimonial.location}
              text={testimonial.text}
              rating={testimonial.rating}
              project={testimonial.project}
            />
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get a free, no-obligation estimate for your home improvement project. We'll work with you to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/contact">
              Get Your Free Estimate
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900">
              <Icon name="Phone" size={20} />
              Call Now
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
