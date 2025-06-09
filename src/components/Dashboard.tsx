
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiCrew } from "@/lib/aiAgents";

export function Dashboard() {
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSystemMetrics = async () => {
      try {
        const metrics = await aiCrew.runSystemWideMonitoring();
        setSystemMetrics(metrics);
      } catch (error) {
        console.error('Error loading system metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSystemMetrics();
    const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
          <p className="text-cyan-300">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Command Center
          </h2>
          <p className="text-cyan-300/80 mt-2">Real-time system monitoring and control</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 shadow-lg">
            All Systems Operational
          </Badge>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Users", value: "2,847", change: "+12%", color: "cyan", icon: "👥" },
          { title: "Applications", value: "156", change: "+8%", color: "blue", icon: "📋" },
          { title: "Certificates", value: "1,247", change: "+15%", color: "purple", icon: "📜" },
          { title: "System Uptime", value: "99.9%", change: "Stable", color: "green", icon: "⚡" }
        ].map((metric, index) => (
          <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 flex items-center justify-center shadow-lg shadow-${metric.color}-500/30`}>
                  <span className="text-xl">{metric.icon}</span>
                </div>
                <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">
                  {metric.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <p className="text-cyan-300/80 text-sm">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="text-sm">🖥️</span>
              </div>
              System Health Monitor
            </CardTitle>
            <CardDescription className="text-cyan-300/80">
              Real-time infrastructure monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemMetrics?.detailedResults?.[0] && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/10">
                    <p className="text-cyan-300 text-sm">CPU Usage</p>
                    <p className="text-2xl font-bold text-white">{systemMetrics.detailedResults[0].performance?.cpuUsage}%</p>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemMetrics.detailedResults[0].performance?.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/10">
                    <p className="text-cyan-300 text-sm">Memory</p>
                    <p className="text-2xl font-bold text-white">{systemMetrics.detailedResults[0].performance?.memoryUsage}%</p>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemMetrics.detailedResults[0].performance?.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-green-500/20">
                    <span className="text-cyan-300">Database Status</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {systemMetrics.detailedResults[0].database?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-blue-500/20">
                    <span className="text-cyan-300">Blockchain Network</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {systemMetrics.detailedResults[0].blockchain?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                    <span className="text-cyan-300">AI Systems</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {systemMetrics.detailedResults[0].ai?.status}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
                <span className="text-sm">📊</span>
              </div>
              Live Activity Feed
            </CardTitle>
            <CardDescription className="text-cyan-300/80">
              Recent system activities and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 min ago", action: "New certificate issued", type: "success", icon: "✅" },
                { time: "5 min ago", action: "Application approved", type: "info", icon: "📋" },
                { time: "8 min ago", action: "User verification completed", type: "success", icon: "🔐" },
                { time: "12 min ago", action: "AI model updated", type: "warning", icon: "🤖" },
                { time: "15 min ago", action: "Blockchain sync completed", type: "info", icon: "⛓️" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'success' ? 'bg-green-500/20 text-green-300' :
                    activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    <span>{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-cyan-200 font-medium">{activity.action}</p>
                    <p className="text-cyan-300/60 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription className="text-cyan-300/80">
            Common administrative tasks and controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-none shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-semibold">New Application</div>
                <div className="text-xs opacity-80">Create service request</div>
              </div>
            </Button>
            <Button className="h-auto p-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-none shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl mb-2">📜</div>
                <div className="font-semibold">Issue Certificate</div>
                <div className="text-xs opacity-80">Generate document</div>
              </div>
            </Button>
            <Button className="h-auto p-6 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white border-none shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-semibold">Run Automation</div>
                <div className="text-xs opacity-80">Execute workflow</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
