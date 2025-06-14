
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useUIState } from "@/lib/stateManager";
import { Upload, File, Check, X, Eye, Trash2, AlertCircle } from "lucide-react";

export function DocumentUpload() {
  const { 
    documentUpload, 
    uploadProgress, 
    uploadedFiles, 
    dragActive,
    setDocumentUploadState 
  } = useUIState();
  
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDocumentUploadState('dragging');
  }, [setDocumentUploadState]);

  const handleDragLeave = useCallback(() => {
    setDocumentUploadState(documentUpload === 'dragging' ? 'idle' : documentUpload);
  }, [documentUpload, setDocumentUploadState]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDocumentUploadState('selected');
      simulateUpload(files[0]);
    }
  }, [setDocumentUploadState]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setDocumentUploadState('selected');
      simulateUpload(files[0]);
    }
  };

  const simulateUpload = async (file: File) => {
    setDocumentUploadState('uploading');
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Update progress through store if needed
    }
    
    // Simulate file validation
    if (file.type.includes('pdf') || file.type.includes('image')) {
      setDocumentUploadState('success');
      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded and verified`,
      });
      
      // Simulate OCR extraction
      setTimeout(() => {
        setDocumentUploadState('ocr-extraction');
        setExtractedData({
          name: "John Doe",
          id: "ABCD1234567890",
          dob: "1990-01-01"
        });
      }, 2000);
    } else {
      setDocumentUploadState('error');
      toast({
        title: "Upload Failed",
        description: "Unsupported file format",
        variant: "destructive"
      });
    }
  };

  const handleVerifyDocument = () => {
    setDocumentUploadState('verification-requested');
    setTimeout(() => {
      setDocumentUploadState('verification-progress');
      setTimeout(() => {
        setDocumentUploadState('verified-valid');
        toast({
          title: "Document Verified",
          description: "Document is authentic and valid",
        });
      }, 3000);
    }, 500);
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    setDocumentUploadState('preview-expanded');
  };

  const renderUploadState = () => {
    switch (documentUpload) {
      case 'idle':
        return (
          <div 
            className="border-2 border-dashed border-cyan-500/30 rounded-xl p-12 text-center bg-gradient-to-br from-slate-800/50 to-blue-900/30 transition-all duration-300"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-16 w-16 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Upload Document</h3>
            <p className="text-cyan-300 mb-4">Drag and drop your files here or click to browse</p>
            <Input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <Button 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              Choose Files
            </Button>
          </div>
        );

      case 'dragging':
        return (
          <div 
            className="border-2 border-dashed border-cyan-400 rounded-xl p-12 text-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 transition-all duration-300"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-16 w-16 text-cyan-300 mb-4 animate-bounce" />
            <h3 className="text-xl font-semibold text-cyan-200 mb-2">Drop files here</h3>
            <p className="text-cyan-300">Release to upload</p>
          </div>
        );

      case 'uploading':
        return (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        );

      case 'success':
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Upload Successful</h3>
            <p className="text-gray-300 mb-4">Document uploaded and ready for verification</p>
            <Button onClick={handleVerifyDocument} className="bg-yellow-500 hover:bg-yellow-600">
              Verify Document
            </Button>
          </div>
        );

      case 'verification-progress':
        return (
          <div className="text-center p-8">
            <div className="animate-pulse w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Validating...</h3>
            <p className="text-gray-300">Checking document authenticity</p>
          </div>
        );

      case 'verified-valid':
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-green-600 text-white mb-4">Verified - Authentic</Badge>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Document Verified</h3>
            <p className="text-gray-300">Your document is authentic and valid</p>
          </div>
        );

      case 'verified-rejected':
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-white" />
            </div>
            <Badge className="bg-red-600 text-white mb-4">Rejected - Invalid Format</Badge>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Verification Failed</h3>
            <p className="text-gray-300">Document format is invalid or corrupted</p>
          </div>
        );

      case 'ocr-extraction':
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Extracted Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm">Name</label>
                <Input value={extractedData?.name || ''} className="bg-gray-700 border-gray-600" />
              </div>
              <div>
                <label className="text-gray-300 text-sm">ID Number</label>
                <Input value={extractedData?.id || ''} className="bg-gray-700 border-gray-600" />
              </div>
              <div>
                <label className="text-gray-300 text-sm">Date of Birth</label>
                <Input value={extractedData?.dob || ''} className="bg-gray-700 border-gray-600" />
              </div>
            </div>
            <Button className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600">
              Confirm Details
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">Upload Failed</h3>
            <p className="text-gray-300 mb-4">Unsupported file format or size too large</p>
            <Button 
              onClick={() => setDocumentUploadState('idle')}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/95 to-blue-900/95 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Document Upload & Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderUploadState()}
        
        {previewFile && documentUpload === 'preview-expanded' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl max-h-4xl overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Document Preview</h3>
                <Button 
                  onClick={() => {
                    setPreviewFile(null);
                    setDocumentUploadState('success');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <File className="mx-auto h-32 w-32 text-cyan-400 mb-4" />
                <p className="text-gray-300">{previewFile.name}</p>
                <p className="text-gray-500 text-sm">{previewFile.size} bytes</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
