import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { paperApi, vacancyApi } from "../api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Download,
  FileText,
  Shield,
  AlertTriangle,
  QrCode,
  Copy,
  CheckCircle,
  Printer,
  Eye
} from "lucide-react";

export default function PaperManagement() {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState("");
  const [paperSets, setPaperSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [copiedSet, setCopiedSet] = useState(null);

  useEffect(() => {
    fetchVacancies();
  }, []);

  useEffect(() => {
    if (selectedVacancyId) {
      fetchPaperSets();
    }
  }, [selectedVacancyId]);

  const fetchVacancies = async () => {
    try {
      const response = await vacancyApi.getAllVacancies();
      setVacancies(response.data);
    } catch (err) {
      setError("Failed to fetch vacancies");
    }
  };

  const fetchPaperSets = async () => {
    try {
      const response = await paperApi.getPaperSets(selectedVacancyId);
      setPaperSets(response.data);
    } catch (err) {
      setPaperSets([]);
    }
  };

  const handleGenerateSets = async () => {
    if (!selectedVacancyId) {
      setError("Please select a vacancy first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await paperApi.generatePaperSets(selectedVacancyId);
      setSuccessMessage("✅ 5 encrypted paper sets generated successfully!");
      await fetchPaperSets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate paper sets");
    } finally {
      setLoading(false);
    }
  };

  const handleLockPaper = async (setId) => {
    const centerId = prompt("Enter Center ID to lock this paper set:");
    if (!centerId) return;

    setLoading(true);
    try {
      await paperApi.lockPaper(selectedVacancyId, centerId);
      setSuccessMessage(`Paper Set ${setId} locked for Center ${centerId}`);
      await fetchPaperSets();
    } catch (err) {
      setError("Failed to lock paper");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (paperSet) => {
    const qrData = `VACANCY_${paperSet.vacancyId}_SET_${paperSet.setId}_${paperSet.paperHash}_${paperSet.timestamp}`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Paper Set ${paperSet.setId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
          h1 { color: #1e40af; }
          .qr-container { margin: 30px 0; }
          .info { margin-top: 20px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Question Paper Set ${paperSet.setId}</h1>
        <p><strong>Vacancy ID:</strong> ${paperSet.vacancyId}</p>
        <div class="qr-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
            ${document.getElementById(`qr-${paperSet.setId}`).innerHTML}
          </svg>
        </div>
        <div class="info">
          <p><strong>Paper Hash:</strong> ${paperSet.paperHash}</p>
          <p><strong>Status:</strong> ${
            paperSet.isLocked ? "LOCKED" : "GENERATED"
          }</p>
          <p><strong>Timestamp:</strong> ${new Date(
            paperSet.timestamp
          ).toLocaleString()}</p>
        </div>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `);
  };

  const generateQRData = (paperSet) => {
    return `VACANCY_${paperSet.vacancyId}_SET_${paperSet.setId}_${paperSet.paperHash}_${paperSet.timestamp}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSet(text);
      setTimeout(() => setCopiedSet(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getSetColor = (setId) => {
    const colors = {
      'A': 'from-blue-500 to-indigo-600',
      'B': 'from-green-500 to-emerald-600',
      'C': 'from-orange-500 to-amber-600',
      'D': 'from-purple-500 to-pink-600',
      'E': 'from-red-500 to-rose-600'
    };
    return colors[setId] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="h-[100vh] bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Paper Leak Protection System
              </h1>
              <p className="text-sm sm:text-base text-indigo-100 mt-1">
                Blockchain-secured question paper distribution with anti-leak protection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Vacancy Selection Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Select Vacancy for Paper Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select
              onValueChange={setSelectedVacancyId}
              value={selectedVacancyId}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a vacancy for paper generation" />
              </SelectTrigger>
              <SelectContent>
                {vacancies.map((vacancy) => (
                  <SelectItem key={vacancy.id} value={vacancy.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{vacancy.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {vacancy.totalPosts} posts
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGenerateSets}
                disabled={loading || !selectedVacancyId}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Paper Sets...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Generate 5 Encrypted Paper Sets (A–E)
                  </>
                )}
              </Button>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paper Sets Grid */}
        {paperSets.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {paperSets.map((paperSet) => {
                const qrData = generateQRData(paperSet);
                return (
                  <Card
                    key={paperSet.id}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 border-2 border-gray-200 group"
                  >
                    <CardHeader className={`bg-gradient-to-r ${getSetColor(paperSet.setId)} text-white rounded-t-xl p-6 relative overflow-hidden`}>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                      
                      <div className="relative z-10">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold">
                            Set {paperSet.setId}
                          </CardTitle>
                          <p className="text-white/90 text-sm mt-1">
                            Unique Encrypted Paper
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* QR Code */}
                      <div className="flex justify-center">
                        <div className="relative group/qr">
                          <div
                            id={`qr-${paperSet.setId}`}
                            className="bg-white p-3 rounded-lg shadow-sm"
                          >
                            <QRCodeSVG
                              value={qrData}
                              size={160}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover/qr:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                            onClick={() => copyToClipboard(qrData)}
                            title="Copy QR Data"
                          >
                            {copiedSet === qrData ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="text-center">
                        <Badge
                          variant={paperSet.isLocked ? "destructive" : "default"}
                          className="text-sm px-4 py-1.5 flex items-center justify-center gap-2"
                        >
                          {paperSet.isLocked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              LOCKED
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              GENERATED
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleLockPaper(paperSet.setId)}
                          disabled={paperSet.isLocked || loading}
                          variant="destructive"
                          className="w-full h-10"
                          size="sm"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Lock for Center
                        </Button>

                        <Button
                          onClick={() => handleDownloadPDF(paperSet)}
                          variant="outline"
                          className="w-full h-10 border-blue-300 text-blue-600 hover:bg-blue-50"
                          size="sm"
                        >
                          <Printer className="w-4 h-4 mr-2" />
                          Print Paper
                        </Button>
                      </div>

                      {/* Paper Hash */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Paper Hash:</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(paperSet.paperHash)}
                            title="Copy Hash"
                          >
                            {copiedSet === paperSet.paperHash ? (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-500" />
                            )}
                          </Button>
                        </div>
                        <code className="text-xs text-gray-600 break-all mt-1 block">
                          {paperSet.paperHash.substring(0, 20)}...
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Security Notice */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-lg mb-2">
                      🔐 Anti-Leak Protection Activated
                    </h3>
                    <div className="space-y-2 text-red-700">
                      <p className="text-sm">
                        Each paper set is cryptographically sealed and blockchain-verified. 
                        Any leaked paper becomes instantly traceable and invalid.
                      </p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li>Unique QR codes for each paper set</li>
                        <li>Real-time blockchain verification during exams</li>
                        <li>Automatic fraud detection for leaked papers</li>
                        <li>Tamper-proof audit trail</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}