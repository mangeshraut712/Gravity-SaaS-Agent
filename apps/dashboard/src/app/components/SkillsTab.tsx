'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

interface Skill {
    id: string;
    name: string;
    description: string;
    category: 'utility' | 'productivity' | 'automation' | 'communication' | 'development';
    status: 'active' | 'inactive' | 'error';
    usageCount: number;
    successRate: number;
    lastUsed?: Date;
    metadata?: Record<string, any>;
}

interface SkillsTabProps {
    skills: Skill[];
    darkMode: boolean;
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6', '#F97316'];

export default function SkillsTab({ skills, darkMode }: SkillsTabProps) {
    const pieData = skills.map(skill => ({
        name: skill.name,
        value: skill.usageCount
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Skills Platform
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills List */}
                <div className="space-y-4">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {skill.name}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    skill.category === 'utility' ? 'bg-blue-100 text-blue-800' :
                                    skill.category === 'productivity' ? 'bg-green-100 text-green-800' :
                                    skill.category === 'automation' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                    {skill.category}
                                </span>
                            </div>
                            
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                                {skill.description}
                            </p>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Executions</span>
                                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {skill.usageCount}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</span>
                                    <span className={`text-sm font-medium text-green-500`}>
                                        {skill.successRate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</span>
                                    <span className={`text-sm font-medium ${
                                        skill.status === 'active' ? 'text-green-500' :
                                        skill.status === 'inactive' ? 'text-gray-500' :
                                        'text-red-500'
                                    }`}>
                                        {skill.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${skill.successRate}%` }}
                                ></div>
                            </div>
                            
                            <button className={`w-full mt-4 px-4 py-2 rounded-lg ${
                                darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                            } text-white transition-colors`}>
                                Configure
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Skills Usage Chart */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Skills Usage Distribution
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </PieChart>
                                <Tooltip />
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
