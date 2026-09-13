import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Copy, Check, BarChart3, Trash2, QrCode, X, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { getLinks, deleteLink, getShortUrl } from '../lib/api';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrModal, setQrModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const data = await getLinks();
      setLinks(data || []);
    } catch (error) {
      toast.error('Failed to load links');
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (alias) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteLink(alias);
        setLinks(links.filter(l => l.alias !== alias));
        toast.success('Link deleted');
      } catch (error) {
        toast.error('Failed to delete link');
      }
    }
  };

  const handleCopy = (alias) => {
    navigator.clipboard.writeText(getShortUrl(alias));
    setCopiedId(alias);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDownloadQR = (alias) => {
    const svg = document.getElementById('modal-qr-code');
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
      downloadLink.download = `${alias}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const filteredLinks = links.filter(l => 
    l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Links</h1>
          <p className="text-slate-400 mt-1">Manage and track your shortened URLs ({links.length})</p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <h3 className="text-xl font-medium text-white mb-2">No links found</h3>
          <p className="text-slate-400 mb-6">Create your first shortened link to get started.</p>
          <Link to="/" className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors">
            Create Link
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredLinks.map((link, i) => (
              <motion.div
                key={link.alias}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass-card p-5 flex flex-col h-full"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-slate-400" title={new Date(link.createdAt).toLocaleString()}>
                      {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <h3 className="font-medium text-white truncate mb-1" title={link.originalUrl}>
                    {link.originalUrl}
                  </h3>
                  <div className="flex items-center space-x-2 mt-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                    <a 
                      href={getShortUrl(link.alias)} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-cyan-400 font-medium truncate flex-grow hover:underline"
                    >
                      {getShortUrl(link.alias)}
                    </a>
                    <button onClick={() => handleCopy(link.alias)} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md">
                      {copiedId === link.alias ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center text-slate-300 text-sm">
                    <BarChart3 className="w-4 h-4 mr-1.5 text-purple-400" />
                    {link.clickCount || 0} clicks
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setQrModal(link.alias)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-md transition-colors"
                      title="QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <Link 
                      to={`/analytics/${link.alias}`}
                      className="p-1.5 text-slate-400 hover:text-purple-400 bg-slate-800/50 hover:bg-slate-700 rounded-md transition-colors"
                      title="Analytics"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(link.alias)}
                      className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-slate-700 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setQrModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-6 text-center">QR Code</h3>
              <div className="bg-white p-4 rounded-xl flex justify-center mb-6">
                <QRCodeSVG
                  id="modal-qr-code"
                  value={getShortUrl(qrModal)}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={() => handleDownloadQR(qrModal)}
                className="w-full py-2 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" /> Download PNG
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
