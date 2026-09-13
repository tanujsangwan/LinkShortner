import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Check, Copy, Link as LinkIcon, BarChart3, Download, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { createLink } from '../lib/api';

export default function Home() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [showAlias, setShowAlias] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    setLoading(true);
    try {
      const data = await createLink(url, alias || undefined);
      setResult(data);
      toast.success('Link created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`http://localhost:8080/${result.alias}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${result.alias}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="z-10 w-full max-w-3xl space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium animate-pulse-slow">
            <Zap className="w-4 h-4 mr-2" />
            ✨ Free URL Shortener
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Shorten. Share. <span className="text-gradient">Track.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Transform long, ugly links into short, memorable ones. Track clicks, analyze audiences, and manage your links in one beautiful dashboard.
          </p>
        </motion.div>

        {/* Input/Result Section */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="glass-card p-6 md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your long URL here..."
                    className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all"
                  />
                </div>
                
                <AnimatePresence>
                  {showAlias && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="Custom alias (optional)"
                        className="block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all mt-2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAlias(!showAlias)}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center"
                  >
                    {showAlias ? '− Hide custom alias' : '+ Add custom alias'}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Shorten URL'
                    )}
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 md:p-8 space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Your link is ready!</h3>
                <p className="text-slate-400 truncate max-w-lg mx-auto">{result.originalUrl}</p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="p-4 bg-white rounded-xl flex-shrink-0">
                  <QRCodeSVG
                    id="qr-code"
                    value={`http://localhost:8080/${result.alias}`}
                    size={128}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="space-y-4 w-full max-w-sm">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`http://localhost:8080/${result.alias}`}
                      className="block w-full pr-12 pl-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-cyan-400 font-medium outline-none selection:bg-cyan-500/30"
                    />
                    <button
                      onClick={handleCopy}
                      className="absolute inset-y-0 right-2 flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadQR}
                      className="flex-1 flex items-center justify-center py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" /> QR Code
                    </button>
                    <Link
                      to={`/analytics/${result.alias}`}
                      className="flex-1 flex items-center justify-center py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setResult(null);
                    setUrl('');
                    setAlias('');
                    setShowAlias(false);
                  }}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Create another link
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-wrap justify-center gap-8 text-sm text-slate-400 pt-12"
        >
          <div className="flex items-center">
            <span className="font-bold text-white text-xl mr-2">10K+</span> Links Created
          </div>
          <div className="flex items-center">
            <span className="font-bold text-white text-xl mr-2">5K+</span> Clicks Tracked
          </div>
          <div className="flex items-center">
            <span className="font-bold text-white text-xl mr-2">99.9%</span> Uptime
          </div>
        </motion.div>
      </div>
    </div>
  );
}
