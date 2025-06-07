
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function ApplicationsPage() {
  const [selectedService, setSelectedService] = useState('');
  const [applicationData, setApplicationData] = useState({
    serviceType: '',
    personalInfo: '',
    documents: null as File | null,
    urgentProcessing: false
  });

  const serviceTypes = [
    { id: 'birth_cert', name: 'Birth Certificate', processing: '3-5 days', fee: '₹50' },
    { id: 'income_cert', name: 'Income Certificate', processing: '5-7 days', fee: '₹75' },
    { id: 'domicile_cert', name: 'Domicile Certificate', processing: '7-10 days', fee: '₹100' },
    { id: 'caste_cert', name: 'Caste Certificate', processing: '10-14 days', fee: '₹100' },
    { id: 'marriage_cert', name: 'Marriage Certificate', processing: '5-7 days', fee: '₹150' }
  ];

  const currentApplications = [
    {
      id: 'APP003',
      type: 'Birth Certificate',
      status: 'processing',
      submittedAt: '2024-01-15',
      estimatedCompletion: '2024-01-20',
      currentStage: 'Document Verification',
      progress: 60,
      aiPrediction: 'Expected completion 1 day earlier based on current processing speed'
    },
    {
      id: 'APP004',
      type: 'Income Certificate',
      status: 'approved',
      submittedAt: '2024-01-10',
      completedAt: '2024-01-14',
      currentStage: 'Completed',
      progress: 100,
      blockchainHash: '0x7a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate document hashing for blockchain
      const reader = new FileReader();
      reader.onload = () => {
        const hash = btoa(reader.result as string).substring(0, 32);
        console.log('Document hash generated for blockchain:', hash);
        setApplicationData({ ...applicationData, documents: file });
        toast({
          title: "Document Uploaded",
          description: `File: ${file.name} - Hash generated for blockchain verification`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedService || !applicationData.documents) {
      toast({
        title: "Incomplete Application",
        description: "Please select a service and upload required documents",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI-powered application processing
    toast({
      title: "Application Submitted",
      description: "AI is processing your application and will provide updates",
    });

    // Simulate blockchain logging
    setTimeout(() => {
      toast({
        title: "Blockchain Verification",
        description: "Your documents have been secured on the blockchain",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Applications & Services</h2>
        <Badge className="bg-blue-600 text-white">AI-Powered Processing</Badge>
      </div>

      {/* New Application Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Apply for New Service</CardTitle>
          <CardDescription className="text-gray-400">
            AI will optimize your application processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Select Service Type</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {serviceTypes.map((service) => (
                  <SelectItem key={service.id} value={service.id} className="text-white">
                    <div className="flex justify-between w-full">
                      <span>{service.name}</span>
                      <span className="text-yellow-400">{service.fee}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-yellow-400 font-semibold">Processing Time</p>
                    <p className="text-white">
                      {serviceTypes.find(s => s.id === selectedService)?.processing}
                    </p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold">Fee</p>
                    <p className="text-white">
                      {serviceTypes.find(s => s.id === selectedService)?.fee}
                    </p>
                  </div>
                  <div>
                    <p className="text-yellow-400 font-semibold">AI Optimization</p>
                    <p className="text-green-400">Enabled ✓</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label className="text-gray-300">Upload Required Documents</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              className="bg-gray-700 border-gray-600 text-white"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-sm text-gray-400 mt-1">
              Documents will be hashed and stored on blockchain for security
            </p>
          </div>

          <div>
            <Label className="text-gray-300">Additional Information</Label>
            <Input
              placeholder="Any additional details or special requirements"
              value={applicationData.personalInfo}
              onChange={(e) => setApplicationData({...applicationData, personalInfo: e.target.value})}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Button 
            onClick={handleSubmitApplication}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
          >
            Submit Application with AI Processing
          </Button>
        </CardContent>
      </Card>

      {/* Current Applications */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">Your Applications</CardTitle>
          <CardDescription className="text-gray-400">
            Track status with AI-powered predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentApplications.map((app) => (
              <Card key={app.id} className="bg-gray-700 border-gray-600">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{app.type}</h4>
                      <p className="text-gray-400">Application ID: {app.id}</p>
                    </div>
                    <Badge className={
                      app.status === 'approved' ? 'bg-green-600' : 
                      app.status === 'processing' ? 'bg-yellow-600' : 'bg-red-600'
                    }>
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Progress</span>
                        <span className="text-yellow-400">{app.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Current Stage:</p>
                        <p className="text-white font-medium">{app.currentStage}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {app.status === 'approved' ? 'Completed:' : 'Est. Completion:'}
                        </p>
                        <p className="text-white font-medium">
                          {app.status === 'approved' ? app.completedAt : app.estimatedCompletion}
                        </p>
                      </div>
                    </div>

                    {app.aiPrediction && (
                      <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3">
                        <p className="text-blue-300 text-sm">
                          🤖 AI Prediction: {app.aiPrediction}
                        </p>
                      </div>
                    )}

                    {app.blockchainHash && (
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-3">
                        <p className="text-green-300 text-sm">
                          🔗 Blockchain Verified: {app.blockchainHash.substring(0, 30)}...
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
