import React, { useState, useEffect } from 'react';
import ElegantCard from '@/components/ElegantCard';
import ElegantButton from '@/components/ElegantButton';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  HelpCircle, 
  Save,
  Moon,
  Sun,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Upload
} from 'lucide-react';

// Define interfaces for our state
interface AccountSettings {
  fullName: string;
  badgeNumber: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  station: string;
  jurisdiction: string;
  publicProfile: boolean;
  caseNotifications: boolean;
  avatar?: string;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Sample settings states
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem('emailAlerts');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => {
    const saved = localStorage.getItem('twoFactorAuth');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [autoLogout, setAutoLogout] = useState(() => {
    const saved = localStorage.getItem('autoLogout');
    return saved !== null ? JSON.parse(saved) : 30;
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved !== null ? saved : 'english';
  });
  
  // Account settings state
  const [accountSettings, setAccountSettings] = useState<AccountSettings>(() => {
    const saved = localStorage.getItem('accountSettings');
    return saved !== null ? JSON.parse(saved) : {
      fullName: 'Agent Kumar',
      badgeNumber: 'KVH-7890',
      email: 'agent.kumar@police.gov.in',
      phone: '+91 98765 43210',
      department: 'cyber',
      designation: 'officer',
      station: 'Delhi Cyber Cell HQ',
      jurisdiction: 'Delhi NCR',
      publicProfile: true,
      caseNotifications: true
    };
  });
  
  // Handle input changes for account settings
  const handleAccountChange = (field: keyof AccountSettings, value: string | boolean) => {
    setAccountSettings(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      return updated;
    });
  };
  
  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAccountSettings(prev => {
          const updated = {
            ...prev,
            avatar: base64String
          };
          // Update localStorage immediately to reflect changes in header
          localStorage.setItem('userProfile', JSON.stringify({
            name: updated.fullName,
            role: updated.designation === 'officer' ? 'Cyber Security Officer' : 
                 updated.designation === 'inspector' ? 'Inspector' :
                 updated.designation === 'dsp' ? 'Deputy Superintendent' :
                 updated.designation === 'sp' ? 'Superintendent' : 'Officer',
            avatar: base64String
          }));
          return updated;
        });
        showNotification('success', 'Profile picture updated successfully!');
        
