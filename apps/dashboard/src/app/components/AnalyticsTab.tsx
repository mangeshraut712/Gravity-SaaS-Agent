'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnalyticsTabProps {
    darkMode: boolean;
}

export default function AnalyticsTab({ darkMode }: AnalyticsTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analytics Dashboard
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analytics Overview */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Performance Analytics
                    </h3>
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response Time</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>245ms</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>98.5%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Error Rate</span>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>1.5%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '1.5%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Statistics */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Usage Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1,234</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily Users</div>
                        </div>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>5,678</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Requests</div>
                        </div>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>89.2%</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
                        </div>
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>2.3s</div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Load Time</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>System Update</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed successfully</div>
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>2 mins ago</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>High Traffic Alert</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Auto-scaling activated</div>
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>15 mins ago</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Backup Completed</div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All systems backed up</div>
                                </div>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Options */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Export Data
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className={`px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                        } text-white transition-colors`}>
                            Export CSV
                        </button>
                        <button className={`px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}>
                            Export JSON
                        </button>
                        <button className={`px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                        } text-white transition-colors`}>
                            Export PDF
                        </button>
                        <button className={`px-4 py-2 rounded-lg ${
                            darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                        } ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>
                            Schedule Report
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
