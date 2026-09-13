import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, BarChart2, Download, RefreshCw, Plus } from 'lucide-react';
import { createLink, getShortUrl } from '../lib/api';

const Home = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showAlias, setShowAlias] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('PLEASE ENTER A URL', {
        style: {
          border: '3px solid black',
          borderRadius: '0',
          background: '#FFFBF0',
          color: '#000',
          fontWeight: 'bold',
          boxShadow: '4px 4px 0px 0px #000'
        }
      });
      return;
    }

    setLoading(true);
    try {
      const data = await createLink(url, customAlias || undefined);
      setResult(data);
      toast.success('LINK CREATED!', {
        style: {
          border: '3px solid black',
          borderRadius: '0',
          background: '#00FF88',
          color: '#000',
          fontWeight: 'bold',
          boxShadow: '4px 4px 0px 0px #000'
        }
      });
    } catch (error) {
      toast.error(error.message || 'FAILED TO CREATE LINK', {
        style: {
          border: '3px solid black',
          borderRadius: '0',
          background: '#FF3366',
          color: '#FFF',
          fontWeight: 'bold',
          boxShadow: '4px 4px 0px 0px #000'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(getShortUrl(result.alias));
      toast.success('COPIED TO CLIPBOARD', {
        style: {
          border: '3px solid black',
          borderRadius: '0',
          background: '#00D4FF',
          color: '#000',
          fontWeight: 'bold',
          boxShadow: '4px 4px 0px 0px #000'
        }
      });
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-${result.alias}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      // Fallback for SVG
      const svg = document.getElementById('qr-code-svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `qr-${result.alias}.png`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-start font-black text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6">
          <motion.h1 
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0 }}
            className="text-brute-yellow drop-shadow-[4px_4px_0px_#000]"
          >
            SHORTEN.
          </motion.h1>
          <motion.h1 
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="text-brute-pink drop-shadow-[4px_4px_0px_#000]"
          >
            SHARE.
          </motion.h1>
          <motion.h1 
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="text-brute-cyan drop-shadow-[4px_4px_0px_#000]"
          >
            TRACK.
          </motion.h1>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 font-bold uppercase tracking-widest text-lg md:text-xl"
        >
          The most brutal URL shortener on the web.
        </motion.p>
      </section>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {!result ? (
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="brute-card p-6 md:p-10 mb-12"
          >
            <form onSubmit={handleShorten} className="space-y-6">
              <div>
                <label className="block font-black text-black text-xl mb-3 uppercase">Paste Your Long URL</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/that/needs/shortening" 
                  className="brute-input text-lg"
                />
              </div>

              <div>
                <button 
                  type="button"
                  onClick={() => setShowAlias(!showAlias)}
                  className="font-bold text-black uppercase flex items-center hover:underline underline-offset-4 decoration-[3px]"
                >
                  <Plus className="w-5 h-5 mr-1" /> Custom Alias
                </button>
                
                <AnimatePresence>
                  {showAlias && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center">
                        <span className="bg-gray-200 border-y-[3px] border-l-[3px] border-black px-4 py-3 font-bold text-black border-r-0">
                          {window.location.host}/
                        </span>
                        <input 
                          type="text" 
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                          placeholder="my-custom-link" 
                          className="brute-input"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="brute-btn-pink w-full text-xl py-4 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    SHORTENING...
                  </>
                ) : (
                  'SHORTEN IT!'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="brute-card border-l-8 border-l-[#00FF88] p-6 md:p-10 mb-12 flex flex-col items-center text-center"
          >
            <div className="brute-badge bg-[#00FF88] text-black mb-6 text-lg">✅ LINK READY!</div>
            
            <div className="w-full bg-[#FFE500] border-[3px] border-black p-4 mb-8 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-black text-black text-xl md:text-2xl truncate w-full md:w-auto">
                {getShortUrl(result.alias)}
              </span>
              <button onClick={copyToClipboard} className="brute-btn-cyan w-full md:w-auto whitespace-nowrap">
                <Copy className="w-5 h-5 mr-2" /> COPY
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
              <div className="flex flex-col items-center bg-white p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000]">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={getShortUrl(result.alias)} 
                  size={150}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
                <button onClick={downloadQR} className="brute-btn-lime mt-4 w-full text-sm py-2">
                  <Download className="w-4 h-4 mr-2" /> QR CODE
                </button>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                <Link to={`/analytics/${result.alias}`} className="brute-btn-pink w-full py-4 text-lg">
                  <BarChart2 className="w-6 h-6 mr-2" /> ANALYTICS
                </Link>
                <button 
                  onClick={() => { setResult(null); setUrl(''); setCustomAlias(''); setShowAlias(false); }} 
                  className="font-bold text-black uppercase hover:underline underline-offset-4 decoration-[3px] mt-2"
                >
                  CREATE ANOTHER
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Strip */}
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="brute-card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-black mb-2">10K+</span>
          <span className="font-bold uppercase tracking-widest text-brute-pink">Links Shortened</span>
        </div>
        <div className="brute-card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-black mb-2">5K+</span>
          <span className="font-bold uppercase tracking-widest text-brute-cyan">Active Users</span>
        </div>
        <div className="brute-card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-black mb-2">99.9%</span>
          <span className="font-bold uppercase tracking-widest text-brute-lime">Uptime</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
