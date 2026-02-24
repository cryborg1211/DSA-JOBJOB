import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

/**
 * Navbar — Vietnamese labels matching the mockup navigation bar.
 * Links: Giới Thiệu, Liên Hệ, Gói Cước, Đăng Ký
 */
export function Navbar() {
    const { token, role, clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 inset-x-0 z-40 h-16 flex items-center px-6 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/80 backdrop-blur-md">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-[var(--color-text-primary)] text-lg tracking-tight">
                    Job<span className="text-[var(--color-cyan)]">Job</span>
                </span>
            </Link>

            {/* Navigation links */}
            <nav className="ml-auto hidden md:flex items-center gap-8 text-sm text-[var(--color-text-muted)]">
                {token ? (
                    <>
                        <Link to="/dashboard" className="hover:text-[var(--color-cyan)] transition-colors flex items-center gap-1.5">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        {role === 'CANDIDATE' && (
                            <Link to="/profile-setup" className="hover:text-[var(--color-cyan)] transition-colors">Hồ Sơ</Link>
                        )}
                        {role === 'RECRUITER' && (
                            <Link to="/jd/new" className="hover:text-[var(--color-cyan)] transition-colors">Đăng Tin</Link>
                        )}
                        <Link to="/match" className="hover:text-[var(--color-cyan)] transition-colors">Matching</Link>
                        <button onClick={handleLogout} className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1.5">
                            <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="#" className="hover:text-[var(--color-cyan)] transition-colors">Giới Thiệu</Link>
                        <Link to="#" className="hover:text-[var(--color-cyan)] transition-colors">Liên Hệ</Link>
                        <Link to="#" className="hover:text-[var(--color-cyan)] transition-colors">Gói Cước</Link>
                        <Link to="/register" className="hover:text-[var(--color-cyan)] transition-colors">Đăng Ký</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
