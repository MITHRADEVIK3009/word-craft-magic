
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useUIState } from "@/lib/stateManager";
import { Bell, Smartphone, Mail, AlertCircle, Check, Clock, History } from "lucide-react";

export function NotificationSystem() {
  const { 
    notification, 
    notificationPrefs, 
    setNotificationState 
  } = useUIState();
  
  const [showHistory, setShowHistory] = useState(false);
  const [customTime, setCustomTime] = useState([9, 17]); // 9 AM to 5 PM
  const [frequency, setFrequency] = useState([1]); // Daily

  const handleToggleNotification = (type: 'sms' | 'push' | 'email') => {
    // Update notification preferences
    setNotificationState(`${type}-enabled` as any);
    
    setTimeout(() => {
      setNotificationState('saved');
      toast({
        title: "Preferences Updated",
        description: `${type.toUpperCase()} notifications ${notificationPrefs[type] ? 'disabled' : 'enabled'}`,
      });
    }, 500);
  };

  const handleSendTestNotification = () => {
    setNotificationState('preview-sent');
    
    toast({
      title: "Test Notification Sent",
      description: "Check your devices for the test notification",
    });

    // Simulate realtime banner
    setTimeout(() => {
      setNotificationState('realtime-banner');
      toast({
        title: "🔔 Test Notification",
        description: "This is how your notifications will appear",
      });
    }, 2000);
  };

  const renderNotificationState = () => {
    switch (notification) {
      case 'all-disabled':
        return (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <div>
                <h4 className="text-orange-400 font-medium">All Notifications Disabled</h4>
                <p className="text-orange-300 text-sm">You may miss important updates about your applications</p>
              </div>
            </div>
          </div>
        );

      case 'unverified':
        return (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <h4 className="text-yellow-400 font-medium">Verify Contact Information</h4>
                  <p className="text-yellow-300 text-sm">Please verify your phone and email to receive notifications</p>
                </div>
              </div>
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Verify Now
              </Button>
            </div>
          </div>
        );

      case 'permission-denied':
        return (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div>
                  <h4 className="text-red-400 font-medium">Browser Permissions Required</h4>
                  <p className="text-red-300 text-sm">Enable notifications in your browser settings</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                Help
              </Button>
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400" />
              <div>
                <h4 className="text-green-400 font-medium">Preferences Saved</h4>
                <p className="text-green-300 text-sm">Your notification settings have been updated</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center gap-3">
            <Bell className="h-6 w-6 text-cyan-400" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderNotificationState()}

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Notification Channels</h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-white font-medium">SMS Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive updates via text message</p>
                </div>
              </div>
              <Switch 
                checked={notificationPrefs.sms}
                onCheckedChange={() => handleToggleNotification('sms')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  <p className="text-gray-400 text-sm">Browser and mobile push alerts</p>
                </div>
              </div>
              <Switch 
                checked={notificationPrefs.push}
                onCheckedChange={() => handleToggleNotification('push')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-gray-400 text-sm">Important updates via email</p>
                </div>
              </div>
              <Switch 
                checked={notificationPrefs.email}
                onCheckedChange={() => handleToggleNotification('email')}
              />
            </div>
          </div>

          {/* Custom Time Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Notification Schedule
            </h3>
            
            <div className="p-4 bg-slate-700/50 rounded-lg space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Active Hours: {customTime[0]}:00 - {customTime[1]}:00
                </label>
                <Slider
                  value={customTime}
                  onValueChange={setCustomTime}
                  max={24}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Frequency: {frequency[0] === 1 ? 'Daily' : frequency[0] === 7 ? 'Weekly' : 'Custom'}
                </label>
                <Slider
                  value={frequency}
                  onValueChange={setFrequency}
                  max={7}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={handleSendTestNotification}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Send Test Notification
            </Button>
            
            <Button 
              onClick={() => setShowHistory(true)}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Notification History</h3>
              <Button 
                onClick={() => setShowHistory(false)}
                variant="ghost"
                size="sm"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { time: '2 hours ago', message: 'Document verification completed', type: 'success' },
                { time: '1 day ago', message: 'Application status updated', type: 'info' },
                { time: '3 days ago', message: 'New document uploaded', type: 'info' },
              ].map((notif, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white">{notif.message}</p>
                    <p className="text-gray-400 text-sm">{notif.time}</p>
                  </div>
                  <Badge className={notif.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}>
                    {notif.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
