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
        <footer className="relative mt-20 backdrop-blur-xl bg-white/5 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl mb-4">
                            <Calendar className="text-purple-400" size={32} />
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                FestBook
              </span>
                        </Link>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            Your ultimate platform for discovering and booking tickets to the most exciting
                            college fest events. Experience entertainment like never before!
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-white/70">
                                <Mail size={18} className="mt-1 flex-shrink-0" />
                                <a
                                    href={`mailto:${CONTACT_INFO.EMAIL}`}
                                    className="hover:text-white transition-colors"
                                >
                                    {CONTACT_INFO.EMAIL}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-white/70">
                                <Phone size={18} className="mt-1 flex-shrink-0" />
                                <a
                                    href={`tel:${CONTACT_INFO.PHONE}`}
                                    className="hover:text-white transition-colors"
                                >
                                    {CONTACT_INFO.PHONE}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-white/70">
                                <MapPin size={18} className="mt-1 flex-shrink-0" />
                                <span>{CONTACT_INFO.ADDRESS}</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Events Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Events</h3>
                        <ul className="space-y-2">
                            {footerLinks.events.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-white font-semibold text-lg mb-2">
                                Subscribe to our newsletter
                            </h3>
                            <p className="text-white/70 text-sm">
                                Get the latest event updates and exclusive offers!
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="px-6 py-2 rounded-xl backdrop-blur-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/60 text-sm">
                        © {currentYear} FestBook. All rights reserved.
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
                                className="p-2 rounded-lg backdrop-blur-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
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
