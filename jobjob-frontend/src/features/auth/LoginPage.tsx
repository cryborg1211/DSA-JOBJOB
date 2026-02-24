import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

/**
 * LoginPage — matches Sign in.png mockup.
 * Aggressive vertical spacing for an airy, premium feel.
 */
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authService.login({ username, password });
            setAuth(data.token, data.role as 'CANDIDATE' | 'RECRUITER');
            navigate('/select-role');
        } catch {
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
        }
    };

    // For demo/dev: skip backend and go directly to role selection
    const handleDevLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        setAuth('dev-token', 'CANDIDATE');
        navigate('/select-role');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ background: '#000c0b' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
        >
            {/* Welcome title — huge bottom margin for separation */}
            <motion.h1
                className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
            >
                Chào mừng bạn đến với JobJob
            </motion.h1>

            {/* Gradient card — gap-8 between inputs for breathing room */}
            <motion.form
                onSubmit={handleDevLogin}
                className="auth-card w-full max-w-md flex flex-col gap-6"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
            >
                <input
                    id="username"
                    className="input-field"
                    type="text"
                    placeholder="Tên Đăng Nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                />
                <input
                    id="password"
                    className="input-field"
                    type="password"
                    placeholder="Nhập Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
            </motion.form>

            {error && (
                <motion.p
                    className="text-sm text-[var(--color-accent-rose)] mt-6 text-center"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.p>
            )}

            {/* Action buttons — massive gap from card */}
            <motion.div
                className="flex items-center gap-14 mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
            >
                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="btn-ghost"
                >
                    Đăng Ký
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        const form = document.querySelector('form');
                        form?.requestSubmit();
                    }}
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-[#000c0b]/40 border-t-[#000c0b] rounded-full animate-spin" />
                    ) : 'Đăng Nhập'}
                </button>
            </motion.div>
        </motion.div>
    );
}
