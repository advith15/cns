import React, { useState, useEffect } from 'react';
import { Globe, Target, Activity, PlayCircle, StopCircle, AlertTriangle, Brain, Zap } from 'lucide-react';

interface SpoofConfig {
  targetDomain: string;
  redirectIp: string;
  interface: string;
  duration: number;
  spoofType: 'dns_response' | 'dns_cache' | 'hosts_file';
}

interface SpoofMetrics {
  queriesIntercepted: number;
  successfulSpoofs: number;
  duration: number;
  detectionRisk: number;
  aiAnalysis: string[];
}

interface DNSQuery {
  id: string;
  timestamp: Date;
  domain: string;
  queryType: string;
  sourceIp: string;
  originalIp: string;
  spoofedIp: string;
  status: 'spoofed' | 'legitimate' | 'blocked';
}

const DNSSpoof: React.FC = () => {
  const [spoofConfig, setSpoofConfig] = useState<SpoofConfig>({
    targetDomain: 'example.com',
    redirectIp: '192.168.1.100',
    interface: 'Ethernet',
    duration: 60,
    spoofType: 'dns_response'
  });
  
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [metrics, setMetrics] = useState<SpoofMetrics>({
    queriesIntercepted: 0,
    successfulSpoofs: 0,
    duration: 0,
    detectionRisk: 0,
    aiAnalysis: []
  });
  
  const [dnsQueries, setDnsQueries] = useState<DNSQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<DNSQuery | null>(null);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    if (isAttacking) {
      const interval = setInterval(() => {
        setAttackProgress(prev => {
          if (prev >= 100) {
            stopAttack();
            return 100;
          }
          return prev + (100 / spoofConfig.duration);
        });
        
        generateDNSQuery();
        updateMetrics();
        generateAIInsights();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isAttacking, spoofConfig.duration]);

  const generateDNSQuery = () => {
    const domains = [
      spoofConfig.targetDomain,
      'google.com',
      'facebook.com',
      'amazon.com',
      'microsoft.com',
      'apple.com',
      'netflix.com',
      'youtube.com'
    ];
    
    const queryTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];
    const sourceIps = ['192.168.1.50', '192.168.1.75', '192.168.1.120', '192.168.1.200'];
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const isTargetDomain = domain === spoofConfig.targetDomain;
    const spoofSuccess = isTargetDomain && Math.random() < 0.8;

    const newQuery: DNSQuery = {
      id: `query-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      domain: domain,
      queryType: queryTypes[Math.floor(Math.random() * queryTypes.length)],
      sourceIp: sourceIps[Math.floor(Math.random() * sourceIps.length)],
      originalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      spoofedIp: spoofConfig.redirectIp,
      status: spoofSuccess ? 'spoofed' : (isTargetDomain ? 'blocked' : 'legitimate')
    };

    setDnsQueries(prev => [newQuery, ...prev.slice(0, 19)]);
  };

  const updateMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      queriesIntercepted: prev.queriesIntercepted + 1,
      successfulSpoofs: prev.successfulSpoofs + (Math.random() < 0.3 ? 1 : 0),
      duration: prev.duration + 1,
      detectionRisk: Math.min(prev.detectionRisk + Math.random() * 1.5, 100),
      aiAnalysis: generateAIAnalysis()
    }));
  };

  const generateAIAnalysis = (): string[] => {
    const analyses = [
      'AI detected DNS cache poisoning attempt',
      'Machine learning model identified domain reputation manipulation',
      'Behavioral analysis suggests DNS tunneling activity',
      'Neural network flagged suspicious DNS response patterns',
      'Deep learning classifier detected DNS amplification vectors',
      'Predictive model indicates DNS-based data exfiltration'
    ];
    
    return analyses.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateAIInsights = () => {
    const insights = [
      'DNS traffic analysis shows 45% increase in non-standard queries',
      'AI model detected potential DNS over HTTPS (DoH) bypass attempts',
      'Behavioral baseline indicates abnormal DNS resolution patterns',
      'Machine learning classifier identified domain generation algorithm (DGA)',
      'Pattern recognition suggests DNS-based command and control channel'
    ];
    
    if (Math.random() < 0.25) {
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
      queriesIntercepted: 0,
      successfulSpoofs: 0,
      duration: 0,
      detectionRisk: 0,
      aiAnalysis: []
    });
    setDnsQueries([]);
    setAiInsights([]);
  };

  const stopAttack = () => {
    setIsAttacking(false);
    setAttackProgress(0);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (risk < 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (risk < 75) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getStatusColor = (status: DNSQuery['status']) => {
    switch (status) {
      case 'spoofed': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'blocked': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'legitimate': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                DNS Spoofing Simulation
              </h1>
              <p className="text-gray-400">AI-Enhanced DNS Attack Testing & Analysis</p>
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
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
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
            <h2 className="text-xl font-bold mb-6">DNS Spoofing Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Domain</label>
                <input
                  type="text"
                  value={spoofConfig.targetDomain}
                  onChange={(e) => setSpoofConfig(prev => ({ ...prev, targetDomain: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Redirect IP</label>
                <input
                  type="text"
                  value={spoofConfig.redirectIp}
                  onChange={(e) => setSpoofConfig(prev => ({ ...prev, redirectIp: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Interface</label>
                <select
                  value={spoofConfig.interface}
                  onChange={(e) => setSpoofConfig(prev => ({ ...prev, interface: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Ethernet">Ethernet</option>
                  <option value="Wi-Fi">Wi-Fi</option>
                  <option value="Bluetooth">Bluetooth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Spoof Type</label>
                <select
                  value={spoofConfig.spoofType}
                  onChange={(e) => setSpoofConfig(prev => ({ ...prev, spoofType: e.target.value as SpoofConfig['spoofType'] }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="dns_response">DNS Response</option>
                  <option value="dns_cache">DNS Cache</option>
                  <option value="hosts_file">Hosts File</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  value={spoofConfig.duration}
                  onChange={(e) => setSpoofConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
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
                <Activity className="w-6 h-6 text-purple-400 animate-pulse" />
                <span className="text-lg font-semibold">DNS Spoofing in Progress</span>
              </div>
              <span className="text-purple-400 font-bold">{attackProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
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
              <h3 className="font-semibold">Queries Intercepted</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{metrics.queriesIntercepted}</p>
            <p className="text-sm text-gray-400">Total DNS queries</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold">Successful Spoofs</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{metrics.successfulSpoofs}</p>
            <p className="text-sm text-gray-400">Domains redirected</p>
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
          {/* DNS Queries */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold">DNS Query Log</h2>
              </div>
              
              <div className="space-y-3">
                {dnsQueries.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No DNS queries intercepted yet</p>
                  </div>
                ) : (
                  dnsQueries.map((query) => (
                    <div
                      key={query.id}
                      onClick={() => setSelectedQuery(query)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getStatusColor(query.status)} hover:shadow-lg`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(query.status)}`}>
                              {query.status.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs font-semibold">
                              {query.queryType}
                            </span>
                          </div>
                          <p className="text-lg font-semibold mt-2">{query.domain}</p>
                          <p className="text-sm text-gray-400">
                            {query.originalIp} → {query.status === 'spoofed' ? query.spoofedIp : query.originalIp}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          <p>From: {query.sourceIp}</p>
                          <p>{query.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold">AI DNS Analysis</h2>
              </div>
              
              <div className="space-y-3">
                {aiInsights.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <p>AI is analyzing DNS patterns...</p>
                  </div>
                ) : (
                  aiInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
                      <p className="text-sm text-cyan-300">{insight}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Query Details Sidebar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">Query Analysis</h2>
            
            {selectedQuery ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Query Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Domain:</span>
                      <span className="font-mono">{selectedQuery.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-mono">{selectedQuery.queryType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source IP:</span>
                      <span className="font-mono">{selectedQuery.sourceIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-semibold ${
                        selectedQuery.status === 'spoofed' ? 'text-red-400' :
                        selectedQuery.status === 'blocked' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {selectedQuery.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Resolution Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Original IP:</span>
                      <p className="font-mono">{selectedQuery.originalIp}</p>
                    </div>
                    {selectedQuery.status === 'spoofed' && (
                      <div>
                        <span className="text-gray-400">Spoofed IP:</span>
                        <p className="font-mono text-red-400">{selectedQuery.spoofedIp}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedQuery.status === 'spoofed' && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-400">Security Alert</h3>
                    <div className="p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                      <p className="text-sm text-red-300">
                        This DNS query was successfully spoofed, redirecting traffic to a malicious server.
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
                
                <div>
                  <h3 className="font-semibold mb-2 text-cyan-400">Mitigation Steps</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Use secure DNS servers (DoH/DoT)</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Implement DNSSEC validation</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Monitor DNS traffic patterns</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-300">Use threat intelligence feeds</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a DNS query to view analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNSSpoof;