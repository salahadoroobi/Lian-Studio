
import React, { useState } from 'react';
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
import { RestorerIcon } from '../components/icons/RestorerIcon';
import { PhotoIcon } from '../components/icons/PhotoIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { AudioIcon } from '../components/icons/AudioIcon';
import { TextIcon } from '../components/icons/TextIcon';
import { InformationCircleIcon } from '../components/icons/InformationCircleIcon';
import { CheckBadgeIcon } from '../components/icons/CheckBadgeIcon';
import { FlagIcon } from '../components/icons/FlagIcon';
import { Squares2X2Icon } from '../components/icons/Squares2X2Icon';
import { WriterIcon } from '../components/icons/WriterIcon';
import { TranslatorIcon } from '../components/icons/TranslatorIcon';
import { ProofreaderIcon } from '../components/icons/ProofreaderIcon';
import { StealthIcon } from '../components/icons/StealthIcon';
import { SummarizerIcon } from '../components/icons/SummarizerIcon';
import { TextExtractorIcon } from '../components/icons/TextExtractorIcon';
import { StudioIcon } from '../components/icons/StudioIcon';

interface LandingPageProps {
  setView: (view: View) => void;
  t: TFunction;
  language: Language;
}

type ContentType = 'studio' | 'images' | 'videos' | 'audio' | 'text';
type InfoTab = 'about' | 'why' | 'mission' | 'features';

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
  const [activeContentType, setActiveContentType] = useState<ContentType>('studio');
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>('about');
  
  const contentTypes: ContentType[] = ['studio', 'images', 'text', 'videos', 'audio'];
  const infoTabs: InfoTab[] = ['about', 'why', 'mission', 'features'];
  
  const contentTypeIcons: Record<ContentType, React.ReactNode> = {
    studio: <StudioIcon />,
    images: <PhotoIcon />,
    videos: <VideoIcon />,
    audio: <AudioIcon />,
    text: <TextIcon />,
  };
  
  const infoTabIcons: Record<InfoTab, React.ReactNode> = {
    about: <InformationCircleIcon />,
    why: <CheckBadgeIcon />,
    mission: <FlagIcon />,
    features: <Squares2X2Icon />,
  };

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

  const renderInfoContent = () => {
    switch(activeInfoTab) {
        case 'about':
            return (
                <InfoSection title={t('landing_about_title')}>
                    <p>{t('landing_about_desc')}</p>
                </InfoSection>
            );
        case 'why':
            return (
                <InfoSection title={t('landing_importance_title')}>
                    <p>{t('landing_importance_desc')}</p>
                </InfoSection>
            );
        case 'mission':
            return (
                <InfoSection title={t('landing_goals_title')}>
                    <p>{t('landing_goals_desc')}</p>
                </InfoSection>
            );
        case 'features':
            return (
                <section className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-brand-primary dark:text-white mb-8">{t('landing_features_title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard language={language} title={t('landing_feature_1_title')} description={t('landing_feature_1_desc')} icon={<SparklesIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_5_title')} description={t('landing_feature_5_desc')} icon={<PaintBrushIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_2_title')} description={t('landing_feature_2_desc')} icon={<WandIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_3_title')} description={t('landing_feature_3_desc')} icon={<CombineIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_7_title')} description={t('landing_feature_7_desc')} icon={<RestorerIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_11_title')} description={t('landing_feature_11_desc')} icon={<WriterIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_12_title')} description={t('landing_feature_12_desc')} icon={<TranslatorIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_4_title')} description={t('landing_feature_4_desc')} icon={<DocumentTextIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_6_title')} description={t('landing_feature_6_desc')} icon={<PencilRulerIcon />} />
                        <FeatureCard language={language} title={t('landing_feature_8_title')} description={t('landing_feature_8_desc')} icon={<VideoIcon className="w-12 h-12 text-brand-accent"/>} />
                        <FeatureCard language={language} title={t('landing_feature_9_title')} description={t('landing_feature_9_desc')} icon={<AudioIcon className="w-12 h-12 text-brand-accent"/>} />
                        <FeatureCard language={language} title={t('landing_feature_10_title')} description={t('landing_feature_10_desc')} icon={<TextIcon className="w-12 h-12 text-brand-accent"/>} />
                    </div>
                </section>
            );
        default:
            return null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-primary dark:text-white mb-4">{t('landing_title')}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('landing_subtitle')}</p>
      </div>
      
      {/* Content Type Selector */}
      <div className="flex justify-center my-8 md:my-12">
        <div className="bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-full shadow-inner flex items-center gap-2 flex-wrap justify-center">
          {contentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveContentType(type)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2 ${
                activeContentType === type 
                  ? 'bg-brand-accent text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {contentTypeIcons[type]}
              <span>{t(`content_type_${type}`)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {activeContentType === 'images' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32 animate-fade-in">
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
            icon={<RestorerIcon />}
            title={t('restorer_card_title')}
            description={t('restorer_card_desc')}
            buttonText={t('start_restoring')}
            onClick={() => setView('restorer')}
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
          <Card
            icon={<DocumentTextIcon />}
            title={t('prompt_extractor_card_title')}
            description={t('prompt_extractor_card_desc')}
            buttonText={t('start_prompt_extracting')}
            onClick={() => setView('prompt_extractor')}
            isBeta={true}
          />
        </div>
      ) : activeContentType === 'text' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32 animate-fade-in">
           <Card
            icon={<WriterIcon />}
            title={t('writer_card_title')}
            description={t('writer_card_desc')}
            buttonText={t('start_writing')}
            onClick={() => setView('writer')}
            isBeta={true}
          />
          <Card
            icon={<TranslatorIcon />}
            title={t('translator_card_title')}
            description={t('translator_card_desc')}
            buttonText={t('start_translating')}
            onClick={() => setView('translator')}
            isBeta={true}
          />
           <Card
            icon={<ProofreaderIcon />}
            title={t('proofreader_card_title')}
            description={t('proofreader_card_desc')}
            buttonText={t('start_proofreading')}
            onClick={() => setView('proofreader')}
            isBeta={true}
          />
          <Card
            icon={<StealthIcon />}
            title={t('stealth_card_title')}
            description={t('stealth_card_desc')}
            buttonText={t('start_stealthing')}
            onClick={() => setView('stealth')}
            isBeta={true}
          />
          <Card
            icon={<SummarizerIcon />}
            title={t('summarizer_card_title')}
            description={t('summarizer_card_desc')}
            buttonText={t('start_summarizing')}
            onClick={() => setView('summarizer')}
            isBeta={true}
          />
           <Card
            icon={<TextExtractorIcon />}
            title={t('text_extractor_card_title')}
            description={t('text_extractor_card_desc')}
            buttonText={t('start_text_extracting')}
            onClick={() => setView('text_extractor')}
            isBeta={true}
          />
        </div>
      ) : (
        <div className="text-center py-20 md:py-32 mb-20 md:mb-32 animate-fade-in">
          <h3 className="text-3xl font-bold text-brand-primary dark:text-white mb-4">{t('coming_soon_title')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">{t('coming_soon_desc')}</p>
        </div>
      )}
      
      {/* Informational Tabs */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-full shadow-inner flex items-center gap-2 flex-wrap justify-center">
          {infoTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveInfoTab(tab)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center gap-2 ${
                activeInfoTab === tab 
                  ? 'bg-brand-accent text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {infoTabIcons[tab]}
              <span>{t(`info_tab_${tab}`)}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div key={activeInfoTab} className="animate-fade-in">
        {renderInfoContent()}
      </div>

    </div>
  );
};
