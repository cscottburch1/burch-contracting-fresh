import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { businessConfig } from '@/config/business';

export default function ServicesPage() {
  const services = businessConfig.services;

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up stagger-1 opacity-0">
            Comprehensive contracting solutions built on quality craftsmanship, clear communication, and dependable delivery.
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.id} className={`animate-scale-in opacity-0 stagger-${(index % 3) + 1} hover-lift`}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={<Icon name={service.icon as any} size={48} className="text-blue-600" />}
                href="/contact"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-up stagger-1 opacity-0">
            Contact us today for a free consultation and estimate. We'll discuss your project needs and provide a detailed quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2 opacity-0">
            <Button variant="primary" size="lg" href="/contact" className="shadow-2xl">
              Request Free Estimate
              <Icon name="ArrowRight" size={20} />
            </Button>
            <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="border-white text-white hover:bg-white hover:text-gray-900">
              <Icon name="Phone" size={20} />
              {businessConfig.contact.phone}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}