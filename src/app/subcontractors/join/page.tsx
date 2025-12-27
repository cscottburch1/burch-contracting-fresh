'use client';

import { useState } from 'react';
import { SUBCONTRACTOR_SPECIALTIES } from '@/types/subcontractor';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function SubcontractorJoinPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Get all checked specialties
      const specialties = formData.getAll('specialties');
      
      // Get reCAPTCHA token
      const recaptchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: 'subcontractor_apply' }
      );

      const data = {
        company_name: formData.get('company_name'),
        contact_name: formData.get('contact_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        business_type: formData.get('business_type'),
        years_in_business: formData.get('years_in_business'),
        license_number: formData.get('license_number'),
        insurance_provider: formData.get('insurance_provider'),
        insurance_expiry: formData.get('insurance_expiry'),
        specialties,
        website: formData.get('website'), // honeypot
        recaptchaToken,
      };

      const res = await fetch('/api/subcontractors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitMessage('Success! Your application has been submitted. We will review and contact you within 48 hours.');
        setTimeout(() => {
          setShowForm(false);
          setSubmitMessage('');
        }, 4000);
      } else {
        setSubmitMessage(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Join Our Subcontractor Network</h1>
              <p className="text-2xl mb-8 text-blue-100">
                Partner with Burch Contracting and grow your business
              </p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-white text-blue-900 px-10 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Steady Work</h3>
                <p className="text-gray-700">
                  Access to consistent project opportunities throughout the year. We keep our best partners busy.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fair Pricing</h3>
                <p className="text-gray-700">
                  Competitive rates and transparent bidding process. Your work is valued and compensated fairly.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast Payments</h3>
                <p className="text-gray-700">
                  Net 30 payment terms with reliable, on-time payments. No chasing down checks.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Long-Term Relationships</h3>
                <p className="text-gray-700">
                  We build partnerships, not just transactions. Grow with us as a preferred contractor.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Professional Projects</h3>
                <p className="text-gray-700">
                  Work on quality residential and commercial projects with clear specifications and expectations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Digital Platform</h3>
                <p className="text-gray-700">
                  Easy online bidding, document management, and communication through our contractor portal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Apply</h3>
                <p className="text-gray-700">
                  Fill out our simple application form with your company details and specialties.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Review</h3>
                <p className="text-gray-700">
                  Our team reviews your application and verifies credentials within 48 hours.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Onboard</h3>
                <p className="text-gray-700">
                  Submit required documents and get access to our contractor portal.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Start Bidding</h3>
                <p className="text-gray-700">
                  Browse available projects and submit bids on jobs that fit your expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Requirements
            </h2>
            <div className="bg-white p-10 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Valid Business License</h3>
                    <p className="text-gray-600">Current and active business license in your state</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">General Liability Insurance</h3>
                    <p className="text-gray-600">Minimum $1M coverage required</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">W-9 Form</h3>
                    <p className="text-gray-600">For tax reporting purposes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Professional References</h3>
                    <p className="text-gray-600">Contact information for previous clients</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Minimum 2 Years Experience</h3>
                    <p className="text-gray-600">In your specialized trade</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 text-2xl mr-3">✓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Own Tools & Equipment</h3>
                    <p className="text-gray-600">Professional-grade tools for your trade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties We Need */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Trades We're Looking For
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {SUBCONTRACTOR_SPECIALTIES.map((specialty) => (
                <div 
                  key={specialty}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center font-semibold text-gray-700"
                >
                  {specialty}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Take the first step toward a profitable partnership
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-white text-blue-900 px-10 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Submit Application
            </button>
          </div>
        </section>

        {/* Application Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Subcontractor Application</h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field */}
                  <div style={{ position: 'absolute', left: '-9999px' }}>
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Submit message */}
                  {submitMessage && (
                    <div className={`p-4 rounded-lg ${submitMessage.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitMessage}
                    </div>
                  )}

                  {/* Company Information */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Company Name *</label>
                        <input 
                          type="text" 
                          name="company_name"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Name *</label>
                        <input 
                          type="text" 
                          name="contact_name"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Business Address</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Street Address</label>
                        <input 
                          type="text" 
                          name="address"
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">City</label>
                          <input 
                            type="text" 
                            name="city"
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">State</label>
                          <input 
                            type="text" 
                            name="state"
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">ZIP</label>
                          <input 
                            type="text" 
                            name="zip"
                            className="w-full border border-gray-300 rounded-lg p-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Business Type *</label>
                        <select 
                          name="business_type"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        >
                          <option value="">Select...</option>
                          <option value="sole_proprietor">Sole Proprietor</option>
                          <option value="llc">LLC</option>
                          <option value="corporation">Corporation</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Years in Business *</label>
                        <input 
                          type="number" 
                          name="years_in_business"
                          min="0"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">License Number *</label>
                        <input 
                          type="text" 
                          name="license_number"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Insurance Provider *</label>
                        <input 
                          type="text" 
                          name="insurance_provider"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Insurance Expiry Date *</label>
                        <input 
                          type="date" 
                          name="insurance_expiry"
                          required
                          className="w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Your Specialties *</h3>
                    <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {SUBCONTRACTOR_SPECIALTIES.map((specialty) => (
                        <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="specialties"
                            value={specialty}
                            className="rounded"
                          />
                          <span className="text-sm">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
