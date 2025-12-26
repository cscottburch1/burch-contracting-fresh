import { Section } from '@/components/ui/Section';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { businessConfig } from '@/config/business';

export default function ServicesPage() {
  const services = businessConfig.services;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            Comprehensive contracting solutions built on quality craftsmanship, clear communication, and dependable delivery.
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon as any}
              href="/contact"
            />
          ))}
        </div>
      </Section>
    </>
  );
}