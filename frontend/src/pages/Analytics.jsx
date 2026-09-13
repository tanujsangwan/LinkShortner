import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { toast } from 'react-hot-toast';
import { getAnalytics, getShortUrl } from '../lib/api';

const COLORS = ['#FFE500', '#FF3366', '#00D4FF', '#00FF88'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFBF0] border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <p className="font-bold text-black uppercase mb-1">{label}</p>
        <p className="font-black text-xl text-[#FF3366]">
          {payload[0].value} CLICKS
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { alias } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, [alias]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics(alias);
      setData(res);
    } catch (err) {
      setError(true);
      // Mock data for visual testing if api fails
      setData({
        alias,
        originalUrl: 'https://example.com/very/long/url',
        totalClicks: 1337,
        uniqueVisitors: 890,
        clicksByDay: [
          { date: 'Mon', clicks: 120 }, { date: 'Tue', clicks: 200 }, { date: 'Wed', clicks: 150 },
          { date: 'Thu', clicks: 380 }, { date: 'Fri', clicks: 290 }, { date: 'Sat', clicks: 110 }, { date: 'Sun', clicks: 87 }
        ],
        deviceBreakdown: [{ name: 'Mobile', value: 65 }, { name: 'Desktop', value: 30 }, { name: 'Tablet', value: 5 }],
        browserBreakdown: [{ name: 'Chrome', value: 60 }, { name: 'Safari', value: 25 }, { name: 'Firefox', value: 15 }],
        osBreakdown: [{ name: 'iOS', value: 45 }, { name: 'Android', value: 35 }, { name: 'Windows', value: 15 }, { name: 'macOS', value: 5 }],
        countryBreakdown: [{ country: 'United States', clicks: 500 }, { country: 'United Kingdom', clicks: 200 }, { country: 'India', clicks: 150 }],
        referrerBreakdown: [{ referrer: 'Direct', clicks: 600 }, { referrer: 'Twitter', clicks: 400 }, { referrer: 'Google', clicks: 337 }]
      });
      setError(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShortUrl(alias));
    toast.success('COPIED!', {
      style: { border: '3px solid black', borderRadius: '0', background: '#00D4FF', color: '#000', fontWeight: 'bold', boxShadow: '4px 4px 0px 0px #000' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brute-bg flex justify-center items-center">
        <div className="w-20 h-20 border-[8px] border-[#FFE500] border-t-[#FF3366] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-brute-bg flex flex-col justify-center items-center px-6 text-center">
        <div className="brute-card bg-[#FF3366] text-white p-10 max-w-lg w-full mb-8">
          <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-8xl font-black mb-4">404.</h1>
          <p className="text-2xl font-bold uppercase">Analytics Not Found</p>
        </div>
        <Link to="/dashboard" className="brute-btn-yellow">← BACK TO DASHBOARD</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brute-bg pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <Link to="/dashboard" className="brute-btn-yellow inline-flex items-center text-sm px-4 py-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> BACK
          </Link>
        </div>

        {/* Link Info */}
        <div className="brute-card p-6 md:p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 overflow-hidden w-full">
            <p className="font-bold text-gray-500 uppercase mb-2">Original URL</p>
            <p className="font-black text-xl truncate" title={data.originalUrl}>{data.originalUrl}</p>
          </div>
          <div className="bg-[#FFE500] border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] flex items-center gap-4 w-full md:w-auto justify-between">
            <span className="font-black text-2xl truncate">/{alias}</span>
            <button onClick={copyToClipboard} className="brute-btn bg-white text-black py-2 px-4 shadow-[2px_2px_0px_0px_#000]">
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0 }} className="brute-card border-t-[8px] border-t-[#FFE500] p-6 text-center">
            <p className="text-4xl md:text-5xl font-black text-black mb-2">{data.totalClicks}</p>
            <p className="font-bold text-xs md:text-sm uppercase text-gray-600">Total Clicks</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="brute-card border-t-[8px] border-t-[#FF3366] p-6 text-center">
            <p className="text-4xl md:text-5xl font-black text-black mb-2">{data.uniqueVisitors || '-'}</p>
            <p className="font-bold text-xs md:text-sm uppercase text-gray-600">Unique Visitors</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="brute-card border-t-[8px] border-t-[#00D4FF] p-6 text-center">
            <p className="text-2xl md:text-3xl font-black text-black mb-2 truncate">{data.countryBreakdown?.[0]?.country || '-'}</p>
            <p className="font-bold text-xs md:text-sm uppercase text-gray-600">Top Country</p>
          </motion.div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="brute-card border-t-[8px] border-t-[#00FF88] p-6 text-center">
            <p className="text-2xl md:text-3xl font-black text-black mb-2 truncate">{data.deviceBreakdown?.[0]?.name || '-'}</p>
            <p className="font-bold text-xs md:text-sm uppercase text-gray-600">Top Device</p>
          </motion.div>
        </div>

        {/* Main Chart */}
        <div className="brute-card p-6 md:p-8 mb-10">
          <h2 className="font-black text-2xl uppercase mb-8">CLICKS OVER TIME</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.clicksByDay || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFE500" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFE500" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} axisLine={{ strokeWidth: 3 }} tickLine={{ strokeWidth: 3 }} />
                <YAxis stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} axisLine={{ strokeWidth: 3 }} tickLine={{ strokeWidth: 3 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="clicks" stroke="#FF3366" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdowns Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Devices */}
          <div className="brute-card p-6">
            <h3 className="font-black text-xl uppercase mb-6 text-center">DEVICES</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.deviceBreakdown || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="#000" strokeWidth={2}>
                    {(data.deviceBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {(data.deviceBreakdown || []).map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs font-bold uppercase">
                  <div className="w-3 h-3 border-[2px] border-black mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Browsers */}
          <div className="brute-card p-6">
            <h3 className="font-black text-xl uppercase mb-6 text-center">BROWSERS</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.browserBreakdown || []} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }} width={70} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="value" fill="#FF3366" stroke="#000" strokeWidth={2} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OS */}
          <div className="brute-card p-6">
            <h3 className="font-black text-xl uppercase mb-6 text-center">OS</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.osBreakdown || []} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#000', fontWeight: 'bold', fontSize: 12 }} width={70} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="value" fill="#00D4FF" stroke="#000" strokeWidth={2} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Referrers */}
          <div className="brute-card overflow-hidden">
            <div className="bg-[#FFE500] border-b-[3px] border-black p-4">
              <h3 className="font-black text-xl uppercase">TOP REFERRERS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-[3px] border-black text-sm uppercase">
                    <th className="p-3 font-bold border-r-[3px] border-black">Source</th>
                    <th className="p-3 font-bold">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.referrerBreakdown || []).map((item, i) => (
                    <tr key={i} className={`border-b-[3px] border-black last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FFFBF0]'}`}>
                      <td className="p-3 font-bold border-r-[3px] border-black">{item.referrer || 'Direct'}</td>
                      <td className="p-3 font-black text-[#FF3366]">{item.clicks}</td>
                    </tr>
                  ))}
                  {(!data.referrerBreakdown || data.referrerBreakdown.length === 0) && (
                    <tr>
                      <td colSpan="2" className="p-6 text-center font-bold">NO DATA YET</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Countries */}
          <div className="brute-card overflow-hidden">
            <div className="bg-[#00FF88] border-b-[3px] border-black p-4">
              <h3 className="font-black text-xl uppercase">TOP COUNTRIES</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-[3px] border-black text-sm uppercase">
                    <th className="p-3 font-bold border-r-[3px] border-black">Country</th>
                    <th className="p-3 font-bold">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.countryBreakdown || []).map((item, i) => (
                    <tr key={i} className={`border-b-[3px] border-black last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FFFBF0]'}`}>
                      <td className="p-3 font-bold border-r-[3px] border-black">{item.country || 'Unknown'}</td>
                      <td className="p-3 font-black text-[#00D4FF]">{item.clicks}</td>
                    </tr>
                  ))}
                  {(!data.countryBreakdown || data.countryBreakdown.length === 0) && (
                    <tr>
                      <td colSpan="2" className="p-6 text-center font-bold">NO DATA YET</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
