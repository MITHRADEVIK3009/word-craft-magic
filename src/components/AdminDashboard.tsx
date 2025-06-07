
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';

export function AdminDashboard() {
  const { data: adminData } = useQuery({
    queryKey: ['admin'],
    queryFn: async () => {
      // Simulate real-time admin dashboard data
      return {
        systemMetrics: {
          totalUsers: 15847,
          activeApplications: 3421,
          processedToday: 567,
          systemUptime: 99.7,
          apiResponseTime: 145,
          databaseHealth: 'Excellent'
        },
        aiMetrics: {
          predictionAccuracy: 94.2,
          automatedProcessing: 78.5,
          resourceOptimization: 89.3,
          fraudDetection: 99.8
        },
        blockchainMetrics: {
          totalTransactions: 12847,
          verificationRate: 100,
          networkNodes: 25,
          consensusTime: 12.5
        },
        serviceTypes: [
          { name: 'Birth Certificate', count: 245, avgTime: '3.2 days' },
          { name: 'Income Certificate', count: 189, avgTime: '4.1 days' },
          { name: 'Domicile Certificate', count: 156, avgTime: '6.8 days' },
          { name: 'Caste Certificate', count: 98, avgTime: '8.5 days' }
        ],
        recentAlerts: [
          { type: 'info', message: 'AI model retrained with 99.2% accuracy', time: '5 min ago' },
          { type: 'success', message: 'Blockchain sync completed successfully', time: '12 min ago' },
          { type: 'warning', message: 'High load detected on Mumbai server', time: '25 min ago' }
        ]
      };
    },
  });

  if (!adminData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Badge className="bg-green-600 text-white">System Healthy</Badge>
          <Badge className="bg-blue-600 text-white">Real-Time Data</Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-200 text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{adminData.systemMetrics.totalUsers.toLocaleString()}</p>
            <p className="text-blue-300 text-sm mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-200 text-sm">Active Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{adminData.systemMetrics.activeApplications.toLocaleString()}</p>
            <p className="text-green-300 text-sm mt-1">Processing in real-time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-200 text-sm">Processed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{adminData.systemMetrics.processedToday}</p>
            <p className="text-purple-300 text-sm mt-1">+23% efficiency boost</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-200 text-sm">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{adminData.systemMetrics.systemUptime}%</p>
            <p className="text-yellow-300 text-sm mt-1">99.9% SLA maintained</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🤖 AI Performance Metrics</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time AI model performance and optimization stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Prediction Accuracy</span>
                <span className="text-yellow-400 font-bold">{adminData.aiMetrics.predictionAccuracy}%</span>
              </div>
              <Progress value={adminData.aiMetrics.predictionAccuracy} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Automated Processing</span>
                <span className="text-yellow-400 font-bold">{adminData.aiMetrics.automatedProcessing}%</span>
              </div>
              <Progress value={adminData.aiMetrics.automatedProcessing} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Resource Optimization</span>
                <span className="text-yellow-400 font-bold">{adminData.aiMetrics.resourceOptimization}%</span>
              </div>
              <Progress value={adminData.aiMetrics.resourceOptimization} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Fraud Detection</span>
                <span className="text-yellow-400 font-bold">{adminData.aiMetrics.fraudDetection}%</span>
              </div>
              <Progress value={adminData.aiMetrics.fraudDetection} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Network Status */}
      <Card className="bg-gradient-to-r from-cyan-900 to-blue-900 border-cyan-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🔗 Blockchain Network Status</CardTitle>
          <CardDescription className="text-gray-300">
            Distributed ledger health and transaction monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{adminData.blockchainMetrics.totalTransactions.toLocaleString()}</p>
              <p className="text-cyan-300 text-sm">Total Transactions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{adminData.blockchainMetrics.verificationRate}%</p>
              <p className="text-cyan-300 text-sm">Verification Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{adminData.blockchainMetrics.networkNodes}</p>
              <p className="text-cyan-300 text-sm">Network Nodes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{adminData.blockchainMetrics.consensusTime}s</p>
              <p className="text-cyan-300 text-sm">Consensus Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">📊 Service Analytics</CardTitle>
            <CardDescription className="text-gray-400">
              Processing statistics by service type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminData.serviceTypes.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-gray-400 text-sm">Avg: {service.avgTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">{service.count}</p>
                    <p className="text-gray-400 text-sm">applications</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">🚨 Recent Alerts</CardTitle>
            <CardDescription className="text-gray-400">
              System notifications and important events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adminData.recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    alert.type === 'success' ? 'bg-green-400' :
                    alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-400 text-xs">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Monitoring */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">⚡ Performance Monitoring</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time system performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 mb-2">API Response Time</p>
              <p className="text-3xl font-bold text-white">{adminData.systemMetrics.apiResponseTime}ms</p>
              <p className="text-green-400 text-sm">Excellent</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2">Database Health</p>
              <p className="text-2xl font-bold text-white">{adminData.systemMetrics.databaseHealth}</p>
              <p className="text-green-400 text-sm">All connections stable</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-2">Active Sessions</p>
              <p className="text-3xl font-bold text-white">2,847</p>
              <p className="text-blue-400 text-sm">Real-time users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
