import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import LightPillar from '../../components/specific/LightPillar';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import api from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';

const AdminLogin = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/admin/login', { password });
            const { token } = response.data;

            // Store JWT in localStorage
            localStorage.setItem('adminToken', token);

            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-slate-950 relative overflow-hidden p-4 pt-40 pb-20">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <LightPillar
                    intensity={0.6}
                    pillarWidth={6}
                    rotationSpeed={0.05}
                    topColor="#FF2727"
                    bottomColor="#FF9F00"
                />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back Link */}
                <button
                    onClick={() => navigate('/')}
                    type="button"
                    className="flex items-center text-white/60 hover:text-white mb-8 transition-colors text-sm group relative z-50 pointer-events-auto cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t('back_to_home')}
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
                        <ShieldCheck className="w-12 h-12 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        {t('admin_portal')}
                    </h1>
                    <p className="text-gray-400">
                        {t('admin_subtitle')}
                    </p>
                </div>

                <Card className="backdrop-blur-xl bg-slate-900/50 border-white/10 relative p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Access Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 bg-slate-950/50"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-500 relative z-50 pointer-events-auto"
                            size="lg"
                            isLoading={isLoading}
                            type="submit"
                        >
                            {t('direct_access')} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500 italic">
                            {t('auth_disclaimer')}
                        </p>
                    </div>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    Proprietary System • unauthorized access is logged
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
