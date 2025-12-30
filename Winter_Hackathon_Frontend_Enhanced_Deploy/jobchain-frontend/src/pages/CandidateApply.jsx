import { useEffect, useState } from "react";
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
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  vacancyId: z.string().min(1, "Vacancy is required"),
  candidateName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  category: z.enum(["UR", "OBC", "SC", "ST"]),
  marks10: z.number().min(0).max(100),
  marks12: z.number().min(0).max(100),
});

export default function CandidateApply() {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successHash, setSuccessHash] = useState(null);
  const [error, setError] = useState(null);

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

  const fetchVacancies = async () => {
    const res = await vacancyApi.getAllVacancies();
    setVacancies(res.data);
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessHash(null);

    try {
      const res = await applicationApi.submitApplication(data);
      setSuccessHash(res.data.appHash);
      setApplications((prev) => [...prev, res.data]);
      form.reset();
    } catch (e) {
      setError("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Apply for Government Job
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                Submit your application with blockchain verification
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Application Form Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Application Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vacancy Select */}
                  <FormField
                    control={form.control}
                    name="vacancyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Select Vacancy
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Choose a government position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vacancies.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{v.title}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {v.totalPosts} posts
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reservation Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UR">UR - Unreserved</SelectItem>
                            <SelectItem value="OBC">OBC - Other Backward Class</SelectItem>
                            <SelectItem value="SC">SC - Scheduled Caste</SelectItem>
                            <SelectItem value="ST">ST - Scheduled Tribe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Candidate Name */}
                  <FormField
                    control={form.control}
                    name="candidateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12" placeholder="Enter your full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="h-12" placeholder="your.email@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Marks 10 */}
                  <FormField
                    control={form.control}
                    name="marks10"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          10th Standard Marks (%)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="h-12 pr-12"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                            <div className="absolute right-3 top-3 text-gray-500">%</div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Marks 12 */}
                  <FormField
                    control={form.control}
                    name="marks12"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          12th Standard Marks (%)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="h-12 pr-12"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                            <div className="absolute right-3 top-3 text-gray-500">%</div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Success Message */}
            {successHash && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">Application Submitted Successfully!</p>
                    <div className="mt-2 bg-green-100 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-green-700" />
                        <span className="text-sm font-medium text-green-700">Blockchain Transaction Hash:</span>
                      </div>
                      <code className="text-xs text-green-800 break-all font-mono">
                        {successHash}
                      </code>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Your application has been securely recorded on the Polygon blockchain.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">Submission Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submitted Applications */}
        {applications.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Submitted Applications ({applications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Vacancy</TableHead>
                      <TableHead className="font-semibold text-gray-700">Applied On</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Verification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Award className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span>{app.vacancyId}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date().toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            Submitted
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 border-0">
                            Blockchain Verified
                          </Badge>
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
    </div>
  );
}