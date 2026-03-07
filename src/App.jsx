import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useExchangeRate } from './hooks/useExchangeRate';
import { useAuth } from './hooks/useAuth';
import { useModels } from './hooks/useModels';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ApiKeyModal from './components/ui/ApiKeyModal';
import AuthModal from './components/auth/AuthModal';
import ModelCatalogModal from './components/models/ModelCatalogModal';
import StatsCards from './components/costs/StatsCards';
import CostTable from './components/costs/CostTable';
import CostChart from './components/costs/CostChart';
import CostCalculator from './components/costs/CostCalculator';
import Tilt3DCard from './components/ui/Tilt3DCard';
import BackgroundEffects from './components/ui/BackgroundEffects';
import ShaderBackground from './components/ui/ShaderBackground';
import ChatWindow from './components/chat/ChatWindow';
import AttendanceSimulator from './components/simulator/AttendanceSimulator';


const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('table');
  const [currency, setCurrency] = useState('BRL');
  const [apiKey, setApiKey] = useLocalStorage('gh_api_key', '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { rate: exchangeRate } = useExchangeRate();
  const { user, signOut, isRecoveringPassword, setIsRecoveringPassword } = useAuth();
  const {
    models,
    catalogModels,
    userSelectedModelIds,
    addModelToUser,
    removeModelFromUser,
    loading: modelsLoading
  } = useModels();

  return (
    <div className="min-h-screen bg-[#070708] text-gray-200 font-sans selection:bg-[#7B61FF]/30 relative">
      <ShaderBackground />
      <BackgroundEffects />

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenApiKey={() => setShowApiKeyModal(true)}
        hasApiKey={!!apiKey}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={signOut}
      />
      <AuthModal
        isOpen={isAuthModalOpen || isRecoveringPassword}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (isRecoveringPassword) setIsRecoveringPassword(false);
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-6 sm:pb-10 relative z-10">
        {activeTab === 'table' && (
          <div key="table-tab">
            <div className="animate-slideUp">
              <StatsCards />
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="mt-6 sm:mt-8 gh-card-hover gh-border-glow rounded-2xl sm:rounded-3xl">
                <CostTable
                  currency={currency}
                  exchangeRate={exchangeRate}
                  models={models}
                  onOpenCatalog={() => user ? setIsCatalogOpen(true) : setIsAuthModalOpen(true)}
                />
              </div>
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
              <div className="mt-6 sm:mt-8 gh-card-hover gh-border-glow rounded-2xl sm:rounded-3xl relative overflow-hidden group">
                <div className={!user ? 'blur-md pointer-events-none transition-all duration-500' : ''}>
                  <CostChart currency={currency} exchangeRate={exchangeRate} models={models} />
                </div>
                {!user && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl sm:rounded-3xl transition-all duration-500 group-hover:bg-black/50">
                    <div className="p-4 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 mb-3">
                      <Lock className="text-[#7B61FF] w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">{t('app.restrictedCharts')}</h4>
                    <p className="text-gray-400 text-sm mb-6 px-8 text-center">{t('app.restrictedChartsDesc')}</p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-2.5 bg-[#7B61FF] hover:bg-[#6851FF] text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] cursor-pointer"
                    >
                      {t('app.loginNow')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="mt-6 sm:mt-8 gh-card-hover gh-border-glow rounded-2xl sm:rounded-3xl relative overflow-hidden group">
                <div className={!user ? 'blur-md pointer-events-none transition-all duration-500' : ''}>
                  <CostCalculator currency={currency} exchangeRate={exchangeRate} models={models} />
                </div>
                {!user && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl sm:rounded-3xl transition-all duration-500 group-hover:bg-black/50">
                    <div className="p-4 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20 mb-3">
                      <Lock className="text-[#7B61FF] w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">{t('app.restrictedSimulator')}</h4>
                    <p className="text-gray-400 text-sm mb-6 px-8 text-center">{t('app.restrictedSimulatorDesc')}</p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-2.5 bg-[#7B61FF] hover:bg-[#6851FF] text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:shadow-[0_0_30px_rgba(123,97,255,0.5)] cursor-pointer"
                    >
                      {t('app.loginNow')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'lab' && (
          <ChatWindow
            apiKey={apiKey}
            onOpenApiKey={() => setShowApiKeyModal(true)}
            currency={currency}
            exchangeRate={exchangeRate}
            models={models}
            onOpenCatalog={() => user ? setIsCatalogOpen(true) : setIsAuthModalOpen(true)}
          />
        )}
        {activeTab === 'simulator' && (
          <AttendanceSimulator
            currency={currency}
            exchangeRate={exchangeRate}
            models={models}
            onOpenCatalog={() => user ? setIsCatalogOpen(true) : setIsAuthModalOpen(true)}
          />
        )}

        <Footer />
      </main>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ModelCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        catalogModels={catalogModels}
        userSelectedModelIds={userSelectedModelIds}
        onAddModel={addModelToUser}
        onRemoveModel={removeModelFromUser}
        loading={modelsLoading}
      />
    </div>
  );
};

export default App;