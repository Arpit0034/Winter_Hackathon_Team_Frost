import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { vacancyApi } from "../api/client";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  FileText,
  Users,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Hash
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  totalPosts: z.number().min(1, "At least 1 post is required"),
});

export default function AdminVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", totalPosts: 1 },
  });

  const fetchVacancies = async () => {
    try {
      const res = await vacancyApi.getAllVacancies();
      setVacancies(res.data);
    } catch (e) {
      setError("Failed to fetch vacancies");
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTxHash(null);
    
    try {
      const res = await vacancyApi.createVacancy(data);
      setTxHash(res.data.blockchainTxHash);
      setSuccess(true);
      form.reset();
      fetchVacancies();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (e) {
      setError("Failed to create vacancy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVacancyStats = () => {
    const totalPosts = vacancies.reduce((sum, v) => sum + v.totalPosts, 0);
    return {
      totalVacancies: vacancies.length,
      totalPosts,
      activeVacancies: vacancies.length,
    };
  };

  const stats = getVacancyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Vacancy Management
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                Create and manage government job vacancies on blockchain
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Vacancies</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalVacancies}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.activeVacancies}</p>
                  <p className="text-xs text-purple-600">Active</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Vacancy Form */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Create New Vacancy
            </CardTitle>
            <CardDescription>
              Add a new government job position. All vacancies are recorded on blockchain for transparency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="h-12" 
                            placeholder="e.g., Software Engineer, Administrative Officer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalPosts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Number of Posts
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="h-12 pr-12"
                              min="1"
                              max="1000"
                            />
                            <div className="absolute right-3 top-3 text-gray-500">posts</div>
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
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Vacancy...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Create Vacancy on Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Success Message */}
            {success && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Vacancy Created Successfully!</p>
                    <p className="text-sm text-green-700 mt-1">
                      The vacancy has been securely recorded on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Hash */}
            {txHash && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-blue-800">Blockchain Transaction</span>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        Polygon Amoy
                      </Badge>
                    </div>
                    <div className="bg-blue-100 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-blue-700">Transaction Hash:</span>
                        <a
                          href={`https://amoy.polygonscan.com/tx/${txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                        >
                          View on Explorer
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <code className="text-xs text-blue-800 break-all font-mono block">
                        {txHash}
                      </code>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      This transaction is immutable and permanently stored on the blockchain.
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
                    <p className="font-semibold text-red-800">Creation Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vacancies Table */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            All Vacancies ({vacancies.length})
          </CardTitle>
          <CardDescription>
            All vacancies are blockchain-verified and cannot be tampered with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Job Title</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Posts</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacancies.length > 0 ? (
                  vacancies.map((v) => (
                    <TableRow key={v.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Hash className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {v.id.length > 8 ? `${v.id.substring(0, 8)}...` : v.id}
                            </code>
                            <div className="text-xs text-gray-500 mt-1">
                              {typeof v.id === 'number' ? `ID: ${v.id}` : 'Blockchain ID'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <span className="font-semibold">{v.title}</span>
                            <div className="text-xs text-gray-500">Position</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-green-700">{v.totalPosts}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Available</span>
                            <div className="text-xs text-gray-400">posts</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          <Shield className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          Open for applications
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(v.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(v.createdAt || Date.now()).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Briefcase className="w-12 h-12 text-gray-300" />
                        <p>No vacancies created yet</p>
                        <p className="text-sm">Create your first vacancy using the form above</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        {/* Blockchain Info Card */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Blockchain Secured Vacancies
                </h3>
                <p className="text-sm text-gray-600">
                  All vacancies are cryptographically signed and recorded on Polygon blockchain. 
                  This ensures complete transparency, prevents tampering, and provides an immutable 
                  audit trail for all recruitment activities.
                </p>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Immutable Record
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}