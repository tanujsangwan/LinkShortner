import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Copy, BarChart2, Trash2, QrCode, Download, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { getLinks, deleteLink, getShortUrl } from '../lib/api';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getLinks();
      setLinks(data || []);
    } catch (error) {
      toast.error('FAILED TO FETCH LINKS', {
        style: { border: '3px solid black', borderRadius: '0', background: '#FF3366', color: '#FFF', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }
      });
      // Fallback dummy data for visual testing if api fails
      setLinks([
        { id: 1, originalUrl: 'https://github.com/verylongurl/repo', alias: 'gh-repo', custom: true, clicks: 142, createdAt: new Date().toISOString() },
        { id: 2, originalUrl: 'https://youtube.com/watch?v=123456789', alias: 'yt-vid', custom: false, clicks: 89, createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, alias) => {
    if (window.confirm('DELETE THIS LINK? THIS CANNOT BE UNDONE.')) {
      try {
        await deleteLink(alias);
        setLinks(links.filter(l => l.alias !== alias));
        toast.success('LINK DELETED', {
          style: { border: '3px solid black', borderRadius: '0', background: '#00FF88', color: '#000', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }
        });
      } catch (error) {
        toast.error('FAILED TO DELETE', {
          style: { border: '3px solid black', borderRadius: '0', background: '#FF3366', color: '#FFF', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }
        });
      }
    }
  };

  const copyToClipboard = (alias) => {
    navigator.clipboard.writeText(getShortUrl(alias));
    toast.success('COPIED!', {
      style: { border: '3px solid black', borderRadius: '0', background: '#00D4FF', color: '#000', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }
    });
  };

  const downloadQR = (alias) => {
    const svg = document.getElementById(`qr-${alias}`);
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
        downloadLink.download = `qr-${alias}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const filteredLinks = links.filter(link => 
    link.originalUrl.toLowerCase().includes(search.toLowerCase()) || 
    link.alias.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brute-bg">
      {/* Header Bar */}
      <div className="bg-[#FFE500] border-b-[3px] border-black py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-5xl font-black text-black uppercase tracking-tight">YOUR LINKS</h1>
          <div className="brute-badge bg-[#FF3366] text-white text-xl py-2 px-4 shadow-[4px_4px_0px_0px_#000]">
            {links.length} TOTAL
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-10 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
          <input 
            type="text" 
            placeholder="SEARCH LINKS OR ALIASES..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="brute-input pl-14 text-xl"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-[6px] border-[#FFE500] border-t-[#FF3366] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLinks.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <h2 className="text-5xl font-black text-white mb-8">NO LINKS YET.</h2>
            <Link to="/" className="brute-btn-yellow text-xl">CREATE LINK</Link>
          </div>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.alias || link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, x: -4, boxShadow: '8px 8px 0px 0px #000' }}
                className="brute-card p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`brute-badge text-[10px] ${link.custom ? 'bg-[#00FF88]' : 'bg-[#00D4FF]'}`}>
                      {link.custom ? 'CUSTOM' : 'AUTO'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-bold text-black truncate mb-2" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    <div className="bg-[#FFE500] border-[3px] border-black p-3 flex justify-between items-center shadow-[3px_3px_0px_0px_#000]">
                      <span className="font-black text-lg truncate pr-2">/{link.alias}</span>
                      <button onClick={() => copyToClipboard(link.alias)} className="p-1 hover:bg-black hover:text-[#FFE500] transition-colors border-2 border-transparent hover:border-black rounded">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-[3px] border-black flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="brute-badge bg-[#FF3366] text-white">
                      <span className="text-lg">{link.clicks || 0}</span> CLICKS
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setSelectedQR(link.alias)} className="brute-btn bg-white text-black p-2 text-xs w-full shadow-[2px_2px_0px_0px_#000]">
                      <QrCode className="w-4 h-4 mx-auto" />
                    </button>
                    <Link to={`/analytics/${link.alias}`} className="brute-btn bg-[#00D4FF] text-black p-2 text-xs w-full shadow-[2px_2px_0px_0px_#000]">
                      <BarChart2 className="w-4 h-4 mx-auto" />
                    </Link>
                    <button onClick={() => handleDelete(link.id, link.alias)} className="brute-btn bg-black text-white p-2 text-xs w-full shadow-[2px_2px_0px_0px_#000]">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="brute-card bg-[#FFFBF0] p-8 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setSelectedQR(null)}
                className="absolute -top-4 -right-4 bg-black text-white p-2 border-[3px] border-black hover:bg-[#FF3366] transition-colors shadow-[4px_4px_0px_0px_#000]"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="font-black text-2xl text-center mb-6 uppercase">QR CODE</h3>
              
              <div className="bg-white border-[3px] border-black p-4 flex justify-center mb-6 shadow-[4px_4px_0px_0px_#000]">
                <QRCodeSVG 
                  id={`qr-${selectedQR}`}
                  value={getShortUrl(selectedQR)} 
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              
              <button onClick={() => downloadQR(selectedQR)} className="brute-btn-lime w-full text-center flex justify-center items-center">
                <Download className="w-5 h-5 mr-2" /> DOWNLOAD PNG
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
