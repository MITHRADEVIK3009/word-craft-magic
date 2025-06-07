
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function CertificatesPage() {
  const [verificationHash, setVerificationHash] = useState('');

  const certificates = [
    {
      id: 'CERT001',
      type: 'Birth Certificate',
      issueDate: '2024-01-14',
      validUntil: '2029-01-14',
      authority: 'Municipal Corporation',
      blockchainHash: '0x4f3c2a1b8e9d7c6a5f4e3d2c1b0a9e8d7c6b5a4f3e2d1c0b9a8e7d6c5b4a3f2e1d',
      ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      digitalSignature: 'Valid PKI Signature',
      downloadUrl: '/api/certificates/CERT001/download'
    },
    {
      id: 'CERT002',
      type: 'Income Certificate',
      issueDate: '2024-01-12',
      validUntil: '2025-01-12',
      authority: 'Revenue Department',
      blockchainHash: '0x7a8b9c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      ipfsHash: 'QmPK1s3dhRBgqhftDQG8EjhMfF8SoThZtDYMKtfXxeWZnE',
      digitalSignature: 'Valid PKI Signature',
      downloadUrl: '/api/certificates/CERT002/download'
    }
  ];

  const handleVerifyDocument = async () => {
    if (!verificationHash) {
      toast({
        title: "Enter Hash",
        description: "Please enter a blockchain hash to verify",
        variant: "destructive"
      });
      return;
    }

    // Simulate blockchain verification
    const isValid = certificates.some(cert => 
      cert.blockchainHash.toLowerCase() === verificationHash.toLowerCase()
    );

    if (isValid) {
      toast({
        title: "Document Verified ✓",
        description: "This document is authentic and secured on blockchain",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "Document not found or tampered. Please check the hash.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (certificate: any) => {
    // Simulate secure download with PKI verification
    toast({
      title: "Downloading Certificate",
      description: `Verifying PKI signature for ${certificate.type}...`,
    });

    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Certificate downloaded with verified digital signature",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-yellow-400">Blockchain Certificates</h2>
        <Badge className="bg-green-600 text-white">PKI Secured</Badge>
      </div>

      {/* Document Verification Section */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🔍 Verify Document Authenticity</CardTitle>
          <CardDescription className="text-gray-300">
            Enter blockchain hash to verify document integrity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter blockchain hash (0x...)"
              value={verificationHash}
              onChange={(e) => setVerificationHash(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white flex-1"
            />
            <Button 
              onClick={handleVerifyDocument}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
            >
              Verify on Blockchain
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            All documents are secured with SHA-256 hashing and stored on immutable blockchain
          </p>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-yellow-400">{cert.type}</CardTitle>
                  <CardDescription className="text-gray-400">
                    ID: {cert.id} | Authority: {cert.authority}
                  </CardDescription>
                </div>
                <Badge className="bg-green-600">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Issue Date:</p>
                  <p className="text-white font-medium">{cert.issueDate}</p>
                </div>
                <div>
                  <p className="text-gray-400">Valid Until:</p>
                  <p className="text-white font-medium">{cert.validUntil}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Blockchain Hash:</p>
                  <p className="text-green-400 font-mono text-xs break-all">
                    {cert.blockchainHash}
                  </p>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">IPFS Storage:</p>
                  <p className="text-blue-400 font-mono text-xs break-all">
                    {cert.ipfsHash}
                  </p>
                </div>

                <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Digital Signature:</p>
                  <p className="text-yellow-400 text-xs">
                    ✓ {cert.digitalSignature}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDownload(cert)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                >
                  Download PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                  onClick={() => {
                    navigator.clipboard.writeText(cert.blockchainHash);
                    toast({
                      title: "Hash Copied",
                      description: "Blockchain hash copied to clipboard",
                    });
                  }}
                >
                  Copy Hash
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blockchain Network Status */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-700">
        <CardHeader>
          <CardTitle className="text-yellow-400">🔗 Blockchain Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">1,247</p>
              <p className="text-sm text-gray-300">Total Certificates</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-sm text-gray-300">Verification Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">99.9%</p>
              <p className="text-sm text-gray-300">Network Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">0</p>
              <p className="text-sm text-gray-300">Tampering Attempts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
