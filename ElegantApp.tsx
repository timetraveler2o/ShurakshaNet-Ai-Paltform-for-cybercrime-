import React, { useState, useEffect } from 'react';
import ElegantLoadingScreen from './components/ElegantLoadingScreen';
import ElegantHeader from './components/ElegantHeader';
import ElegantCard from './components/ElegantCard';
import ElegantButton from './components/ElegantButton';
import ElegantModuleCard from './components/ElegantModuleCard';
import ScrollToTopButton from './components/ScrollToTopButton';
import { DASHBOARD_APP_NAME } from './constants';
import type { ActiveView, GeminiServiceStatus } from './types';

// Import your existing views
import { DhanRakshakView } from './views/DhanRakshakView';
import { SatyaDarpanView } from './views/SatyaDarpanView';
import { NetraTraceView } from './views/NetraTraceView';
import { SahayakCopBotView } from './views/SahayakCopBotView';
import { NigraniAIView } from './views/NigraniAIView';
import { VaaniShieldView } from './views/VaaniShieldView';
import { KavachMailGuardView } from './views/KavachMailGuardView';

// Import new views
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

// Import icons (assuming you're using Lucide React)
import { 
  ShieldCheck, 
  ScanFace, 
  PersonStanding, 
  MessageCircleQuestion, 
  Video, 
  PhoneCall, 
  MailWarning,
  AlertTriangle,
  CheckCircle2,
  Menu,
  Home,
  ChevronRight,
  BarChart3,
  FileText,
  Settings,
  X
} from 'lucide-react';

const ElegantApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [geminiServiceStatus, setGeminiServiceStatus] = useState<GeminiServiceStatus>({
    isKeySet: false,
    message: "Gemini API Key is not configured. Some modules may not function properly."
  });

  useEffect(() => {
    // Check API Key
    // @ts-ignore - Vite's import.meta.env is properly typed in vite-env.d.ts
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      setGeminiServiceStatus({ 
        isKeySet: true, 
        message: "Gemini API Key is configured and ready." 
      });
    }
  }, []);
  
  // Make setActiveView available globally
  useEffect(() => {
    // @ts-ignore
    window.setActiveView = setActiveView;
    
    return () => {
      // @ts-ignore
      delete window.setActiveView;
    };
  }, []);
  
  // Setup scroll indicator in a separate effect to ensure it runs after DOM updates
  useEffect(() => {
    // Import the scroll utilities
    import('./utils/scrollUtils').then(({ updateScrollIndicator }) => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        // Add scroll event listener
        mainElement.addEventListener('scroll', updateScrollIndicator);
        
        // Initial update with a longer delay to ensure content is fully rendered
        setTimeout(updateScrollIndicator, 1000);
        
        // Also update when window is resized
        window.addEventListener('resize', updateScrollIndicator);
        
        return () => {
          mainElement.removeEventListener('scroll', updateScrollIndicator);
          window.removeEventListener('resize', updateScrollIndicator);
        };
      }
    });
  }, [activeView]);
  
  // Reset scroll position when changing views
  useEffect(() => {
    const mainElement = document.getElementById('mainContent');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [activeView]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <ElegantDashboardView setActiveView={setActiveView} apiKeyStatus={geminiServiceStatus} />;
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
      case 'analytics':
        return <AnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ElegantDashboardView setActiveView={setActiveView} apiKeyStatus={geminiServiceStatus} />;
    }
  };

  if (isLoading) {
    return <ElegantLoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200 flex flex-col">
      <ElegantHeader 
        user={{ name: 'Agent', role: 'Cyber Security Officer' }} 
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out pt-16
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 overflow-y-auto
        `}>
          <div className="p-4">
            <nav className="space-y-1">
              <SidebarItem 
                icon={<Home size={18} />} 
                label="Dashboard" 
                isActive={activeView === 'dashboard'} 
                onClick={() => setActiveView('dashboard')} 
              />
              <SidebarItem 
                icon={<ShieldCheck size={18} />} 
                label="DhanRakshak" 
                isActive={activeView === 'dhanrakshak'} 
                onClick={() => setActiveView('dhanrakshak')} 
              />
              <SidebarItem 
                icon={<ScanFace size={18} />} 
                label="SatyaDarpan" 
                isActive={activeView === 'satyadarpan'} 
                onClick={() => setActiveView('satyadarpan')} 
              />
              <SidebarItem 
                icon={<PersonStanding size={18} />} 
                label="NetraTrace" 
                isActive={activeView === 'netratrace'} 
                onClick={() => setActiveView('netratrace')} 
              />
              <SidebarItem 
                icon={<MessageCircleQuestion size={18} />} 
                label="Sahayak CopBot" 
                isActive={activeView === 'sahayakcopbot'} 
                onClick={() => setActiveView('sahayakcopbot')} 
              />
              <SidebarItem 
                icon={<Video size={18} />} 
                label="NigraniAI" 
                isActive={activeView === 'nigraniai'} 
                onClick={() => setActiveView('nigraniai')} 
              />
              <SidebarItem 
                icon={<PhoneCall size={18} />} 
                label="VaaniShield" 
                isActive={activeView === 'vaanishield'} 
                onClick={() => setActiveView('vaanishield')} 
              />
              <SidebarItem 
                icon={<MailWarning size={18} />} 
                label="Kavach MailGuard" 
                isActive={activeView === 'kavachmailguard'} 
                onClick={() => setActiveView('kavachmailguard')} 
              />
              
              <div className="pt-4 mt-4 border-t border-slate-800">
                <SidebarItem 
                  icon={<BarChart3 size={18} />} 
                  label="Analytics" 
                  isActive={activeView === 'analytics'} 
                  onClick={() => setActiveView('analytics')} 
                />
                <SidebarItem 
                  icon={<FileText size={18} />} 
                  label="Reports" 
                  isActive={activeView === 'reports'} 
                  onClick={() => setActiveView('reports')} 
                />
                <SidebarItem 
                  icon={<Settings size={18} />} 
                  label="Settings" 
                  isActive={activeView === 'settings'} 
                  onClick={() => setActiveView('settings')} 
                />
              </div>
            </nav>
          </div>
        </div>
        
        {/* Mobile sidebar toggle */}
        <button 
          className="fixed bottom-4 left-4 z-50 md:hidden bg-blue-600 p-3 rounded-full shadow-blue-glow"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <Menu size={24} className="text-white" />
          )}
        </button>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative h-full" id="mainContent">
          {/* Page Scroll Indicator */}
          <div className="fixed top-16 left-0 right-0 h-1 bg-slate-800 z-30">
            <div className="h-full w-full bg-gradient-to-r from-blue-600 to-indigo-500 origin-left" 
                 style={{ 
                   transform: 'scaleX(0)',
                   transition: 'transform 0.1s ease-out'
                 }}
                 id="pageScrollIndicator">
            </div>
          </div>
          
          <div className="container mx-auto h-full">
            {renderActiveView()}
          </div>
          
          {/* Scroll to top button */}
          <ScrollToTopButton />
        </main>
      </div>
      
      {/* API Status notification */}
      {!geminiServiceStatus.isKeySet && (
        <div className="fixed bottom-4 right-4 bg-red-500/80 text-white p-3 rounded-lg shadow-lg text-sm flex items-center space-x-2 z-50 backdrop-blur-sm border border-red-400/50 animate-fadeIn">
          <AlertTriangle size={18} />
          <span>{geminiServiceStatus.message}</span>
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-500/10 text-blue-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-3 ${isActive ? 'text-blue-400' : ''}`}>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      {isActive && <ChevronRight size={16} className="text-blue-400" />}
    </button>
  );
};

