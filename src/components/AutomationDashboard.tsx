
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { automationEngine } from '@/lib/automationEngine';
import { toast } from "@/hooks/use-toast";

export function AutomationDashboard() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
    loadStats();
  }, []);

  const loadWorkflows = () => {
    const workflowList = automationEngine.getWorkflows();
    setWorkflows(workflowList);
  };

  const loadStats = () => {
    const statistics = automationEngine.getStats();
    setStats(statistics);
  };

  const toggleWorkflow = async (workflowId: string, isActive: boolean) => {
    try {
      if (isActive) {
        automationEngine.resumeWorkflow(workflowId);
        toast({
          title: "Workflow Activated",
          description: "The workflow has been activated successfully",
        });
      } else {
        automationEngine.pauseWorkflow(workflowId);
        toast({
          title: "Workflow Paused",
          description: "The workflow has been paused",
        });
      }
      loadWorkflows();
      loadStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle workflow",
        variant: "destructive"
      });
    }
  };

  const triggerWorkflow = async (workflowId: string, workflowName: string) => {
    setIsLoading(true);
    try {
      const result = await automationEngine.triggerWorkflow(workflowId, {
        triggeredBy: 'manual',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        toast({
          title: "Workflow Triggered",
          description: `${workflowName} has been executed successfully`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Workflow Failed",
        description: error.message || "Failed to execute workflow",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'paused': return 'bg-yellow-600';
      case 'inactive': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'user': return '👤';
      case 'application': return '📋';
      case 'blockchain': return '🔗';
      case 'monitoring': return '📊';
      default: return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Automation Dashboard</h2>
        <Badge className="bg-blue-600 text-white">AI-Powered Workflows</Badge>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-800 to-green-900 border-green-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.totalWorkflows || 0}</div>
              <div className="text-green-200">Total Workflows</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-800 to-blue-900 border-blue-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.activeWorkflows || 0}</div>
              <div className="text-blue-200">Active Workflows</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-800 to-yellow-900 border-yellow-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.pausedWorkflows || 0}</div>
              <div className="text-yellow-200">Paused Workflows</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-800 to-purple-900 border-purple-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.jobsExecuted || 0}</div>
              <div className="text-purple-200">Jobs Running</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWorkflowIcon(workflow.type)}</span>
                  <div>
                    <CardTitle className="text-yellow-400">{workflow.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      Type: {workflow.type} • ID: {workflow.id}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(workflow.status)}>
                  {workflow.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Triggers: {workflow.triggers.length}</span>
                  <span className="text-gray-300">Actions: {workflow.actions.length}</span>
                </div>
                <Progress value={workflow.status === 'active' ? 100 : 0} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={workflow.status === 'active'}
                    onCheckedChange={(checked) => toggleWorkflow(workflow.id, checked)}
                  />
                  <span className="text-sm text-gray-300">
                    {workflow.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => triggerWorkflow(workflow.id, workflow.name)}
                  disabled={isLoading || workflow.status !== 'active'}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                >
                  {isLoading ? 'Running...' : 'Trigger Now'}
                </Button>
              </div>

              <div className="text-xs text-gray-400">
                <div className="grid grid-cols-2 gap-2">
                  <div>Triggers: {workflow.triggers.map((t: any) => t.type).join(', ')}</div>
                  <div>Actions: {workflow.actions.length} configured</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">
            Manually trigger common automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => triggerWorkflow('document-processing', 'Document Processing')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              📄 Process Documents
            </Button>
            <Button
              onClick={() => triggerWorkflow('system-monitoring', 'System Monitoring')}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              📊 System Health Check
            </Button>
            <Button
              onClick={() => triggerWorkflow('blockchain-sync', 'Blockchain Sync')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              🔗 Blockchain Sync
            </Button>
            <Button
              onClick={() => {
                loadWorkflows();
                loadStats();
                toast({ title: "Dashboard Refreshed", description: "All data has been updated" });
              }}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              🔄 Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
