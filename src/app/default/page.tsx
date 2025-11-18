'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, AlertTriangle } from 'lucide-react';
import VCardResult from '@/components/VCardResult';
import { VCardData } from '@/lib/types';

export default function DefaultVCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{ qrCode: string; vcard: string; data: VCardData } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the request is from authorized domains
    const checkAuthorization = () => {
      const hostname = window.location.hostname;
      const allowedDomains = ['vcard.aade.me', 'ife.360ace.food', 'localhost'];

      const authorized = allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith('.' + domain)
      );

      return authorized;
    };

    const loadDefaultVCard = async () => {
      try {
        if (!checkAuthorization()) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);

        // Default data for Ifeoluwa Adekoya
        const defaultData: VCardData = {
          firstName: 'Ifeoluwa',
          lastName: 'Adekoya',
          title: 'Food Safety Consultant',
          email: 'ife@360ace.food',
          phone: '+1 780 236 3276',
          mobile: '+1 780 236 3276',
          website: 'https://360ace.food',
        };

        const response = await fetch('/api/qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultData),
        });

        if (!response.ok) {
          throw new Error('Failed to generate QR code');
        }

        const { qrCode, vcard } = await response.json();
        setResult({ qrCode, vcard, data: defaultData });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load contact card. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDefaultVCard();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen clean-gradient-bg relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-strong mb-4"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div className="spinner w-12 h-12"></div>
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Loading Contact Card
            </h2>
            <p className="text-white/70 max-w-md mx-auto">
              Preparing your digital contact information...
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="min-h-screen clean-gradient-bg relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-screen">
          <motion.div
            className="glass-strong border-2 border-red-400/30 rounded-3xl p-8 md:p-12 max-w-lg text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Shield size={40} className="text-red-300" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Access Restricted
            </h2>

            <p className="text-white/80 text-lg leading-relaxed">
              This page can only be accessed from authorized domains.
            </p>

            <div className="pt-4 space-y-2">
              <p className="text-sm text-white/60">
                Authorized domains:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['vcard.aade.me', 'ife.360ace.food'].map((domain, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white/80"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen clean-gradient-bg relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-screen">
          <motion.div
            className="glass-strong border-2 border-yellow-400/30 rounded-3xl p-8 md:p-12 max-w-lg text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <AlertTriangle size={40} className="text-yellow-300" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white">
              Something Went Wrong
            </h2>

            <p className="text-white/80">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen clean-gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full text-sm mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-white/90 font-medium">Digital Contact Card</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Save My Contact
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Scan the QR code or download the vCard to save my contact information instantly
          </motion.p>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex justify-center items-center">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <VCardResult
                  qrCode={result.qrCode}
                  vcard={result.vcard}
                  data={result.data}
                  hideCreateAnother={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          className="text-center mt-20 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-white/50 text-sm">
            Compatible with iOS and Android • vCard 3.0 Standard
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
