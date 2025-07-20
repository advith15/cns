import React, { useState, useEffect } from 'react';
import { Shield, Target, Activity, PlayCircle, StopCircle, AlertTriangle, Brain, Zap } from 'lucide-react';

interface AttackConfig {
  targetIp: string;
  gatewayIp: string;
  interface: string;
  duration: number;
}

interface AttackMetrics {
  packetsIntercepted: number;
  dataSize: number;
  duration: number;
  detectionRisk: number;
  aiAnalysis: string[];
}

interface InterceptedPacket {
  id: string;
  timestamp: Date;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  data: string;
  sensitive: boolean;
}

const MITMAttack: React.FC = () => {
  const [attackConfig, setAttackConfig] = useState<AttackConfig>({
    targetIp: '192.168.1.100',
    gatewayIp: '192.168.1.1',
    interface: 'Ethernet',
    duration: 60
  });
  
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [metrics, setMetrics] = useState<AttackMetrics>({
    packetsIntercepted: 0,
    dataSize: 0,
    duration: 0,
    detectionRisk: 0,
    aiAnalysis: []
  });
  
  const [interceptedPackets, setInterceptedPackets] = useState<InterceptedPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<InterceptedPacket | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    if (isAttacking) {
      const interval = setInterval(() => {
        setAttackProgress(prev => {
          if (prev >= 100) {
            stopAttack();
            return 100;
          }
          return prev + (100 / attackConfig.duration);
        });
        
        generateInterceptedPacket();
        updateMetrics();
        generateAIInsights();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isAttacking, attackConfig.duration]);

  const generateInterceptedPacket = () => {
    const protocols = ['HTTP', 'HTTPS', 'DNS', 'TCP', 'UDP', 'ARP'];
    const sources = [attackConfig.targetIp, attackConfig.gatewayIp, '192.168.1.50', '192.168.1.75'];
    const destinations = ['8.8.8.8', '1.1.1.1', '192.168.1.1', 'facebook.com', 'google.com'];
    
    const sensitiveData = [
      'POST /login username=admin&password=secret123',
      'Cookie: session_id=abc123def456',
      'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
      'GET /admin/users HTTP/1.1',
      'X-API-Key: sk-1234567890abcdef'
    ];
    
    const normalData = [
      'GET / HTTP/1.1 Host: example.com',
      'DNS Query: google.com A',
      'TCP SYN 192.168.1.100:1234 -> 8.8.8.8:80',
      'UDP 192.168.1.100:5353 -> 224.0.0.251:5353',
      'ARP Request: Who has 192.168.1.1?'
    ];

    const isSensitive = Math.random() < 0.3;
    const data = isSensitive 
      ? sensitiveData[Math.floor(Math.random() * sensitiveData.length)]
      : normalData[Math.floor(Math.random() * normalData.length)];

    const newPacket: InterceptedPacket = {
      id: `packet-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      source: sources[Math.floor(Math.random() * sources.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      size: Math.floor(Math.random() * 1500) + 60,
      data: data,
      sensitive: isSensitive
    };

    setInterceptedPackets(prev => [newPacket, ...prev.slice(0, 19)]);
  };

  const updateMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      packetsIntercepted: prev.packetsIntercepted + 1,
      dataSize: prev.dataSize + Math.floor(Math.random() * 1500) + 60,
      duration: prev.duration + 1,
      detectionRisk: Math.min(prev.detectionRisk + Math.random() * 2, 100),
      aiAnalysis: generateAIAnalysis()
    }));
  };

  const generateAIAnalysis = (): string[] => {
    const analyses = [
      'AI detected potential credential harvesting attempt',
      'Machine learning model identified suspicious traffic patterns',
      'Behavioral analysis suggests session hijacking in progress',
      'Neural network flagged anomalous authentication requests',
      'Deep packet inspection reveals sensitive data exposure',
      'Predictive model indicates high probability of data exfiltration'
    ];
    
    return analyses.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateAIInsights = () => {
    const insights = [
      'Traffic analysis shows 67% increase in encrypted connections',
      'AI model detected evasion techniques in network traffic',
      'Behavioral baseline indicates abnormal data flow patterns',
      'Machine learning classifier identified potential C2 communication',
      'Pattern recognition suggests coordinated attack infrastructure'
    ];
    
    if (Math.random() < 0.3) {
      setAiInsights(prev => {
        const newInsight = insights[Math.floor(Math.random() * insights.length)];
        return [newInsight, ...prev.slice(0, 4)];
      });
    }
  };

  const startAttack = () => {
    setIsAttacking(true);
    setAttackProgress(0);
    setMetrics({
      packetsIntercepted: 0,
      dataSize: 0,
      duration: 0,
      detectionRisk: 0,
      aiAnalysis: []
    });
    setInterceptedPackets([]);
    setAiInsights([]);
  };

  const stopAttack = () => {
    setIsAttacking(false);
    setAttackProgress(0);
  };

  const formatDataSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (risk < 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (risk < 75) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
              <Target className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                MITM Attack Simulation
              </h1>
              <p className="text-gray-400">AI-Enhanced Man-in-the-Middle Attack Testing</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 ${getRiskColor(metrics.detectionRisk)} backdrop-blur-sm`}>
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="text-xs opacity-80">Detection Risk</p>
                <p className="font-bold">{metrics.detectionRisk.toFixed(1)}%</p>
              </div>
            </div>
            
            {!isAttacking ? (
              <button
                onClick={startAttack}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Attack</span>
              </button>
            ) : (
              <button
                onClick={stopAttack}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                <StopCircle className="w-5 h-5" />
                <span>Stop Attack</span>
              </button>
            )}
          </div>
        </div>

        {/* Attack Configuration */}
        {!isAttacking && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">Attack Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target IP</label>
                <input
                  type="text"
                  value={attackConfig.targetIp}
                  onChange={(e) => setAttackConfig(prev => ({ ...prev, targetIp: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Gateway IP</label>
                <input
                  type="text"
                  value={attackConfig.gatewayIp}
                  onChange={(e) => setAttackConfig(prev => ({ ...prev, gatewayIp: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Interface</label>
                <select
                  value={attackConfig.interface}
                  onChange={(e) => setAttackConfig(prev => ({ ...prev, interface: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:outline-none"
                >
                  <option value="Ethernet">Ethernet</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Bluetooth">Bluetooth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  value={attackConfig.duration}
                  onChange={(e) => setAttackConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Attack Progress */}
        {isAttacking && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-red-400 animate-pulse" />
                <span className="text-lg font-semibold">Attack in Progress</span>
              </div>
              <span className="text-red-400 font-bold">{attackProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${attackProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Attack Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">Packets Intercepted</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{metrics.packetsIntercepted}</p>
            <p className="text-sm text-gray-400">Total captured packets</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold">Data Intercepted</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{formatDataSize(metrics.dataSize)}</p>
            <p className="text-sm text-gray-400">Total data captured</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Duration</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{metrics.duration}s</p>
            <p className="text-sm text-gray-400">Attack duration</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold">Detection Risk</h3>
            </div>
            <p className="text-3xl font-bold text-red-400">{metrics.detectionRisk.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">AI-calculated risk</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Intercepted Packets */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold">Intercepted Traffic</h2>
              </div>
              
              <div className="space-y-3">
                {interceptedPackets.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No packets intercepted yet</p>
                  </div>
                ) : (
                  interceptedPackets.map((packet) => (
                    <div
                      key={packet.id}
                      onClick={() => setSelectedPacket(packet)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        packet.sensitive 
                          ? 'border-red-400/50 bg-red-400/10 hover:border-red-400/70' 
                          : 'border-gray-600/50 bg-gray-700/30 hover:border-blue-400/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              packet.sensitive ? 'bg-red-400/20 text-red-400' : 'bg-blue-400/20 text-blue-400'
                            }`}>
                              {packet.protocol}
                            </span>
                            {packet.sensitive && (
                              <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs font-semibold">
                                SENSITIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-2 font-mono">{packet.data.substring(0, 60)}...</p>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          <p>{packet.size} bytes</p>
                          <p>{packet.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>{packet.source} → {packet.destination}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold">AI Security Insights</h2>
              </div>
              
              <div className="space-y-3">
                {aiInsights.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <p>AI is analyzing traffic patterns...</p>
                  </div>
                ) : (
                  aiInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                      <p className="text-sm text-purple-300">{insight}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Packet Details Sidebar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">Packet Analysis</h2>
            
            {selectedPacket ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Packet Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Protocol:</span>
                      <span className="font-mono">{selectedPacket.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="font-mono">{selectedPacket.size} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="font-mono">{selectedPacket.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Destination:</span>
                      <span className="font-mono">{selectedPacket.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sensitive:</span>
                      <span className={selectedPacket.sensitive ? 'text-red-400' : 'text-green-400'}>
                        {selectedPacket.sensitive ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Payload Data</h3>
                  <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                      {selectedPacket.data}
                    </pre>
                  </div>
                </div>
                
                {selectedPacket.sensitive && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-400">Security Alert</h3>
                    <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                      <p className="text-sm text-red-300">
                        This packet contains sensitive information that could be exploited by attackers.
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">AI Analysis</h3>
                  <div className="space-y-2">
                    {metrics.aiAnalysis.map((analysis, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-300">{analysis}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a packet to view analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MITMAttack;