import React from "react";
import LightPillar from "../../components/specific/LightPillar";
import { Card } from "../../components/ui/Card";
import { Video, Smartphone, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.8}
          pillarWidth={4}
          interactive={true}
        />
        <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
        <div className="h-16 md:h-24" /> {/* Spacer for fixed header */}

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 mt-4 md:mt-20 text-center max-w-4xl mx-auto px-2">
          <div className="space-y-4 md:space-y-6 w-full flex flex-col items-center">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold font-display leading-[1.1] tracking-tight">
              {t('hero_title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary inline-block py-2">
                {t('hero_subtitle')}
              </span>
            </h1>
            <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed px-2">
              {t('hero_desc')}
            </p>

            <div className="pt-6 md:pt-10 flex flex-wrap gap-4 md:gap-8 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 justify-center">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                {t('doctors_online')}
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_#3b82f6]" />
                {t('support_247')}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 md:mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Video className="w-7 h-7 md:w-8 md:h-8 text-secondary" />}
            title={t('teleconsultation')}
            desc={t('tele_desc')}
            delay="0"
          />
          <FeatureCard
            icon={<Smartphone className="w-7 h-7 md:w-8 md:h-8 text-primary" />}
            title={t('mobile_first')}
            desc={t('mobile_desc')}
            delay="100"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-green-400" />}
            title={t('secure_records')}
            desc={t('secure_desc')}
            delay="200"
          />
        </div>
      </div>
    </div>
  );
};


const FeatureCard = ({
  icon,
  title,
  desc,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}) => (
  <Card
    className="cursor-default border-white/5 duration-500 group"
    backgroundColor="bg-white/5 hover:bg-white/10 transition-colors"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm font-medium leading-relaxed">{desc}</p>
  </Card>
);

export default Landing;

