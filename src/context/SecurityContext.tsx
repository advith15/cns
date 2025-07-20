import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SecurityState {
  networkDevices: any[];
  threats: any[];
  isScanning: boolean;
  isAttacking: boolean;
  isMonitoring: boolean;
  aiEnabled: boolean;
  riskScore: number;
}

interface SecurityContextType {
  state: SecurityState;
  updateNetworkDevices: (devices: any[]) => void;
  addThreat: (threat: any) => void;
  setScanning: (scanning: boolean) => void;
  setAttacking: (attacking: boolean) => void;
  setMonitoring: (monitoring: boolean) => void;
  toggleAI: () => void;
  updateRiskScore: (score: number) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [state, setState] = useState<SecurityState>({
    networkDevices: [],
    threats: [],
    isScanning: false,
    isAttacking: false,
    isMonitoring: false,
    aiEnabled: true,
    riskScore: 0,
  });

  const updateNetworkDevices = (devices: any[]) => {
    setState(prev => ({ ...prev, networkDevices: devices }));
  };

  const addThreat = (threat: any) => {
    setState(prev => ({ 
      ...prev, 
      threats: [threat, ...prev.threats.slice(0, 19)] 
    }));
  };

  const setScanning = (scanning: boolean) => {
    setState(prev => ({ ...prev, isScanning: scanning }));
  };

  const setAttacking = (attacking: boolean) => {
    setState(prev => ({ ...prev, isAttacking: attacking }));
  };

  const setMonitoring = (monitoring: boolean) => {
    setState(prev => ({ ...prev, isMonitoring: monitoring }));
  };

  const toggleAI = () => {
    setState(prev => ({ ...prev, aiEnabled: !prev.aiEnabled }));
  };

  const updateRiskScore = (score: number) => {
    setState(prev => ({ ...prev, riskScore: score }));
  };

  const contextValue: SecurityContextType = {
    state,
    updateNetworkDevices,
    addThreat,
    setScanning,
    setAttacking,
    setMonitoring,
    toggleAI,
    updateRiskScore,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};