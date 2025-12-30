import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  FileCheck,
  Eye,
  Search,
  ExternalLink,
} from "lucide-react";

export default function PublicMeritView() {
  const [vacancyId, setVacancyId] = useState("");
  const [meritData, setMeritData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulated API calls - replace with actual examApi
  const handleViewMerit = async () => {
    if (!vacancyId.trim()) {
      setError("Please enter a Vacancy ID");
      return;
    }

    setLoading(true);
    setError(null);
    setMeritData(null);
    setVerificationStatus(null);

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      setMeritData({
        blockchainTxHash:
          "0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e",
        meritHash:
          "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
        vacancyDetails: "Assistant Engineer (Civil) - Public Works Department",
        examDate: "December 15, 2025",
        totalApplications: 1247,
        selectedCandidates: 50,
        meritList: [
          {
            rank: 1,
            candidateName: "Rajesh Kumar",
            marks: 95,
            category: "General",
          },
          {
            rank: 2,
            candidateName: "Priya Sharma",
            marks: 94,
            category: "General",
          },
          { rank: 3, candidateName: "Amit Singh", marks: 93, category: "OBC" },
          {
            rank: 4,
            candidateName: "Sneha Patel",
            marks: 92,
            category: "General",
          },
          { rank: 5, candidateName: "Vikram Reddy", marks: 91, category: "SC" },
        ],
      });
      setVerificationStatus(true);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleViewMerit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-12 h-12 text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-800">JobChain</h1>
            </div>
            <p className="text-2xl text-gray-600 font-medium">
              Blockchain-Verified Government Recruitment System
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Ensuring transparency, security, and trust in public sector hiring
              through immutable blockchain technology
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-12 space-y-8">
        {/* Search Section */}
        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader className="bg-gray-100 border-b border-gray-200">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-gray-800">
              <Search className="w-6 h-6 text-blue-600" />
              Verify Merit List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-700 text-lg font-medium">
                  Enter the Vacancy ID to verify the authenticity of any merit
                  list
                </p>
                <p className="text-gray-500 text-sm">
                  All results are cryptographically verified against blockchain
                  records
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                <Input
                  value={vacancyId}
                  onChange={(e) => setVacancyId(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter Vacancy UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)"
                  className="flex-1 text-lg p-6 border border-gray-300 focus:border-blue-500 rounded-lg"
                />
                <Button
                  onClick={handleViewMerit}
                  disabled={loading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-md"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Verify Now
                    </span>
                  )}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 p-4 rounded-lg text-red-700 text-center max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {meritData && (
          <div className="space-y-8">
            {/* Verification Status */}
            <Card className="bg-white shadow-md border border-gray-200">
              <div
                className={`p-8 ${
                  verificationStatus
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="text-center space-y-4">
                  {verificationStatus ? (
                    <>
                      <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
                      <h2 className="text-3xl font-bold text-green-700">
                        ✓ BLOCKCHAIN VERIFIED
                      </h2>
                      <p className="text-green-600 text-lg">
                        This merit list is cryptographically authentic and has
                        not been tampered with
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-20 h-20 text-red-600 mx-auto" />
                      <h2 className="text-3xl font-bold text-red-700">
                        ⚠ VERIFICATION FAILED
                      </h2>
                      <p className="text-red-600 text-lg">
                        This merit list does not match blockchain records. Data
                        may have been tampered with.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Blockchain Transaction
                        </p>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${meritData.blockchainTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 underline font-mono text-sm break-all block"
                        >
                          {meritData.blockchainTxHash}
                        </a>
                        <p className="text-xs text-gray-600">
                          View on Polygon Amoy Explorer
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <FileCheck className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                          Cryptographic Hash
                        </p>
                        <p className="font-mono text-sm text-gray-800 break-all">
                          {meritData.meritHash}
                        </p>
                        <p className="text-xs text-gray-600">
                          SHA-256 hash of merit list data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Total Applications
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {meritData.totalApplications?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Selected Candidates
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {meritData.selectedCandidates || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vacancy Details */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-xl text-gray-800">
                  Vacancy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Position
                    </p>
                    <p className="text-lg font-medium text-gray-800">
                      {meritData.vacancyDetails || "Details not available"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Examination Date
                    </p>
                    <p className="text-lg font-medium text-gray-800">
                      {meritData.examDate || "Date not available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Merit Table */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-gray-100 border-b border-gray-200">
                <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  Official Merit List
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left font-bold text-gray-700 text-base">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 text-base">
                          Candidate Name
                        </th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 text-base">
                          Marks Obtained
                        </th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 text-base">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {meritData.meritList.map((candidate, index) => (
                        <tr
                          key={candidate.rank}
                          className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 font-bold text-lg text-blue-600">
                            #{candidate.rank}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {candidate.candidateName}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {candidate.marks}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="rounded-full px-3 py-1 font-medium border border-gray-300"
                            >
                              {candidate.category}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Section (shown when no results) */}
        {!meritData && !loading && (
          <div className="space-y-8">
            <Card className="bg-white shadow-md border border-gray-200">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-3">
                  <Shield className="w-16 h-16 text-blue-600 mx-auto" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    How JobChain Works
                  </h2>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    A complete blockchain-based solution for transparent
                    government recruitment
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        1
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Vacancy Created
                      </h3>
                      <p className="text-sm text-gray-600">
                        Job posting details are hashed and recorded on
                        blockchain
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        2
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Papers Protected
                      </h3>
                      <p className="text-sm text-gray-600">
                        5 encrypted question sets with QR codes prevent leaks
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        3
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Marks Verified
                      </h3>
                      <p className="text-sm text-gray-600">
                        Automated fraud detection ensures fair evaluation
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border-2 border-amber-200">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        4
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Merit Published
                      </h3>
                      <p className="text-sm text-gray-600">
                        Final results recorded on blockchain for public
                        verification
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-2xl border-2 border-indigo-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        End-to-End Transparency
                      </h3>
                      <p className="text-sm text-gray-600">
                        Every action from vacancy creation to merit publication
                        is cryptographically verified
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Question Paper Security
                      </h3>
                      <p className="text-sm text-gray-600">
                        QR-coded encrypted papers make leaks useless through
                        blockchain verification
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Automated Fraud Detection
                      </h3>
                      <p className="text-sm text-gray-600">
                        Easy identification of suspicious patterns and marks
                        manipulation attempts
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Public Verification
                      </h3>
                      <p className="text-sm text-gray-600">
                        Anyone can verify results independently without needing
                        to trust authorities
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="container mx-auto max-w-6xl px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <p className="text-gray-600 font-medium">
                Powered by Polygon Amoy Blockchain
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              JobChain - Bringing trust, transparency, and accountability to
              government recruitment
            </p>
            <p className="text-gray-400 text-xs">
              © 2025 JobChain. Built with Spring Boot, React, and blockchain
              technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
