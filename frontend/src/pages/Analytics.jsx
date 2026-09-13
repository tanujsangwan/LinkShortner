import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Copy, Check, MousePointerClick, Users, 
  Globe2, Smartphone, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import toast from 'react-hot-toast';
import { getAnalytics, getShortUrl } from '../lib/api';

const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'];

export default function Analytics() {
  const { alias } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [alias]);

  const fetchAnalytics = async () => {
    try {
      const result = await getAnalytics(alias);
      setData(result);
    } catch (err) {
      setError(true);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(getShortUrl(data.alias));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Analytics Not Found</h2>
        <p className="text-slate-400 mb-8">We couldn't find data for the alias "{alias}".</p>
        <Link to="/dashboard" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Format data for charts — handle both camelCase key names from backend
  const clicksOverTime = Object.entries(data.clicksByDay || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, clicks]) => ({ date, clicks }));
  const deviceData = Object.entries(data.deviceBreakdown || {}).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browserBreakdown || {}).map(([name, value]) => ({ name, value }));
  const osData = Object.entries(data.osBreakdown || {}).map(([name, value]) => ({ name, value }));
  const topCountries = Object.entries(data.countryBreakdown || {}).sort((a,b) => b[1] - a[1]).slice(0,5);
  const topReferrers = Object.entries(data.referrerBreakdown || {}).sort((a,b) => b[1] - a[1]).slice(0,5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-white font-bold">{payload[0].value} clicks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Overview</h1>
          <p className="text-slate-400 text-sm">Detailed stats for your link</p>
        </div>
      </div>

      {/* Link Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <h3 className="text-slate-400 text-sm mb-1 font-medium">Original URL</h3>
            <p className="text-white truncate" title={data.originalUrl}>{data.originalUrl}</p>
          </div>
          <div className="flex-1 md:text-right">
            <h3 className="text-slate-400 text-sm mb-1 font-medium">Short URL</h3>
            <div className="flex items-center md:justify-end space-x-2">
              <a href={getShortUrl(data.alias)} target="_blank" rel="noreferrer" className="text-cyan-400 font-medium hover:underline truncate">
                {getShortUrl(data.alias)}
              </a>
              <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-md flex-shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><MousePointerClick className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Total Clicks</p><p className="text-2xl font-bold text-white">{data.totalClicks}</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><Users className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Unique Visitors</p><p className="text-2xl font-bold text-white">{data.uniqueVisitors}</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl"><Globe2 className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Top Country</p><p className="text-xl font-bold text-white truncate">{topCountries[0] ? topCountries[0][0] : 'N/A'}</p></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6 flex items-center space-x-4">
          <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl"><Smartphone className="w-6 h-6" /></div>
          <div><p className="text-slate-400 text-sm">Top Device</p><p className="text-xl font-bold text-white">{deviceData.sort((a,b)=>b.value-a.value)[0]?.name || 'N/A'}</p></div>
        </motion.div>
      </div>

      {/* Main Chart */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6">Clicks Over Time</h3>
        <div className="h-72">
          {clicksOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clicksOverTime}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-500">Not enough data to display chart.</div>
          )}
        </div>
      </motion.div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Devices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="text-md font-bold text-white mb-4">Devices</h3>
          <div className="h-48">
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-slate-500">No data</div>}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
             {deviceData.map((entry, i) => (
               <div key={entry.name} className="flex items-center text-xs text-slate-400">
                 <div className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </motion.div>

        {/* Browsers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6">
          <h3 className="text-md font-bold text-white mb-4">Browsers</h3>
          <div className="h-56">
            {browserData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={browserData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12}} width={70} />
                  <RechartsTooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-slate-500">No data</div>}
          </div>
        </motion.div>

        {/* OS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-md font-bold text-white mb-4">Operating Systems</h3>
          <div className="h-56">
            {osData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={osData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12}} width={70} />
                  <RechartsTooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-slate-500">No data</div>}
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-bold text-white">Top Referrers</h3>
          </div>
          <div className="p-0">
            {topReferrers.length > 0 ? (
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 bg-slate-900/30">
                  <tr><th className="px-4 py-3">Source</th><th className="px-4 py-3 text-right">Clicks</th></tr>
                </thead>
                <tbody>
                  {topReferrers.map(([name, count]) => (
                    <tr key={name} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium truncate max-w-[200px]">{name}</td>
                      <td className="px-4 py-3 text-right">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="p-6 text-center text-slate-500">No referrer data</div>}
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-bold text-white">Top Countries</h3>
          </div>
          <div className="p-0">
            {topCountries.length > 0 ? (
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 bg-slate-900/30">
                  <tr><th className="px-4 py-3">Country</th><th className="px-4 py-3 text-right">Clicks</th></tr>
                </thead>
                <tbody>
                  {topCountries.map(([name, count]) => (
                    <tr key={name} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium">{name}</td>
                      <td className="px-4 py-3 text-right">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="p-6 text-center text-slate-500">No country data</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
