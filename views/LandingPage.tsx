import React from 'react';
import type { View } from '../App';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { WandIcon } from '../components/icons/WandIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import type { Language, TFunction } from '../hooks/useLocalization';
import { CombineIcon } from '../components/icons/CombineIcon';
import { PaintBrushIcon } from '../components/icons/PaintBrushIcon';
import { ShimmerWrapper } from '../components/ShimmerWrapper';
import { ActionButton } from '../components/ActionButton';
import { PencilRulerIcon } from '../components/icons/PencilRulerIcon';

interface LandingPageProps {
  setView: (view: View) => void;
  t: TFunction;
  language: Language;
}

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    language: Language;
  }> = ({ icon, title, description, language }) => (
    <div className={`flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="flex-shrink-0 w-12 h-12">{icon}</div>
        <div>
            <h4 className="text-xl font-bold text-brand-primary dark:text-white">{title}</h4>
            <p className="text-brand-primary dark:text-gray-400">{description}</p>
        </div>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ setView, t, language }) => {

  const Card: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    isBeta?: boolean;
  }> = ({ icon, title, description, buttonText, onClick, isBeta }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
      <div className="mb-4">{icon}</div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-2xl font-bold text-brand-primary dark:text-white">{title}</h3>
        {isBeta && (
          <ShimmerWrapper className="rounded-full">
            <span className="inline-flex items-center justify-center bg-brand-accent text-brand-bg text-xs font-semibold px-2.5 py-1 rounded-full min-w-[50px]">
              {t('beta_tag')}
            </span>
          </ShimmerWrapper>
        )}
      </div>
      <p className="text-brand-primary dark:text-gray-400 mb-6 flex-grow">{description}</p>
      <ActionButton
        onClick={onClick}
        className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-dark transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
      >
        {buttonText}
      </ActionButton>
    </div>
  );
  
  const InfoSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-4">{title}</h2>
        <div className="text-lg text-center text-gray-600 dark:text-gray-300 space-y-4">
            {children}
        </div>
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-white mb-4">{t('landing_title')}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">{t('landing_subtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32">
        <Card
          icon={<PaintBrushIcon />}
          title={t('editor_card_title')}
          description={t('editor_card_desc')}
          buttonText={t('start_editing')}
          onClick={() => setView('editor')}
          isBeta={true}
        />
        <Card
          icon={<SparklesIcon />}
          title={t('generator_card_title')}
          description={t('generator_card_desc')}
          buttonText={t('start_generating')}
          onClick={() => setView('generator')}
        />
        <Card
          icon={<WandIcon />}
          title={t('enhancer_card_title')}
          description={t('enhancer_card_desc')}
          buttonText={t('start_enhancing')}
          onClick={() => setView('enhancer')}
        />
        <Card
          icon={<CombineIcon />}
          title={t('merger_card_title')}
          description={t('merger_card_desc')}
          buttonText={t('start_merging')}
          onClick={() => setView('merger')}
          isBeta={true}
        />
        <Card
          icon={<DocumentTextIcon />}
          title={t('extractor_card_title')}
          description={t('extractor_card_desc')}
          buttonText={t('start_extracting')}
          onClick={() => setView('extractor')}
          isBeta={true}
        />
        <Card
          icon={<PencilRulerIcon />}
          title={t('corrector_card_title')}
          description={t('corrector_card_desc')}
          buttonText={t('start_correcting')}
          onClick={() => setView('corrector')}
          isBeta={true}
        />
      </div>

      <div className="space-y-16">
        <InfoSection title={t('landing_about_title')}>
            <p>{t('landing_about_desc')}</p>
        </InfoSection>
        
        <InfoSection title={t('landing_importance_title')}>
            <p>{t('landing_importance_desc')}</p>
        </InfoSection>

        <InfoSection title={t('landing_goals_title')}>
            <p>{t('landing_goals_desc')}</p>
        </InfoSection>

        <section className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-8">{t('landing_features_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard language={language} title={t('landing_feature_1_title')} description={t('landing_feature_1_desc')} icon={<SparklesIcon />} />
                <FeatureCard language={language} title={t('landing_feature_5_title')} description={t('landing_feature_5_desc')} icon={<PaintBrushIcon />} />
                <FeatureCard language={language} title={t('landing_feature_2_title')} description={t('landing_feature_2_desc')} icon={<WandIcon />} />
                <FeatureCard language={language} title={t('landing_feature_3_title')} description={t('landing_feature_3_desc')} icon={<CombineIcon />} />
                <FeatureCard language={language} title={t('landing_feature_4_title')} description={t('landing_feature_4_desc')} icon={<DocumentTextIcon />} />
                <FeatureCard language={language} title={t('landing_feature_6_title')} description={t('landing_feature_6_desc')} icon={<PencilRulerIcon />} />
            </div>
        </section>

      </div>
    </div>
  );
};