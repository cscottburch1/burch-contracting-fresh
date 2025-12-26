'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { businessConfig } from '@/config/business';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  budgetRange: string;
  timeframe: string;
  referralSource: string;
  description: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: '',
    budgetRange: '',
    timeframe: '',
    referralSource: '',
    description: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          serviceType: '',
          budgetRange: '',
          timeframe: '',
          referralSource: '',
          description: ''
        });
      } else {
        setErrors({ submit: 'Something went wrong. Please try again or call us directly.' });
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (submitSuccess) {
    return (
      <>
        <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          </div>
        </section>

        <Section background="white" padding="lg">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Check" className="text-green-600" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-xl text-gray-600 mb-8">
              We've received your request and will get back to you within 24 hours. If you need immediate assistance, please give us a call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" href="/">
                Return to Home
              </Button>
              <Button variant="outline" size="lg" href={`tel:${businessConfig.contact.phone}`}>
                <Icon name="Phone" size={20} />
                Call Now
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Your Free Estimate</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tell us about your project and we'll get back to you with a detailed estimate
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Card padding="lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Smith"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Address or City/Area
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="YourTown, ST"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a service...</option>
                      {businessConfig.services.map(service => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a range...</option>
                      <option value="under-1000">Under $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-25000">$10,000 - $25,000</option>
                      <option value="25000-plus">$25,000+</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeframe" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Timeframe
                    </label>
                    <select
                      id="timeframe"
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select timeframe...</option>
                      <option value="asap">ASAP</option>
                      <option value="within-1-month">Within 1 month</option>
                      <option value="1-3-months">1-3 months</option>
                      <option value="3-plus-months">3+ months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="referralSource" className="block text-sm font-semibold text-gray-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      id="referralSource"
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select option...</option>
                      <option value="google">Google Search</option>
                      <option value="social-media">Social Media</option>
                      <option value="referral">Friend/Family Referral</option>
                      <option value="previous-customer">Previous Customer</option>
                      <option value="yard-sign">Yard Sign</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your project... What work needs to be done? Any specific requirements or concerns?"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                  {!isSubmitting && <Icon name="ArrowRight" size={20} />}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to be contacted about your project. We respect your privacy and will never share your information.
                </p>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href={`tel:${businessConfig.contact.phone}`} className="text-blue-600 hover:underline">
                      {businessConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Mail" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href={`mailto:${businessConfig.contact.email}`} className="text-blue-600 hover:underline">
                      {businessConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Service Area</p>
                    <p className="text-gray-600">{businessConfig.contact.city}, {businessConfig.contact.state}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon name="Clock" className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600 whitespace-pre-line text-sm">{businessConfig.contact.hours}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="bg-blue-50">
              <h3 className="text-lg font-bold text-gray-900 mb-3">What Happens Next?</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>We'll review your request within 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>We'll contact you to schedule a consultation</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>We'll visit your property to assess the project</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600">4.</span>
                  <span>You'll receive a detailed written estimate</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
