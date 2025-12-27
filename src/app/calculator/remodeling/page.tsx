'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface ServiceRate {
  name: string;
  laborRate: number;
  materialLow: number;
  materialHigh: number;
  timeHours: number;
  category: string;
  unit: string;
}

const serviceRates: ServiceRate[] = [
  // Kitchen Remodeling
  { name: 'Full Kitchen Remodel (Small, 70-100 sq ft)', laborRate: 8000, materialLow: 10000, materialHigh: 25000, timeHours: 120, category: 'Kitchen', unit: 'project' },
  { name: 'Full Kitchen Remodel (Medium, 100-150 sq ft)', laborRate: 15000, materialLow: 20000, materialHigh: 45000, timeHours: 200, category: 'Kitchen', unit: 'project' },
  { name: 'Full Kitchen Remodel (Large, 150-200 sq ft)', laborRate: 25000, materialLow: 35000, materialHigh: 75000, timeHours: 300, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Stock)', laborRate: 2500, materialLow: 3000, materialHigh: 8000, timeHours: 40, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Semi-Custom)', laborRate: 3500, materialLow: 8000, materialHigh: 15000, timeHours: 50, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Cabinet Installation (Custom)', laborRate: 5000, materialLow: 15000, materialHigh: 35000, timeHours: 60, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Laminate)', laborRate: 800, materialLow: 600, materialHigh: 1500, timeHours: 8, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Granite)', laborRate: 1200, materialLow: 2000, materialHigh: 4500, timeHours: 12, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Countertop Installation (Quartz)', laborRate: 1500, materialLow: 2500, materialHigh: 5500, timeHours: 12, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Backsplash Installation', laborRate: 800, materialLow: 400, materialHigh: 1500, timeHours: 16, category: 'Kitchen', unit: 'project' },
  { name: 'Kitchen Sink & Faucet Replacement', laborRate: 300, materialLow: 200, materialHigh: 1200, timeHours: 4, category: 'Kitchen', unit: 'project' },
  
  // Bathroom Remodeling
  { name: 'Full Bathroom Remodel (Small, 35-50 sq ft)', laborRate: 5000, materialLow: 6000, materialHigh: 15000, timeHours: 80, category: 'Bathroom', unit: 'project' },
  { name: 'Full Bathroom Remodel (Medium, 50-75 sq ft)', laborRate: 8000, materialLow: 10000, materialHigh: 22000, timeHours: 120, category: 'Bathroom', unit: 'project' },
  { name: 'Full Bathroom Remodel (Large, 75-100 sq ft)', laborRate: 12000, materialLow: 15000, materialHigh: 35000, timeHours: 160, category: 'Bathroom', unit: 'project' },
  { name: 'Shower/Tub Surround Installation (Tile)', laborRate: 2500, materialLow: 1500, materialHigh: 4000, timeHours: 40, category: 'Bathroom', unit: 'project' },
  { name: 'Shower/Tub Surround Installation (Acrylic)', laborRate: 1500, materialLow: 800, materialHigh: 2000, timeHours: 24, category: 'Bathroom', unit: 'project' },
  { name: 'Bathroom Vanity Installation', laborRate: 600, materialLow: 400, materialHigh: 2500, timeHours: 8, category: 'Bathroom', unit: 'project' },
  { name: 'Bathroom Flooring (Tile)', laborRate: 800, materialLow: 600, materialHigh: 2000, timeHours: 16, category: 'Bathroom', unit: 'project' },
  { name: 'Bathroom Flooring (Vinyl)', laborRate: 400, materialLow: 300, materialHigh: 800, timeHours: 8, category: 'Bathroom', unit: 'project' },
  { name: 'Walk-in Shower Installation', laborRate: 4000, materialLow: 3000, materialHigh: 8000, timeHours: 60, category: 'Bathroom', unit: 'project' },
  
  // Flooring
  { name: 'Hardwood Flooring Installation', laborRate: 6, materialLow: 5, materialHigh: 15, timeHours: 0.15, category: 'Flooring', unit: 'sq ft' },
  { name: 'Laminate Flooring Installation', laborRate: 3, materialLow: 2, materialHigh: 6, timeHours: 0.08, category: 'Flooring', unit: 'sq ft' },
  { name: 'Luxury Vinyl Plank Installation', laborRate: 4, materialLow: 3, materialHigh: 8, timeHours: 0.1, category: 'Flooring', unit: 'sq ft' },
  { name: 'Tile Flooring Installation', laborRate: 8, materialLow: 4, materialHigh: 15, timeHours: 0.2, category: 'Flooring', unit: 'sq ft' },
  { name: 'Carpet Installation', laborRate: 2, materialLow: 2, materialHigh: 8, timeHours: 0.05, category: 'Flooring', unit: 'sq ft' },
  
  // Painting & Drywall
  { name: 'Interior Painting (per room, 12x12)', laborRate: 400, materialLow: 100, materialHigh: 200, timeHours: 12, category: 'Painting', unit: 'room' },
  { name: 'Exterior Painting (per 1000 sq ft)', laborRate: 1500, materialLow: 300, materialHigh: 600, timeHours: 40, category: 'Painting', unit: 'area' },
  { name: 'Cabinet Painting/Refinishing', laborRate: 1200, materialLow: 300, materialHigh: 800, timeHours: 32, category: 'Painting', unit: 'project' },
  { name: 'Drywall Installation (per sheet)', laborRate: 45, materialLow: 15, materialHigh: 25, timeHours: 1, category: 'Painting', unit: 'sheet' },
  { name: 'Popcorn Ceiling Removal', laborRate: 2, materialLow: 0.5, materialHigh: 1, timeHours: 0.1, category: 'Painting', unit: 'sq ft' },
  
  // Windows & Doors
  { name: 'Window Replacement (Standard)', laborRate: 250, materialLow: 250, materialHigh: 800, timeHours: 3, category: 'Windows & Doors', unit: 'window' },
  { name: 'Window Replacement (Bay/Bow)', laborRate: 800, materialLow: 1500, materialHigh: 4000, timeHours: 12, category: 'Windows & Doors', unit: 'window' },
  { name: 'Sliding Glass Door Installation', laborRate: 600, materialLow: 800, materialHigh: 2500, timeHours: 8, category: 'Windows & Doors', unit: 'door' },
  { name: 'French Door Installation', laborRate: 500, materialLow: 600, materialHigh: 2000, timeHours: 6, category: 'Windows & Doors', unit: 'set' },
  { name: 'Garage Door Installation', laborRate: 400, materialLow: 800, materialHigh: 2500, timeHours: 6, category: 'Windows & Doors', unit: 'door' },
  
  // Basement Finishing
  { name: 'Basement Finishing (per sq ft)', laborRate: 35, materialLow: 20, materialHigh: 45, timeHours: 0.3, category: 'Basement', unit: 'sq ft' },
  { name: 'Basement Bathroom Addition', laborRate: 6000, materialLow: 4000, materialHigh: 10000, timeHours: 100, category: 'Basement', unit: 'project' },
  { name: 'Basement Egress Window Installation', laborRate: 1500, materialLow: 1000, materialHigh: 3000, timeHours: 24, category: 'Basement', unit: 'window' },
];

