import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('table');
  const [currency, setCurrency] = useState('BRL');
  const [apiKey, setApiKey] = useLocalStorage('gh_api_key', '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { rate: exchangeRate } = useExchangeRate();
  const { user, signOut } = useAuth();
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
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
              <div className="mt-6 sm:mt-8 gh-card-hover gh-border-glow rounded-2xl sm:rounded-3xl">
                <CostChart currency={currency} exchangeRate={exchangeRate} models={models} />
              </div>
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="mt-6 sm:mt-8 gh-card-hover gh-border-glow rounded-2xl sm:rounded-3xl">
                <CostCalculator currency={currency} exchangeRate={exchangeRate} models={models} />
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