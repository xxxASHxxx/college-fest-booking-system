import React from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
} from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../utils/constants';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'Careers', path: '/careers' },
            { label: 'Press', path: '/press' },
        ],
        support: [
            { label: 'Help Center', path: '/help' },
            { label: 'Safety', path: '/safety' },
            { label: 'Terms of Service', path: '/terms' },
            { label: 'Privacy Policy', path: '/privacy' },
        ],
        events: [
            { label: 'Browse Events', path: '/events' },
            { label: 'Featured Events', path: '/events?featured=true' },
            { label: 'Upcoming Events', path: '/events?status=upcoming' },
            { label: 'Past Events', path: '/events?status=past' },
        ],
    };

    const socialIcons = [
        { Icon: Facebook, href: SOCIAL_LINKS.FACEBOOK, label: 'Facebook' },
        { Icon: Twitter, href: SOCIAL_LINKS.TWITTER, label: 'Twitter' },
        { Icon: Instagram, href: SOCIAL_LINKS.INSTAGRAM, label: 'Instagram' },
        { Icon: Linkedin, href: SOCIAL_LINKS.LINKEDIN, label: 'LinkedIn' },
        { Icon: Youtube, href: SOCIAL_LINKS.YOUTUBE, label: 'YouTube' },
    ];

    return (
        <footer className="relative mt-20 bg-bg-darker border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-4">
                            <img
                                src="/festify.png"
                                alt="FESTIFY logo"
                                className="h-8 w-8 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <span className="bg-gradient-to-r from-teal-accent to-warm-highlight bg-clip-text text-transparent">
                                FESTIFY
                            </span>
                        </Link>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Your ultimate platform for discovering and booking tickets to the most exciting
                            college fest events. Experience entertainment like never before!
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-text-secondary">
                                <Mail size={18} className="mt-1 flex-shrink-0" />
                                <a
                                    href={`mailto:${CONTACT_INFO.EMAIL}`}
                                    className="hover:text-teal-accent transition-colors"
                                >
                                    {CONTACT_INFO.EMAIL}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-text-secondary">
                                <Phone size={18} className="mt-1 flex-shrink-0" />
                                <a
                                    href={`tel:${CONTACT_INFO.PHONE}`}
                                    className="hover:text-teal-accent transition-colors"
                                >
                                    {CONTACT_INFO.PHONE}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-text-secondary">
                                <MapPin size={18} className="mt-1 flex-shrink-0" />
                                <span>{CONTACT_INFO.ADDRESS}</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-text-secondary hover:text-teal-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-text-secondary hover:text-teal-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Events Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold text-lg mb-4">Events</h3>
                        <ul className="space-y-2">
                            {footerLinks.events.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-text-secondary hover:text-teal-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-text-primary font-semibold text-lg mb-2">
                                Subscribe to our newsletter
                            </h3>
                            <p className="text-text-secondary text-sm">
                                Get the latest event updates and exclusive offers!
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 rounded-xl bg-bg-input border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-teal-accent transition-all"
                            />
                            <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-accent to-primary-dark text-white font-medium hover:shadow-glow-accent transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-text-muted text-sm">
                        © {currentYear} FESTIFY. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialIcons.map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="p-2 rounded-lg bg-bg-card text-text-secondary hover:bg-teal-accent/20 hover:text-teal-accent transition-all"
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
