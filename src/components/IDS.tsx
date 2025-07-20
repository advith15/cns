import React, { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, Brain, Target, Zap, PlayCircle, StopCircle, Eye } from 'lucide-react';

interface IDSConfig {
  interface: string;
  targetIp: string;
  gatewayIp: string;
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
  aiMode: boolean;
}

interface ThreatDetection {
  id: string;
  timestamp: Date;
  threatType: 'mitm' | 'dns_spoof' | 'port_scan' | 'brute_force' | 'malware' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  sourceIp: string;
  targetIp: string;
  confidence: number;
  description: string;
  evidence: string[];
  aiAnalysis: string;
  status: 'detected' | 'investigating' | 'mitigated' | 'false_positive';
}

interface IDSMetrics {
  threatsDetected: number;
  packetsAnalyzed: number;
  falsePositives: number;
  accuracy: number;
  uptime: number;
  aiConfidence: number;
}

const IDS: React.FC = () => {
  const [idsConfig, setIdsConfig] = useState<IDSConfig>({
    interface: 'Ethernet',
    targetIp: '192.168.1.100',
    gatewayIp: '192.168.1.1',
    sensitivity: 'medium',
    aiMode: true
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatDetection | null>(null);
  const [metrics, setMetrics] = useState<IDSMetrics>({
    threatsDetected: 0,
    packetsAnalyzed: 0,
    falsePositives: 0,
    accuracy: 95.2,
    uptime: 0,
    aiConfidence: 0
  });

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        updateMetrics();
        generateThreatDetection();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const generateThreatDetection = () => {
    if (Math.random() < 0.4) { // 40% chance to detect a threat
      const threatTypes: ThreatDetection['threatType'][] = ['mitm', 'dns_spoof', 'port_scan', 'brute_force', 'malware', 'anomaly'];
      const severities: ThreatDetection['severity'][] = ['low', 'medium', 'high', 'critical'];
      const sources = ['192.168.1.50', '10.0.0.100', '172.16.0.50', '203.0.113.10', '198.51.100.25'];
      
      const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      const threatDescriptions = {
        mitm: 'ARP spoofing attack detected - suspicious ARP cache poisoning',
        dns_spoof: 'DNS spoofing attack identified - malicious DNS responses',
        port_scan: 'Port scanning activity detected - systematic port enumeration',
        brute_force: 'Brute force attack in progress - multiple authentication failures',
        malware: 'Malware communication detected - C2 server communication',
        anomaly: 'Network anomaly identified - deviation from baseline behavior'
      };

      const evidencePatterns = {
        mitm: ['Duplicate ARP responses', 'MAC address conflicts', 'Gateway impersonation'],
        dns_spoof: ['Forged DNS responses', 'DNS cache poisoning', 'Domain redirection'],
        port_scan: ['Sequential port access', 'Rapid connection attempts', 'Service enumeration'],
        brute_force: ['Multiple login failures', 'Dictionary attack patterns', 'Credential stuffing'],
        malware: ['C2 beacon traffic', 'Data exfiltration patterns', 'Suspicious process behavior'],
        anomaly: ['Traffic volume spike', 'Unusual protocol usage', 'Behavioral deviation']
      };

      const aiAnalysisPatterns = {
        mitm: 'Neural network detected ARP table manipulation with 94% confidence. Pattern analysis indicates sophisticated attack using gratuitous ARP replies.',
        dns_spoof: 'Machine learning model identified DNS response anomalies with 87% confidence. Behavioral analysis suggests domain hijacking attempt.',
        port_scan: 'AI classifier detected systematic reconnaissance with 91% confidence. Pattern recognition indicates automated scanning tools.',
        brute_force: 'Deep learning model identified credential attack with 96% confidence. Behavioral analysis suggests botnet-coordinated attack.',
        malware: 'Neural network detected C2 communication with 89% confidence. Pattern matching indicates advanced persistent threat.',
        anomaly: 'Anomaly detection algorithm identified network deviation with 85% confidence. Statistical analysis indicates potential insider threat.'
      };

      const newThreat: ThreatDetection = {
        id: `threat-${Date.now()}`,
        timestamp: new Date(),
        threatType,
        severity,
        sourceIp: sources[Math.floor(Math.random() * sources.length)],
        targetIp: idsConfig.targetIp,
        confidence: Math.floor(Math.random() * 30) + 70,
        description: threatDescriptions[threatType],
        evidence: evidencePatterns[threatType],
        aiAnalysis: aiAnalysisPatterns[threatType],
        status: 'detected'
      };

      setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
    }
  };

  const updateMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      packetsAnalyzed: prev.packetsAnalyzed + Math.floor(Math.random() * 1000) + 500,
      uptime: prev.uptime + 3,
      aiConfidence: Math.min(prev.aiConfidence + Math.random() * 2, 99),
      threatsDetected: threats.length,
      accuracy: Math.min(95 + Math.random() * 4, 99.9)
    }));
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setThreats([]);
    setMetrics(prev => ({ ...prev, uptime: 0, packetsAnalyzed: 0, aiConfidence: 0 }));
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const mitigateThreat = (threatId: string) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId 
        ? { ...threat, status: 'mitigated' }
        : threat
    ));
  };

  const markFalsePositive = (threatId: string) => {
    setThreats(prev => prev.map(threat => 
      threat.id === threatId 
        ? { ...threat, status: 'false_positive' }
        : threat
    ));
    setMetrics(prev => ({ ...prev, falsePositives: prev.falsePositives + 1 }));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'investigating': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'mitigated': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'false_positive': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  const getThreatIcon = (threatType: string) => {
    switch (threatType) {
      case 'mitm': return <Target className="w-5 h-5" />;
      case 'dns_spoof': return <Shield className="w-5 h-5" />;
      case 'port_scan': return <Eye className="w-5 h-5" />;
      case 'brute_force': return <Zap className="w-5 h-5" />;
      case 'malware': return <AlertTriangle className="w-5 h-5" />;
      case 'anomaly': return <Activity className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Enhanced IDS
              </h1>
              <p className="text-gray-400">Intelligent Intrusion Detection & Response System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 backdrop-blur-sm ${
              isMonitoring ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-gray-400 bg-gray-400/10 border-gray-400/30'
            }`}>
              <Activity className={`w-5 h-5 ${isMonitoring ? 'animate-pulse' : ''}`} />
              <div>
                <p className="text-xs opacity-80">System Status</p>
                <p className="font-bold">{isMonitoring ? 'Active' : 'Standby'}</p>
              </div>
            </div>
            
            {!isMonitoring ? (
              <button
                onClick={startMonitoring}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Monitoring</span>
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <StopCircle className="w-5 h-5" />
                <span>Stop Monitoring</span>
              </button>
            )}
          </div>
        </div>

        {/* IDS Configuration */}
        {!isMonitoring && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">IDS Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Network Interface</label>
                <select
                  value={idsConfig.interface}
                  onChange={(e) => setIdsConfig(prev => ({ ...prev, interface: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                >
                  <option value="Ethernet">Ethernet</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="All">All Interfaces</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target IP</label>
                <input
                  type="text"
                  value={idsConfig.targetIp}
                  onChange={(e) => setIdsConfig(prev => ({ ...prev, targetIp: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Gateway IP</label>
                <input
                  type="text"
                  value={idsConfig.gatewayIp}
                  onChange={(e) => setIdsConfig(prev => ({ ...prev, gatewayIp: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sensitivity</label>
                <select
                  value={idsConfig.sensitivity}
                  onChange={(e) => setIdsConfig(prev => ({ ...prev, sensitivity: e.target.value as IDSConfig['sensitivity'] }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">AI Mode</label>
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={idsConfig.aiMode}
                    onChange={(e) => setIdsConfig(prev => ({ ...prev, aiMode: e.target.checked }))}
                    className="w-4 h-4 text-green-400 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
                  />
                  <span className="ml-2 text-sm">Enable AI Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IDS Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-sm">Threats</h3>
            </div>
            <p className="text-2xl font-bold text-red-400">{metrics.threatsDetected}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-sm">Packets</h3>
            </div>
            <p className="text-2xl font-bold text-blue-400">{metrics.packetsAnalyzed.toLocaleString()}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-sm">AI Confidence</h3>
            </div>
            <p className="text-2xl font-bold text-purple-400">{metrics.aiConfidence.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-sm">Accuracy</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">{metrics.accuracy.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-sm">Uptime</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{Math.floor(metrics.uptime / 60)}m</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Eye className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-sm">False Positives</h3>
            </div>
            <p className="text-2xl font-bold text-gray-400">{metrics.falsePositives}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Threat Detections */}
          <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold">Threat Detections</h2>
              </div>
              <span className="text-sm text-gray-400">{threats.length} active threats</span>
            </div>
            
            <div className="space-y-4">
              {threats.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No threats detected</p>
                  <p className="text-sm">System is monitoring for suspicious activity</p>
                </div>
              ) : (
                threats.map((threat) => (
                  <div
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(threat.severity)} hover:shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={getSeverityColor(threat.severity).split(' ')[0]}>
                          {getThreatIcon(threat.threatType)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{threat.description}</h3>
                          <p className="text-sm opacity-80">{threat.sourceIp} → {threat.targetIp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(threat.status)}`}>
                          {threat.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="opacity-70">{threat.timestamp.toLocaleTimeString()}</span>
                      <span className="font-semibold">Confidence: {threat.confidence}%</span>
                    </div>

                    {threat.status === 'detected' && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            mitigateThreat(threat.id);
                          }}
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                        >
                          Mitigate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markFalsePositive(threat.id);
                          }}
                          className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30 transition-colors"
                        >
                          False Positive
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Threat Details Sidebar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">Threat Analysis</h2>
            
            {selectedThreat ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Threat Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-mono">{selectedThreat.threatType.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Severity:</span>
                      <span className={getSeverityColor(selectedThreat.severity).split(' ')[0]}>
                        {selectedThreat.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="font-mono">{selectedThreat.sourceIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target:</span>
                      <span className="font-mono">{selectedThreat.targetIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="font-semibold">{selectedThreat.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Evidence</h3>
                  <div className="space-y-2">
                    {selectedThreat.evidence.map((evidence, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-300">{evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">AI Analysis</h3>
                  <div className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                    <p className="text-sm text-purple-300">{selectedThreat.aiAnalysis}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Recommended Actions</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Block source IP address</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Increase monitoring sensitivity</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Update threat signatures</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Notify security team</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a threat to view analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDS;