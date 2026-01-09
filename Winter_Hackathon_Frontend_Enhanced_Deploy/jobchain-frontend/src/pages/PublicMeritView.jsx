import { useState } from "react";
import { examApi } from "../api/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ExternalLink,

  Copy,
} from "lucide-react";

export default function PublicMeritView() {
  const [vacancyId, setVacancyId] = useState("");
  const [meritData, setMeritData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uiAlert, setUiAlert] = useState(null);

  const showAlert = (type, message) => {
    setUiAlert({ type, message });
    setTimeout(() => setUiAlert(null), 3000);
  };

  const handleViewMerit = async () => {
    if (!vacancyId.trim()) {
      setError("Please enter a Vacancy ID");
      showAlert("error", "Vacancy ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    setMeritData(null);
    setVerificationStatus(null);
    setUiAlert(null);

    try {
      const meritResponse = await examApi.getMeritList(vacancyId);
      setMeritData(meritResponse.data);

      const verifyResponse = await examApi.verifyMeritIntegrity(vacancyId);
      setVerificationStatus(verifyResponse.data.verified);

      showAlert("success", "Merit list loaded successfully");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to fetch merit list. Please check the Vacancy ID.";
      setError(msg);
      showAlert("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleViewMerit();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showAlert("info", "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="container mx-auto max-w-6xl space-y-8">

        {uiAlert && (
          <div
            className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
              uiAlert.type === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : uiAlert.type === "error"
                ? "bg-red-50 border-red-300 text-red-700"
                : "bg-blue-50 border-blue-300 text-blue-700"
            }`}
          >
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <p className="font-medium">{uiAlert.message}</p>
          </div>
        )}

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-700">JobChain</h1>
          <p className="text-slate-600">
            Transparent blockchain-verified merit list system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Merit List</CardTitle>
            <CardDescription>Enter Vacancy ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={vacancyId}
              onChange={(e) => setVacancyId(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Vacancy UUID"
            />
            <Button onClick={handleViewMerit} disabled={loading}>
              {loading ? "Loading..." : "View Merit List"}
            </Button>

            {error && (
              <p className="text-red-600 font-medium">{error}</p>
            )}
          </CardContent>
        </Card>

        {meritData && (
          <Card>
            <CardHeader>
              <CardTitle>Merit List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meritData.meritList.map((c) => (
                    <TableRow key={c.rank}>
                      <TableCell>{c.rank}</TableCell>
                      <TableCell>{c.candidateName}</TableCell>
                      <TableCell>{c.marks}</TableCell>
                      <TableCell>{c.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(meritData.blockchainTxHash)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Tx Hash
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://amoy.polygonscan.com/tx/${meritData.blockchainTxHash}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!meritData && !loading && (
          <p className="text-center text-slate-500">
            Enter a Vacancy ID to verify a merit list
          </p>
        )}
      </div>
    </div>
  );
}
