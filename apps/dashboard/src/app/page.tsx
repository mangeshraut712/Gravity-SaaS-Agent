'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Sparkles, ArrowRight, Check, Menu, X,
    Bot, MessageSquare, Zap, Shield, Globe, TrendingUp,
    Play, Star, BarChart3, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// NAVBAR COMPONENT
// ============================================
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-4'
                : 'bg-white py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-black text-black tracking-tight">Gravity</span>
                        <span className="text-[9px] text-violet-600 block uppercase tracking-[0.2em] font-bold -mt-1">AI Agents</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-black"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-200"
                    >
                        <nav className="p-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-lg font-medium text-gray-700 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 space-y-3 border-t border-gray-200">
                                <Link href="/login" className="block text-center py-3 text-gray-700">Sign In</Link>
                                <Link href="/signup" className="block text-center py-3 rounded-xl bg-black text-white font-bold">
                                    Get Started Free
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 bg-white">
            <div className="max-w-6xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 mb-8"
                >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">Now with GPT-4o & Claude 3.5 Support</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tight leading-[0.95]"
                >
                    Launch AI Agents
                    <br />
                    <span className="text-violet-600">in 5 Minutes</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                >
                    Build, deploy, and scale production-ready AI agents for customer support,
                    sales automation, and beyond. No coding required.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/signup"
                        className="group px-8 py-4 rounded-2xl bg-black text-white text-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-3"
                    >
                        Start Building Free
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="group px-8 py-4 rounded-2xl bg-gray-100 border border-gray-200 text-black text-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-3">
                        <Play className="h-5 w-5" />
                        Watch Demo
                    </button>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">2,500+ businesses trust Gravity</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-600">4.9/5 from 500+ reviews</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
    const features = [
        {
            icon: Bot,
            title: 'AI-Powered Agents',
            description: 'Deploy intelligent agents that understand context and handle complex conversations autonomously.',
            color: 'bg-violet-600'
        },
        {
            icon: Globe,
            title: 'Multi-Channel Deployment',
            description: 'Connect to WhatsApp, Telegram, Slack, Discord, and web chat from a single platform.',
            color: 'bg-blue-600'
        },
        {
            icon: Zap,
            title: 'Instant Setup',
            description: 'Go from idea to production in minutes with pre-built templates and one-click deployment.',
            color: 'bg-amber-500'
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'SOC 2 compliant with end-to-end encryption and role-based access control.',
            color: 'bg-emerald-600'
        },
        {
            icon: BarChart3,
            title: 'Real-Time Analytics',
            description: 'Track conversations and optimize agent performance with detailed insights.',
            color: 'bg-pink-600'
        },
        {
            icon: Layers,
            title: 'Custom Workflows',
            description: 'Build sophisticated automation flows with our visual workflow editor.',
            color: 'bg-indigo-600'
        }
    ];

    return (
        <section id="features" className="py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-violet-600 font-bold uppercase tracking-[0.2em] text-sm">Features</span>
                    <h2 className="mt-4 text-4xl md:text-6xl font-black text-black tracking-tight">
                        Everything You Need to
                        <br />
                        <span className="text-violet-600">Scale Conversations</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-3xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                        >
                            <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
    const steps = [
        { step: '01', title: 'Choose a Template', description: 'Start with a pre-built template or build from scratch.' },
        { step: '02', title: 'Customize Your Agent', description: 'Define personality, knowledge base, and workflows.' },
        { step: '03', title: 'Deploy Everywhere', description: 'Launch to WhatsApp, web chat, or API with one click.' }
    ];

    return (
        <section id="how-it-works" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-violet-600 font-bold uppercase tracking-[0.2em] text-sm">How It Works</span>
                    <h2 className="mt-4 text-4xl md:text-6xl font-black text-black tracking-tight">
                        Three Steps to AI-Powered Growth
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative p-8 rounded-3xl bg-gray-50 border border-gray-200"
                        >
                            <div className="text-6xl font-black text-violet-100 mb-4">{item.step}</div>
                            <h3 className="text-2xl font-bold text-black mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// PRICING SECTION
// ============================================
function PricingSection() {
    const plans = [
        {
            name: 'Starter',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out Gravity',
            features: ['1 AI Agent', '100 messages/month', 'Web Chat Widget', 'Email Support'],
            cta: 'Start Free',
            popular: false
        },
        {
            name: 'Pro',
            price: '$49',
            period: '/month',
            description: 'For growing businesses',
            features: ['5 AI Agents', '5,000 messages/month', 'WhatsApp & Telegram', 'API Access', 'Priority Support'],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'For large organizations',
            features: ['Unlimited Agents', 'Unlimited Messages', 'All Channels', 'Dedicated Support', 'SLA Guarantee'],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-violet-600 font-bold uppercase tracking-[0.2em] text-sm">Pricing</span>
                    <h2 className="mt-4 text-4xl md:text-6xl font-black text-black tracking-tight">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-6 text-xl text-gray-600">Start free and scale as you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-3xl border ${plan.popular
                                    ? 'bg-white border-violet-300 shadow-xl'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-violet-600 text-xs font-bold text-white uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                            <p className="text-gray-600 mt-2">{plan.description}</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-5xl font-black text-black">{plan.price}</span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                                        <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup"
                                className={`mt-8 block text-center py-4 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-gray-100 text-black border border-gray-200 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// FOOTER COMPONENT
// ============================================
function Footer() {
    const footerLinks = {
        Product: ['Features', 'Pricing', 'Templates', 'API'],
        Company: ['About', 'Blog', 'Careers', 'Press'],
        Resources: ['Documentation', 'Help Center', 'Community'],
        Legal: ['Privacy', 'Terms', 'Security']
    };

    return (
        <footer className="py-20 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-6 gap-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black text-black">Gravity</span>
                        </Link>
                        <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-xs">
                            The fastest way to launch production-ready AI agents for your business.
                        </p>
                    </div>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">© 2026 Gravity AI. All rights reserved.</p>
                    <p className="text-sm text-gray-500">Made with 💜 for the future of work</p>
                </div>
            </div>
        </footer>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function HomePage() {
    return (
        <div className="bg-white text-black">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <PricingSection />
            <Footer />
        </div>
    );
}
