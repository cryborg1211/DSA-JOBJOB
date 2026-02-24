import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

/**
 * RoleSelectionPage — matches "chọn role.jpg" mockup.
 * Aggressive vertical spacing for premium feel.
 */
export default function RoleSelectionPage() {
    const { setRole } = useAuthStore();
    const navigate = useNavigate();

    const handleSelectRole = (role: 'CANDIDATE' | 'RECRUITER') => {
        setRole(role);
        navigate('/profile-setup');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-6"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(13,58,55,0.7) 0%, #000c0b 65%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
        >
            {/* Welcome text — large italic, big bottom margin */}
            <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-light italic text-white mb-8 text-center leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                Chào Mừng Bạn Đến Với JobJob
            </motion.h1>

            {/* "Who are you?" — massive gap to buttons */}
            <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-24 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
            >
                Bạn Là Ai ?
            </motion.h2>

            {/* Two large role buttons — generous gap between them */}
            <motion.div
                className="flex flex-col sm:flex-row items-center gap-10 sm:gap-16"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
            >
                <button
                    id="role-recruiter"
                    onClick={() => handleSelectRole('RECRUITER')}
                    className="btn-primary text-lg px-14 py-5 min-w-[260px] tracking-wider font-extrabold"
                >
                    Nhà Tuyển Dụng
                </button>
                <button
                    id="role-candidate"
                    onClick={() => handleSelectRole('CANDIDATE')}
                    className="btn-primary text-lg px-14 py-5 min-w-[260px] tracking-wider font-extrabold"
                >
                    Ứng Viên
                </button>
            </motion.div>
        </motion.div>
    );
}
