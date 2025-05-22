import React, { useState, useEffect, useCallback } from 'react';
import { LaunchAnimation } from './components/launch/LaunchAnimation';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { DhanRakshakView } from './views/DhanRakshakView';
import { SatyaDarpanView } from './views/SatyaDarpanView';
import { NetraTraceView } from './views/NetraTraceView';
import { SahayakCopBotView } from './views/SahayakCopBotView';
import { NigraniAIView } from './views/NigraniAIView';
import { VaaniShieldView } from './views/VaaniShieldView';
import { KavachMailGuardView } from './views/KavachMailGuardView';
import { ModuleCard } from './components/ui/ModuleCard'; // Added import
import type { ActiveView, GeminiServiceStatus } from './types';
import { DASHBOARD_APP_NAME, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from './constants';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [showLaunchAnimation, setShowLaunchAnimation] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [geminiServiceStatus, setGeminiServiceStatus] = useState<GeminiServiceStatus>({
    isKeySet: false,
    message: DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchAnimation(false);
      document.body.style.overflow = 'auto'; // Restore scroll
    }, 4000); // Duration of launch animation

    // Check API Key
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      setGeminiServiceStatus({ isKeySet: true, message: "Gemini API Key is configured." });
    } else {
      setGeminiServiceStatus({ isKeySet: false, message: DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE });
    }
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = useCallback((view: ActiveView) => {
    setActiveView(view);
    // Potentially close sidebar on mobile after selection, if that's a desired UX
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHomeView setActiveView={handleViewChange} apiKeyStatus={geminiServiceStatus} />;
      case 'dhanrakshak':
        return <DhanRakshakView apiKeyStatus={geminiServiceStatus} />;
      case 'satyadarpan':
        return <SatyaDarpanView apiKeyStatus={geminiServiceStatus} />;
      case 'netratrace':
        return <NetraTraceView apiKeyStatus={geminiServiceStatus} />;
      case 'sahayakcopbot':
        return <SahayakCopBotView apiKeyStatus={geminiServiceStatus} />;
      case 'nigraniai':
        return <NigraniAIView apiKeyStatus={geminiServiceStatus} />;
      case 'vaanishield':
        return <VaaniShieldView apiKeyStatus={geminiServiceStatus} />;
      case 'kavachmailguard':
        return <KavachMailGuardView apiKeyStatus={geminiServiceStatus} />;
      // case 'settings': return <SettingsView />;
      // case 'profile': return <ProfileView />;
      default:
        return <DashboardHomeView setActiveView={handleViewChange} apiKeyStatus={geminiServiceStatus} />;
    }
  };

  if (showLaunchAnimation) {
    return <LaunchAnimation appName={DASHBOARD_APP_NAME} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar activeView={activeView} setActiveView={handleViewChange} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-16'}`}>
        <DashboardHeader appName={DASHBOARD_APP_NAME} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-800/30 custom-scrollbar-main">
          {renderActiveView()}
        </main>
         {!geminiServiceStatus.isKeySet && (
            <div className="fixed bottom-4 right-4 bg-red-700 text-white p-3 rounded-lg shadow-xl text-xs flex items-center space-x-2 z-50">
              <AlertTriangle size={18} />
              <span>{geminiServiceStatus.message} Some modules may not function.</span>
            </div>
          )}
      </div>
       <style>{`
        .custom-scrollbar-main::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-main::-webkit-scrollbar-track { background: #0f172a; } /* slate-900 */
        .custom-scrollbar-main::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 3px; } /* sky-400 */
        .custom-scrollbar-main::-webkit-scrollbar-thumb:hover { background: #0ea5e9; } /* sky-500 */
      `}</style>
    </div>
  );
};

// Placeholder for Dashboard Home View (can be expanded)
const DashboardHomeView: React.FC<{ setActiveView: (view: ActiveView) => void, apiKeyStatus: GeminiServiceStatus }> = ({ setActiveView, apiKeyStatus }) => {
  // Dummy module data
  const modules = [
    { id: 'dhanrakshak', name: 'DhanRakshak', description: 'Financial Fraud Detection', icon: 'ShieldCheck' },
    { id: 'satyadarpan', name: 'SatyaDarpan', description: 'Deepfake Media Analysis', icon: 'ScanFace' },
    { id: 'netratrace', name: 'NetraTrace', description: 'Missing Persons (Sim.)', icon: 'PersonStanding' },
    { id: 'sahayakcopbot', name: 'Sahayak CopBot', description: 'Police Legal Assistant', icon: 'MessageCircleQuestion' },
    { id: 'nigraniai', name: 'NigraniAI', description: 'Surveillance Analysis (Sim.)', icon: 'Video' },
    { id: 'vaanishield', name: 'VaaniShield', description: 'VoIP Scam Detection (Sim.)', icon: 'PhoneCall' },
    { id: 'kavachmailguard', name: 'Kavach MailGuard', description: 'Phishing Email Detection', icon: 'MailWarning' },
  ];

  return (
    <div className="animate-contentFadeInUp">
      <h1 className="text-3xl font-orbitron font-bold text-sky-400 mb-2">Welcome to {DASHBOARD_APP_NAME}</h1>
      <p className="text-slate-400 mb-6">Unified Platform for Advanced Security & Investigation.</p>
      
      <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 ${apiKeyStatus.isKeySet ? 'bg-green-600/20 border-green-500/50' : 'bg-red-600/20 border-red-500/50'} border`}>
        {apiKeyStatus.isKeySet ? <CheckCircle2 className="text-green-400 h-6 w-6" /> : <AlertTriangle className="text-red-400 h-6 w-6" />}
        <div>
          <h3 className={`text-sm font-semibold ${apiKeyStatus.isKeySet ? 'text-green-300' : 'text-red-300'}`}>
            Gemini API Status
          </h3>
          <p className="text-xs text-slate-400">{apiKeyStatus.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(module => (
          <ModuleCard 
            key={module.id as ActiveView}
            title={module.name}
            description={module.description}
            iconName={module.icon as any} // Type assertion for lucide icons
            onClick={() => setActiveView(module.id as ActiveView)}
          />
        ))}
      </div>
    </div>
  );
};

// Removed ModuleCard definition from here

export default App;