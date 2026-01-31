'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChannelStatus {
    id: string;
    name: string;
    type: 'whatsapp' | 'telegram' | 'slack' | 'discord' | 'signal' | 'teams' | 'webchat';
    status: 'connected' | 'disconnected' | 'error';
    lastActivity?: Date;
    messageCount: number;
    errorCount: number;
    latency: number;
    metadata?: Record<string, any>;
}

interface ChannelsTabProps {
    channels: ChannelStatus[];
    darkMode: boolean;
}

export default function ChannelsTab({ channels, darkMode }: ChannelsTabProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return '#10B981';
            case 'disconnected': return '#EF4444';
            case 'error': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'whatsapp':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.23-1.624l-.808-1.336c-.425-.644-1.072-1.103-1.82-1.103l-.654.003c-1.657.006-3.225.649-4.371 1.649a9.403 9.403 0 0 1 4.642 4.642c1.373 1.398 3.194 1.753 5.034 1.549l.654-.003c.748 0 1.395-.459 1.82-1.103l.808-1.336c.472-.757 1.933-1.475 2.23-1.624.145-.073.26-.15.375-.15l1.426-.006c.613 0 1.175.197 1.632.531l2.612 2.612c.334.457.531 1.019.531 1.632l-.006 1.426c0 .115-.077.23-.15.375"/>
                    </svg>
                );
            case 'telegram':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.56l-.84 8.4c-.05.47-.45.83-.92.83l-2.4-.6-8.4-2.1c-.47-.12-.85.05-.92.52l.84 8.4c.07.47.45.83.92.83l2.4-.6c.47-.12.85-.05.92-.52l.84-8.4c.07-.47-.05-.85-.52-.92z"/>
                    </svg>
                );
            case 'slack':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM11.5 9c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM6.5 9c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM8.5 6c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM3.5 6c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM11.5 3c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM14.5 3c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM17.5 6c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM20.5 9c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5zM17.5 12c-.83 0-1.5-.67-1.5-1.5v1c0 .83.67 1.5 1.5 1.5z"/>
                    </svg>
                );
            default:
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Channel Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {channels.map((channel, index) => (
                    <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    {getStatusIcon(channel.type)}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {channel.name}
                                    </h3>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {channel.type.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: getStatusColor(channel.status) }}></div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(channel.status) }}></div>
                                    <span className={`text-sm font-medium`} style={{ color: getStatusColor(channel.status) }}>
                                        {channel.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {channel.messageCount?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Errors</span>
                                <span className={`text-sm font-medium text-red-500`}>
                                    {channel.errorCount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latency</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {channel.latency}s
                                </span>
                            </div>
                            {channel.lastActivity && (
                                <div className="flex justify-between">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Activity</span>
                                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {channel.lastActivity.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {channel.metadata && (
                            <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <h4 className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Metadata</h4>
                                <div className="space-y-1">
                                    {Object.entries(channel.metadata).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key}:</span>
                                            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                            <button className={`flex-1 px-3 py-2 rounded-lg ${
                                darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                            } text-white transition-colors text-sm`}>
                                Configure
                            </button>
                            <button className={`px-3 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            } ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors text-sm`}>
                                Test
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Channel Summary */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Channel Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {channels.length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Channels
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-2xl font-bold text-green-500`}>
                            {channels.filter(c => c.status === 'connected').length}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Connected
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {channels.reduce((sum, c) => sum + c.messageCount, 0).toLocaleString()}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Messages
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-2xl font-bold text-red-500`}>
                            {channels.reduce((sum, c) => sum + c.errorCount, 0)}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Errors
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
