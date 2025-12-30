import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Briefcase,
  FileText,
  BarChart3,
  User,
  ShieldCheck,
  Settings,
  Lock,
  Database
} from 'lucide-react';

export default function AdminDashboard() {
  const { user} = useAuth();

  const dashboardCards = [
    {
      title: 'Manage Vacancies',
      description: 'Create and publish job vacancies on blockchain with secure audit trails',
      path: '/admin/vacancies',
      gradient: 'from-green-500 to-emerald-600',
      icon: Briefcase,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      stats: 'Active',
      badgeColor: 'bg-green-500'
    },
    {
      title: 'Paper Management',
      description: 'Generate encrypted paper sets with QR codes and blockchain verification',
      path: '/admin/papers',
      gradient: 'from-blue-500 to-indigo-600',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      stats: 'Secure',
      badgeColor: 'bg-blue-500'
    },
    {
      title: 'Exam & Fraud Detection',
      description: 'Record marks, analyze patterns, and detect anomalies with AI algorithms',
      path: '/admin/exam',
      gradient: 'from-orange-500 to-red-600',
      icon: BarChart3,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      stats: 'Protected',
      badgeColor: 'bg-orange-500'
    },
  ];

  const systemStats = [
    { label: 'Total Vacancies', value: '24', change: '+3' },
    { label: 'Active Papers', value: '156', change: '+12' },
    { label: 'Processed Exams', value: '2,847', change: '+89' },
    { label: 'Blockchain TX', value: '4,892', change: '+231' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-indigo-200" />
                  <p className="text-sm sm:text-base text-indigo-200">
                    Welcome back,{' '}
                    <span className="font-semibold text-white">{user}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8">
        {/* Welcome Card with Stats */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      JobChain Administration Console
                    </h2>
                    <p className="text-sm text-gray-600">
                      Secure blockchain-powered recruitment management system
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                {systemStats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 min-w-[120px]">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {stat.change} this week
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link to={card.path} key={index}>
                <Card className="h-full bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-transparent group">
                  <CardHeader className={`bg-gradient-to-r ${card.gradient} text-white rounded-t-xl p-6 sm:p-8 relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-8 h-8 ${card.iconColor}`} />
                        </div>
                        <span className={`${card.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                          {card.stats}
                        </span>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-bold mt-4">
                        {card.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                      {card.description}
                    </CardDescription>
                    <Button
                      className={`w-full bg-gradient-to-r ${card.gradient} text-white hover:opacity-90 shadow-lg group-hover:shadow-xl transition-all`}
                    >
                      Manage
                      <Settings className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* System Info & Blockchain Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blockchain Status */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Database className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Blockchain-Secured System
                  </h3>
                  <p className="text-sm text-gray-600">
                    Powered by Polygon Amoy Testnet
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Network Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Live
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Transaction Count</span>
                  <span className="font-medium text-gray-900">4,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Last Sync</span>
                  <span className="text-sm text-gray-600">2 minutes ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Security Overview
                  </h3>
                  <p className="text-sm text-gray-600">
                    All systems operational
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fraud Detection</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Encryption Status</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    AES-256
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Audit Trail</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                    Complete
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Need Assistance?
                </h3>
                <p className="text-sm text-indigo-200 max-w-lg">
                  Contact system administrators for critical operations, 
                  blockchain transactions, or security-related inquiries.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  View System Logs
                </Button>
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  Emergency Protocols
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-t border-gray-300 mt-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                JobChain Admin Portal • Secure Blockchain Operations
              </p>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              All actions are cryptographically signed and recorded on Polygon blockchain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}