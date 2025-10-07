'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Key,
  Globe,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Mail,
  Bell,
  FileText,
  Archive,
  Search
} from 'lucide-react';

interface SystemStatus {
  server: {
    status: 'online' | 'offline' | 'maintenance';
    uptime: number;
    cpu: number;
    memory: number;
    disk: number;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error';
    connections: number;
    size: number;
    responseTime: number;
  };
  services: {
    api: 'running' | 'stopped' | 'error';
    auth: 'running' | 'stopped' | 'error';
    email: 'running' | 'stopped' | 'error';
    storage: 'running' | 'stopped' | 'error';
  };
  security: {
    ssl: boolean;
    firewall: boolean;
    backups: boolean;
    monitoring: boolean;
  };
}

const AdminSystemPage: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    server: {
      status: 'online',
      uptime: 99.9,
      cpu: 45,
      memory: 67,
      disk: 46
    },
    database: {
      status: 'connected',
      connections: 23,
      size: 2.3,
      responseTime: 12
    },
    services: {
      api: 'running',
      auth: 'running',
      email: 'running',
      storage: 'running'
    },
    security: {
      ssl: true,
      firewall: true,
      backups: true,
      monitoring: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([
    {
      id: '1',
      level: 'info',
      message: 'System backup completed successfully',
      timestamp: '2024-01-20T15:30:00Z',
      service: 'backup'
    },
    {
      id: '2',
      level: 'warning',
      message: 'High CPU usage detected on server-02',
      timestamp: '2024-01-20T14:45:00Z',
      service: 'monitoring'
    },
    {
      id: '3',
      level: 'error',
      message: 'Database connection timeout',
      timestamp: '2024-01-20T13:20:00Z',
      service: 'database'
    },
    {
      id: '4',
      level: 'info',
      message: 'New user registration: john@example.com',
      timestamp: '2024-01-20T12:15:00Z',
      service: 'auth'
    },
    {
      id: '5',
      level: 'info',
      message: 'SSL certificate renewed',
      timestamp: '2024-01-20T10:00:00Z',
      service: 'security'
    }
  ]);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleServiceAction = (service: string, action: 'start' | 'stop' | 'restart') => {
    console.log(`${action} ${service} service`);
    // Implement service control logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'running':
      case true:
        return 'text-green-600 bg-green-100';
      case 'offline':
      case 'disconnected':
      case 'stopped':
      case false:
        return 'text-red-600 bg-red-100';
      case 'maintenance':
      case 'error':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'running':
      case true:
        return <CheckCircle className="w-4 h-4" />;
      case 'offline':
      case 'disconnected':
      case 'stopped':
      case false:
        return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance':
      case 'error':
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-2 sm:px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-violet-600 bg-clip-text text-transparent">
                System Management
              </h1>
              <p className="text-slate-600 mt-2">Monitor and control system infrastructure</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Server Status</p>
                <p className="text-2xl font-bold text-slate-900 capitalize">{systemStatus.server.status}</p>
                <p className="text-sm text-green-600">{systemStatus.server.uptime}% uptime</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Database</p>
                <p className="text-2xl font-bold text-slate-900 capitalize">{systemStatus.database.status}</p>
                <p className="text-sm text-blue-600">{systemStatus.database.connections} connections</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">CPU Usage</p>
                <p className="text-2xl font-bold text-slate-900">{systemStatus.server.cpu}%</p>
                <p className="text-sm text-orange-600">Normal load</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Memory Usage</p>
                <p className="text-2xl font-bold text-slate-900">{systemStatus.server.memory}%</p>
                <p className="text-sm text-purple-600">2.1GB used</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* System Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">System Services</h3>
            <div className="space-y-4">
              {Object.entries(systemStatus.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 capitalize">{service}</p>
                      <p className="text-sm text-slate-600">Service status</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleServiceAction(service, 'start')}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                      title="Start"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleServiceAction(service, 'stop')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Stop"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleServiceAction(service, 'restart')}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Restart"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Security Status</h3>
            <div className="space-y-4">
              {Object.entries(systemStatus.security).map(([security, status]) => (
                <div key={security} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 capitalize">{security}</p>
                      <p className="text-sm text-slate-600">Security feature</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">CPU Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current Usage</span>
                <span>{systemStatus.server.cpu}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemStatus.server.cpu}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Memory Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current Usage</span>
                <span>{systemStatus.server.memory}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemStatus.server.memory}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Disk Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Current Usage</span>
                <span>{systemStatus.server.disk}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemStatus.server.disk}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">System Logs</h2>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <Search className="w-4 h-4 mr-2 inline" />
                  Search
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  <Trash2 className="w-4 h-4 mr-2 inline" />
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{log.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 capitalize">
                      {log.service}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemPage;
