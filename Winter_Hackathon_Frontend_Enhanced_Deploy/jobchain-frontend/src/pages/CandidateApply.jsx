import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { vacancyApi, applicationApi } from "../api/client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  User,
  Mail,
  GraduationCap,
  Award,
  FileText,
  CheckCircle,
  AlertCircle,
  Hash,
  Shield,
  Briefcase,
  Percent,
  BookOpen,
  Clock,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ------------------ FORM SCHEMA ------------------ */

const schema = z.object({
  vacancyId: z.string().min(1, "Vacancy is required"),
  candidateName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  category: z.enum(["UR", "OBC", "SC", "ST"]),
  marks10: z.number().min(0).max(100),
  marks12: z.number().min(0).max(100),
});

/* ------------------ COMPONENT ------------------ */

export default function CandidateApply() {
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successHash, setSuccessHash] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, attempted: 0 });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      vacancyId: "",
      candidateName: "",
      email: "",
      category: "UR",
      marks10: 0,
      marks12: 0,
    },
  });

  /* ------------------ LOAD VACANCIES ------------------ */

  useEffect(() => {
    vacancyApi.getAllVacancies().then((res) => {
      setVacancies(res.data);
    });
  }, []);

  /* ------------------ SUBMIT APPLICATION ------------------ */

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessHash(null);

    try {
      const res = await applicationApi.submitApplication(data);
      setSuccessHash(res.data.appHash);

      // IMPORTANT: backend must return testAttempted=false
      setApplications((prev) => [...prev, res.data]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));

      form.reset();
    } catch (e) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl">
        <div className="container mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Government Job Portal
                </h1>
                <p className="text-blue-100 text-lg">
                  Secure blockchain-verified applications
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{applications.length}</div>
                <div className="text-blue-100 text-sm">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.attempted}</div>
                <div className="text-blue-100 text-sm">Tests Taken</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            {/* Application Form */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  New Application Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Vacancy & Category Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="vacancyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <Briefcase className="w-4 h-4" />
                              Select Vacancy
                            </FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                                  <SelectValue placeholder="Choose a vacancy position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {vacancies.map((v) => (
                                  <SelectItem key={v.id} value={v.id} className="py-3">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{v.title}</span>
                                      {v.department && (
                                        <span className="text-xs text-gray-500">{v.department}</span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <Shield className="w-4 h-4" />
                              Category
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UR" className="py-3">UR - Unreserved</SelectItem>
                                <SelectItem value="OBC" className="py-3">OBC - Other Backward Class</SelectItem>
                                <SelectItem value="SC" className="py-3">SC - Scheduled Caste</SelectItem>
                                <SelectItem value="ST" className="py-3">ST - Scheduled Tribe</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Personal Info Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="candidateName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <User className="w-4 h-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-12 bg-gray-50 border-gray-200"
                                placeholder="Enter your full name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <Mail className="w-4 h-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                className="h-12 bg-gray-50 border-gray-200"
                                placeholder="example@email.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Academic Marks */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="marks10"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <BookOpen className="w-4 h-4" />
                              10th Marks (%)
                            </FormLabel>
                            <div className="relative">
                              <Input
                                type="number"
                                {...field}
                                className="h-12 bg-gray-50 border-gray-200 pl-10"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="marks12"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                              <GraduationCap className="w-4 h-4" />
                              12th Marks (%)
                            </FormLabel>
                            <div className="relative">
                              <Input
                                type="number"
                                {...field}
                                className="h-12 bg-gray-50 border-gray-200 pl-10"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-xl"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5" />
                            Submit Application
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Success Message */}
                {successHash && (
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 animate-in slide-in-from-bottom">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-green-800 text-lg mb-2">
                          Application Successfully Submitted!
                        </h4>
                        <p className="text-green-700 mb-3">
                          Your application has been recorded on the blockchain network.
                        </p>
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                            <Hash className="w-4 h-4" />
                            Transaction Hash:
                          </div>
                          <code className="text-xs bg-gray-50 p-3 rounded block break-all font-mono">
                            {successHash}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 animate-in slide-in-from-bottom">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 text-lg mb-2">
                          Submission Failed
                        </h4>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submitted Applications */}
            {applications.length > 0 && (
              <Card className="mt-8 bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    My Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">Vacancy</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Verification</TableHead>
                          <TableHead className="font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app, index) => (
                          <TableRow key={index} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">
                              {app.vacancyTitle || `Vacancy #${app.vacancyId}`}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                Submitted
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Blockchain Verified
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {!app.testAttempted ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/exam/${app.id}/${app.vacancyId}`)
                                  }
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Give Test
                                </Button>
                              ) : (
                                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                  Test Completed
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Instructions Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Award className="w-6 h-6" />
                  Application Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Fill Details Carefully</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Ensure all personal and academic information is accurate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Blockchain Verification</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Each application is immutably recorded on the blockchain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Take Test</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete the OMR test after successful application submission.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Need Help?</span>
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}