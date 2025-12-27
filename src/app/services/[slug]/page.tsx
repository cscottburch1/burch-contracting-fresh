import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { businessConfig } from '@/config/business';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import Script from 'next/script';

// Service content database
const serviceContent: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: { title: string; description: string; icon: string }[];
  process: { step: number; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  gallery: { title: string; description: string }[];
  cta: string;
}> = {
  handyman: {
    title: "Professional Handyman Services in Simpsonville, SC",
    subtitle: "Expert repairs and maintenance for your home or business",
    description: "From minor repairs to routine maintenance, our skilled handyman services cover all your home improvement needs. We handle everything from fixing squeaky doors to installing new fixtures, ensuring your property stays in top condition.",
    benefits: [
      "Quick response time - same-day service available",
      "Fixed, upfront pricing - no surprises",
      "Licensed, insured professionals",
      "Satisfaction guaranteed on all work",
      "One call handles multiple repairs"
    ],
    features: [
      {
        title: "Door & Window Repairs",
        description: "Fix squeaky doors, replace locks, repair window screens, adjust door hinges, and weatherstripping installation.",
        icon: "DoorOpen"
      },
      {
        title: "Fixture Installation",
        description: "Install ceiling fans, light fixtures, cabinet hardware, towel bars, shelving, and curtain rods.",
        icon: "Lightbulb"
      },
      {
        title: "Minor Repairs",
        description: "Patch drywall holes, fix leaky faucets, repair loose trim, caulking, and general maintenance tasks.",
        icon: "Wrench"
      },
      {
        title: "Cabinet & Furniture",
        description: "Install cabinets, repair drawer slides, adjust doors, and assemble furniture professionally.",
        icon: "Box"
      }
    ],
    process: [
      { step: 1, title: "Call or Contact Us", description: "Describe your repair needs and schedule a convenient time" },
      { step: 2, title: "Assessment", description: "We assess the work and provide an upfront quote" },
      { step: 3, title: "Quick Completion", description: "Most handyman jobs completed same-day or next-day" },
      { step: 4, title: "Quality Check", description: "Review the work and ensure your complete satisfaction" }
    ],
    faq: [
      {
        question: "What's included in handyman services?",
        answer: "Our handyman services cover a wide range of small to medium repairs and installations including door repairs, fixture installation, drywall patching, minor plumbing fixes, cabinet installation, and general maintenance. If you're unsure, just call us!"
      },
      {
        question: "Do you charge by the hour or by the job?",
        answer: "We provide upfront, fixed pricing for most handyman jobs after assessing the work. For larger projects requiring multiple visits, we'll discuss hourly rates and provide a detailed estimate."
      },
      {
        question: "How quickly can you respond?",
        answer: "We offer same-day or next-day service for most handyman requests. For urgent repairs, call us directly at (864) 724-4600."
      }
    ],
    gallery: [
      { title: "Door Repair & Installation", description: "Professional door hardware and repair services" },
      { title: "Fixture Installation", description: "Expert ceiling fan and light fixture installation" },
      { title: "Cabinet Work", description: "Quality cabinet installation and repair" }
    ],
    cta: "Need a reliable handyman? Get your free quote today!"
  },
  remodeling: {
    title: "Kitchen & Bathroom Remodeling in Simpsonville, SC",
    subtitle: "Transform your space with expert remodeling services",
    description: "Whether you're looking to modernize your kitchen, upgrade your bathroom, or create your dream space, our experienced team delivers quality remodeling that increases your home's value and functionality. We handle everything from design consultation to final installation.",
    benefits: [
      "Complete design-to-completion service",
      "Licensed contractors and skilled craftsmen",
      "Quality materials from trusted suppliers",
      "Detailed project timeline and budget",
      "Clean, professional work site daily"
    ],
    features: [
      {
        title: "Kitchen Remodeling",
        description: "Custom cabinets, countertops, backsplashes, flooring, lighting, and appliance installation for a complete kitchen transformation.",
        icon: "Home"
      },
      {
        title: "Bathroom Renovations",
        description: "New vanities, tile work, shower/tub replacement, plumbing fixtures, lighting, and modern amenities.",
        icon: "Droplets"
      },
      {
        title: "Countertop Installation",
        description: "Expert installation of granite, quartz, marble, and solid surface countertops with professional fabrication.",
        icon: "Square"
      },
      {
        title: "Custom Tile Work",
        description: "Beautiful backsplashes, shower surrounds, and flooring with precision installation and attention to detail.",
        icon: "Grid3x3"
      }
    ],
    process: [
      { step: 1, title: "Design Consultation", description: "Discuss your vision, needs, and budget with our design team" },
      { step: 2, title: "Detailed Estimate", description: "Receive a comprehensive quote with material specifications" },
      { step: 3, title: "Project Planning", description: "Finalize timeline, selections, and prepare for construction" },
      { step: 4, title: "Professional Execution", description: "Expert installation with daily updates on progress" },
      { step: 5, title: "Final Walkthrough", description: "Review completed work and ensure your complete satisfaction" }
    ],
    faq: [
      {
        question: "How long does a typical kitchen remodel take?",
        answer: "Most kitchen remodels take 4-6 weeks depending on the scope. A simple refresh (cabinets and countertops) may take 2-3 weeks, while a complete gut renovation can take 8-12 weeks. We'll provide a detailed timeline during consultation."
      },
      {
        question: "Can I stay in my home during the remodel?",
        answer: "Yes! While there will be some inconvenience, most homeowners stay in their homes during remodeling. We'll set up a temporary kitchen area and maintain a clean, safe work environment. We work efficiently to minimize disruption."
      },
      {
        question: "Do you help with design and material selection?",
        answer: "Absolutely! We offer design consultation and can help you select materials, colors, and fixtures that match your vision and budget. We work with trusted suppliers to ensure quality materials."
      },
      {
        question: "What's the cost range for a bathroom remodel?",
        answer: "Bathroom remodels typically range from $8,000-$25,000+ depending on size and scope. A basic refresh starts around $8,000-$12,000, while a complete renovation with high-end finishes can be $20,000-$35,000. We'll provide a detailed estimate based on your specific needs."
      }
    ],
    gallery: [
      { title: "Modern Kitchen Transformation", description: "Complete kitchen renovation with custom cabinets and quartz countertops" },
      { title: "Luxury Master Bath", description: "Spa-like bathroom with walk-in shower and double vanity" },
      { title: "Updated Guest Bath", description: "Fresh, modern bathroom with new fixtures and tile" }
    ],
    cta: "Ready to transform your space? Schedule your free design consultation!"
  },
  additions: {
    title: "Screened Porches, Decks & Room Additions in Simpsonville, SC",
    subtitle: "Expand your living space with quality outdoor and home additions",
    description: "Increase your home's living space and value with professionally built screened porches, decks, and room additions. Our experienced team creates beautiful, functional outdoor living areas and home expansions that seamlessly blend with your existing structure.",
    benefits: [
      "Increase your home's value and usable space",
      "Custom designs tailored to your home",
      "Quality materials built to last",
      "Proper permits and inspections handled",
      "Warranty on workmanship and materials"
    ],
    features: [
      {
        title: "Screened Porches",
        description: "Enjoy the outdoors without bugs! Custom screened porches with ceiling fans, lighting, and decorative elements.",
        icon: "Home"
      },
      {
        title: "Deck Construction",
        description: "Beautiful composite or wood decks with professional railings, stairs, and built-in features like benches or planters.",
        icon: "Layers"
      },
      {
        title: "Room Additions",
        description: "Add a bedroom, office, or family room with full foundation, framing, electrical, HVAC, and finishing.",
        icon: "PlusSquare"
      },
      {
        title: "Outdoor Living Spaces",
        description: "Create the perfect outdoor entertainment area with pergolas, pavilions, and covered patios.",
        icon: "TreePine"
      }
    ],
    process: [
      { step: 1, title: "Site Visit & Consultation", description: "Assess your property and discuss your vision for the addition" },
      { step: 2, title: "Design & Planning", description: "Create detailed plans and handle permit applications" },
      { step: 3, title: "Material Selection", description: "Choose quality materials and finalize specifications" },
      { step: 4, title: "Construction", description: "Professional building with regular progress updates" },
      { step: 5, title: "Final Inspection", description: "Ensure all work meets code and your expectations" }
    ],
    faq: [
      {
        question: "Do I need a permit for a deck or screened porch?",
        answer: "Yes, most decks and screened porches require building permits. We handle all permit applications and ensure your project meets local building codes. The permit costs are included in your project estimate."
      },
      {
        question: "How long does it take to build a screened porch?",
        answer: "A typical screened porch takes 2-4 weeks to complete, depending on size and complexity. Weather can affect outdoor construction, so we'll keep you updated on any timeline changes."
      },
      {
        question: "What's better: composite or wood decking?",
        answer: "Both have advantages! Wood (especially pressure-treated or cedar) offers natural beauty at lower cost but requires regular maintenance. Composite decking costs more initially but requires minimal maintenance and lasts longer. We'll help you choose based on your budget and preferences."
      },
      {
        question: "Can you match my existing home's style?",
        answer: "Absolutely! We specialize in creating additions that seamlessly blend with your home's existing architecture, materials, and style. Your addition will look like it was always part of your home."
      }
    ],
    gallery: [
      { title: "Elegant Screened Porch", description: "Beautiful screened porch with vaulted ceiling and ceiling fan" },
      { title: "Custom Composite Deck", description: "Low-maintenance deck with built-in seating and lighting" },
      { title: "Room Addition", description: "Seamless home addition adding 400 sq ft of living space" }
    ],
    cta: "Expand your living space! Request your free addition consultation today!"
  }
};

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return businessConfig.services.map((service) => ({
    slug: service.id,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceContent[slug];
  
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.title} | Burch Contracting`,
    description: service.description,
    keywords: `${slug}, ${service.title.toLowerCase()}, simpsonville sc, contractor`,
    openGraph: {
      title: service.title,
      description: service.description,
      url: `https://burchcontracting.com/services/${slug}`,
      siteName: 'Burch Contracting',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = serviceContent[slug];
  
  if (!service) {
    notFound();
  }

  const serviceConfig = businessConfig.services.find(s => s.id === slug);
  const relevantTestimonials = businessConfig.testimonials;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Burch Contracting",
      "telephone": "(864) 724-4600",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Simpsonville",
        "addressRegion": "SC",
        "postalCode": "29681"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Simpsonville"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Script
        id="service-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 animate-fade-in-up">
              <Badge variant="blue" className="text-lg px-6 py-2 inline-block">
                {serviceConfig?.title}
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up stagger-1 opacity-0">
              {service.subtitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed animate-fade-in-up stagger-2 opacity-0">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up stagger-3 opacity-0">
              {slug === 'handyman' && (
                <Button variant="primary" size="lg" href="/calculator/handyman" className="bg-green-600 hover:bg-green-700">
                  <Icon name="Calculator" size={20} />
                  Price Calculator
                </Button>
              )}
              <Button variant="primary" size="lg" href="/contact">
                Get Free Estimate
                <Icon name="ArrowRight" size={20} />
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`} className="glass border-white/30 text-white hover:bg-white hover:text-gray-900">
                <Icon name="Phone" size={20} />
                {businessConfig.contact.phone}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our <span className="gradient-text">{serviceConfig?.title}</span>?
          </h2>
          <div className="grid gap-4">
            {service.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover-lift">
                <Icon name="CheckCircle2" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="gray" padding="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive {serviceConfig?.title.toLowerCase()} solutions for your home
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {service.features.map((feature, index) => (
            <Card key={index} className="hover-lift">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name={feature.icon as any} size={28} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section background="white" padding="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent, and professional from start to finish
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {service.process.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-lg text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section background="gray" padding="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {service.faq.map((item, index) => (
            <Card key={index} className="hover-lift">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.question}</h3>
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section background="white" padding="lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {relevantTestimonials.map((testimonial, index) => (
            <div key={index} className="hover-lift">
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

      {/* CTA Section */}
      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {service.cta}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Contact us today for a free consultation and detailed estimate. We'll discuss your project and provide expert recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/contact" className="shadow-2xl">
              Request Free Estimate
              <Icon name="ArrowRight" size={20} />
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
