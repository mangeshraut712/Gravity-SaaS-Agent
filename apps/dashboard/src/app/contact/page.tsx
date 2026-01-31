'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Send, Sparkles, MessageSquare, Github, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-20">
                {/* Header */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-12 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 mb-6">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-medium text-gray-700">We&apos;d love to hear from you</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight">
                        Get in <span className="text-violet-600">touch</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions about Gravity? We&apos;re here to help you launch your AI agents.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-black mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-black">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-black">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-black">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full h-12 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-lg">
                            <h3 className="text-xl font-bold text-black mb-6">Other ways to reach us</h3>
                            <div className="space-y-5">
                                <a href="mailto:support@gravity-ai.com" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <Mail className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-black">Email</p>
                                        <p className="text-violet-600 group-hover:text-violet-700 transition-colors">support@gravity-ai.com</p>
                                    </div>
                                </a>

                                <a href="https://twitter.com/gravity_ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                                        <Twitter className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-black">Twitter</p>
                                        <p className="text-violet-600 group-hover:text-violet-700 transition-colors">@gravity_ai</p>
                                    </div>
                                </a>

                                <a href="https://github.com/mangeshraut712/Gravity-SaaS-Agent" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center shadow-lg">
                                        <Github className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-black">GitHub</p>
                                        <p className="text-violet-600 group-hover:text-violet-700 transition-colors">Gravity-SaaS-Agent</p>
                                    </div>
                                </a>

                                <a href="https://discord.gg/gravity" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-black">Discord</p>
                                        <p className="text-violet-600 group-hover:text-violet-700 transition-colors">Join our server</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200">
                            <h4 className="font-bold text-black mb-2">⚡ Quick Response Time</h4>
                            <p className="text-sm text-gray-600">
                                We typically respond to all inquiries within 24 hours during business days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
