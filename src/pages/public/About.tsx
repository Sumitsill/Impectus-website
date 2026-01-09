import LightPillar from '../../components/specific/LightPillar';
import { useLanguage } from '../../context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pt-28 md:pt-44 pb-12 px-4 md:px-6">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LightPillar topColor="#00ffcc" bottomColor="#336699" intensity={0.4} />
            </div>
            <div className="relative z-10 container mx-auto max-w-4xl">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-display mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                    {t('about_title')}
                </h1>
                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-300">
                        {t('about_desc')}
                    </p>
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 my-8">
                        <h2 className="text-2xl font-bold mb-4">{t('mission_title')}</h2>
                        <p className="text-gray-400">
                            {t('mission_desc')}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                            <h3 className="font-semibold text-lg mb-2 text-teal-300">{t('for_patients')}</h3>
                            <p className="text-sm text-gray-500">{t('for_patients_desc')}</p>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5">
                            <h3 className="font-semibold text-lg mb-2 text-blue-300">{t('for_doctors')}</h3>
                            <p className="text-sm text-gray-500">{t('for_doctors_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
