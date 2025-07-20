import React, { useState } from 'react';
import { SecurityProvider } from './context/SecurityContext';
import NetworkScanner from './components/NetworkScanner';
import MITMAttack from './components/MITMAttack';
import DNSSpoof from './components/DNSSpoof';
import IDS from './components/IDS';
import { Shield, Wifi, Target, Globe, Activity } from 'lucide-react';

type ActiveTab = 'scanner' | 'mitm' | 'dns' | 'ids';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');

  const tabs = [
    { id: 'scanner' as const, label: 'Network Scanner', icon: Wifi, component: NetworkScanner },
    { id: 'mitm' as const, label: 'MITM Attack', icon: Target, component: MITMAttack },
    { id: 'dns' as const, label: 'DNS Spoofing', icon: Globe, component: DNSSpoof },
    { id: 'ids' as const, label: 'IDS', icon: Shield, component: IDS },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || NetworkScanner;

  return (
    <SecurityProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation Header */}
        <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
                    <Activity className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Network Security Toolkit
                    </h1>
                    <p className="text-xs text-gray-400">Cybersecurity Testing & Analysis Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:block">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <ActiveComponent />
        </main>
      </div>
    </SecurityProvider>
  );
}

export default App;