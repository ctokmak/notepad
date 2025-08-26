import React, { useEffect, useState } from 'react';

// A helper component to manage the component-specific styles.
const ComponentStyles = () => {
    const styles = `
    :root {
        --primary-color: #667eea;
        --secondary-color: #764ba2;
        --accent-color: #f093fb;
        --text-dark: #2d3748;
        --text-light: #718096;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
    }

    .gradient-bg {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    }

    .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        /* --- FIX: Added padding-top to push content below the fixed navbar --- */
        padding-top: 80px; 
    }

    .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
    }

    .hero-content {
        position: relative;
        z-index: 2;
    }

    .feature-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: none;
        height: 100%;
    }

    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }

    .feature-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: white;
        font-size: 1.5rem;
    }

    .btn-custom {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border: none;
        color: white;
        padding: 12px 30px;
        border-radius: 50px;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-custom:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        color: white;
    }

    .btn-outline-custom {
        border: 2px solid white;
        color: white;
        padding: 12px 30px;
        border-radius: 50px;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        transition: all 0.3s ease;
        background: transparent;
    }

    .btn-outline-custom:hover {
        background: white;
        color: var(--primary-color);
        transform: translateY(-2px);
    }

    .navbar-brand {
        font-weight: 700;
        font-size: 1.5rem;
    }
    
    .navbar.scrolled {
        background-color: rgba(102, 126, 234, 0.95) !important;
        transition: background-color 0.3s ease-in-out;
    }


    .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }

    .floating-elements::before,
    .floating-elements::after {
        content: '';
        position: absolute;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
    }

    .floating-elements::before {
        width: 80px;
        height: 80px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
    }

    .floating-elements::after {
        width: 120px;
        height: 120px;
        top: 60%;
        right: 15%;
        animation-delay: 3s;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }

    /* Overriding .text-muted from bootstrap to use our variable */
    .text-muted {
        color: var(--text-light) !important;
    }

    .section-padding {
        padding: 80px 0;
    }
  `;
    return <style>{styles}</style>;
};


const Welcome = () => {

    // Effect to handle dynamic loading of external stylesheets and scripts
    useEffect(() => {
        // Add Bootstrap CSS
        const bootstrapCSS = document.createElement('link');
        bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        bootstrapCSS.rel = "stylesheet";
        document.head.appendChild(bootstrapCSS);

        // Add Font Awesome CSS
        const fontAwesomeCSS = document.createElement('link');
        fontAwesomeCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
        fontAwesomeCSS.rel = "stylesheet";
        document.head.appendChild(fontAwesomeCSS);

        // Add Bootstrap JS Bundle
        const bootstrapJS = document.createElement('script');
        bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
        bootstrapJS.async = true;
        document.body.appendChild(bootstrapJS);

        // Cleanup function to remove added elements on component unmount
        return () => {
            if (document.head.contains(bootstrapCSS)) document.head.removeChild(bootstrapCSS);
            if (document.head.contains(fontAwesomeCSS)) document.head.removeChild(fontAwesomeCSS);
            if (document.body.contains(bootstrapJS)) document.body.removeChild(bootstrapJS);
        };
    }, []);

    // Effect for navbar background change on scroll
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scrolling function for anchor links
    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            <ComponentStyles />

            {/* --- FIX: Added a conditional class for the scroll effect --- */}
            <nav className={`navbar navbar-expand-lg navbar-dark gradient-bg fixed-top ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <a className="navbar-brand" href="/"><i className="fas fa-sticky-note me-2"></i>NotePad</a>

                    {/* This is the "hamburger" button for small screens */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* This div contains the links and collapses on small screens */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#features" onClick={handleSmoothScroll}>Özellikler</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#about" onClick={handleSmoothScroll}>Hakkında</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn btn-outline-custom ms-2" href="/login">Giriş Yap</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <section className="hero-section gradient-bg text-white">
                <div className="floating-elements"></div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1 className="display-4 fw-bold mb-4">
                                    Notlarınızı <span className="text-warning">Dijitalleştirin</span>
                                </h1>
                                <p className="lead mb-5">
                                    Modern ve kullanıcı dostu arayüzü ile notlarınızı organize edin,
                                    düzenleyin ve her yerden erişin. Artık hiçbir fikrini kaybetmeyin!
                                </p>
                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <a href="/register" className="btn btn-custom btn-lg">
                                        <i className="fas fa-rocket me-2"></i>Hemen Başla
                                    </a>
                                    <a href="#features" className="btn btn-outline-custom btn-lg" onClick={handleSmoothScroll}>
                                        <i className="fas fa-play me-2"></i>Özellikleri Keşfet
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <div className="text-center">
                                <div className="position-relative">
                                    <i className="fas fa-clipboard-list" style={{ fontSize: '20rem', color: 'rgba(255,255,255,0.1)' }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section-padding bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center mb-5">
                            <h2 className="display-5 fw-bold text-dark mb-3">Neden NotePad?</h2>
                            <p className="text-muted lead">Günlük hayatınızı organize etmenin en kolay yolu</p>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-bolt"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Hızlı & Kolay</h4>
                                <p className="text-muted">
                                    Sezgisel arayüzü ile saniyeler içinde not oluşturun ve düzenleyin.
                                    Karmaşık menüler yok, sadece saf verimlilik.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-cloud"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Bulut Sync</h4>
                                <p className="text-muted">
                                    Notlarınız güvenli bulut sunucularında saklanır.
                                    Her cihazdan erişin, asla kaybetmeyin.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Güvenli</h4>
                                <p className="text-muted">
                                    End-to-end şifreleme ile notlarınız tamamen güvende.
                                    Gizliliğiniz bizim önceliğimiz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="section-padding">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-4">Basitlik, Güç ile Buluşuyor</h2>
                            <p className="text-muted mb-4">
                                NotePad, günlük not alma ihtiyaçlarınızı karşılamak için özel olarak tasarlanmış,
                                modern bir platform. Karmaşık özellikler yerine, gerçekten ihtiyacınız olan araçları sunar.
                            </p>
                            <div className="row g-4">
                                <div className="col-sm-6">
                                    <div className="d-flex">
                                        <div className="feature-icon me-3" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Sınırsız Not</h6>
                                            <small className="text-muted">İstediğiniz kadar not oluşturun</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex">
                                        <div className="feature-icon me-3" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                                            <i className="fas fa-search"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Akıllı Arama</h6>
                                            <small className="text-muted">Notlarınızı anında bulun</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-4 mt-lg-0">
                            <div className="text-center">
                                <div className="bg-light rounded-3 p-5">
                                    <i className="fas fa-edit display-4 text-primary mb-3"></i>
                                    <h5 className="fw-bold">Her Zaman Yanınızda</h5>
                                    <p className="text-muted mb-0">Web, mobile, desktop - her platformda aynı deneyim</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="gradient-bg text-white section-padding">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="display-5 fw-bold mb-4">Bugün Başlayın!</h2>
                            <p className="lead mb-5">
                                Binlerce kullanıcının tercihi NotePad ile notlarınızı organize etmenin
                                ve üretkenliğinizi artırmanın keyfini çıkarın.
                            </p>
                            <a href="/register" className="btn btn-custom btn-lg">
                                <i className="fas fa-user-plus me-2"></i>Ücretsiz Kayıt Ol
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h5><i className="fas fa-sticky-note me-2"></i>NotePad</h5>
                            <p className="text-muted mb-0">Notlarınızın dijital evi</p>
                        </div>
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <p className="text-muted mb-0">&copy; 2025 NotePad. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Welcome;