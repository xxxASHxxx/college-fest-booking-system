import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import './Breadcrumb.css';

const Breadcrumb = ({ items }) => {
    const location = useLocation();

    // Auto-generate breadcrumbs if items not provided
    const breadcrumbs = items || generateBreadcrumbs(location.pathname);

    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
                <li className="breadcrumb-item">
                    <Link to="/" className="breadcrumb-link">
                        <FiHome />
                    </Link>
                </li>

                {breadcrumbs.map((item, index) => (
                    <li key={index} className="breadcrumb-item">
                        <FiChevronRight className="breadcrumb-separator" />
                        {item.path && index < breadcrumbs.length - 1 ? (
                            <Link to={item.path} className="breadcrumb-link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb-current">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

// Generate breadcrumbs from pathname
const generateBreadcrumbs = (pathname) => {
    const paths = pathname.split('/').filter(Boolean);

    return paths.map((path, index) => {
        const route = '/' + paths.slice(0, index + 1).join('/');
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return {
            label,
            path: index < paths.length - 1 ? route : null,
        };
    });
};

export default Breadcrumb;
