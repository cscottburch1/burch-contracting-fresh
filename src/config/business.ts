export const businessConfig = {
  name: "Burch Contracting",
  tagline: "Reliable Home Repair & Remodeling You Can Trust",
  description: "Professional residential and light commercial contracting services.",

  credentials: {
    bbbRating: "A+",
    bbbSince: "2014",
    yearsInBusiness: 30,
    established: "1995",
    bbbUrl: "https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875",
    googleRating: "5.0",
    googleUrl: "https://www.google.com/maps/place/Burch+Contracting/@34.6341746,-82.0744941,17z/data=!4m7!3m6!1s0x88578d1a6ee3c001:0x147295d161e89612!8m2!3d34.6341746!4d-82.0744941!16s%2Fg%2F11bbrjh0dt",
    licensed: true,
    insured: true
  },

  contact: {
    phone: "(864) 724-4600",
    email: "estimates@burchcontracting.com",
    address: "",
    city: "Simpsonville",
    state: "SC",
    zip: "29681",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8Appt Only"
  },

  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    linkedin: "#"
  },

  serviceArea: {
    description: "Proudly serving Simpsonville and surrounding communities",
    locations: ["Simpsonville", "Greenville", "Five Forks", "Fountain Inn", "Mauldin", "Laurens", "Woodruff", "Gray Court"]
  },

  services: [
    {
      id: "handyman",
      title: "General Handyman Services",
      icon: "Wrench",
      description: "From small repairs to routine maintenance.",
      tasks: ["Door repairs", "Cabinet installation", "Fixture replacement"]
    },
    {
      id: "remodeling",
      title: "Kitchen & Bathroom Remodels",
      icon: "Home",
      description: "Transform your spaces with quality materials.",
      tasks: ["Kitchen renovations", "Bathroom makeovers", "Countertop installation"]
    },
    {
      id: "additions",
      title: "Screened Porches & Decks",
      icon: "Paintbrush",
      description: "Professional additions and outdoor living spaces.",
      tasks: ["Screened porch construction", "Deck building", "Room Additions"]
    }
  ],

  features: [
    { title: "Licensed & Insured", description: "Fully licensed and insured", icon: "ShieldCheck" },
    { title: "Clear Communication", description: "We keep you informed", icon: "MessageSquare" },
    { title: "Quality Workmanship", description: "Attention to detail", icon: "Award" },
    { title: "On-Time & On-Budget", description: "Reliable scheduling", icon: "Clock" }
  ],

  values: [
    { title: "Integrity", description: "We do what we say" },
    { title: "Quality", description: "Meticulous attention to detail" }
  ],

  testimonials: [
    { name: "Sarah M.", location: "Simpsonville", text: "Excellent work!", rating: 5, project: "Kitchen" },
    { name: "John D.", location: "Fountain Inn", text: "Highly recommend!", rating: 5, project: "Deck" },
    { name: "Maria L.", location: "Simpsonville", text: "Professional service!", rating: 5, project: "Repairs" }
  ],

  projects: [
    { id: 1, title: "Modern Kitchen", category: "Kitchen", description: "Complete renovation", scope: "Full remodel", timeline: "4 weeks", testimonial: "Amazing!" },
    { id: 2, title: "Master Bath", category: "Bath", description: "Luxury bathroom", scope: "Complete renovation", timeline: "3 weeks", testimonial: "Beautiful!" }
  ],

  process: [
    { step: 1, title: "Contact", description: "Reach out to us" },
    { step: 2, title: "Consultation", description: "We visit your property" },
    { step: 3, title: "Estimate", description: "Detailed written estimate" },
    { step: 4, title: "Execution", description: "Complete your project" },
    { step: 5, title: "Walkthrough", description: "Review completed work" }
  ],

  seo: {
    baseUrl: "https://www.burchcontracting.com",
    defaultTitle: "Burch Contracting | Reliable Home Repair & Remodeling",
    defaultDescription: "Professional contracting services in Simpsonville, SC.",
    keywords: "contractor, home repair, remodeling, handyman, kitchen remodel, bathroom remodel, decks, porches"
  }
};