// Dashboard View
const ElegantDashboardView: React.FC<{ 
  setActiveView: (view: ActiveView) => void, 
  apiKeyStatus: GeminiServiceStatus 
}> = ({ setActiveView, apiKeyStatus }) => {
  // Module data
  const modules = [
    { 
      id: 'dhanrakshak', 
      name: 'DhanRakshak', 
      description: 'Financial Fraud Detection & Analysis', 
      icon: <ShieldCheck size={22} />,
      variant: 'default' as const
    },
    { 
      id: 'satyadarpan', 
      name: 'SatyaDarpan', 
      description: 'Deepfake Media Analysis & Detection', 
      icon: <ScanFace size={22} />,
      variant: 'glass' as const
    },
    { 
      id: 'netratrace', 
      name: 'NetraTrace', 
      description: 'Missing Persons Facial Recognition', 
      icon: <PersonStanding size={22} />,
      variant: 'accent' as const
    },
    { 
      id: 'sahayakcopbot', 
      name: 'Sahayak CopBot', 
      description: 'AI-Powered Police Legal Assistant', 
      icon: <MessageCircleQuestion size={22} />,
      variant: 'default' as const
    },
    { 
      id: 'nigraniai', 
      name: 'NigraniAI', 
      description: 'Intelligent Surveillance Analysis', 
      icon: <Video size={22} />,
      variant: 'gradient' as const
    },
    { 
      id: 'vaanishield', 
      name: 'VaaniShield', 
      description: 'Voice-based Scam Call Detection', 
      icon: <PhoneCall size={22} />,
      variant: 'glass' as const
    },
    { 
      id: 'kavachmailguard', 
      name: 'Kavach MailGuard', 
      description: 'Advanced Phishing Email Detection', 
      icon: <MailWarning size={22} />,
      variant: 'accent' as const
    },
  ];

  // Technology stack data
  const technologies = [
    { name: 'React', description: 'Frontend UI library' },
    { name: 'TypeScript', description: 'Type-safe JavaScript' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Vite', description: 'Next generation frontend tooling' },
    { name: 'Gemini API', description: 'Google\'s multimodal AI model' },
    { name: 'Lucide React', description: 'Beautiful & consistent icons' }
  ];

  // Roadmap data
  const roadmapItems = [
    { 
      phase: 'Phase 1', 
      title: 'Core Platform Development', 
      description: 'Building the foundation with essential security modules',
      status: 'Completed'
    },
    { 
      phase: 'Phase 2', 
      title: 'Advanced AI Integration', 
      description: 'Enhancing modules with state-of-the-art AI capabilities',
      status: 'In Progress'
    },
    { 
      phase: 'Phase 3', 
      title: 'Cross-Platform Deployment', 
      description: 'Extending to mobile and desktop applications',
      status: 'Planned'
    },
    { 
      phase: 'Phase 4', 
      title: 'Global Expansion', 
      description: 'Multilingual support and international deployment',
      status: 'Planned'
    }
  ];

  return (
    <div className="space-y-12 animate-fadeInUp pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/40 via-slate-800 to-indigo-900/40 border border-slate-700/50 p-6 md:p-8 shimmer">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                  Welcome to {DASHBOARD_APP_NAME}
                </span>
              </h1>
              <p className="text-slate-300 mb-6 max-w-2xl text-lg">
                Advanced cybersecurity platform for threat detection, investigation, and protection against digital crimes.
              </p>
              <ElegantButton variant="primary" size="lg" className="shadow-blue-glow-sm">
                System Status: Online
              </ElegantButton>
            </div>
            
            <div className="hidden md:block relative w-48 h-48 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full animate-pulse-subtle"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-full animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-600/40 to-indigo-600/40 rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-900 flex items-center justify-center shadow-blue-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-subtle-grid opacity-20"></div>
                  <span className="font-poppins text-white text-4xl font-bold">S</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -top-10 right-20 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0 bg-subtle-grid bg-[length:30px_30px] opacity-10"></div>
      </div>
      
      {/* API Status Card */}
      <ElegantCard 
        variant={apiKeyStatus.isKeySet ? 'accent' : 'default'} 
        className="mb-6"
      >
        <div className="flex items-center space-x-3">
          {apiKeyStatus.isKeySet ? 
            <CheckCircle2 className="text-emerald-400 h-6 w-6" /> : 
            <AlertTriangle className="text-amber-400 h-6 w-6" />
          }
          <div>
            <h3 className="font-medium">
              Gemini API Status
            </h3>
            <p className="text-xs text-slate-400">{apiKeyStatus.message}</p>
          </div>
        </div>
      </ElegantCard>
      
      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-poppins font-semibold elegant-text-gradient">Security Modules</h2>
          <ElegantButton variant="outline" size="sm">
            View All
          </ElegantButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div key={module.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
              <ElegantModuleCard 
                title={module.name}
                description={module.description}
                icon={module.icon}
                onClick={() => setActiveView(module.id as ActiveView)}
                variant={module.variant}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* About Section */}
      <div>
        <h2 className="text-2xl font-poppins font-semibold elegant-text-gradient mb-6">About SurakshaNet</h2>
        
        <ElegantCard variant="gradient" className="mb-8">
          <h3 className="text-xl font-poppins font-medium text-blue-300 mb-4">Our Vision</h3>
          <p className="text-slate-300 mb-4">
            SurakshaNet aims to revolutionize cybersecurity and public safety by providing law enforcement agencies with cutting-edge AI-powered tools to combat digital crimes, financial fraud, and enhance public safety.
          </p>
          <p className="text-slate-300">
            We envision a future where technology serves as a force multiplier for law enforcement, enabling faster response times, more accurate threat detection, and enhanced investigative capabilities while maintaining the highest standards of privacy and ethical use.
          </p>
        </ElegantCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ElegantCard variant="accent">
            <h3 className="text-xl font-poppins font-medium text-blue-300 mb-4">Key Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-1 rounded-md mr-3 mt-0.5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300">AI-powered fraud detection and prevention</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-1 rounded-md mr-3 mt-0.5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300">Deepfake detection and media authenticity verification</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-1 rounded-md mr-3 mt-0.5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300">Advanced facial recognition for missing persons</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-1 rounded-md mr-3 mt-0.5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300">Legal assistance and case management</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-500/10 p-1 rounded-md mr-3 mt-0.5">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300">Phishing and scam detection systems</span>
              </li>
            </ul>
          </ElegantCard>
          
          <ElegantCard variant="glass">
            <h3 className="text-xl font-poppins font-medium text-blue-300 mb-4">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  <h4 className="font-medium text-blue-400">{tech.name}</h4>
                  <p className="text-xs text-slate-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </ElegantCard>
        </div>
        
        {/* Roadmap */}
        <h3 className="text-xl font-poppins font-medium text-blue-300 mb-4">Development Roadmap</h3>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-600 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {roadmapItems.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-4 shadow-blue-glow-sm z-10">
                  <span className="text-white text-xs font-medium">{index + 1}</span>
                </div>
                <div className="bg-slate-800/70 rounded-lg p-4 flex-grow border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-blue-400">{item.phase}: {item.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Developer Information */}
      <div className="mt-12 pt-8 border-t border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-poppins font-medium text-blue-300 mb-2">Developer</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-4 text-white font-bold">
                R
              </div>
              <div>
                <h4 className="font-medium text-white">Rahul Kumar Sharma</h4>
                <p className="text-sm text-slate-400">Lead Developer & Security Specialist</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-400">
              &copy; 2025 SurakshaNet by Rahul Kumar Sharma
            </p>
            <p className="text-xs text-slate-500 mt-1">
              All rights reserved. Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantApp;