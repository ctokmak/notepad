import '../../css/login.css'

export default function GuestLayout({ children }) {
    return (
        <div className='container-fluid px-0'>
            <div className="auth-container">
                <div className="auth-left">
                    <div className="floating-shapes">
                        <div className="shape"></div>
                        <div className="shape"></div>
                        <div className="shape"></div>
                    </div>
                    <div className="auth-left-content">
                        <i className="fas fa-sticky-note fa-4x mb-3"></i>
                        <h2 id="leftTitle">NotePad'e Hoş Geldiniz!</h2>
                        <p id="leftSubtitle">Notlarınızı organize etmenin en kolay yolu. Güvenli, hızlı ve kullanıcı dostu.</p>

                        <div className="features">
                            <div className="feature-item">
                                <i className="fas fa-bolt"></i>
                                <span>Hızlı ve Güvenli</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-cloud"></i>
                                <span>Bulut Synchronizasyon</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-mobile-alt"></i>
                                <span>Her Cihazdan Erişim</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form">
                        <div className="brand-logo">
                            <h1><i className="fas fa-sticky-note me-2"></i>NotePad</h1>
                            <p id="formSubtitle">Hesabınıza giriş yapın</p>
                        </div>

                        <div id="alertContainer"></div>
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}
