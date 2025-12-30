import { useState, useEffect } from "react";
import { vacancyApi, applicationApi, examApi, fraudApi } from "../api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QRScanner from "../components/QRScanner";
import FraudAlert from "../components/FraudAlert";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  QrCode,
  Shield,
  Upload,
  Users,
  BarChart3,
  Lock,
  AlertTriangle,
  Download,
  ClipboardCheck
} from "lucide-react";

function generateRandomMarkingScheme(totalQuestions = 20) {
  const options = ["A", "B", "C", "D"];
  const scheme = {};

  for (let i = 1; i <= totalQuestions; i++) {
    const randomOption =
      options[Math.floor(Math.random() * options.length)];
    scheme[`Q${i}`] = randomOption;
  }

  return scheme;
}

export default function AdminExamMerit() {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancyId, setSelectedVacancyId] = useState("");
  const [applications, setApplications] = useState([]);
  const [marks, setMarks] = useState({});
  const [omrStatus, setOmrStatus] = useState({});
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [currentScanAppId, setCurrentScanAppId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    suspicious: 0
  });

  useEffect(() => {
    fetchVacancies();
  }, []);

  useEffect(() => {
    if (selectedVacancyId) {
      fetchApplications();
      fetchFraudAlerts();
    }
  }, [selectedVacancyId]);

  useEffect(() => {
    // Calculate stats whenever applications or omrStatus changes
    const verified = Object.values(omrStatus).filter(s => s === "Verified").length;
    const pending = Object.values(omrStatus).filter(s => s === "Pending").length;
    const suspicious = Object.values(omrStatus).filter(s => s === "Fraud").length;
    
    setStats({
      total: applications.length,
      verified,
      pending,
      suspicious
    });
  }, [applications, omrStatus]);

  const fetchVacancies = async () => {
    try {
      const response = await vacancyApi.getAllVacancies();
      setVacancies(response.data);
    } catch (err) {
      setError("Failed to fetch vacancies");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationApi.getApplicationsByVacancy(
        selectedVacancyId
      );
      setApplications(response.data);

      const initialMarks = {};
      const initialStatus = {};
      response.data.forEach((app) => {
        initialMarks[app.id] = 0;
        initialStatus[app.id] = "Pending";
      });
      setMarks(initialMarks);
      setOmrStatus(initialStatus);
    } catch (err) {
      setError("Failed to fetch applications");
    }
  };

  const fetchFraudAlerts = async () => {
    try {
      const response = await fraudApi.getFraudAlerts(selectedVacancyId);
      setFraudAlerts(response.data);
    } catch (err) {
      setFraudAlerts([]);
    }
  };

  const handleMarksChange = (appId, value) => {
    setMarks((prev) => ({
      ...prev,
      [appId]: parseFloat(value) || 0,
    }));
  };

  const handleRecordScore = async (application) => {
    setLoading(true);
    setError(null);

    try {
      const markingScheme = generateRandomMarkingScheme(20);
      const markingJson = JSON.stringify(markingScheme);

      await examApi.recordExamScore({
        vacancyId: selectedVacancyId,
        applicationId: application.id,
        marks: marks[application.id],
        markingJson: markingJson,
      });

      setSuccessMessage(`Marks recorded for ${application.candidateName}`);
      setOmrStatus((prev) => ({
        ...prev,
        [application.id]: "Recorded",
      }));
    } catch (err) {
      setError("Failed to record exam score");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScanner = (appId) => {
    setCurrentScanAppId(appId);
    setShowScanner(true);
  };

  const handleScanSuccess = (data) => {
    if (data.includes("VACANCY") && data.includes("SET")) {
      setOmrStatus((prev) => ({
        ...prev,
        [currentScanAppId]: "Verified",
      }));
      setSuccessMessage("✅ OMR QR Code verified - GENUINE");
    } else {
      setOmrStatus((prev) => ({
        ...prev,
        [currentScanAppId]: "Fraud",
      }));
      setError("❌ OMR QR Code verification failed - TAMPERED");
    }
    setShowScanner(false);
    setCurrentScanAppId(null);
  };

  const handleAnalyzeFraud = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fraudApi.analyzeFraud(selectedVacancyId);
      setFraudAlerts(response.data);

      if (response.data.length > 0) {
        setError("🚨 FRAUD DETECTED! Check fraud alerts below.");
      } else {
        setSuccessMessage("✅ No fraud detected. All clear!");
      }
    } catch (err) {
      setError("Failed to analyze fraud");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishMerit = async () => {
    if (fraudAlerts.length > 0) {
      setError("Cannot publish merit list while fraud alerts exist!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await examApi.publishMerit(selectedVacancyId);
      setSuccessMessage("✅ Merit list published successfully on blockchain!");
    } catch (err) {
      setError("Failed to publish merit list");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Pending: { variant: "secondary", icon: AlertCircle, color: "text-gray-600" },
      Verified: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      Recorded: { variant: "default", icon: ClipboardCheck, color: "text-blue-600" },
      Fraud: { variant: "destructive", icon: Shield, color: "text-red-600" },
    };

    const config = variants[status] || variants.Pending;
    const Icon = config.icon;

    return (
      <Badge 
        variant={config.variant} 
        className="flex items-center gap-1.5 px-3 py-1"
      >
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Exam Marks & Fraud Detection
                </h1>
                <p className="text-sm sm:text-base text-indigo-200 mt-1">
                  AI-powered paper leak detection & merit list publishing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Vacancy Selection Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              Select Vacancy for Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                onValueChange={setSelectedVacancyId}
                value={selectedVacancyId}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a vacancy for exam evaluation" />
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
              
              {selectedVacancyId && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                    <div className="text-sm text-blue-600">Total Candidates</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">{stats.verified}</div>
                    <div className="text-sm text-green-600">Verified</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                    <div className="text-sm text-yellow-600">Pending</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">{stats.suspicious}</div>
                    <div className="text-sm text-red-600">Suspicious</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {successMessage && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Fraud Alerts */}
        {fraudAlerts.length > 0 && <FraudAlert alerts={fraudAlerts} />}

        {/* Applications Table */}
        {selectedVacancyId && applications.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Candidate Evaluation ({applications.length} candidates)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Candidate</TableHead>
                      <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                      <TableHead className="font-semibold text-gray-700">Category</TableHead>
                      <TableHead className="font-semibold text-gray-700">Marks</TableHead>
                      <TableHead className="font-semibold text-gray-700">OMR Verification</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-indigo-700">
                                {app.candidateName.charAt(0)}
                              </span>
                            </div>
                            <span>{app.candidateName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">{app.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-300">
                            {app.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={marks[app.id] || 0}
                              onChange={(e) => handleMarksChange(app.id, e.target.value)}
                              className="w-24 h-9"
                            />
                            <span className="text-sm text-gray-500">/100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleOpenScanner(app.id)}
                            variant="outline"
                            size="sm"
                            className="h-9 border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            Scan OMR QR
                          </Button>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(omrStatus[app.id] || "Pending")}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRecordScore(app)}
                            disabled={loading || omrStatus[app.id] !== "Verified"}
                            size="sm"
                            className="h-9 bg-green-600 hover:bg-green-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Record
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {selectedVacancyId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Fraud Detection Analysis
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Scan 500+ answer patterns for anomalies
                    </p>
                  </div>
                  <Button
                    onClick={handleAnalyzeFraud}
                    disabled={loading || !selectedVacancyId}
                    variant="destructive"
                    size="lg"
                    className="px-8"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Analyze Fraud Patterns
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-600" />
                      Publish Merit List
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Finalize and publish on blockchain
                    </p>
                  </div>
                  <Button
                    onClick={handlePublishMerit}
                    disabled={loading || !selectedVacancyId || fraudAlerts.length > 0}
                    className="px-8 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Publish Merit List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fraud Warning */}
        {fraudAlerts.length > 0 && (
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800 text-lg">
                    ⚠️ Merit list publication blocked
                  </p>
                  <p className="text-red-600">
                    Cannot publish merit list while {fraudAlerts.length} fraud alert{fraudAlerts.length > 1 ? 's are' : ' is'} active. 
                    Resolve fraud issues first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Scanner */}
        {showScanner && (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => {
              setShowScanner(false);
              setCurrentScanAppId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}