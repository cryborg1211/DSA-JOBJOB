import api from './api';

interface LoginPayload { username: string; password: string; }
interface RegisterPayload { username: string; password: string; role: 'CANDIDATE' | 'RECRUITER'; }

export const authService = {
    login: (payload: LoginPayload) =>
        api.post<{ token: string; role: string }>('/auth/login', payload),

    register: (payload: RegisterPayload) =>
        api.post<{ message: string }>('/auth/register', payload),

    logout: () => localStorage.removeItem('jj_token'),
};
