'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ServiceItem {
  category: string;
  items: { name: string; price: number }[];
}

const HANDYMAN_SERVICES: ServiceItem[] = [
  {
    category: 'General Repairs',
    items: [
      { name: 'Drywall repair (small hole)', price: 75 },
      { name: 'Drywall repair (large hole)', price: 150 },
      { name: 'Door hinge replacement', price: 50 },
      { name: 'Door knob/lock installation', price: 65 },
      { name: 'Window screen repair', price: 40 },
      { name: 'Ceiling fan repair', price: 85 },
      { name: 'Light fixture replacement', price: 75 },
      { name: 'Outlet/switch replacement', price: 60 },
    ]
  },
  {
    category: 'Painting',
    items: [
      { name: 'Interior room painting (per room)', price: 350 },
      { name: 'Exterior door painting', price: 150 },
      { name: 'Trim/baseboard painting (per room)', price: 125 },
      { name: 'Ceiling painting (per room)', price: 200 },
      { name: 'Deck staining (per sq ft)', price: 2.5 },
    ]
  },
  {
    category: 'Carpentry',
    items: [
      { name: 'Shelf installation (per shelf)', price: 85 },
      { name: 'Crown molding installation (per linear ft)', price: 8 },
      { name: 'Baseboard installation (per linear ft)', price: 6 },
      { name: 'Door trim installation', price: 125 },
      { name: 'Cabinet hardware installation (per piece)', price: 15 },
    ]
  },
  {
    category: 'Plumbing',
    items: [
      { name: 'Faucet replacement', price: 125 },
      { name: 'Toilet repair', price: 95 },
      { name: 'Garbage disposal installation', price: 175 },
      { name: 'Drain cleaning', price: 110 },
      { name: 'Showerhead replacement', price: 75 },
    ]
  },
  {
    category: 'Assembly & Installation',
    items: [
      { name: 'Furniture assembly (small)', price: 75 },
      { name: 'Furniture assembly (large)', price: 150 },
      { name: 'TV wall mounting', price: 125 },
      { name: 'Curtain rod installation', price: 65 },
      { name: 'Blinds installation (per window)', price: 85 },
    ]
  }
];

interface ProposalItem {
  id: string;
  service: string;
  quantity: number;
  price: number;
  total: number;
  notes: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function HandymanProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [emailing, setEmailing] = useState(false);
  
  // Proposal data
  const [proposalNumber, setProposalNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [proposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  const [taxRate, setTaxRate] = useState(7);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    checkAuth();
    generateProposalNumber();
    fetchCustomers();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (!res.ok) {
        router.push('/admin');
        return;
      }
    } catch (err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const generateProposalNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900) + 100; // 100-999
    setProposalNumber(`BC-${year}-${random}`);
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    if (!customerId) {
      setSelectedCustomerId(null);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomerAddress('');
      return;
    }
    
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (customer) {
      setSelectedCustomerId(customer.id);
      setCustomerName(customer.name);
      setCustomerEmail(customer.email || '');
      setCustomerPhone(customer.phone || '');
      setCustomerAddress(customer.address || '');
    }
  };

  const addServiceItem = () => {
    if (!selectedService) return;
    
    let service = null;
    let price = 0;
    
    for (const category of HANDYMAN_SERVICES) {
      const found = category.items.find(item => item.name === selectedService);
      if (found) {
        service = found.name;
        price = found.price;
        break;
      }
    }
    
    if (!service) return;
    
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      service,
      quantity: 1,
      price,
      total: price,
      notes: ''
    };
    
