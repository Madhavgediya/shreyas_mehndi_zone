import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';
import { Sparkles, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found (404)" />
      <div className="min-h-[75vh] bg-parchment-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto space-y-5 bg-white p-8 sm:p-12 rounded-3xl border border-parchment-200 shadow-soft-sm">
          <div className="w-16 h-16 rounded-full bg-henna-100 text-henna-700 flex items-center justify-center mx-auto shadow-soft-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-5xl font-bold text-espresso-900">404</h1>
          <h2 className="font-serif text-xl font-medium text-espresso-800">
            Page Not Found
          </h2>

          <p className="text-xs text-espresso-700 leading-relaxed">
            The page or Mehndi design you are looking for might have been moved or does not exist.
          </p>

          <div className="pt-2">
            <Link to="/">
              <Button variant="primary" icon={Home}>
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
