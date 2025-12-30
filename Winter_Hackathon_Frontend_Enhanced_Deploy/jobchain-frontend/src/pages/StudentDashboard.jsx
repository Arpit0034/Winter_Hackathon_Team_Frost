import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  FileText,
  List,
  LogOut,
  User,
  CheckCircle,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const dashboardCards = [
    {
      title: 'Apply for Jobs',
      description: 'Browse open vacancies and submit your applications for government positions',
      path: '/candidate/apply',
      gradient: 'from-purple-500 to-pink-600',
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'View Merit List',
      description: 'Check published merit lists with blockchain verification for transparency',
      path: '/merit',
      gradient: 'from-blue-500 to-indigo-600',
      icon: List,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Student Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-blue-100" />
                  <p className="text-sm sm:text-base text-blue-100">
                    Welcome,{' '}
                    <span className="font-semibold text-white">{user}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Welcome Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Welcome to JobChain
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Your gateway to transparent and secure government job
                  recruitment. All processes are blockchain-verified to ensure
                  fairness and prevent fraud.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {dashboardCards.map((card, index) => (
            <Link to={card.path} key={index}>
              <Card className="h-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-transparent hover:scale-105">
                <CardHeader
                  className={`bg-gradient-to-r ${card.gradient} text-white rounded-t-xl p-6 sm:p-8`}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 ${card.iconBg} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <card.icon
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${card.iconColor}`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl text-center font-bold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <CardDescription className="text-gray-700 text-sm sm:text-base text-center leading-relaxed">
                    {card.description}
                  </CardDescription>
                  <div className="mt-6 flex justify-center">
                    <Button
                      className={`bg-gradient-to-r ${card.gradient} text-white hover:opacity-90 shadow-lg`}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                Blockchain Verified
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                All merit lists are cryptographically secured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                Tamper-Proof
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Results cannot be altered or manipulated
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg sm:col-span-3 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                Fair Selection
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Transparent recruitment with no bias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 border-0 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <h3 className="font-bold text-white text-lg sm:text-xl lg:text-2xl">
                  Fair & Transparent Recruitment
                </h3>
              </div>
              <p className="text-sm sm:text-base text-purple-100 max-w-3xl mx-auto">
                All merit lists and exam results are secured on the Polygon
                blockchain to prevent fraud, manipulation, and ensure complete
                transparency in government job recruitment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-t border-gray-300 mt-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Powered by Polygon Amoy Blockchain
              </p>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              JobChain - Transparent, Secure, and Fair Government Recruitment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}