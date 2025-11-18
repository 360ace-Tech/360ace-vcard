'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, QrCode, Share2, Copy, Check, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { VCardData } from '@/lib/types';

interface VCardResultProps {
  qrCode: string;
  vcard: string;
  data: VCardData;
  hideCreateAnother?: boolean;
}

export default function VCardResult({ qrCode, vcard, data, hideCreateAnother = false }: VCardResultProps) {
  const [copied, setCopied] = useState(false);
  const [showQRPreview, setShowQRPreview] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success'>('idle');

  const downloadVCard = async () => {
    setDownloadStatus('downloading');

    // Add a small delay for UX feedback
    setTimeout(() => {
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.firstName}_${data.lastName}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    }, 300);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${data.firstName}_${data.lastName}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    const url = window.location.origin + '/api/vcard?' +
      new URLSearchParams({
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.organization && { org: data.organization }),
        ...(data.title && { title: data.title }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.mobile && { mobile: data.mobile }),
        ...(data.website && { url: data.website }),
      }).toString();

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVCard = async () => {
    const url = window.location.origin + '/api/vcard?' +
      new URLSearchParams({
        firstName: data.firstName,
        lastName: data.lastName,
        ...(data.organization && { org: data.organization }),
        ...(data.title && { title: data.title }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.mobile && { mobile: data.mobile }),
        ...(data.website && { url: data.website }),
      }).toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.firstName} ${data.lastName} - Contact Card`,
          text: 'Save my contact information',
          url: url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Success Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-100 px-4 py-2 rounded-full text-sm font-medium"
      >
        <Check size={16} />
        <span>QR Code Generated Successfully</span>
      </motion.div>

      {/* QR Code Display */}
      <motion.div
        className="glass-strong rounded-2xl p-8 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

        <motion.div
          className="relative inline-block"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
        >
          <div className="qr-container group cursor-pointer" onClick={() => setShowQRPreview(true)}>
            <img
              src={qrCode}
              alt="VCard QR Code"
              className="w-64 h-64 mx-auto transition-transform duration-300 group-hover:scale-105"
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
              whileHover={{ opacity: 1 }}
            >
              <div className="text-white text-sm font-medium flex items-center gap-2">
                <Sparkles size={16} />
                Click to enlarge
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 space-y-2 relative z-10"
        >
          <h3 className="text-2xl font-bold text-white">
            {data.firstName} {data.lastName}
          </h3>
          {data.title && (
            <p className="text-white/80 font-medium">{data.title}</p>
          )}
          {data.organization && (
            <p className="text-white/70">{data.organization}</p>
          )}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={downloadVCard}
          disabled={downloadStatus === 'downloading'}
          className="flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-blue-600 font-semibold rounded-xl hover:bg-opacity-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {downloadStatus === 'success' ? (
            <>
              <Check size={20} className="text-green-600" />
              <span className="text-green-600">Downloaded!</span>
            </>
          ) : (
            <>
              <Download size={20} />
              {downloadStatus === 'downloading' ? 'Downloading...' : 'Download VCard'}
            </>
          )}
        </motion.button>

        <motion.button
          onClick={downloadQRCode}
          className="flex items-center justify-center gap-2 py-3.5 px-6 glass-strong border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <QrCode size={20} />
          Download QR
        </motion.button>

        <motion.button
          onClick={shareVCard}
          className="flex items-center justify-center gap-2 py-3.5 px-6 glass-strong border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 size={20} />
          Share
        </motion.button>

        <motion.button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 py-3.5 px-6 glass-strong border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <Check size={20} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={20} />
              Copy Link
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="glass rounded-xl p-5 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="font-semibold flex items-center gap-2 text-white">
          <QrCode size={18} />
          How to use your digital contact card:
        </h4>
        <ul className="text-sm text-white/80 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span><strong>Scan the QR code</strong> with your phone camera to instantly save the contact</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span><strong>Download the VCard</strong> to import directly into your contacts app</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span><strong>Share the link</strong> to let others download your contact information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>Compatible with <strong>all iOS and Android devices</strong></span>
          </li>
        </ul>
      </motion.div>

      {/* QR Code Preview Modal */}
      <AnimatePresence>
        {showQRPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowQRPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQRPreview(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close preview"
              >
                <X size={24} />
              </button>
              <img src={qrCode} alt="QR Code Preview" className="w-full h-auto" />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {data.firstName} {data.lastName}
                </h3>
                {data.title && <p className="text-gray-600">{data.title}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
