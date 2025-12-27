import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { businessConfig } from '@/config/business';
import { ServiceCard } from '@/components/ui/ServiceCard';
import Script from 'next/script';

// City-specific content with rich history and modern context
const cityContent: Record<string, {
  name: string;
  displayName: string;
  tagline: string;
  history: string;
  modernDay: {
    population: string;
    growth: string;
    characteristics: string[];
  };
  neighborhoods: {
    name: string;
    description: string;
    homeTypes: string;
  }[];
  whyChooseUs: string[];
  localInsights: string[];
  servicesIntro: string;
}> = {
  simpsonville: {
    name: "Simpsonville",
    displayName: "Simpsonville, SC",
    tagline: "Quality Home Services for Simpsonville's Growing Community",
    history: "Founded in 1839, Simpsonville has evolved from a small railroad town into one of South Carolina's most desirable suburban communities. Named after Peter Simpson, an early settler and innkeeper, the city has maintained its small-town charm while embracing modern growth. Historic downtown Simpsonville preserves the character of its past with charming local shops and restaurants.",
    modernDay: {
      population: "Over 25,000 residents",
      growth: "One of the fastest-growing cities in South Carolina, with 30%+ growth in the last decade",
      characteristics: [
        "Mix of historic homes from the early 1900s and modern subdivisions",
        "Strong focus on maintaining historic downtown character",
        "Popular with families seeking top-rated schools and safe neighborhoods",
        "Growing commercial district along Fairview Road"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Downtown",
        description: "Charming historic homes built in the early-to-mid 1900s featuring traditional Southern architecture",
        homeTypes: "Craftsman bungalows, Victorian-era homes, traditional ranch homes from the 1950s-70s"
      },
      {
        name: "Five Forks Plantation & Heritage",
        description: "Upscale planned communities with modern amenities and family-friendly features",
        homeTypes: "Contemporary single-family homes, townhomes (2000s-present)"
      },
      {
        name: "Fairview Road Corridor",
        description: "Established neighborhoods with mature landscaping near shopping and dining",
        homeTypes: "Traditional suburban homes, ranch and split-level designs (1980s-2000s)"
      }
    ],
    whyChooseUs: [
      "Historic homes require specialized care and maintenance to preserve their character",
      "Growing families need reliable contractors for home updates and repairs",
      "Established neighborhoods benefit from kitchen and bathroom modernizations",
      "New construction communities require trusted contractors for warranty work and customization",
      "Active real estate market means homeowners invest in pre-sale improvements"
    ],
    localInsights: [
      "Heritage Festival draws thousands annually to celebrate local history",
      "Award-winning parks system with 13+ parks and recreation facilities",
      "Simpsonville City Center hosts year-round community events",
      "Close-knit community values relationships and word-of-mouth recommendations"
    ],
    servicesIntro: "Whether you're restoring a historic downtown home, updating an established property, or customizing a new build in one of Simpsonville's growing subdivisions, we understand the unique needs of this community."
  },
  greenville: {
    name: "Greenville",
    displayName: "Greenville, SC",
    tagline: "Premier Contracting Services for Greenville's Vibrant Community",
    history: "Greenville's history dates back to 1797 when it was established as Pleasantburg. By the late 1800s, it had become a textile manufacturing powerhouse that defined the region. The city's transformation from an industrial center to a thriving cultural and economic hub is one of the South's great success stories. Downtown Greenville's revitalization, centered around Falls Park and Main Street, has made it a model for urban renewal nationwide.",
    modernDay: {
      population: "Over 70,000 in the city, 500,000+ in the metro area",
      growth: "Consistent 15%+ growth over the past decade, recognized as one of America's fastest-growing cities",
      characteristics: [
        "Diverse housing stock from historic mansions to modern luxury condos",
        "Thriving downtown with award-winning restaurants and cultural venues",
        "Strong corporate presence including Michelin, BMW, and GE",
        "Nationally recognized for quality of life and business climate",
        "Extensive historic districts alongside contemporary developments"
      ]
    },
    neighborhoods: [
      {
        name: "Downtown & West End",
        description: "Historic urban core with converted lofts, modern condos, and restored historic homes",
        homeTypes: "Historic mills converted to lofts, luxury condominiums, Victorian and Craftsman homes"
      },
      {
        name: "North Main & Hampton-Pinckney",
        description: "Prestigious historic districts with grand estates and tree-lined streets",
        homeTypes: "Historic mansions, Colonial Revival estates, Tudor and Mediterranean styles (1900s-1940s)"
      },
      {
        name: "Augusta Road & Greenville Country Club",
        description: "Upscale established neighborhoods with mid-century to contemporary homes",
        homeTypes: "Ranch, Contemporary, and Traditional designs (1950s-1990s)"
      },
      {
        name: "Verdae & Pelham",
        description: "Modern mixed-use communities with new construction and luxury amenities",
        homeTypes: "Contemporary single-family homes, townhomes, luxury apartments (2000s-present)"
      }
    ],
    whyChooseUs: [
      "Historic homes in protected districts require skilled craftsmen familiar with preservation standards",
      "High-value properties demand premium quality workmanship and attention to detail",
      "Active luxury home market needs contractors who understand upscale finishes",
      "Urban living spaces require creative solutions for remodeling in compact footprints",
      "Growing population of young professionals and families seeking home customization",
      "Strong rental market means property owners invest in quality improvements"
    ],
    localInsights: [
      "Falls Park on the Reedy is one of America's best urban parks",
      "Peace Center brings world-class entertainment to the region",
      "Greenville's restaurant scene rivals major metropolitan areas",
      "Saturday Market downtown is the Southeast's largest outdoor market",
      "Strong emphasis on preserving historic character while encouraging innovation",
      "Swamp Rabbit Trail connects city neighborhoods and attracts outdoor enthusiasts"
    ],
    servicesIntro: "From historic North Main estates requiring careful restoration to modern downtown condos needing contemporary updates, we bring the expertise Greenville homeowners expect."
  },
  "five-forks": {
    name: "Five Forks",
    displayName: "Five Forks, SC",
    tagline: "Trusted Home Services for Five Forks' Family-Friendly Neighborhoods",
    history: "Five Forks gets its name from the historic five-way intersection that has served as a community gathering point since the 1800s. What was once rural farmland has transformed into one of the Upstate's most desirable suburban areas. The community has carefully balanced growth with preserving its neighborhood feel, making it a top choice for families relocating to the Greenville area.",
    modernDay: {
      population: "Over 18,000 residents in the Five Forks area",
      growth: "Rapid growth since the 1990s, with major residential development continuing",
      characteristics: [
        "Primarily newer construction (1990s-present)",
        "Master-planned communities with amenities like pools and playgrounds",
        "Highly-rated Greenville County schools draw families",
        "Strong sense of community with active HOAs and neighborhood events",
        "Convenient access to Greenville and I-385"
      ]
    },
    neighborhoods: [
      {
        name: "Five Forks Plantation",
        description: "Established upscale community with diverse home styles and sizes",
        homeTypes: "Traditional single-family homes, executive estates (1990s-2010s)"
      },
      {
        name: "Heritage",
        description: "Popular family neighborhood with excellent amenities and schools",
        homeTypes: "Contemporary and Traditional designs, ranch and two-story homes (2000s-present)"
      },
      {
        name: "Garfield Park",
        description: "Well-maintained community with mature landscaping",
        homeTypes: "Single-family homes, variety of sizes and layouts (1990s-2000s)"
      },
      {
        name: "Neely Farm & Neely Station",
        description: "Newer developments with modern home designs and community features",
        homeTypes: "Contemporary single-family homes, open floor plans (2010s-present)"
      }
    ],
    whyChooseUs: [
      "Newer homes still need regular maintenance and occasional repairs",
      "Growing families require home modifications like finished basements or deck additions",
      "Active lifestyle means outdoor living spaces need expansion and upkeep",
      "Many homes reaching 15-25 years old need kitchen and bathroom updates",
      "Strong real estate market means homeowners invest in improvements before selling",
      "HOA standards require maintaining home exteriors and curb appeal"
    ],
    localInsights: [
      "Five Forks Library serves as a community hub",
      "Excellent school districts make it a top choice for families",
      "Parks and greenways encourage outdoor activities",
      "Strong community identity despite being unincorporated",
      "Convenient to both Greenville amenities and Simpsonville's hometown feel",
      "Active neighborhood associations foster community connections"
    ],
    servicesIntro: "Five Forks homeowners value quality, reliability, and responsive service. We understand the needs of this family-focused community and deliver the professionalism you expect."
  },
  woodruff: {
    name: "Woodruff",
    displayName: "Woodruff, SC",
    tagline: "Dependable Home Services for Woodruff's Historic Community",
    history: "Incorporated in 1874, Woodruff's history is deeply rooted in the textile industry and agriculture. The town served as an important junction on the Southern Railway, bringing prosperity to the region. While the textile mills that once defined Woodruff have closed, the town has maintained its identity and close-knit community spirit. Historic Main Street preserves the character of this small Southern town.",
    modernDay: {
      population: "Approximately 4,000 residents",
      growth: "Stable community with some new residential development on the outskirts",
      characteristics: [
        "Mix of historic homes and affordable newer construction",
        "Strong sense of community and Southern hospitality",
        "Lower cost of living attracts families and retirees",
        "Close proximity to Spartanburg and Greenville for employment",
        "Quiet, small-town atmosphere with convenient access to larger cities"
      ]
    },
    neighborhoods: [
      {
        name: "Historic Downtown",
        description: "Original residential areas with homes dating back to early 1900s",
        homeTypes: "Historic mill houses, Victorian-era homes, bungalows (1900s-1940s)"
      },
      {
        name: "East Woodruff",
        description: "Established neighborhoods with affordable family homes",
        homeTypes: "Ranch homes, modest single-family residences (1950s-1980s)"
      },
      {
        name: "Newer Subdivisions",
        description: "Recent residential development offering modern amenities",
        homeTypes: "Contemporary single-family homes, affordable new construction (2000s-present)"
      }
    ],
    whyChooseUs: [
      "Historic homes require experienced contractors who understand older construction methods",
      "Affordable housing market means homeowners invest in maintenance and improvements",
      "Many original mill houses need updating while preserving their historic character",
      "Growing number of first-time homebuyers need reliable contractors for renovations",
      "Retirees downsizing to Woodruff want to customize homes to their needs",
      "Small-town community values personal relationships and trustworthy service"
    ],
    localInsights: [
      "Woodruff's motto 'City of Hospitality' reflects the welcoming community",
      "Annual Heritage Festival celebrates local history and culture",
      "Close-knit community where word-of-mouth recommendations are trusted",
      "Affordable real estate market attracts young families and retirees",
      "Growing interest in downtown revitalization and historic preservation",
      "Convenient location between Spartanburg and Greenville"
    ],
    servicesIntro: "Woodruff homeowners appreciate honest, straightforward service at fair prices. We're proud to serve this historic community with the respect and quality workmanship it deserves."
  },
  "gray-court": {
    name: "Gray Court",
    displayName: "Gray Court, SC",
    tagline: "Reliable Home Services for Gray Court's Rural Community",
    history: "Gray Court's history reflects rural South Carolina's agricultural heritage. Originally a farming community, the town developed around the railroad in the late 1800s. Gray Court has maintained its small-town character while serving as a quiet residential area for those who work in nearby Laurens, Clinton, and Greenville. The community values its peaceful, country lifestyle while remaining connected to larger employment centers.",
    modernDay: {
      population: "Approximately 800 residents in town, several thousand in surrounding area",
      growth: "Modest growth with some new rural residential development",
      characteristics: [
        "Rural community with larger lots and country living",
        "Mix of historic homes and newer construction on acreage",
        "Lower cost of living and affordable property",
        "Quiet lifestyle while maintaining access to Interstate 26",
        "Strong agricultural heritage still present in surrounding areas"
      ]
    },
    neighborhoods: [
      {
        name: "Town Center",
        description: "Original residential area with older established homes",
        homeTypes: "Historic homes, modest single-family residences (1920s-1960s)"
      },
      {
        name: "Highway 14 Corridor",
        description: "Newer development along main roads with larger lots",
        homeTypes: "Ranch homes, manufactured homes, newer construction on acreage (1970s-present)"
      },
      {
        name: "Rural Acreage",
        description: "Country properties with land for farming, gardening, or horses",
        homeTypes: "Single-family homes on multiple acres, farmhouses, custom builds"
      }
    ],
    whyChooseUs: [
      "Rural properties require contractors willing to travel and work on larger projects",
      "Older homes need experienced maintenance and repair services",
      "Country properties often need outbuilding repairs, deck additions, and exterior work",
      "Homeowners value contractors who understand rural living and property needs",
      "Growing number of people moving from cities need help customizing country properties",
      "Limited local contractors means reliable, quality service is highly valued"
    ],
    localInsights: [
      "Peaceful rural setting attracts those seeking country lifestyle",
      "Close to Lake Greenwood for recreational activities",
      "Strong community ties with local churches as gathering places",
      "Affordable property attracts first-time homebuyers and retirees",
      "Convenient access to Laurens, Clinton, and Greenville for work",
      "Growing interest in hobby farming and sustainable living"
    ],
    servicesIntro: "Gray Court homeowners need contractors who understand rural properties and country living. We're experienced with the unique challenges and opportunities of homes on acreage."
  }
};

