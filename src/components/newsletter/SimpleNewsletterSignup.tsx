'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Welcome aboard!</h3>
        <p className="text-green-700">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <Mail className="w-8 h-8 text-beer-amber mx-auto mb-4" />
        <h3 className="text-xl font-bold text-beer-dark mb-2">
          Join the BrewQuest Journey
        </h3>
        <p className="text-beer-brown">
          Get weekly beer discoveries and brewery stories delivered to your inbox
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
        />
        
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-beer-amber focus:border-beer-amber"
        />
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-beer-amber hover:bg-beer-gold text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe for Free'}
        </button>
      </form>
      
      {status === 'error' && (
        <div className="mt-4 flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}
      
      <p className="text-xs text-gray-500 text-center mt-4">
        No spam, unsubscribe anytime. We respect your inbox.
      </p>
    </div>
  );
}