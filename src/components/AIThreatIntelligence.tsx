import React, { useState, useEffect } from 'react';
import { Brain, Shield, AlertTriangle, Zap, Activity, Target, TrendingUp, Eye } from 'lucide-react';

interface ThreatIntelligence {
  id: string;
  type: 'malware' | 'intrusion' | 'anomaly' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  source: string;
  timestamp: Date;
  aiAnalysis: string;
  mitigationSteps: string[];
  attackVector: string;
}

interface NetworkAnomaly {
  id: string;
  anomalyType: string;
  deviationScore: number;
  normalPattern: number;
  currentPattern: number;
  timestamp: Date;
  affectedDevices: string[];
  aiConfidence: number;
}

interface AIMetrics {
  threatsDetected: number;
  anomaliesFound: number;
  riskScore: number;
  modelAccuracy: number;
  learningProgress: number;
}

const AIThreatIntelligence: React.FC = () => {
  const [threats, setThreats] = useState<ThreatIntelligence[]>([]);
  const [anomalies, setAnomalies] = useState<NetworkAnomaly[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'active' | 'learning'>('idle');
  const [metrics, setMetrics] = useState<AIMetrics>({
    threatsDetected: 0,
    anomaliesFound: 0,
    riskScore: 0,
    modelAccuracy: 95.2,
    learningProgress: 0
  });
  const [selectedThreat, setSelectedThreat] = useState<ThreatIntelligence | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (aiStatus === 'active') {
        generateThreatIntelligence();
        updateAIMetrics();
        detectNetworkAnomalies();
      } else if (aiStatus === 'learning') {
        updateLearningProgress();
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [aiStatus]);

  const generateThreatIntelligence = () => {
    const threatDatabase = [
      {
        type: 'intrusion' as const,
        description: 'Advanced Persistent Threat (APT) detected',
        source: 'Deep Learning Network Analysis',
        aiAnalysis: 'Neural network identified sophisticated multi-stage attack pattern with 96% confidence. Behavioral analysis indicates state-sponsored threat actor.',
        mitigationSteps: ['Isolate affected systems', 'Enable enhanced monitoring', 'Update threat signatures', 'Conduct forensic analysis'],
        attackVector: 'Lateral Movement via Credential Stuffing'
      },
      {
        type: 'malware' as const,
        description: 'Zero-day malware communication detected',
        source: 'AI Behavioral Analysis Engine',
        aiAnalysis: 'Machine learning model detected unknown C2 communication protocol. Pattern analysis suggests new malware family with evasion capabilities.',
        mitigationSteps: ['Quarantine infected devices', 'Update ML models', 'Deploy behavioral shields', 'Coordinate with threat intelligence'],
        attackVector: 'Command & Control Communication'
      },
      {
        type: 'anomaly' as const,
        description: 'Unusual data exfiltration pattern identified',
        source: 'Predictive Analytics Engine',
        aiAnalysis: 'Time-series analysis reveals data exfiltration attempts disguised as normal traffic. AI detected 87% probability of insider threat.',
        mitigationSteps: ['Monitor user activities', 'Implement DLP controls', 'Review access permissions', 'Enhanced user behavior analytics'],
        attackVector: 'Data Exfiltration via Steganography'
      },
      {
        type: 'vulnerability' as const,
        description: 'AI-predicted attack surface expansion',
        source: 'Vulnerability Prediction Model',
        aiAnalysis: 'Predictive model indicates 83% probability of exploitation within 72 hours based on current network configuration.',
        mitigationSteps: ['Patch critical vulnerabilities', 'Reduce attack surface', 'Deploy virtual patching', 'Schedule security assessment'],
        attackVector: 'Exploitation of Unpatched Services'
      }
    ];

    const severities: ThreatIntelligence['severity'][] = ['low', 'medium', 'high', 'critical'];
    const randomThreat = threatDatabase[Math.floor(Math.random() * threatDatabase.length)];
    
    const newThreat: ThreatIntelligence = {
      id: `threat-${Date.now()}`,
      type: randomThreat.type,
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: Math.floor(Math.random() * 25) + 75,
      description: randomThreat.description,
      source: randomThreat.source,
      timestamp: new Date(),
      aiAnalysis: randomThreat.aiAnalysis,
      mitigationSteps: randomThreat.mitigationSteps,
      attackVector: randomThreat.attackVector
    };

    setThreats(prev => [newThreat, ...prev.slice(0, 7)]);
  };

  const detectNetworkAnomalies = () => {
    const anomalyTypes = [
      'Traffic Volume Anomaly',
      'Connection Pattern Deviation',
      'Protocol Usage Anomaly',
      'Port Activity Outlier',
      'Bandwidth Consumption Spike',
      'Session Duration Anomaly'
    ];
    
    const newAnomaly: NetworkAnomaly = {
      id: `anomaly-${Date.now()}`,
      anomalyType: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      deviationScore: Math.random() * 100,
      normalPattern: Math.floor(Math.random() * 1000) + 500,
      currentPattern: Math.floor(Math.random() * 2000) + 800,
      timestamp: new Date(),
      affectedDevices: Array.from({length: Math.floor(Math.random() * 3) + 1}, () => 
        `192.168.1.${Math.floor(Math.random() * 254) + 1}`
      ),
      aiConfidence: Math.floor(Math.random() * 30) + 70
    };

    setAnomalies(prev => [newAnomaly, ...prev.slice(0, 5)]);
  };

  const updateAIMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      threatsDetected: threats.length,
      anomaliesFound: anomalies.length,
      riskScore: Math.min(calculateRiskScore(), 100),
      modelAccuracy: Math.min(prev.modelAccuracy + Math.random() * 0.1, 99.9)
    }));
  };

  const updateLearningProgress = () => {
    setMetrics(prev => ({
      ...prev,
      learningProgress: Math.min(prev.learningProgress + 2, 100)
    }));

    if (metrics.learningProgress >= 100) {
      setAiStatus('active');
      setMetrics(prev => ({ ...prev, learningProgress: 0 }));
    }
  };

  const calculateRiskScore = () => {
    const threatScore = threats.reduce((acc, threat) => {
      const severityWeight = { low: 1, medium: 3, high: 6, critical: 10 }[threat.severity];
      return acc + (severityWeight * threat.confidence / 100);
    }, 0);
    
    const anomalyScore = anomalies.reduce((acc, anomaly) => {
      return acc + (anomaly.deviationScore * anomaly.aiConfidence / 100);
    }, 0);

    return Math.floor((threatScore + anomalyScore) * 2);
  };

  const startAIEngine = () => {
    setAiStatus('learning');
    setMetrics(prev => ({ ...prev, learningProgress: 0 }));
  };

  const stopAIEngine = () => {
    setAiStatus('idle');
    setThreats([]);
    setAnomalies([]);
    setMetrics(prev => ({
      ...prev,
      threatsDetected: 0,
      anomaliesFound: 0,
      riskScore: 0,
      learningProgress: 0
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 25) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (score < 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (score < 75) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'learning': return <Brain className="w-6 h-6 text-blue-400 animate-pulse" />;
      case 'active': return <Eye className="w-6 h-6 text-green-400 animate-pulse" />;
      case 'analyzing': return <Activity className="w-6 h-6 text-yellow-400 animate-spin" />;
      default: return <Brain className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
              <Brain className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Threat Intelligence
              </h1>
              <p className="text-gray-400">Advanced Machine Learning Security Analytics</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 ${getRiskScoreColor(metrics.riskScore)} backdrop-blur-sm`}>
              <Shield className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-80">Network Risk</p>
                <p className="font-bold">{metrics.riskScore}%</p>
              </div>
            </div>
            
            {aiStatus === 'idle' ? (
              <button
                onClick={startAIEngine}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                <Zap className="w-5 h-5" />
                <span>Initialize AI Engine</span>
              </button>
            ) : (
              <button
                onClick={stopAIEngine}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <span>Stop AI Engine</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Status Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <h3 className="text-lg font-semibold">AI Engine Status</h3>
                  <p className="text-gray-400 capitalize">
                    {aiStatus === 'learning' ? 'Training ML Models...' : 
                     aiStatus === 'active' ? 'Active Monitoring' : 
                     aiStatus === 'analyzing' ? 'Analyzing Threats...' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Model Accuracy</p>
                <p className="text-xl font-bold text-cyan-400">{metrics.modelAccuracy.toFixed(1)}%</p>
              </div>
            </div>
            
            {aiStatus === 'learning' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Learning Progress</span>
                  <span>{metrics.learningProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.learningProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold">Threats Detected</h3>
            </div>
            <p className="text-3xl font-bold text-red-400">{metrics.threatsDetected}</p>
            <p className="text-sm text-gray-400">AI-Identified Threats</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold">Anomalies Found</h3>
            </div>
            <p className="text-3xl font-bold text-orange-400">{metrics.anomaliesFound}</p>
            <p className="text-sm text-gray-400">Behavioral Deviations</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Threat Intelligence Feed */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold">Real-Time Threat Intelligence</h2>
              </div>
              
              <div className="space-y-4">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>AI Engine is ready to detect threats</p>
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div
                      key={threat.id}
                      onClick={() => setSelectedThreat(threat)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(threat.severity)} hover:shadow-lg`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{threat.description}</h3>
                          <p className="text-sm opacity-80">{threat.attackVector}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </span>
                          <p className="text-xs mt-1 opacity-80">{threat.confidence}% confidence</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs opacity-70">
                        <span>{threat.source}</span>
                        <span>{threat.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Network Anomalies */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-orange-400" />
                <h2 className="text-xl font-bold">AI Behavioral Analysis</h2>
              </div>
              
              <div className="space-y-3">
                {anomalies.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <p>No anomalies detected</p>
                  </div>
                ) : (
                  anomalies.map((anomaly) => (
                    <div key={anomaly.id} className="p-3 bg-gray-700/30 rounded-lg border border-orange-400/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-orange-400">{anomaly.anomalyType}</h4>
                        <span className="text-xs bg-orange-400/20 px-2 py-1 rounded">
                          {anomaly.aiConfidence}% AI Confidence
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Normal Pattern:</p>
                          <p className="font-mono">{anomaly.normalPattern}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Current Pattern:</p>
                          <p className="font-mono text-orange-400">{anomaly.currentPattern}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">Affected Devices:</p>
                        <p className="text-sm font-mono">{anomaly.affectedDevices.join(', ')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Threat Details Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-6">AI Analysis Details</h2>
              
              {selectedThreat ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">Threat Description</h3>
                    <p className="text-sm text-gray-300">{selectedThreat.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">AI Analysis</h3>
                    <p className="text-sm text-gray-300">{selectedThreat.aiAnalysis}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">Attack Vector</h3>
                    <p className="text-sm text-gray-300">{selectedThreat.attackVector}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-cyan-400">Recommended Actions</h3>
                    <div className="space-y-2">
                      {selectedThreat.mitigationSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-300">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a threat to view AI analysis</p>
                </div>
              )}
            </div>

            {/* AI Model Performance */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Model Performance</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Detection Accuracy</span>
                    <span>{metrics.modelAccuracy.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${metrics.modelAccuracy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>False Positive Rate</span>
                    <span>{(100 - metrics.modelAccuracy).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${100 - metrics.modelAccuracy}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">AI Model Status</p>
                  <p className="text-green-400 font-semibold">
                    {aiStatus === 'active' ? 'Operational' : 'Standby'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIThreatIntelligence;