import { useState, useEffect, useCallback } from 'react'
import { Heart, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock, Wifi, Database, Server } from 'lucide-react'
import { getHealth, getP6Status, type HealthResponse } from '@/services/api'
import { Button } from '@/components'

type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown'

interface ServiceInfo {
  name: string
  status: ServiceStatus
  message?: string
  responseTime?: number
  icon: React.ReactNode
}

interface P6StatusResponse {
  status: string
  connection_status: {
    is_connected: boolean
    active_connections: number
    max_connections: number
    connection_time?: number
  }
  database_info?: {
    database_name: string
    server_version?: string
  }
}

export function HealthPage() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [p6Status, setP6Status] = useState<P6StatusResponse | null>(null)
  const [services, setServices] = useState<ServiceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100'
      case 'unhealthy':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />
      case 'degraded':
        return <AlertCircle className="w-5 h-5" />
      case 'unhealthy':
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const determineServiceStatus = (service: string, data: any): ServiceStatus => {
    if (!data) return 'unknown'
    
    // Logic to determine status based on service type and data
    if (service === 'API Services') {
      return data.status === 'healthy' ? 'healthy' : 'unhealthy'
    } else if (service === 'Database') {
      return data.is_connected ? 'healthy' : 'unhealthy'
    } else if (service === 'Agent Health') {
      const agentStatus = data.status || data.agent_status
      if (agentStatus === 'ready' || agentStatus === 'healthy') return 'healthy'
      if (agentStatus === 'busy' || agentStatus === 'degraded') return 'degraded'
      return 'unhealthy'
    }
    
    return 'unknown'
  }

  const fetchHealthData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch health and P6 status in parallel
      const [health, p6] = await Promise.all([
        getHealth(),
        getP6Status().catch(() => null) // P6 might not always be available
      ])

      setHealthData(health)
      setP6Status(p6 as P6StatusResponse)
      setLastUpdate(new Date())

      // Update services based on fetched data
      const updatedServices: ServiceInfo[] = [
        {
          name: 'API Services',
          status: determineServiceStatus('API Services', health),
          message: `Status: ${health.status}`,
          responseTime: health.timestamp ? Date.now() - health.timestamp : undefined,
          icon: <Server className="w-5 h-5" />
        },
        {
          name: 'Agent Health',
          status: determineServiceStatus('Agent Health', health.agent_health),
          message: typeof health.agent_health === 'object' && health.agent_health !== null && 'status' in health.agent_health 
            ? String(health.agent_health.status) 
            : 'Status unknown',
          icon: <Heart className="w-5 h-5" />
        },
        {
          name: 'Database',
          status: p6 ? determineServiceStatus('Database', (p6 as P6StatusResponse).connection_status) : 'unknown',
          message: p6 
            ? `${(p6 as P6StatusResponse).connection_status.active_connections}/${(p6 as P6StatusResponse).connection_status.max_connections} connections`
            : 'Unable to fetch status',
          icon: <Database className="w-5 h-5" />
        },
        {
          name: 'Network',
          status: 'healthy', // Assumed healthy if we can fetch data
          message: 'All systems operational',
          icon: <Wifi className="w-5 h-5" />
        }
      ]

      // Add any additional services from agent_health
      if (health.agent_health && typeof health.agent_health === 'object') {
        Object.entries(health.agent_health).forEach(([key, value]) => {
          if (key !== 'status' && typeof value === 'object' && value !== null) {
            const serviceData = value as any
            if (serviceData.name || key.includes('tool') || key.includes('service')) {
              updatedServices.push({
                name: serviceData.name || key.charAt(0).toUpperCase() + key.slice(1),
                status: serviceData.status === 'active' ? 'healthy' : 'degraded',
                message: serviceData.description || `Status: ${serviceData.status}`,
                icon: <Server className="w-5 h-5" />
              })
            }
          }
        })
      }

      setServices(updatedServices)
    } catch (err) {
      console.error('Failed to fetch health data:', err)
      setError('Failed to fetch health data. Please try again.')
      setServices([
        {
          name: 'API Services',
          status: 'unhealthy',
          message: 'Connection failed',
          icon: <Server className="w-5 h-5" />
        }
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchHealthData()
  }, [fetchHealthData])

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchHealthData()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchHealthData])

  const handleManualRefresh = () => {
    fetchHealthData()
  }

  const overallStatus = services.length > 0
    ? services.every(s => s.status === 'healthy')
      ? 'healthy'
      : services.some(s => s.status === 'unhealthy')
      ? 'unhealthy'
      : 'degraded'
    : 'unknown'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-900">System Health</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="ml-2 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1m</option>
                <option value={300}>5m</option>
              </select>
            )}
          </div>
          <Button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Badge */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall System Status</h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(overallStatus)}`}>
              {getStatusIcon(overallStatus)}
              <span className="font-medium capitalize">{overallStatus}</span>
            </div>
          </div>
          {lastUpdate && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                  {service.icon}
                </div>
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
              </div>
              <div className={`flex items-center gap-1 ${getStatusColor(service.status).split(' ')[0]}`}>
                {getStatusIcon(service.status)}
              </div>
            </div>
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusColor(service.status)}`}>
                <span className="font-medium capitalize">{service.status}</span>
              </div>
              {service.message && (
                <p className="text-sm text-gray-600">{service.message}</p>
              )}
              {service.responseTime && (
                <p className="text-xs text-gray-500">
                  Response time: {service.responseTime}ms
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Raw Data (for debugging, can be removed in production) */}
      {import.meta.env.DEV && healthData && (
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="cursor-pointer text-sm text-gray-600 font-medium">
            Raw Health Data (Development Only)
          </summary>
          <pre className="mt-2 text-xs text-gray-700 overflow-auto">
            {JSON.stringify({ health: healthData, p6: p6Status }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