        // Trigger an event to notify other components about the update
        window.dispatchEvent(new CustomEvent('user-profile-updated'));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('emailAlerts', JSON.stringify(emailAlerts));
    localStorage.setItem('twoFactorAuth', JSON.stringify(twoFactorAuth));
    localStorage.setItem('autoLogout', JSON.stringify(autoLogout));
    localStorage.setItem('language', language);
  }, [darkMode, notifications, emailAlerts, twoFactorAuth, autoLogout, language]);
  
  // Initialize user profile in localStorage if it doesn't exist
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      localStorage.setItem('userProfile', JSON.stringify({
        name: accountSettings.fullName,
        role: accountSettings.designation === 'officer' ? 'Cyber Security Officer' : 
             accountSettings.designation === 'inspector' ? 'Inspector' :
             accountSettings.designation === 'dsp' ? 'Deputy Superintendent' :
             accountSettings.designation === 'sp' ? 'Superintendent' : 'Officer',
        avatar: accountSettings.avatar
      }));
    }
    
    // Listen for navigation events from the header
    const handleNavigateToSettings = (event: CustomEvent) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('navigate-to-settings', handleNavigateToSettings as EventListener);
    
    return () => {
      window.removeEventListener('navigate-to-settings', handleNavigateToSettings as EventListener);
    };
  }, []);
  
  // Notification state
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Save account settings to localStorage
  const saveAccountSettings = () => {
    localStorage.setItem('accountSettings', JSON.stringify(accountSettings));
    
    // Update userProfile in localStorage for the header
    localStorage.setItem('userProfile', JSON.stringify({
      name: accountSettings.fullName,
      role: accountSettings.designation === 'officer' ? 'Cyber Security Officer' : 
           accountSettings.designation === 'inspector' ? 'Inspector' :
           accountSettings.designation === 'dsp' ? 'Deputy Superintendent' :
           accountSettings.designation === 'sp' ? 'Superintendent' : 'Officer',
      avatar: accountSettings.avatar
    }));
    
    // Trigger an event to notify other components about the update
    window.dispatchEvent(new CustomEvent('user-profile-updated'));
    
    // Show success notification
    showNotification('success', 'Account settings saved successfully!');
  };
  
  return (
    <div className="space-y-6 animate-fadeInUp relative">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fadeIn ${
          notification.type === 'success' ? 'bg-green-500/90 text-white' :
          notification.type === 'error' ? 'bg-red-500/90 text-white' :
          'bg-blue-500/90 text-white'
        }`}>
          <span>
            {notification.type === 'success' && <CheckCircle size={18} />}
            {notification.type === 'error' && <AlertCircle size={18} />}
            {notification.type === 'info' && <Info size={18} />}
          </span>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 text-white/80 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-slate-400">
          Configure your account, security, and application preferences.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <ElegantCard className="p-0 overflow-hidden">
            <nav>
              <SettingsNavItem 
                icon={<Settings size={18} />} 
                label="General" 
                active={activeTab === 'general'} 
                onClick={() => setActiveTab('general')} 
              />
              <SettingsNavItem 
                icon={<User size={18} />} 
                label="Account" 
                active={activeTab === 'account'} 
                onClick={() => setActiveTab('account')}
                data-tab="account"
              />
              <SettingsNavItem 
                icon={<Bell size={18} />} 
                label="Notifications" 
                active={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')} 
              />
              <SettingsNavItem 
                icon={<Shield size={18} />} 
                label="Security" 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
              />
              <SettingsNavItem 
                icon={<Key size={18} />} 
                label="API Keys" 
                active={activeTab === 'api'} 
                onClick={() => setActiveTab('api')} 
              />
              <SettingsNavItem 
                icon={<Globe size={18} />} 
                label="Language" 
                active={activeTab === 'language'} 
                onClick={() => setActiveTab('language')} 
              />
              <SettingsNavItem 
                icon={<HelpCircle size={18} />} 
                label="Help & Support" 
                active={activeTab === 'help'} 
                onClick={() => setActiveTab('help')} 
              />
            </nav>
          </ElegantCard>
        </div>
        
        {/* Settings Content */}
        <div className="flex-grow">
          {activeTab === 'general' && (
            <ElegantCard title="General Settings">
              <div className="space-y-6">
                <SettingsToggle
                  icon={darkMode ? <Moon size={18} /> : <Sun size={18} />}
                  title="Dark Mode"
                  description="Enable dark mode for the application interface"
                  isEnabled={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Session Timeout</h3>
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-slate-300">Auto logout after inactivity (minutes)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={autoLogout}
                        onChange={(e) => setAutoLogout(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-blue-400 font-medium w-8">{autoLogout}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Theme Customization</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <ThemeColorOption color="blue" isSelected={true} />
                    <ThemeColorOption color="purple" isSelected={false} />
                    <ThemeColorOption color="teal" isSelected={false} />
                    <ThemeColorOption color="amber" isSelected={false} />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <ElegantButton 
                    variant="primary" 
                    icon={<Save size={16} />}
                    onClick={() => {
                      // Save general settings
                      localStorage.setItem('darkMode', JSON.stringify(darkMode));
                      localStorage.setItem('autoLogout', JSON.stringify(autoLogout));
                      showNotification('success', 'General settings saved successfully!');
                    }}
                  >
                    Save Changes
                  </ElegantButton>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'notifications' && (
            <ElegantCard title="Notification Settings">
              <div className="space-y-6">
                <SettingsToggle
                  icon={<Bell size={18} />}
                  title="Push Notifications"
                  description="Receive in-app notifications for important events"
                  isEnabled={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                
                <SettingsToggle
                  icon={<Bell size={18} />}
                  title="Email Alerts"
                  description="Receive email notifications for critical security events"
                  isEnabled={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                />
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Notification Categories</h3>
                  <div className="space-y-3">
                    <NotificationCategory 
                      title="Security Alerts" 
                      isEnabled={true} 
                      priority="high"
                    />
                    <NotificationCategory 
                      title="System Updates" 
                      isEnabled={true} 
                      priority="medium"
                    />
                    <NotificationCategory 
                      title="New Reports" 
                      isEnabled={true} 
                      priority="medium"
                    />
                    <NotificationCategory 
                      title="User Activity" 
                      isEnabled={false} 
                      priority="low"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <ElegantButton 
                    variant="primary" 
                    icon={<Save size={16} />}
                    onClick={() => {
                      // Save notification settings
                      localStorage.setItem('notifications', JSON.stringify(notifications));
                      localStorage.setItem('emailAlerts', JSON.stringify(emailAlerts));
                      showNotification('success', 'Notification settings saved successfully!');
                    }}
                  >
                    Save Changes
                  </ElegantButton>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'security' && (
            <ElegantCard title="Security Settings">
              <div className="space-y-6">
                <SettingsToggle
                  icon={<Shield size={18} />}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  isEnabled={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Current Password</label>
                      <input type="password" className="elegant-input w-full" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">New Password</label>
                      <input type="password" className="elegant-input w-full" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Confirm New Password</label>
                      <input type="password" className="elegant-input w-full" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Login History</h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Last login</span>
                      <span className="text-blue-400">Today, 10:45 AM</span>
                    </div>
                    <div className="text-slate-400">From IP: 192.168.1.1 • Delhi, India</div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <ElegantButton 
                    variant="primary" 
                    icon={<Save size={16} />}
                    onClick={() => {
                      // Save security settings
                      localStorage.setItem('twoFactorAuth', JSON.stringify(twoFactorAuth));
                      showNotification('success', 'Security settings saved successfully!');
                    }}
                  >
                    Save Changes
                  </ElegantButton>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'language' && (
            <ElegantCard title="Language Settings">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">Select Language</label>
                  <select 
                    className="elegant-input w-full"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="bengali">Bengali</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                    <option value="marathi">Marathi</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Date & Time Format</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Date Format</label>
                      <select className="elegant-input w-full">
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Time Format</label>
                      <select className="elegant-input w-full">
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <ElegantButton 
                    variant="primary" 
                    icon={<Save size={16} />}
                    onClick={() => {
                      // Save language settings
                      localStorage.setItem('language', language);
                      showNotification('success', 'Language settings saved successfully!');
                    }}
                  >
                    Save Changes
                  </ElegantButton>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'api' && (
            <ElegantCard title="API Key Settings">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Gemini API Key</h3>
                  <div className="flex">
                    <input 
                      type="password" 
                      className="elegant-input w-full rounded-r-none" 
                      value="AIzaSyBh4nR8izTFHmcZA5-yxlDXzWYwaiK4NqY" 
                      readOnly
                    />
                    <button className="elegant-button-outline rounded-l-none px-4">
                      Show
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Used for AI-powered features across the platform
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Other API Keys</h3>
                  <div className="space-y-4">
                    <ApiKeyItem 
                      name="Facial Recognition API" 
                      status="active" 
                      expiresIn="Never"
                    />
                    <ApiKeyItem 
                      name="Threat Intelligence API" 
                      status="active" 
                      expiresIn="30 days"
                    />
                    <ApiKeyItem 
                      name="Voice Analysis API" 
                      status="inactive" 
                      expiresIn="Expired"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <ElegantButton 
                    variant="outline" 
                    className="mr-2"
                  >
                    Generate New Key
                  </ElegantButton>
                  <ElegantButton 
                    variant="primary" 
                    icon={<Save size={16} />}
                  >
                    Save Changes
                  </ElegantButton>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'account' && (
            <ElegantCard title="Account Settings">
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar Upload */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {accountSettings.avatar ? (
                          <img 
                            src={accountSettings.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{accountSettings.fullName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Upload size={18} className="text-white" />
                      </div>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-300 block mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="elegant-input w-full" 
                          placeholder="John Doe"
                          value={accountSettings.fullName}
                          onChange={(e) => handleAccountChange('fullName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-300 block mb-1">Badge Number</label>
                        <input 
                          type="text" 
                          className="elegant-input w-full" 
                          placeholder="e.g. KVH-1234"
                          value={accountSettings.badgeNumber}
                          onChange={(e) => handleAccountChange('badgeNumber', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="elegant-input w-full" 
                        placeholder="your.email@example.com"
                        value={accountSettings.email}
                        onChange={(e) => handleAccountChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="elegant-input w-full" 
                        placeholder="+91 XXXXX XXXXX"
                        value={accountSettings.phone}
                        onChange={(e) => handleAccountChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Department Information */}
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Department Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Department</label>
                      <select 
                        className="elegant-input w-full"
                        value={accountSettings.department}
                        onChange={(e) => handleAccountChange('department', e.target.value)}
                      >
                        <option value="cyber">Cyber Crime Unit</option>
                        <option value="intelligence">Intelligence Bureau</option>
                        <option value="investigation">Investigation Department</option>
                        <option value="traffic">Traffic Police</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Designation</label>
                      <select 
                        className="elegant-input w-full"
                        value={accountSettings.designation}
                        onChange={(e) => handleAccountChange('designation', e.target.value)}
                      >
                        <option value="officer">Cyber Security Officer</option>
                        <option value="inspector">Inspector</option>
                        <option value="dsp">Deputy Superintendent</option>
                        <option value="sp">Superintendent</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Station/Unit</label>
                      <input 
                        type="text" 
                        className="elegant-input w-full" 
                        placeholder="e.g. Central Cyber Cell"
                        value={accountSettings.station}
                        onChange={(e) => handleAccountChange('station', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Jurisdiction</label>
                      <input 
                        type="text" 
                        className="elegant-input w-full" 
                        placeholder="e.g. North District"
                        value={accountSettings.jurisdiction}
                        onChange={(e) => handleAccountChange('jurisdiction', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Account Preferences */}
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Account Preferences</h3>
                  <div className="space-y-3">
                    <SettingsToggle
                      icon={<User size={18} />}
                      title="Public Profile"
                      description="Make your profile visible to other department members"
                      isEnabled={accountSettings.publicProfile}
                      onChange={() => handleAccountChange('publicProfile', !accountSettings.publicProfile)}
                    />
                    <SettingsToggle
                      icon={<Bell size={18} />}
                      title="Case Notifications"
                      description="Receive notifications for case updates and assignments"
                      isEnabled={accountSettings.caseNotifications}
                      onChange={() => handleAccountChange('caseNotifications', !accountSettings.caseNotifications)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <div className="flex gap-3">
                    <ElegantButton 
                      variant="outline"
                      onClick={() => {
                        // Reset to saved settings
                        const saved = localStorage.getItem('accountSettings');
                        if (saved) {
                          setAccountSettings(JSON.parse(saved));
                          showNotification('info', 'Changes discarded');
                        }
                      }}
                    >
                      Cancel
                    </ElegantButton>
                    <ElegantButton 
                      variant="primary" 
                      icon={<Save size={16} />}
                      onClick={saveAccountSettings}
                    >
                      Save Changes
                    </ElegantButton>
                  </div>
                </div>
              </div>
            </ElegantCard>
          )}
          
          {activeTab === 'help' && (
            <ElegantCard title="Help & Support">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Documentation</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Access comprehensive guides and documentation for using the Kavach platform.
                  </p>
                  <ElegantButton variant="outline">
                    View Documentation
                  </ElegantButton>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Contact Support</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Need help? Our support team is available 24/7.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Subject</label>
                      <select className="elegant-input w-full">
                        <option value="">Select a topic</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account Problem</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300 block mb-1">Priority</label>
                      <select className="elegant-input w-full">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-slate-300 block mb-1">Message</label>
                    <textarea 
                      className="elegant-input w-full min-h-[120px]" 
                      placeholder="Describe your issue or question in detail..."
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <ElegantButton variant="primary">
                      Submit Request
                    </ElegantButton>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">FAQ</h3>
                  <div className="space-y-3">
                    <FaqItem 
                      question="How do I reset my password?" 
                      answer="You can reset your password by going to the Security tab in Settings and clicking on the 'Change Password' option."
                    />
                    <FaqItem 
                      question="Can I use Kavach on mobile devices?" 
                      answer="Yes, Kavach is fully responsive and works on all modern mobile devices and tablets."
                    />
                    <FaqItem 
                      question="How do I configure API keys?" 
                      answer="API keys can be configured in the API Keys section of the Settings page."
                    />
                  </div>
                </div>
              </div>
            </ElegantCard>
          )}
        </div>
      </div>
    </div>
  );
};

// FAQ Item Component
const FaqItem: React.FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-700/50 rounded-lg overflow-hidden">
      <button 
        className="w-full p-3 text-left flex justify-between items-center hover:bg-slate-800/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-slate-200">{question}</span>
        <span className="text-blue-400 transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={16} />
        </span>
      </button>
      {isOpen && (
        <div className="p-3 pt-0 text-sm text-slate-400 border-t border-slate-700/50">
          {answer}
        </div>
      )}
    </div>
  );
};

// Settings Navigation Item
const SettingsNavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  'data-tab'?: string;
}> = ({ icon, label, active, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 transition-colors ${
        active 
          ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
      }`}
      {...props}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Settings Toggle Component
