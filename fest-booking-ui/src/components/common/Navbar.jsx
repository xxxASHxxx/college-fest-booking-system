import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    Calendar,
    Ticket,
    LayoutDashboard,
    LogOut,
    User,
    ShoppingCart,
    Home,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/events', label: 'Events', icon: Calendar },
        ...(isAuthenticated
            ? [{ path: '/my-tickets', label: 'My Tickets', icon: Ticket }]
            : []),
    ];

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
                    ? 'bg-bg-card/95 backdrop-blur-xl border-b border-border shadow-lg'
                    : 'bg-transparent backdrop-blur-sm'
                }
      `}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                        <img
                            src="/festify.png"
                            alt="FESTIFY logo"
                            className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-17 lg:w-17 object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <span className="font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-teal-accent to-warm-highlight bg-clip-text text-transparent">
                            FESTIFY
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${location.pathname === link.path
                                        ? 'bg-teal-accent/20 text-teal-accent shadow-glow-teal'
                                        : 'text-text-secondary hover:text-teal-accent hover:bg-bg-card'
                                    }
                `}
                            >
                                <link.icon size={18} />
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${location.pathname.startsWith('/admin')
                                        ? 'bg-teal-accent/20 text-teal-accent shadow-glow-accent'
                                        : 'text-text-secondary hover:text-teal-accent hover:bg-bg-card'
                                    }
                `}
                            >
                                <LayoutDashboard size={18} />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons / Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* Cart Icon */}
                                <button className="relative p-2 text-text-secondary hover:text-teal-accent hover:bg-bg-card rounded-xl transition-all">
                                    <ShoppingCart size={22} />
                                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        0
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card border border-border hover:border-teal-accent transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-accent to-primary-dark flex items-center justify-center text-white font-medium">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-text-primary text-sm font-medium hidden lg:block">
                                            {user?.name}
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                                            <div className="p-4 border-b border-border">
                                                <p className="text-text-primary font-medium">{user?.name}</p>
                                                <p className="text-text-muted text-sm">{user?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg-darker hover:text-teal-accent rounded-lg transition-all"
                                                >
                                                    <User size={18} />
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/my-tickets"
                                                    className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg-darker hover:text-teal-accent rounded-lg transition-all"
                                                >
                                                    <Ticket size={18} />
                                                    My Tickets
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-all"
                                                >
                                                    <LogOut size={18} />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-text-primary hover:bg-bg-card rounded-lg transition-all"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-bg-card border-t border-border animate-slideDown">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  transition-all duration-300
                  ${location.pathname === link.path
                                        ? 'bg-teal-accent/20 text-teal-accent'
                                        : 'text-text-secondary hover:bg-bg-darker hover:text-teal-accent'
                                    }
                `}
                            >
                                <link.icon size={20} />
                                {link.label}
                            </Link>
                        ))}

                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:bg-bg-darker hover:text-teal-accent transition-all"
                            >
                                <LayoutDashboard size={20} />
                                Admin Dashboard
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                <div className="pt-4 mt-4 border-t border-border">
                                    <div className="px-4 py-2">
                                        <p className="text-text-primary font-medium">{user?.name}</p>
                                        <p className="text-text-muted text-sm">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-text-secondary hover:bg-bg-darker hover:text-teal-accent transition-all"
                                    >
                                        <User size={20} />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base text-error hover:bg-error/10 transition-all"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 mt-4 border-t border-border space-y-2">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
