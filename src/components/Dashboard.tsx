
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';

export function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Simulate real AI-powered dashboard data
      return {
        aiInsights: [
          {
            type: 'demand_prediction',
            title: 'Peak Service Hours Predicted',
            prediction: 'High demand expected between 10 AM - 2 PM today',
            confidence: 94.5,
            impact: 'Recommend additional staff allocation'
          },
          {
            type: 'resource_optimization',
            title: 'Resource Allocation Optimization',
            prediction: 'Certificate processing can be 23% faster with AI routing',
            confidence: 87.2,
            impact: 'Automatically route to less busy counters'
          },
          {
            type: 'fraud_detection',
            title: 'Blockchain Security Status',
            prediction: '100% document integrity maintained',
            confidence: 99.9,
            impact: '0 tampering attempts detected today'
          }
        ],
        applications: [
          {
            id: 'APP001',
            type: 'Birth Certificate',
            status: 'processing',
            progress: 65,
            submittedAt: '2024-01-15',
            estimatedCompletion: '2024-01-18'
          },
          {
            id: 'APP002',
            type: 'Income Certificate',
            status: 'approved',
            progress: 100,
            submittedAt: '2024-01-10',
            completedAt: '2024-01-14'
          }
        ],
        certificates: [
          {
            id: 'CERT001',
            type: 'Aadhaar Verification',
            issueDate: '2024-01-14',
            blockchainHash: '0x4f3c2a1b8e9d7c6a5f4e3d2c1b0a9e8d7c6b5a4f3e2d1c0b9a8e7d6c5b4a3f2e1d',
            status: 'verified'
          }
        ],
        blockchainStats: {
          totalTransactions: 1247,
          verifiedDocuments: 892,
          networkHealth: 'Excellent',
          lastBlockTime: '12 seconds ago'
        }
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-700 rounded"></div>
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
        <h2 className="text-3xl font-bold text-yellow-400">AI-Powered Dashboard</h2>
        <Badge className="bg-green-600 text-white">Real-Time Data</Badge>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dashboardData?.aiInsights.map((insight, index) => (
          <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                🤖 {insight.title}
              </CardTitle>
              <CardDescription className="text-gray-300">
                AI Confidence: {insight.confidence}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 mb-3">{insight.prediction}</p>
              <Progress value={insight.confidence} className="mb-2" />
              <p className="text-sm text-yellow-300">💡 {insight.impact}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications & Certificates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Recent Applications</CardTitle>
            <CardDescription className="text-gray-400">
              Track your service requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.applications.map((app) => (
                <div key={app.id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{app.type}</h4>
                    <Badge className={
                      app.status === 'approved' ? 'bg-green-600' : 
                      app.status === 'processing' ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {app.status}
                    </Badge>
                  </div>
                  <Progress value={app.progress} className="mb-2" />
                  <p className="text-sm text-gray-400">
                    {app.status === 'approved' 
                      ? `Completed: ${app.completedAt}`
                      : `Est. completion: ${app.estimatedCompletion}`
                    }
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Blockchain Certificates</CardTitle>
            <CardDescription className="text-gray-400">
              Verified documents on blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{cert.type}</h4>
                    <Badge className="bg-blue-600">Verified</Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    Issued: {cert.issueDate}
                  </p>
                  <p className="text-xs text-green-400 font-mono">
                    🔗 {cert.blockchainHash.substring(0, 20)}...
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Network Status */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Blockchain Network Status</CardTitle>
          <CardDescription className="text-gray-300">
            Real-time blockchain health monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{dashboardData?.blockchainStats.totalTransactions}</p>
              <p className="text-sm text-gray-300">Total Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{dashboardData?.blockchainStats.verifiedDocuments}</p>
              <p className="text-sm text-gray-300">Verified Documents</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">{dashboardData?.blockchainStats.networkHealth}</p>
              <p className="text-sm text-gray-300">Network Health</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-yellow-400">{dashboardData?.blockchainStats.lastBlockTime}</p>
              <p className="text-sm text-gray-300">Last Block</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
              Apply for Certificate
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Track Application
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Verify Document
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
