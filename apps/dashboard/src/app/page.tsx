'use client';

import React, { useState, useEffect } from 'react';
import {
    Zap, Activity, Cpu, Settings, ArrowRight, Command,
    BarChart2, Globe, Shield, Search, AlertTriangle, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface Message { 
    role: 'user' | 'assistant'; 
    text: string; 
    timestamp?: Date;
}

interface SystemStats {
    status: 'online' | 'offline' | 'degraded';
    uptime: number;
    activeSessions: number;
    mcpTools: number;
    memoryUsage: Record<string, number>;
    userTier: string;
    usagePercent: number;
    errorRate?: number;
    responseTime?: number;
}

export default function DashboardPage() {
    const [data, setData] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({
            time: `${10 + i}:00`,
            tokens: Math.floor(Math.random() * 5000) + 2000,
            cost: Math.floor(Math.random() * 2000) + 1000
        }))
    );
    
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', text: "GravityBot v2.0 online. Enhanced security and performance monitoring active." },
        { role: 'assistant', text: "Ready to optimize your workflow with improved error handling." }
    ]);

    const [stats, setStats] = useState<SystemStats>({
        status: 'offline',
        activeSessions: 0,
        mcpTools: 0,
        uptime: 0,
        userTier: 'FREE',
        usagePercent: 0,
        memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0 }
    });

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

    // Enhanced stats fetching with error handling
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/stats');
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setStats(json.data);
                        setConnectionStatus('connected');
                    } else {
                        throw new Error(json.error || 'Invalid response format');
                    }
                } else {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
            } catch (e) {
                console.error('Stats fetch error:', e);
                setStats(s => ({ ...s, status: 'offline' }));
                setConnectionStatus('error');
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 3000);
        return () => clearInterval(interval);
    }, []);

    // Enhanced data simulation with realistic patterns
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1)];
                const lastTokens = prev[prev.length - 1].tokens;
                const variation = (Math.random() - 0.5) * 1000;
                newData.push({
                    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    tokens: Math.max(1000, lastTokens + variation),
                    cost: Math.max(500, Math.floor(Math.random() * 2500) + 1000)
                });
                return newData;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        
        const userMsg = inputText;
        const newMsg: Message = { role: 'user', text: userMsg, timestamp: new Date() };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        try {
            const res = await fetch('http://localhost:3001/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'dashboard-user', text: userMsg })
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    setMessages(prev => [...prev, { 
                        role: 'assistant', 
                        text: json.data.reply,
                        timestamp: new Date()
                    }]);
                } else {
                    throw new Error(json.error || 'Invalid response format');
                }
            } else {
                throw new Error(`HTTP ${res.status}: Gateway rejected request`);
            }
        } catch (e) {
            console.error('Message send error:', e);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                text: `❌ Error: ${e instanceof Error ? e.message : 'Could not reach Gateway'}`,
                timestamp: new Date()
            }]);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return '#10B981';
            case 'offline': return '#EF4444';
            case 'degraded': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const getConnectionIcon = () => {
        switch (connectionStatus) {
            case 'connected': return <CheckCircle size={16} color="#10B981" />;
            case 'error': return <AlertTriangle size={16} color="#EF4444" />;
            default: return <Activity size={16} color="#6B7280" />;
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
                            <p style={{ fontSize: '12px', color: '#888' }}>Enhanced Intelligence</p>
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

            {/* Main Content */}
            <main className="main">
                <header className="header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1>Command Center</h1>
                        {getConnectionIcon()}
                    </div>
                    <p>Real-time telemetry with enhanced monitoring and security.</p>
                </header>

                <div className="bento-grid">
                    {/* Enhanced Main Chart Card */}
                    <motion.div
                        className="bento-card bento-large"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Token Velocity & Performance</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#000', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>
                                    Input: {stats.activeSessions * 40}k/s
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', padding: '4px 10px', background: '#F5F5F7', borderRadius: '100px' }}>
                                    $/hr: $0.42
                                </span>
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

                    {/* Enhanced Status Card */}
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
                            <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>System Status</p>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: getStatusColor(stats.status) }}>
                                {stats.status.toUpperCase()}
                            </h2>
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                Uptime: {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m
                            </p>
                        </div>
                    </motion.div>

                    {/* Enhanced Usage Card */}
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
                            <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>
                                Plan: {stats.userTier}
                            </p>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                                {stats.usagePercent.toFixed(1)}% Usage
                            </h2>
                            <div style={{ width: '100%', height: '4px', background: '#EEE', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                                <div 
                                    style={{ 
                                        width: `${Math.min(stats.usagePercent, 100)}%`, 
                                        height: '100%', 
                                        background: stats.usagePercent > 80 ? '#EF4444' : '#F72585',
                                        transition: 'all 0.3s ease'
                                    }} 
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* New Performance Metrics Card */}
                    <motion.div
                        className="bento-card"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '12px', color: '#10B981' }}>
                                <Cpu size={24} />
                            </div>
                            <ArrowRight size={20} color="#CCC" />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <p style={{ color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Performance</p>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em' }}>
                                {stats.activeSessions} Sessions
                            </h2>
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                {stats.mcpTools} Tools Active
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Enhanced Chat Panel */}
            <aside className="chat-panel">
                <div className="chat-header">
                    <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Live Feed</h3>
                    <div className="status-badge">
                        <span className="status-dot"></span>
                        {connectionStatus === 'connected' ? 'CONNECTED' : connectionStatus.toUpperCase()}
                    </div>
                </div>

                <div className="messages">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className={`msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                            >
                                {m.text}
                                {m.timestamp && (
                                    <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '8px' }}>
                                        {m.timestamp.toLocaleTimeString()}
                                    </span>
                                )}
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
                        disabled={connectionStatus !== 'connected'}
                    />
                    <button 
                        className="send-btn" 
                        onClick={handleSend}
                        disabled={connectionStatus !== 'connected'}
                        style={{ opacity: connectionStatus === 'connected' ? 1 : 0.5 }}
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </aside>
        </div>
    );
}
