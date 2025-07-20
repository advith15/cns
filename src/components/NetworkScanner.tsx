import React, { useState, useEffect } from 'react';
import { Wifi, Router, Smartphone, Monitor, Scan, PlayCircle, StopCircle, Activity } from 'lucide-react';

interface NetworkDevice {
  ip: string;
  mac: string;
  hostname: string;
  deviceType: 'router' | 'device' | 'this_device';
  openPorts: number[];
  services: string[];
  isOnline: boolean;
  lastSeen: Date;
  aiRiskScore?: number;
}

interface WirelessNetwork {
  ssid: string;
  bssid: string;
  channel: number;
  signal: number;
  security: string;
  frequency: string;
}

const NetworkScanner: React.FC = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [wirelessNetworks, setWirelessNetworks] = useState<WirelessNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [scanType, setScanType] = useState<'network' | 'wireless' | 'both'>('both');

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            generateMockDevices();
            if (scanType === 'wireless' || scanType === 'both') {
              generateMockWirelessNetworks();
            }
            setIsScanning(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isScanning, scanType]);

  const generateMockDevices = () => {
    const mockDevices: NetworkDevice[] = [
      {
        ip: '192.168.1.1',
        mac: '00:11:22:33:44:55',
        hostname: 'Router',
        deviceType: 'router',
        openPorts: [80, 443, 22, 23],
        services: ['HTTP', 'HTTPS', 'SSH', 'Telnet'],
        isOnline: true,
        lastSeen: new Date(),
        aiRiskScore: 15
      },
      {
        ip: '192.168.1.105',
        mac: 'AA:BB:CC:DD:EE:FF',
        hostname: 'This Device',
        deviceType: 'this_device',
        openPorts: [3000, 5000],
        services: ['Node.js', 'Flask'],
        isOnline: true,
        lastSeen: new Date(),
        aiRiskScore: 5
      }
    ];

    // Generate random devices
    for (let i = 0; i < 5; i++) {
      const deviceTypes: NetworkDevice['deviceType'][] = ['device'];
      const randomIp = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
      const randomPorts = [80, 443, 22, 135, 445, 3389].filter(() => Math.random() > 0.7);
      
      mockDevices.push({
        ip: randomIp,
        mac: `${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`,
        hostname: `Device-${randomIp.split('.')[3]}`,
        deviceType: deviceTypes[0],
        openPorts: randomPorts,
        services: randomPorts.map(port => {
          const serviceMap: { [key: number]: string } = {
            80: 'HTTP', 443: 'HTTPS', 22: 'SSH', 135: 'RPC', 445: 'SMB', 3389: 'RDP'
          };
          return serviceMap[port] || 'Unknown';
        }),
        isOnline: Math.random() > 0.2,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        aiRiskScore: Math.floor(Math.random() * 60) + 10
      });
    }

    setDevices(mockDevices);
  };

  const generateMockWirelessNetworks = () => {
    const mockNetworks: WirelessNetwork[] = [
      {
        ssid: 'HomeNetwork_5G',
        bssid: '00:11:22:33:44:55',
        channel: 36,
        signal: -45,
        security: 'WPA3',
        frequency: '5GHz'
      },
      {
        ssid: 'HomeNetwork_2.4G',
        bssid: '00:11:22:33:44:56',
        channel: 6,
        signal: -52,
        security: 'WPA2',
        frequency: '2.4GHz'
      },
      {
        ssid: 'Neighbor_WiFi',
        bssid: 'AA:BB:CC:DD:EE:FF',
        channel: 11,
        signal: -78,
        security: 'WPA2',
        frequency: '2.4GHz'
      },
      {
        ssid: 'Guest_Network',
        bssid: 'BB:CC:DD:EE:FF:AA',
        channel: 149,
        signal: -65,
        security: 'Open',
        frequency: '5GHz'
      }
    ];

    setWirelessNetworks(mockNetworks);
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDevices([]);
    setWirelessNetworks([]);
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  const getDeviceIcon = (deviceType: NetworkDevice['deviceType']) => {
    switch (deviceType) {
      case 'router': return <Router className="w-6 h-6 text-blue-400" />;
      case 'this_device': return <Monitor className="w-6 h-6 text-green-400" />;
      default: return <Smartphone className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRiskScoreColor = (score: number = 0) => {
    if (score < 20) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (score < 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (score < 70) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getSignalStrength = (signal: number) => {
    if (signal > -50) return { strength: 'Excellent', color: 'text-green-400' };
    if (signal > -60) return { strength: 'Good', color: 'text-yellow-400' };
    if (signal > -70) return { strength: 'Fair', color: 'text-orange-400' };
    return { strength: 'Poor', color: 'text-red-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
              <Wifi className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Network Scanner
              </h1>
              <p className="text-gray-400">AI-Enhanced Network Discovery & Analysis</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value as 'network' | 'wireless' | 'both')}
              className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="both">Network & Wireless</option>
              <option value="network">Network Only</option>
              <option value="wireless">Wireless Only</option>
            </select>
            
            {!isScanning ? (
              <button
                onClick={startScan}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Scan</span>
              </button>
            ) : (
              <button
                onClick={stopScan}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                <StopCircle className="w-5 h-5" />
                <span>Stop Scan</span>
              </button>
            )}
          </div>
        </div>

        {/* Scan Progress */}
        {isScanning && (
          <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                <span className="text-lg font-semibold">Scanning Network...</span>
              </div>
              <span className="text-blue-400 font-bold">{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Network Devices */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Scan className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold">Discovered Devices</h2>
                </div>
                <span className="text-sm text-gray-400">{devices.length} devices found</span>
              </div>
              
              <div className="space-y-4">
                {devices.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Wifi className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No devices discovered yet</p>
                  </div>
                ) : (
                  devices.map((device) => (
                    <div
                      key={device.ip}
                      onClick={() => setSelectedDevice(device)}
                      className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 cursor-pointer transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getDeviceIcon(device.deviceType)}
                          <div>
                            <h3 className="font-semibold">{device.hostname}</h3>
                            <p className="text-sm text-gray-400">{device.ip}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${getRiskScoreColor(device.aiRiskScore)}`}>
                            Risk: {device.aiRiskScore}%
                          </div>
                          <div className={`w-3 h-3 rounded-full ${device.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">MAC Address:</p>
                          <p className="font-mono">{device.mac}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Open Ports:</p>
                          <p className="font-mono">{device.openPorts.slice(0, 3).join(', ')}{device.openPorts.length > 3 ? '...' : ''}</p>
                        </div>
                      </div>
                      
                      {device.services.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-400 mb-1">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {device.services.slice(0, 4).map((service, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Wireless Networks */}
            {(scanType === 'wireless' || scanType === 'both') && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-6 h-6 text-green-400" />
                    <h2 className="text-xl font-bold">Wireless Networks</h2>
                  </div>
                  <span className="text-sm text-gray-400">{wirelessNetworks.length} networks found</span>
                </div>
                
                <div className="space-y-3">
                  {wirelessNetworks.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                      <p>No wireless networks discovered</p>
                    </div>
                  ) : (
                    wirelessNetworks.map((network, index) => {
                      const signal = getSignalStrength(network.signal);
                      return (
                        <div key={index} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{network.ssid}</h4>
                              <p className="text-xs text-gray-400 font-mono">{network.bssid}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-semibold ${signal.color}`}>
                                {signal.strength}
                              </span>
                              <p className="text-xs text-gray-400">{network.signal} dBm</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <p className="text-gray-400">Security:</p>
                              <p className={network.security === 'Open' ? 'text-red-400' : 'text-green-400'}>
                                {network.security}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Channel:</p>
                              <p>{network.channel}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Band:</p>
                              <p>{network.frequency}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Device Details Sidebar */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6">Device Details</h2>
            
            {selectedDevice ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  {getDeviceIcon(selectedDevice.deviceType)}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedDevice.hostname}</h3>
                    <p className="text-gray-400">{selectedDevice.ip}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-400">Network Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">MAC Address:</span>
                        <span className="font-mono">{selectedDevice.mac}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={selectedDevice.isOnline ? 'text-green-400' : 'text-red-400'}>
                          {selectedDevice.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Seen:</span>
                        <span>{selectedDevice.lastSeen.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-400">AI Risk Assessment</h4>
                    <div className={`p-3 rounded-lg border ${getRiskScoreColor(selectedDevice.aiRiskScore)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span>Risk Score</span>
                        <span className="font-bold">{selectedDevice.aiRiskScore}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedDevice.aiRiskScore! < 20 ? 'bg-green-400' :
                            selectedDevice.aiRiskScore! < 40 ? 'bg-yellow-400' :
                            selectedDevice.aiRiskScore! < 70 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${selectedDevice.aiRiskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-400">Open Ports</h4>
                    <div className="space-y-2">
                      {selectedDevice.openPorts.map((port, index) => (
                        <div key={port} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                          <span className="font-mono">{port}</span>
                          <span className="text-sm text-gray-400">
                            {selectedDevice.services[index] || 'Unknown'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-400">Security Recommendations</h4>
                    <div className="space-y-2 text-sm">
                      {selectedDevice.deviceType === 'router' && (
                        <>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Change default admin credentials</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Update firmware to latest version</p>
                          </div>
                        </>
                      )}
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Monitor for unusual network activity</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Implement network segmentation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a device to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkScanner;