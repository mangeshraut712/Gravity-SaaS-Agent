'use client';

import React from 'react';
import './landing.css';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <nav className="nav">
                <div className="logo">GravityBot.ai</div>
                <div className="nav-links">
                    <a href="#">Solutions</a>
                    <a href="#">Integrations</a>
                    <a href="#">Pricing</a>
                    <a href="/login" className="btn-black">Get Started</a>
                </div>
            </nav>

            <section className="hero">
                <div className="badge">NOW IN PUBLIC BETA — 2.0</div>
                <h1 className="title">Personal AI<br />with Hands.</h1>
                <p className="subtitle">
                    The autonomous agent platform that connects your digital life.
                    Manage files, browse the web, and automate your workflows through WhatsApp.
                </p>
                <div className="cta-group">
                    <a href="/dashboard" className="btn-large primary">Go to Console</a>
                    <a href="#demo" className="btn-large secondary">Watch Demo</a>
                </div>

                <div className="preview">
                    <img src="https://gemini-static.googleusercontent.com/antigravity/brain/3514a195-44dd-4874-8386-9b01fce0ab04/gravity_bot_dashboard_final_1769432596427.png" alt="Dashboard Preview" />
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <div className="feature-icon">🌿</div>
                    <h3 className="feature-title">Multi-Tenant Core</h3>
                    <p className="feature-desc">Dedicated isolated environments for every user. Your data is your own.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3 className="feature-title">MCP Skill Engine</h3>
                    <p className="feature-desc">Instantly add capabilities like GitHub, Google Search, or Stripe through the MCP protocol.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💓</div>
                    <h3 className="feature-title">Proactive Intelligence</h3>
                    <p className="feature-desc">Heartbeat-aware agents that reach out when it matters most.</p>
                </div>
            </section>

            <footer style={{ padding: '80px 0', borderTop: '1px solid #EEE', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                © 2026 Gravity Intelligence Corp. Built for the future of work.
            </footer>
        </div>
    );
}
