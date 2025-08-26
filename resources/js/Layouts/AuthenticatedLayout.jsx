import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import '../../css/dashboard.css'

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            <div className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <h4 className="mb-0">
                        <i className="fas fa-sticky-note me-2"></i>
                        <span className="sidebar-text">NotePad</span>
                    </h4>
                </div>
                <div className="sidebar-menu">
                    <a href="#" className="active">
                        <i className="fas fa-home"></i>
                        <span className="sidebar-text">Dashboard</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-sticky-note"></i>
                        <span className="sidebar-text">Tüm Notlar</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-star"></i>
                        <span className="sidebar-text">Favoriler</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-archive"></i>
                        <span className="sidebar-text">Arşiv</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-cog"></i>
                        <span className="sidebar-text">Ayarlar</span>
                    </a>
                </div>
            </div>
            <main>{children}</main>
        </div>
    );
}
