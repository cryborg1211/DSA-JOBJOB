import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * ProfilePage — matches profi_empl.jpg mockup.
 *
 * - "PROFILE CV" heading — extrabold, uppercase
 * - Vibrant teal gradient card with avatar placeholder
 * - Form fields with consistent vertical spacing (gap-4)
 * - Two bottom buttons with generous separation from card
 */
export default function ProfilePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        degree: '',
        language: '',
        experience1: '',
        experience2: '',
        skill1: '',
        skill2: '',
    });

    const update = (key: keyof typeof form) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleConfirm = () => {
        // TODO: Send profile data to backend
        navigate('/dashboard');
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(13,58,55,0.5) 0%, #000c0b 65%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
        >
            {/* Page title */}
            <motion.h1
                className="text-3xl md:text-4xl font-extrabold tracking-wider uppercase mb-10 text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                Profile CV
            </motion.h1>

            {/* Teal gradient card */}
            <motion.div
                className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
                style={{
                    background: 'linear-gradient(180deg, #2dd4bf 0%, #14b8a6 40%, #0d9488 100%)',
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.45 }}
            >
                {/* Circular avatar placeholder */}
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                        background: 'radial-gradient(circle, #4ecdc4 0%, #2c7a7b 60%, #1a4e5a 100%)',
                        boxShadow: '0 0 24px rgba(0,0,0,0.3)',
                    }}
                >
                    <span className="text-4xl">🎨</span>
                </div>

                {/* Form fields — consistent vertical spacing */}
                <div className="w-full flex flex-col gap-4">
                    {/* Full width */}
                    <input
                        className="profile-input"
                        placeholder="Họ Và Tên"
                        value={form.fullName}
                        onChange={update('fullName')}
                    />

                    {/* 2-column rows */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="profile-input"
                            placeholder="Bằng Cấp"
                            value={form.degree}
                            onChange={update('degree')}
                        />
                        <input
                            className="profile-input"
                            placeholder="Ngoại Ngữ"
                            value={form.language}
                            onChange={update('language')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="profile-input"
                            placeholder="Kinh Nghiệm 1"
                            value={form.experience1}
                            onChange={update('experience1')}
                        />
                        <input
                            className="profile-input"
                            placeholder="Kinh Nghiệm 2"
                            value={form.experience2}
                            onChange={update('experience2')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            className="profile-input"
                            placeholder="Năng Lực 1"
                            value={form.skill1}
                            onChange={update('skill1')}
                        />
                        <input
                            className="profile-input"
                            placeholder="Năng Lực 2"
                            value={form.skill2}
                            onChange={update('skill2')}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Bottom action buttons — generous spacing from card */}
            <motion.div
                className="flex items-center gap-16 mt-14"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
            >
                <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => navigate(-1)}
                >
                    Chỉnh Sửa
                </button>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleConfirm}
                >
                    Xác Nhận
                </button>
            </motion.div>
        </motion.div>
    );
}
