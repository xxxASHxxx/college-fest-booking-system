import React from 'react';
import { Link } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Instagram,
    Linkedin,
    ArrowRight,
    Sparkles,
    Calendar,
    Ticket,
    Users,
    Heart,
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20" style={{ background: '#03071E', borderTop: '1px solid rgba(255, 186, 8, 0.12)' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-4">
                            <img
                                src="/festify.png"
                                alt="FESTIFY logo"
                                className="h-8 w-8 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #FFBA08, #FAA307)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                FESTIFY
                            </span>
                        </Link>
                        <p className="text-text-secondary mb-6 leading-relaxed text-sm">
                            The official event booking platform for SRM Institute of Science and Technology, Kattankulathur Campus.
                            Discover, book, and experience the best college fest events — all in one place.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="p-2.5 rounded-xl transition-all"
                                style={{
                                    background: 'rgba(255, 186, 8, 0.08)',
                                    border: '1px solid rgba(255, 186, 8, 0.15)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 186, 8, 0.18)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 186, 8, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.15)';
                                }}
                            >
                                <Instagram size={18} style={{ color: '#FAA307' }} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="p-2.5 rounded-xl transition-all"
                                style={{
                                    background: 'rgba(255, 186, 8, 0.08)',
                                    border: '1px solid rgba(255, 186, 8, 0.15)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 186, 8, 0.18)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 186, 8, 0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.15)';
                                }}
                            >
                                <Linkedin size={18} style={{ color: '#FAA307' }} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                            <Sparkles size={16} style={{ color: '#FAA307' }} />
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Browse Events', path: '/events', icon: <Calendar size={14} /> },
                                { label: 'My Tickets', path: '/my-tickets', icon: <Ticket size={14} /> },
                                { label: 'Technical Events', path: '/events?category=technical', icon: <ArrowRight size={14} /> },
                                { label: 'Gaming Events', path: '/events?category=gaming', icon: <ArrowRight size={14} /> },
                                { label: 'Hackathons', path: '/events?category=hackathon', icon: <ArrowRight size={14} /> },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2 text-sm transition-colors"
                                        style={{ color: 'rgba(255,255,255,0.5)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FAA307'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-5 flex items-center gap-2">
                            <Mail size={16} style={{ color: '#FAA307' }} />
                            Get in Touch
                        </h3>
                        <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <a
                                href="mailto:events@srmist.edu.in"
                                className="flex items-center gap-2 transition-colors"
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#FAA307'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                                <Mail size={14} style={{ color: '#FAA307', flexShrink: 0 }} />
                                events@srmist.edu.in
                            </a>
                            <a
                                href="tel:+919080076065"
                                className="flex items-center gap-2 transition-colors"
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#FAA307'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                                <Phone size={14} style={{ color: '#FAA307', flexShrink: 0 }} />
                                +91 90800 76065
                            </a>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} style={{ color: '#FAA307', flexShrink: 0, marginTop: '2px' }} />
                                <span>
                                    SRM IST, Kattankulathur Campus,
                                    <br />
                                    Chengalpattu, Tamil Nadu 603203
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255, 186, 8, 0.08)' }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            © {currentYear} FESTIFY — SRM Institute of Science and Technology. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
                            <span>•</span>
                            <Link to="/my-tickets" className="hover:text-white transition-colors">My Tickets</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Creator Attribution */}
            <div className="py-5 text-center" style={{ borderTop: '1px solid rgba(255, 186, 8, 0.06)' }}>
                <p className="text-xs tracking-wider flex items-center justify-center gap-1.5" style={{ color: 'rgba(248, 248, 248, 0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '500' }}>
                    Crafted with
                    <Heart size={12} style={{ color: '#ef4444' }} fill="#ef4444" />
                    by{' '}
                    <span style={{ background: 'linear-gradient(135deg, #FFBA08, #FAA307)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>
                        Ashmit
                    </span>
                    {' '}&{' '}
                    <span style={{ background: 'linear-gradient(135deg, #FFBA08, #FAA307)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>
                        Dhwani
                    </span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
