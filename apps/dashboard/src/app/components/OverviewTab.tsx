'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';

interface SystemStats {
    status: 'operational' | 'degraded' | 'offline';
    uptime: number;
    activeConnections: number;
    totalRequests: number;
    errorRate: number;
    responseTime: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkIO: number;
}

interface OverviewTabProps {
    systemStats: SystemStats;
    darkMode: boolean;
    totalMessages: number;
    performanceData: any[];
}

export default function OverviewTab({ systemStats, darkMode, totalMessages, performanceData }: OverviewTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return '#10B981';
            case 'degraded': return '#F59E0B';
            case 'offline': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                            <svg className="text-green-600" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                        </div>
                        <span className={`text-sm font-medium`} style={{ color: getStatusColor(systemStats.status) }}>
                            {systemStats.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatUptime(systemStats.uptime)}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <svg className="text-blue-600" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <svg className="text-green-500" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <polyline points="23 6 13.5 15.5 16 19"/>
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78"/>
                        </svg>
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(systemStats.activeConnections)}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Connections</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                            <svg className="text-purple-600" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <span className={`text-sm font-medium ${totalMessages > 1000 ? 'text-red-500' : 'text-green-500'}`}>
                            {formatNumber(totalMessages)}
                        </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(systemStats.totalRequests)}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                            <svg className="text-orange-600" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                <rect x="6" y="3" width="12" height="4" rx="1" ry="1"/>
                            </svg>
                        </div>
                        <span className={`text-sm font-medium ${systemStats.cpuUsage > 80 ? 'text-red-500' : 'text-green-500'}`}>
                            {systemStats.cpuUsage.toFixed(1)}%
                        </span>
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatBytes(systemStats.memoryUsage)}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Memory Usage</p>
                </motion.div>
            </div>

            {/* Performance Chart */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Performance Metrics
                    </h3>
                    <select 
                        value="1h"
                        className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                        <option value="1h">Last Hour</option>
                        <option value="6h">Last 6 Hours</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                    </select>
                </div>
                
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                            <XAxis dataKey="time" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                            <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: darkMode ? '#F3F4F6' : '#111827'
                                }} 
                            />
                            <Area
                                type="monotone"
                                dataKey="requests"
                                stroke="#8B5CF6"
                                fillOpacity={1}
                                fill="url(#colorTokens)"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="errors"
                                stroke="#EF4444"
                                strokeWidth={2}
                                dot={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
