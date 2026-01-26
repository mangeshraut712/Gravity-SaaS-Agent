'use client';

import React, { useState, useEffect } from 'react';
import {
    Zap, Activity, Cpu, Settings, ArrowRight, Command,
    BarChart2, Globe, Shield, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Mock Data for Real-time Chart ---
const generateData = () =>
    Array.from({ length: 15 }, (_, i) => ({
        time: `${10 + i}:00`,
        tokens: Math.floor(Math.random() * 5000) + 2000,
        cost: Math.floor(Math.random() * 2000) + 1000
    }));

interface Message { role: 'user' | 'assistant'; text: string; }

export default function DashboardPage() {
    const [data, setData] = useState(generateData());
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: "GravityBot v2.0 online. Context engine caching active." },
        { role: 'assistant', text: "Ready to optimize your workflow." }
    ]);

    // State for real-time stats
    const [stats, setStats] = useState({
        status: 'offline',
        activeSessions: 0,
        mcpTools: 0,
        uptime: 0,
        userTier: 'FREE',
        usagePercent: 0
    });

    // Poll Gateway for System Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3001/stats');
                if (res.ok) {
                    const json = await res.json();
                    setStats(json);
                } else {
                    setStats(s => ({ ...s, status: 'offline' }));
                }
            } catch (e) {
                setStats(s => ({ ...s, status: 'offline' }));
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    // Simulate Live Data Ticking (for chart, as Gateway doesn't persist history yet)
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => [
                ...prev.slice(1),
                {
                    time: 'New',
                    tokens: Math.floor(Math.random() * 6000) + 2000,
                    cost: Math.floor(Math.random() * 2500) + 1000
                }
            ]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const userMsg = inputText;
        const newMsg: Message = { role: 'user', text: userMsg };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        try {
            const res = await fetch('http://localhost:3001/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'dashboard-user', text: userMsg })
            });

            if (res.ok) {
                const json = await res.json();
                setMessages(prev => [...prev, { role: 'assistant', text: json.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "Error: Gateway rejected request." }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Error: Could not reach Gateway." }]);
        }
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <nav className="sidebar">
                <div>
                    <div className="brand">
                        <div className="brand-icon"><Zap size={20} fill="currentColor" /></div>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>GravityBot</h2>
                            <p style={{ fontSize: '12px', color: '#888' }}>Personal Intelligence</p>
                        </div>
                    </div>

                    <div className="nav-group">
                        <div className="nav-link active"><Activity size={18} /> Overview</div>
                        <div className="nav-link"><Cpu size={18} /> Memory Engine</div>
                        <div className="nav-link"><Globe size={18} /> Active Skills</div>
                    </div>
                </div>

                <div className="nav-link"><Settings size={18} /> System Config</div>
            </nav>

            {/* Main Content: Bento Grid */}
            <main className="main">
                <header className="header">
                    <h1>Command Center</h1>
                    <p>Real-time telemetry of your AI infrastructure.</p>
                </header>

                <div className="bento-grid">
                    {/* Main Chart Card */}
                    <motion.div
                        className="bento-card bento-large"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Token Velocity</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#000', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>Input: 40k/s</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>$/hr: $0.42</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tokens"
                                        stroke="#000"
                                        fillOpacity={1}
                                        fill="url(#colorTokens)"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="cost"
                                        stroke="#CCC"
                                        fill="none"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Stat Card 1 */}
                    <motion.div
                        className="bento-card"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '12px', color: '#007AFF' }}>
                                <Shield size={24} />
                            </div>
                            <ArrowRight size={20} color="#CCC" />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Status</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: stats.status === 'online' ? '#10B981' : '#EF4444' }}>
                                {stats.status.toUpperCase()}
                            </h2>
                        </div>
                    </motion.div>

                    {/* Stat Card 2 */}
                    <motion.div
                        className="bento-card"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: '#FFF0F5', padding: '10px', borderRadius: '12px', color: '#F72585' }}>
                                <Zap size={24} />
                            </div>
                            <ArrowRight size={20} color="#CCC" />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Plan: {stats.userTier}</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                                {stats.usagePercent.toFixed(1)}% Usage
                            </h2>
                            <div style={{ width: '100%', height: '4px', background: '#EEE', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                                <div style={{ width: `${stats.usagePercent}%`, height: '100%', background: '#F72585' }} />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Right: Live Chat */}
            <aside className="chat-panel">
                <div className="chat-header">
                    <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Live Feed</h3>
                    <div className="status-badge">
                        <span className="status-dot"></span>
                        ACTIVE
                    </div>
                </div>

                <div className="messages">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className={`msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                            >
                                {m.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="input-zone">
                    <input
                        className="chat-input"
                        placeholder="Type command or query..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend}>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </aside>
        </div>
    );
}
