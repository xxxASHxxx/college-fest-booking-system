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
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${isScrolled
                ? 'backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-xl'
                : 'backdrop-blur-md bg-transparent'
            }
      `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-white font-bold text-xl sm:text-2xl hover:scale-105 transition-transform"
                    >
                        <Calendar className="text-purple-400" size={28} />
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              FestBook
            </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300
                  ${location.pathname === link.path
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
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
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-300
                  ${location.pathname.startsWith('/admin')
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
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
                                <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                    <ShoppingCart size={22} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    0
                  </span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white text-sm font-medium hidden lg:block">
                      {user?.name}
                    </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                                            <div className="p-4 border-b border-white/10">
                                                <p className="text-white font-medium">{user?.name}</p>
                                                <p className="text-white/60 text-sm">{user?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    <User size={18} />
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/my-tickets"
                                                    className="flex items-center gap-3 px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    <Ticket size={18} />
                                                    My Tickets
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                        className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden backdrop-blur-xl bg-white/10 border-t border-white/20 animate-slideDown">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  transition-all duration-300
                  ${location.pathname === link.path
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/80 hover:bg-white/10'
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
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:bg-white/10 transition-all"
                            >
                                <LayoutDashboard size={20} />
                                Admin Dashboard
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <div className="px-4 py-2">
                                        <p className="text-white font-medium">{user?.name}</p>
                                        <p className="text-white/60 text-sm">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-white/80 hover:bg-white/10 transition-all"
                                    >
                                        <User size={20} />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base text-red-400 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
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
