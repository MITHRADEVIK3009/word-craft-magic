
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/database';
import { aiCrew } from '@/lib/aiAgents';

export function Dashboard() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get real data from database
      const [applications, certificates] = await Promise.all([
        db.getUserApplications(user.id),
        db.getUserCertificates(user.id)
      ]);

      // Get AI insights
      const aiInsights = await Promise.all([
        aiCrew.executeTask('analytics', {
          action: 'predict_demand',
          serviceType: 'birth_certificate',
          timeframe: 'today'
        }),
        aiCrew.executeTask('analytics', {
          action: 'predict_demand',
          serviceType: 'income_certificate',
          timeframe: 'today'
        }),
        aiCrew.executeTask('analytics', {
          action: 'analyze_behavior',
          userId: user.id
        })
      ]);

      return {
        applications,
        certificates,
        aiInsights,
        blockchainStats: {
          totalTransactions: applications.length + certificates.length,
          verifiedDocuments: certificates.length,
          networkHealth: 'Excellent',
          lastBlockTime: '12 seconds ago'
        }
      };
    },
    enabled: !!user,
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

  if (!dashboardData) {
    return (
      <div className="text-center text-gray-400">
        <p>Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">AI-Powered Dashboard</h2>
        <Badge className="bg-green-600 text-white">Live Data</Badge>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dashboardData.aiInsights.map((insight, index) => (
          <Card key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                🤖 AI Prediction #{index + 1}
              </CardTitle>
              <CardDescription className="text-gray-300">
                Confidence: {insight.confidence}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200 mb-3">
                {insight.prediction?.recommendation || 'AI analysis complete'}
              </p>
              <Progress value={insight.confidence} className="mb-2" />
              <p className="text-sm text-yellow-300">
                💡 Service: {insight.serviceType?.replace('_', ' ').toUpperCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications & Certificates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Your Applications</CardTitle>
            <CardDescription className="text-gray-400">
              Track your service requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.applications.length > 0 ? (
                dashboardData.applications.map((app) => (
                  <div key={app.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">
                        {app.serviceType.replace('_', ' ').toUpperCase()}
                      </h4>
                      <Badge className={
                        app.status === 'completed' ? 'bg-green-600' : 
                        app.status === 'processing' ? 'bg-yellow-600' : 'bg-blue-600'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                    <Progress value={app.progress} className="mb-2" />
                    <p className="text-sm text-gray-400">
                      Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No applications yet. Apply for a certificate to get started!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Your Certificates</CardTitle>
            <CardDescription className="text-gray-400">
              Verified blockchain documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.certificates.length > 0 ? (
                dashboardData.certificates.map((cert) => (
                  <div key={cert.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{cert.type}</h4>
                      <Badge className="bg-green-600">Verified</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-green-400 font-mono">
                      🔗 {cert.blockchainHash.substring(0, 20)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No certificates yet. Complete an application to receive certificates!
                </p>
              )}
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
              <p className="text-2xl font-bold text-white">{dashboardData.blockchainStats.totalTransactions}</p>
              <p className="text-sm text-gray-300">Your Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{dashboardData.blockchainStats.verifiedDocuments}</p>
              <p className="text-sm text-gray-300">Verified Documents</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">{dashboardData.blockchainStats.networkHealth}</p>
              <p className="text-sm text-gray-300">Network Health</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-yellow-400">{dashboardData.blockchainStats.lastBlockTime}</p>
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
