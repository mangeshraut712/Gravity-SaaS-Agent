import Link from 'next/link';
import { ArrowLeft, Mail, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors mb-12"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="card p-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
                            Get in <span className="text-gradient-violet-indigo">touch</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions about Gravity? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        className="input-modern w-full"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        className="input-modern w-full"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="input-modern w-full"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        className="input-modern w-full resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Other ways to reach us</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                                            <Mail className="h-5 w-5 text-violet-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Email</p>
                                            <a
                                                href="mailto:support@gravity-ai.com"
                                                className="text-violet-600 hover:text-violet-700 transition-colors"
                                            >
                                                support@gravity-ai.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                                            <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Twitter</p>
                                            <a
                                                href="https://twitter.com/gravity_ai"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:text-violet-700 transition-colors"
                                            >
                                                @gravity_ai
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">GitHub</p>
                                            <a
                                                href="https://github.com/mangeshraut712/Gravity-SaaS-Agent"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:text-violet-700 transition-colors"
                                            >
                                                Gravity-SaaS-Agent
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                                            <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Discord</p>
                                            <a
                                                href="https://discord.gg/gravity"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-violet-600 hover:text-violet-700 transition-colors"
                                            >
                                                Join our server
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-6 border border-violet-100">
                                <h4 className="font-bold text-gray-900 mb-2">Quick Response Time</h4>
                                <p className="text-sm text-gray-600">
                                    We typically respond to all inquiries within 24 hours during business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
