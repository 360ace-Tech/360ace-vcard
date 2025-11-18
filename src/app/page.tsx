'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, QrCode, Download, Share2, Zap } from 'lucide-react';
import VCardForm from '@/components/VCardForm';
import VCardResult from '@/components/VCardResult';
import { VCardData } from '@/lib/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ qrCode: string; vcard: string; data: VCardData } | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data: VCardData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const { qrCode, vcard } = await response.json();
      setResult({ qrCode, vcard, data });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setResult(null);
    setShowForm(true);
  };

  return (
    <main className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        {/* Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key="header"
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
              <span className="text-white/90 font-medium">Next-Generation Digital Contact Cards</span>
              <Zap size={18} className="text-cyan-300" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                360Ace
              </motion.span>
              {' '}
              <motion.span
                className="inline-block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                VCard
              </motion.span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Create stunning digital contact cards with QR codes in seconds.
              <br className="hidden md:block" />
              <span className="text-white/90 font-medium">Share instantly. Save automatically.</span>
            </motion.p>

            {/* Feature Pills */}
            {showForm && (
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: QrCode, text: 'QR Code Generation', color: 'from-blue-500 to-cyan-500' },
                  { icon: Download, text: 'Instant Download', color: 'from-purple-500 to-pink-500' },
                  { icon: Share2, text: 'Easy Sharing', color: 'from-green-500 to-emerald-500' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group flex items-center gap-3 glass-strong px-5 py-3 rounded-xl hover:scale-105 transition-transform cursor-default"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                      <feature.icon size={20} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-semibold">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex justify-center items-center w-full">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <VCardForm onSubmit={handleSubmit} isLoading={isLoading} />
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full max-w-2xl mx-auto"
              >
                <VCardResult qrCode={result.qrCode} vcard={result.vcard} data={result.data} />

                {/* Create New Button */}
                <motion.button
                  onClick={handleCreateNew}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 glass-strong border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span>Create Another VCard</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          className="text-center mt-24 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm flex-wrap">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" />
              Built with Next.js & TypeScript
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-purple-400" />
              Powered by Framer Motion
            </span>
          </div>
          <p className="text-white/50 text-sm">
            Compatible with iOS and Android • vCard 3.0 Standard
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
