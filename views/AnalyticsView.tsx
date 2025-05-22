import React from 'react';
import ElegantCard from '../components/ElegantCard';
import { BarChart3, PieChart, TrendingUp, Users, ShieldAlert, Clock, Calendar } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  // Sample data for charts
  const securityIncidents = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 38 },
    { month: 'Mar', count: 52 },
    { month: 'Apr', count: 41 },
    { month: 'May', count: 37 },
    { month: 'Jun', count: 29 },
  ];

  const maxIncident = Math.max(...securityIncidents.map(item => item.count));

  return (
    <div className="view-container">
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </span>
        </h1>
        <p className="text-slate-400">
          Comprehensive analytics and insights for security monitoring and threat detection.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Incidents" 
          value="1,248" 
          change="+12.5%" 
          trend="up"
          icon={<ShieldAlert size={20} className="text-blue-400" />}
        />
        <StatCard 
          title="Active Users" 
          value="847" 
          change="+5.3%" 
          trend="up"
          icon={<Users size={20} className="text-blue-400" />}
        />
        <StatCard 
          title="Response Time" 
          value="1.8s" 
          change="-0.3s" 
          trend="down"
          icon={<Clock size={20} className="text-blue-400" />}
        />
        <StatCard 
          title="Detection Rate" 
          value="98.2%" 
          change="+2.1%" 
          trend="up"
          icon={<TrendingUp size={20} className="text-blue-400" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ElegantCard title="Security Incidents (Last 6 Months)" className="h-full">
          <div className="flex items-end h-64 mt-4 space-x-2">
            {securityIncidents.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-slate-700/50 rounded-t-sm relative overflow-hidden" 
                     style={{ height: `${(item.count / maxIncident) * 180}px` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-indigo-600/80 shimmer"></div>
                </div>
                <div className="text-xs text-slate-400 mt-2">{item.month}</div>
                <div className="text-sm font-medium text-white">{item.count}</div>
              </div>
            ))}
          </div>
        </ElegantCard>

        <ElegantCard title="Threat Distribution" className="h-full">
          <div className="flex items-center justify-center h-64 mt-4">
            {/* Simulated pie chart */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 rounded-full border-8 border-blue-500/30"></div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 border-b-indigo-500 animate-pulse-subtle"></div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-400 rotate-[220deg] animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-blue-600 border-t-blue-600 rotate-[110deg] animate-pulse-subtle" style={{ animationDelay: '0.5s' }}></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart size={28} className="text-blue-400" />
              </div>
            </div>
            
            <div className="ml-8 space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Phishing (42%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Malware (28%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Data Breach (18%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-800 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Other (12%)</span>
              </div>
            </div>
          </div>
        </ElegantCard>
      </div>

      {/* Recent Activity */}
      <ElegantCard title="Recent Activity">
        <div className="space-y-4 mt-2">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <ActivityItem key={index} index={index} />
          ))}
        </div>
      </ElegantCard>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}> = ({ title, value, change, trend, icon }) => {
  return (
    <ElegantCard className="h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="text-2xl font-medium text-white mt-1">{value}</h3>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className={`mt-4 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
        {change} {trend === 'up' ? '↑' : '↓'}
      </div>
    </ElegantCard>
  );
};

// Activity Item Component
const ActivityItem: React.FC<{ index: number }> = ({ index }) => {
  const activities = [
    {
      title: 'Suspicious login detected',
      description: 'Multiple failed login attempts from IP 192.168.1.45',
      time: '2 hours ago',
      icon: <ShieldAlert size={16} className="text-amber-400" />
    },
    {
      title: 'Phishing attempt blocked',
      description: 'Email with malicious attachment quarantined',
      time: '4 hours ago',
      icon: <ShieldAlert size={16} className="text-emerald-400" />
    },
    {
      title: 'System update completed',
      description: 'Security patches applied successfully',
      time: '6 hours ago',
      icon: <Calendar size={16} className="text-blue-400" />
    },
    {
      title: 'New user registered',
      description: 'Officer ID #45892 added to the system',
      time: '8 hours ago',
      icon: <Users size={16} className="text-blue-400" />
    },
    {
      title: 'Threat intelligence updated',
      description: 'New threat signatures added to database',
      time: '10 hours ago',
      icon: <BarChart3 size={16} className="text-indigo-400" />
    }
  ];

  const activity = activities[index];

  return (
    <div className="flex items-start p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
      <div className="bg-slate-700 p-2 rounded-lg mr-3">
        {activity.icon}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-white">{activity.title}</h4>
        <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
      </div>
      <div className="text-xs text-slate-500 whitespace-nowrap">
        {activity.time}
      </div>
    </div>
  );
};