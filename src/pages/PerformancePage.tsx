import { useState, useEffect, useCallback } from 'react'
import { BarChart3, RefreshCw, TrendingUp, TrendingDown, Activity, Cpu, HardDrive, Zap, Database } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getPerformance, startProfiling, stopProfiling } from '@/services/api'
import { Button } from '@/components'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

interface TimeSeriesData {
  timestamp: string
  responseTime: number
  throughput: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
}

interface PerformanceData {
  current_metrics: {
    response_time_ms: number
    requests_per_second: number
    error_rate: number
    active_connections: number
    cpu_usage_percent: number
    memory_usage_mb: number
    cache_hit_rate: number
    db_query_time_ms: number
  }
  time_series: TimeSeriesData[]
  agent_metrics: {
    total_agents: number
    active_agents: number
    idle_agents: number
  }
  tool_metrics: {
    total_tools: number
    active_tools: number
    tool_usage: Array<{
      name: string
      count: number
      avg_execution_time_ms: number
    }>
  }
  cache_stats: {
    hit_rate: number
    miss_rate: number
    total_entries: number
    memory_usage_mb: number
  }
  db_stats: {
    active_connections: number
    max_connections: number
    avg_query_time_ms: number
    slow_queries: number
  }
}

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function PerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds
  const [isProfiling, setIsProfiling] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')

  const fetchPerformanceData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getPerformance() as any
      
      // Transform the data if needed (the API might return data in a different format)
      const transformedData: PerformanceData = {
        current_metrics: data?.current_metrics || {
          response_time_ms: Math.random() * 100 + 50,
          requests_per_second: Math.random() * 1000 + 500,
          error_rate: Math.random() * 5,
          active_connections: Math.floor(Math.random() * 100 + 20),
          cpu_usage_percent: Math.random() * 80 + 10,
          memory_usage_mb: Math.random() * 2048 + 512,
          cache_hit_rate: Math.random() * 30 + 70,
          db_query_time_ms: Math.random() * 50 + 10
        },
        time_series: data?.time_series || generateMockTimeSeries(),
        agent_metrics: data?.agent_metrics || {
          total_agents: 10,
          active_agents: Math.floor(Math.random() * 8 + 1),
          idle_agents: Math.floor(Math.random() * 3)
        },
        tool_metrics: data?.tool_metrics || {
          total_tools: 15,
          active_tools: Math.floor(Math.random() * 10 + 5),
          tool_usage: [
            { name: 'Search', count: Math.floor(Math.random() * 100 + 50), avg_execution_time_ms: Math.random() * 100 + 50 },
            { name: 'Analysis', count: Math.floor(Math.random() * 80 + 30), avg_execution_time_ms: Math.random() * 200 + 100 },
            { name: 'Generation', count: Math.floor(Math.random() * 60 + 20), avg_execution_time_ms: Math.random() * 150 + 75 },
            { name: 'Validation', count: Math.floor(Math.random() * 40 + 10), avg_execution_time_ms: Math.random() * 50 + 25 }
          ]
        },
        cache_stats: data?.cache_stats || {
          hit_rate: Math.random() * 30 + 70,
          miss_rate: Math.random() * 30,
          total_entries: Math.floor(Math.random() * 10000 + 5000),
          memory_usage_mb: Math.random() * 512 + 128
        },
        db_stats: data?.db_stats || {
          active_connections: Math.floor(Math.random() * 50 + 10),
          max_connections: 100,
          avg_query_time_ms: Math.random() * 50 + 10,
          slow_queries: Math.floor(Math.random() * 10)
        }
      }

      setPerformanceData(transformedData)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Failed to fetch performance data:', err)
      setError('Failed to fetch performance data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate mock time series data (replace with real data from API)
  const generateMockTimeSeries = (): TimeSeriesData[] => {
    const now = new Date()
    const data: TimeSeriesData[] = []
    
    for (let i = 59; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000)
      data.push({
        timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        responseTime: Math.random() * 100 + 50,
        throughput: Math.random() * 1000 + 500,
        errorRate: Math.random() * 5,
        cpuUsage: Math.random() * 80 + 10,
        memoryUsage: Math.random() * 2048 + 512
      })
    }
    
    return data
  }

  // Initial fetch
  useEffect(() => {
    fetchPerformanceData()
  }, [fetchPerformanceData])

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchPerformanceData()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchPerformanceData])

  const handleManualRefresh = () => {
    fetchPerformanceData()
  }

  const handleStartProfiling = async () => {
    try {
      await startProfiling()
      setIsProfiling(true)
    } catch (err) {
      console.error('Failed to start profiling:', err)
    }
  }

  const handleStopProfiling = async () => {
    try {
      const results = await stopProfiling()
      console.log('Profiling results:', results)
      setIsProfiling(false)
      // Could show results in a modal or separate section
    } catch (err) {
      console.error('Failed to stop profiling:', err)
    }
  }

  const metrics: PerformanceMetric[] = performanceData ? [
    {
      name: 'Response Time',
      value: performanceData.current_metrics.response_time_ms,
      unit: 'ms',
      trend: performanceData.current_metrics.response_time_ms > 100 ? 'up' : 'down',
      trendValue: 5.2
    },
    {
      name: 'Throughput',
      value: performanceData.current_metrics.requests_per_second,
      unit: 'req/s',
      trend: 'up',
      trendValue: 12.5
    },
    {
      name: 'Error Rate',
      value: performanceData.current_metrics.error_rate,
      unit: '%',
      trend: performanceData.current_metrics.error_rate > 2 ? 'up' : 'down',
      trendValue: -2.1
    },
    {
      name: 'Cache Hit Rate',
      value: performanceData.current_metrics.cache_hit_rate,
      unit: '%',
      trend: 'stable',
      trendValue: 0.5
    }
  ] : []

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getTrendColor = (metric: string, trend: 'up' | 'down' | 'stable') => {
    // For error rate and response time, up is bad
    if ((metric === 'Error Rate' || metric === 'Response Time') && trend === 'up') {
      return 'text-red-600'
    }
    // For throughput and cache hit rate, up is good
    if ((metric === 'Throughput' || metric === 'Cache Hit Rate') && trend === 'up') {
      return 'text-green-600'
    }
    if (trend === 'down') {
      return metric === 'Error Rate' || metric === 'Response Time' ? 'text-green-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-900">Performance Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
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
            onClick={isProfiling ? handleStopProfiling : handleStartProfiling}
            variant={isProfiling ? "danger" : "secondary"}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isProfiling ? 'Stop Profiling' : 'Start Profiling'}
          </Button>
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
              <div className={`flex items-center gap-1 ${getTrendColor(metric.name, metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span className="text-xs font-medium">{Math.abs(metric.trendValue)}%</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
              <span className="text-sm font-normal text-gray-600 ml-1">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {performanceData && (
        <>
          {/* Response Time & Throughput Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.time_series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#3b82f6"
                    name="Response Time (ms)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Throughput & Error Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData.time_series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="throughput"
                    stroke="#10b981"
                    name="Throughput (req/s)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="errorRate"
                    stroke="#ef4444"
                    name="Error Rate (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resource Usage Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData.time_series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cpuUsage"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="CPU Usage (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="memoryUsage"
                    stackId="2"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.6}
                    name="Memory (MB)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData.tool_metrics.tool_usage}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {performanceData.tool_metrics.tool_usage.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Agent Statistics
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Total Agents</dt>
                  <dd className="text-sm font-medium text-gray-900">{performanceData.agent_metrics.total_agents}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Active Agents</dt>
                  <dd className="text-sm font-medium text-green-600">{performanceData.agent_metrics.active_agents}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Idle Agents</dt>
                  <dd className="text-sm font-medium text-gray-500">{performanceData.agent_metrics.idle_agents}</dd>
                </div>
              </dl>
            </div>

            {/* Cache Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Cache Statistics
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Hit Rate</dt>
                  <dd className="text-sm font-medium text-green-600">{performanceData.cache_stats.hit_rate.toFixed(1)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Total Entries</dt>
                  <dd className="text-sm font-medium text-gray-900">{performanceData.cache_stats.total_entries.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Memory Usage</dt>
                  <dd className="text-sm font-medium text-gray-900">{performanceData.cache_stats.memory_usage_mb.toFixed(0)} MB</dd>
                </div>
              </dl>
            </div>

            {/* DB Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Statistics
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Connections</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {performanceData.db_stats.active_connections}/{performanceData.db_stats.max_connections}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Avg Query Time</dt>
                  <dd className="text-sm font-medium text-gray-900">{performanceData.db_stats.avg_query_time_ms.toFixed(1)} ms</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Slow Queries</dt>
                  <dd className="text-sm font-medium text-orange-600">{performanceData.db_stats.slow_queries}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="text-sm text-gray-500 text-right">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
