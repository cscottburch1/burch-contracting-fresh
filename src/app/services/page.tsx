import React from 'react';
import { Section } from '@/components/ui/Section';
import { businessConfig } from '@/config/business';

export default function ServicesPage() {
  const services = businessConfig.services;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Services</h1>
          <p className="text-lg text-blue-100 max-w-3xl">
            Comprehensive contracting solutions built on quality craftsmanship, clear communication, and dependable delivery.
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {services.map((service) => (
    <div
      key={service.id}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      {service.icon && <div className="text-4xl mb-4">{service.icon}</div>}
      <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <a
        href="/contact"
        className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
      >
        Learn More →
      </a>
    </div>
  ))}
</div>