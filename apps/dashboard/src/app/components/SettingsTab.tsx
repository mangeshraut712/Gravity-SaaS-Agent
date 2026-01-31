'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SettingsTabProps {
    darkMode: boolean;
}

export default function SettingsTab({ darkMode }: SettingsTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Settings
            </h2>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    General Settings
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Platform Name
                        </label>
                        <input
                            type="text"
                            defaultValue="GravityOS"
                            className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Admin Email
                        </label>
                        <input
                            type="email"
                            defaultValue="admin@gravityos.com"
                            className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
