
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    preferredLanguage: 'english',
    notificationSettings: {
      email: true,
      sms: true,
      push: true
    }
  });

  const userActivity = [
    {
      date: '2024-01-15',
      action: 'Applied for Birth Certificate',
      status: 'Processing',
      id: 'APP003'
    },
    {
      date: '2024-01-14',
      action: 'Downloaded Income Certificate',
      status: 'Completed',
      id: 'CERT002'
    },
    {
      date: '2024-01-12',
      action: 'Verified Aadhaar Details',
      status: 'Verified',
      id: 'VERIFY001'
    },
    {
      date: '2024-01-10',
      action: 'Created Account',
      status: 'Completed',
      id: 'REG001'
    }
  ];

  const securityLogs = [
    {
      date: '2024-01-15 14:30',
      event: 'Login from Chrome (Windows)',
      location: 'Mumbai, India',
      status: 'Success'
    },
    {
      date: '2024-01-14 09:15',
      event: 'Password Change',
      location: 'Mumbai, India',
      status: 'Success'
    },
    {
      date: '2024-01-12 16:45',
      event: 'OTP Verification',
      location: 'Mumbai, India',
      status: 'Success'
    }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "OTP sent to your email for password change verification",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Profile & Settings</h2>
        <Button 
          variant="outline" 
          className="border-gray-600 text-gray-300"
          onClick={logout}
        >
          Logout
        </Button>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-yellow-400">Personal Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account details and preferences
                </CardDescription>
              </div>
              <Button 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Email Address</Label>
                <Input
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Phone Number</Label>
                <Input
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">Aadhaar Number</Label>
                <Input
                  value={user?.aadhaarNumber || ''}
                  disabled
                  className="bg-gray-600 border-gray-500 text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Aadhaar number cannot be changed</p>
              </div>

              <div>
                <Label className="text-gray-300">Preferred Language</Label>
                <Select 
                  value={profileData.preferredLanguage} 
                  onValueChange={(value) => setProfileData({...profileData, preferredLanguage: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="english" className="text-white">English</SelectItem>
                    <SelectItem value="hindi" className="text-white">हिंदी</SelectItem>
                    <SelectItem value="tamil" className="text-white">தமிழ்</SelectItem>
                    <SelectItem value="telugu" className="text-white">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <Button 
                  onClick={handleSaveProfile}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                >
                  Save Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-400">Security Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your account security and privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-400 text-sm">Email OTP enabled</p>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Aadhaar Verification</p>
                  <p className="text-gray-400 text-sm">Identity verified</p>
                </div>
                <Badge className="bg-green-600">Verified</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Blockchain Security</p>
                  <p className="text-gray-400 text-sm">All documents secured</p>
                </div>
                <Badge className="bg-blue-600">Protected</Badge>
              </div>

              <Button 
                onClick={handleChangePassword}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                Change Password
              </Button>

              <Button 
                variant="outline"
                className="w-full border-gray-600 text-gray-300"
              >
                Download Data Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Activity History</CardTitle>
          <CardDescription className="text-gray-400">
            Your recent actions and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.date} • ID: {activity.id}</p>
                  </div>
                </div>
                <Badge className={
                  activity.status === 'Completed' || activity.status === 'Verified' ? 'bg-green-600' :
                  activity.status === 'Processing' ? 'bg-yellow-600' : 'bg-blue-600'
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Logs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Security Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Recent login attempts and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">{log.event}</p>
                  <p className="text-gray-400 text-sm">{log.date} • {log.location}</p>
                </div>
                <Badge className="bg-green-600">{log.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