const SettingsToggle: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  isEnabled: boolean;
  onChange: () => void;
}> = ({ icon, title, description, isEnabled, onChange }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start">
        <div className="bg-slate-800 p-2 rounded-lg mr-3">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <button onClick={onChange} className="text-blue-400">
        {isEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
      </button>
    </div>
  );
};

// Theme Color Option
const ThemeColorOption: React.FC<{
  color: string;
  isSelected: boolean;
}> = ({ color, isSelected }) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'purple': return 'bg-gradient-to-br from-purple-500 to-purple-700';
      case 'teal': return 'bg-gradient-to-br from-teal-500 to-teal-700';
      case 'amber': return 'bg-gradient-to-br from-amber-500 to-amber-700';
      default: return 'bg-gradient-to-br from-blue-500 to-blue-700';
    }
  };
  
  return (
    <button 
      className={`w-12 h-12 rounded-full ${getColorClass()} flex items-center justify-center ${
        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : ''
      }`}
    >
      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
    </button>
  );
};

// Notification Category
const NotificationCategory: React.FC<{
  title: string;
  isEnabled: boolean;
  priority: 'high' | 'medium' | 'low';
}> = ({ title, isEnabled, priority }) => {
  const getPriorityBadge = () => {
    switch (priority) {
      case 'high': return <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">High</span>;
      case 'medium': return <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">Medium</span>;
      case 'low': return <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">Low</span>;
      default: return null;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
      <div className="flex items-center">
        <span className="text-sm text-white mr-2">{title}</span>
        {getPriorityBadge()}
      </div>
      <div className="text-blue-400">
        {isEnabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
      </div>
    </div>
  );
};

// API Key Item
const ApiKeyItem: React.FC<{
  name: string;
  status: 'active' | 'inactive';
  expiresIn: string;
}> = ({ name, status, expiresIn }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
      <div>
        <h4 className="text-sm font-medium text-white">{name}</h4>
        <div className="flex items-center mt-1">
          <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-400' : 'bg-red-400'} mr-1.5`}></span>
          <span className="text-xs text-slate-400">
            {status === 'active' ? 'Active' : 'Inactive'} • Expires: {expiresIn}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="text-xs text-blue-400 hover:text-blue-300">Refresh</button>
        <button className="text-xs text-slate-400 hover:text-slate-300">Revoke</button>
      </div>
    </div>
  );
};