    setItems([...items, newItem]);
    setSelectedService('');
    setSelectedCategory('');
  };

  const updateItem = (id: string, field: keyof ProposalItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleSave = async () => {
    if (!customerName || items.length === 0) {
      alert('Please add customer name and at least one service item.');
      return;
    }

    setSaving(true);
    try {
      const proposalData = {
        proposalNumber,
        customerId: selectedCustomerId,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        proposalDate,
        expirationDate,
        items: items.map(item => ({
          service: item.service,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          notes: item.notes
        })),
        subtotal,
        taxRate,
        tax,
        total,
        notes,
        proposalType: 'Handyman Services',
        status: 'draft'
      };

      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });

      if (res.ok) {
        alert('Proposal saved successfully!');
      } else {
        const error = await res.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save proposal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailToCustomer = async () => {
    if (!customerEmail) {
      alert('Customer email is required to send proposal.');
      return;
    }

    if (!customerName || items.length === 0) {
      alert('Please complete the proposal before emailing.');
      return;
    }

    setEmailing(true);
    try {
      const proposalData = {
        proposalNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        proposalDate,
        expirationDate,
        items,
        subtotal,
        taxRate,
        tax,
        total,
        notes,
        proposalType: 'Handyman Services'
      };

      const res = await fetch('/api/admin/proposals/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });

      if (res.ok) {
        alert(`Proposal sent to ${customerEmail} successfully!`);
      } else {
        const error = await res.json();
        alert(`Failed to send email: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Email error:', err);
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      router.push('/admin/proposals/create');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Preview Header - No Print */}
        <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Proposal Preview</h2>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/proposals/create')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                ← Back to Proposals
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleEmailToCustomer}
                disabled={emailing || !customerEmail}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300"
              >
                {emailing ? '📤 Sending...' : '📧 Email to Customer'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300"
              >
                {saving ? '💾 Saving...' : '💾 Save to CRM'}
              </button>
              <button
                onClick={handlePrint}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                🖨️ Print
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        {/* Printable Proposal */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg my-8 p-12">
          {/* Header */}
          <div className="border-b-4 border-blue-600 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-blue-600">BURCH CONTRACTING</h1>
                <p className="text-gray-600 mt-1">Professional Handyman Services</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">PROPOSAL</div>
                <div className="text-sm text-gray-600 mt-1">#{proposalNumber}</div>
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">From:</h3>
              <p className="text-gray-700">Burch Contracting</p>
              <p className="text-gray-700">(864) 724-4600</p>
              <p className="text-gray-700">estimates@burchcontracting.com</p>
              <p className="text-gray-700">Simpsonville, SC 29681</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">To:</h3>
              <p className="text-gray-700 font-semibold">{customerName || '[Customer Name]'}</p>
              <p className="text-gray-700">{customerEmail}</p>
              <p className="text-gray-700">{customerPhone}</p>
              <p className="text-gray-700">{customerAddress}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <span className="font-bold text-gray-700">Date:</span> {proposalDate}
            </div>
            <div>
              <span className="font-bold text-gray-700">Valid Until:</span> {expirationDate}
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-bold">Service Description</th>
                  <th className="text-center p-3 font-bold">Qty</th>
                  <th className="text-right p-3 font-bold">Price</th>
                  <th className="text-right p-3 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">{item.service}</td>
                      <td className="text-center p-3">{item.quantity}</td>
                      <td className="text-right p-3">${item.price.toFixed(2)}</td>
                      <td className="text-right p-3 font-semibold">${item.total.toFixed(2)}</td>
                    </tr>
                    {item.notes && (
                      <tr>
                        <td colSpan={4} className="px-3 pb-3 text-sm text-gray-600 italic">
                          Note: {item.notes}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Tax ({taxRate}%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-900">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Notes */}
          <div className="border-t border-gray-300 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">Terms & Conditions:</h3>
            <ul className="text-sm text-gray-700 space-y-1 mb-4">
              <li>• 50% deposit required to schedule work</li>
              <li>• Balance due upon completion</li>
              <li>• All work guaranteed for 90 days</li>
              <li>• Proposal valid for 30 days from date above</li>
            </ul>
            {notes && (
              <div className="mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Additional Notes:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{notes}</p>
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="mt-12 pt-6 border-t border-gray-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b border-gray-400 mb-2 pb-8"></div>
                <p className="text-sm text-gray-600">Customer Signature</p>
              </div>
              <div>
                <div className="border-b border-gray-400 mb-2 pb-8"></div>
                <p className="text-sm text-gray-600">Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Handyman Services Proposal</h1>
              <p className="text-xl text-gray-600">Proposal #{proposalNumber}</p>
            </div>
            <button
              onClick={() => router.push('/admin/proposals/create')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-bold"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Existing Customer
                </label>
                <select
                  value={selectedCustomerId || ''}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a customer or enter manually below --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email || customer.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Add Services */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedService('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  {HANDYMAN_SERVICES.map(cat => (
                    <option key={cat.category} value={cat.category}>{cat.category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedCategory}
                >
                  <option value="">Select service...</option>
                  {selectedCategory && HANDYMAN_SERVICES
                    .find(cat => cat.category === selectedCategory)
                    ?.items.map(item => (
                      <option key={item.name} value={item.name}>
                        {item.name} - ${item.price}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={addServiceItem}
                  disabled={!selectedService}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
                >
                  + Add Service
                </button>
              </div>
            </div>
          </div>

          {/* Selected Services */}
          {items.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Services</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Service</label>
                        <input
                          type="text"
                          value={item.service}
                          onChange={(e) => updateItem(item.id, 'service', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-semibold">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1 flex items-end justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Add any special notes for this service..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Proposal Totals</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Tax Rate:</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="text-sm text-gray-700">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax ({taxRate}%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2 border-t-2 border-blue-600">
                <span>Total:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional information, special instructions, or terms..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => router.push('/admin/proposals/create')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowPreview(true)}
              disabled={!customerName || items.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300"
            >
              Preview Proposal
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