export default function RemodelingCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceRate | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [materialQuality, setMaterialQuality] = useState<'low' | 'mid' | 'high'>('mid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(serviceRates.map(s => s.category)))];

  const filteredServices = selectedCategory === 'All' 
    ? serviceRates 
    : serviceRates.filter(s => s.category === selectedCategory);

  const calculateEstimate = () => {
    if (!selectedService) return { labor: 0, materials: 0, total: 0 };

    const labor = selectedService.laborRate * quantity;
    let materials = 0;

    if (materialQuality === 'low') {
      materials = selectedService.materialLow * quantity;
    } else if (materialQuality === 'high') {
      materials = selectedService.materialHigh * quantity;
    } else {
      materials = ((selectedService.materialLow + selectedService.materialHigh) / 2) * quantity;
    }

    const total = labor + materials;
    return { labor, materials, total };
  };

  const estimate = calculateEstimate();

  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4em0wIDI4YzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in backdrop-blur">
            <Icon name="Home" size={48} className="text-blue-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Remodeling <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-fade-in-up stagger-1 opacity-0">
            Get instant estimates for kitchen, bathroom, and home remodeling projects using Greenville area rates
          </p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="max-w-6xl mx-auto">
          {/* Disclaimer */}
          <Card className="bg-yellow-50 border-2 border-yellow-200 mb-8 animate-fade-in-up">
            <div className="flex gap-3">
              <Icon name="AlertCircle" size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Estimate Disclaimer</h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  These calculations are for <strong>estimating purposes only</strong>. Actual costs may vary significantly based on project scope, structural requirements, permits, material selections, site conditions, and complexity of work. Remodeling projects often uncover hidden issues that can affect final costs. For an accurate quote tailored to your specific project, please contact us for a free in-home consultation.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Selection */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Project Type</h2>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Service List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredServices.map((service) => (
                    <button
                      key={service.name}
                      onClick={() => {
                        setSelectedService(service);
                        // Set smart default quantity based on unit
                        if (service.unit === 'sq ft') setQuantity(500);
                        else if (service.unit === 'project') setQuantity(1);
                        else if (service.unit === 'room') setQuantity(1);
                        else if (service.unit === 'sheet') setQuantity(20);
                        else setQuantity(1);
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedService?.name === service.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="inline-flex items-center gap-1">
                              <Icon name="Tag" size={14} />
                              {service.category}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Icon name="Ruler" size={14} />
                              per {service.unit}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-bold text-blue-600">
                            ${(service.laborRate + service.materialLow).toLocaleString()}/{service.unit}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Calculator */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Estimate</h2>
                
                {selectedService ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedService.name}</h3>
                      <p className="text-sm text-gray-600">{selectedService.category}</p>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity ({selectedService.unit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedService.unit === 'sq ft' && 'Enter total square footage'}
                        {selectedService.unit === 'project' && 'Typically 1 for full projects'}
                        {selectedService.unit === 'room' && 'Number of rooms'}
                        {selectedService.unit === 'sheet' && 'Number of drywall sheets (4x8)'}
                      </p>
                    </div>

                    {/* Material Quality */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material Quality
                      </label>
                      <div className="space-y-2">
                        {['low', 'mid', 'high'].map((quality) => (
                          <label key={quality} className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50" style={{
                            borderColor: materialQuality === quality ? '#2563eb' : '#e5e7eb',
                            backgroundColor: materialQuality === quality ? '#eff6ff' : 'transparent'
                          }}>
                            <input
                              type="radio"
                              name="quality"
                              value={quality}
                              checked={materialQuality === quality}
                              onChange={(e) => setMaterialQuality(e.target.value as any)}
                              className="mr-3"
                            />
                            <span className="font-medium capitalize">{quality === 'mid' ? 'Standard' : quality === 'low' ? 'Budget' : 'Premium'}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Estimate Breakdown */}
                    <div className="border-t pt-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-gray-700">
                          <span>Labor</span>
                          <span className="font-semibold">${estimate.labor.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Materials</span>
                          <span className="font-semibold">${estimate.materials.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total Estimate</span>
                          <span className="font-bold text-2xl">${estimate.total.toLocaleString()}</span>
                        </div>
                        <p className="text-blue-100 text-xs mt-2">
                          Estimated time: {(selectedService.timeHours * quantity).toFixed(0)} hours
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 space-y-3">
                      <Button variant="primary" size="md" href="/contact" className="w-full">
                        <Icon name="FileText" size={18} />
                        Request Official Quote
                      </Button>
                      <Button variant="outline" size="md" href="tel:(864) 724-4600" className="w-full">
                        <Icon name="Phone" size={18} />
                        Call for Details
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Home" size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Select a project to see the estimate</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <Icon name="MapPin" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Greenville Area Rates</h3>
              <p className="text-sm text-gray-600">
                Based on current Greenville, SC market rates
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Shield" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Licensed & Insured</h3>
              <p className="text-sm text-gray-600">
                All remodeling work fully licensed and insured
              </p>
            </Card>
            <Card className="text-center">
              <Icon name="Award" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">
                We stand behind all our remodeling projects
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