interface ServiceAreaPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return [
    { city: 'simpsonville' },
    { city: 'greenville' },
    { city: 'five-forks' },
    { city: 'woodruff' },
    { city: 'gray-court' }
  ];
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { city } = await params;
  const content = cityContent[city];
  
  if (!content) {
    return {
      title: 'Service Area Not Found',
    };
  }

  return {
    title: `${content.name} Contracting Services | Handyman, Remodeling & Home Repair | Burch Contracting`,
    description: `Professional home repair, remodeling, and handyman services in ${content.displayName}. Local contractors serving ${content.name}'s historic homes and modern neighborhoods. Licensed, insured, and trusted.`,
    keywords: `${content.name} contractor, ${content.name} handyman, ${content.name} remodeling, home repair ${content.name}, kitchen remodeling ${content.name}, bathroom renovation ${content.name}, deck builder ${content.name}`,
    openGraph: {
      title: `${content.name} Home Services | Burch Contracting`,
      description: `Trusted contractor serving ${content.displayName} - from historic home restoration to modern remodeling.`,
      url: `https://burchcontracting.com/service-areas/${city}`,
      siteName: 'Burch Contracting',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { city } = await params;
  const content = cityContent[city];
  
  if (!content) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Burch Contracting",
    "image": "https://burchcontracting.com/logo-transparent.png",
    "description": `Professional contracting services in ${content.displayName}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": content.name,
      "addressRegion": "SC"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressLocality": content.name
    },
    "areaServed": {
      "@type": "City",
      "name": content.name
    },
    "telephone": businessConfig.contact.phone,
    "priceRange": "$$"
  };

  return (
    <>
      <Script
        id="service-area-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge variant="blue" className="text-base px-4 py-2 mb-6">
              Service Area: {content.displayName}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              {content.servicesIntro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

      {/* History Section */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About <span className="gradient-text">{content.name}</span>
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {content.history}
          </p>
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {content.name} Today
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Population</p>
                <p className="text-gray-800">{content.modernDay.population}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-1">Growth</p>
                <p className="text-gray-800">{content.modernDay.growth}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-600 mb-2">Community Characteristics</p>
              <ul className="space-y-2">
                {content.modernDay.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Icon name="CheckCircle2" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Neighborhoods Section */}
      <Section background="gray" padding="lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Neighborhoods We Serve in {content.name}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Understanding the unique character of {content.name}'s diverse neighborhoods
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {content.neighborhoods.map((neighborhood, index) => (
              <Card key={index} className="hover-lift">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{neighborhood.name}</h3>
                <p className="text-gray-700 mb-4">{neighborhood.description}</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-600 mb-2">Common Home Types:</p>
                  <p className="text-gray-700 text-sm">{neighborhood.homeTypes}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us for This City */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Why {content.name} Homeowners Choose Us
          </h2>
          <div className="grid gap-4">
            {content.whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover-lift">
                <Icon name="Home" className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-lg text-gray-800">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Local Insights */}
      <Section background="gray" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Local Insights
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-md">
            <ul className="space-y-4">
              {content.localInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="MapPin" size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section background="white" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services in {content.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive home improvement solutions for every neighborhood
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {businessConfig.services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={<Icon name={service.icon as any} size={40} className="text-blue-600" />}
              href={`/services/${service.id}`}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="dark" padding="lg">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your {content.name} Home Project?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
            Contact us today for a free consultation. We're proud to serve {content.displayName} with quality craftsmanship and reliable service.
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
