import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PaperManagement from "./pages/PaperManagement";
import AdminExamMerit from "./pages/AdminExamMerit";
import AdminVacancies from "./pages/Vacancies";
import CandidateApply from "./pages/CandidateApply";
import PublicMeritView from "./pages/PublicMeritView";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  Megaphone,
  FileText,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from "react";
function Navigation() {
  const { isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  JobChain
                </span>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-200">
                v2.0
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {/* Admin Navigation */}
                {(role === "ADMIN" || role === "ROLE_ADMIN") && (
                  <div className="flex items-center space-x-1 border-r border-gray-200 pr-4 mr-4">
                    <Link to="/admin/dashboard">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 text-sm font-medium"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/admin/papers">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 text-sm font-medium"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Papers
                      </Button>
                    </Link>
                    <Link to="/admin/exam">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 text-sm font-medium"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Exam
                      </Button>
                    </Link>
                    <Link to="/admin/vacancies">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-green-700 hover:bg-green-50 px-3 py-2 text-sm font-medium"
                      >
                        <Megaphone className="w-4 h-4 mr-2" />
                        Vacancies
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Student Navigation */}
                {(role === "STUDENT" || role === "ROLE_STUDENT") && (
                  <div className="flex items-center space-x-1 border-r border-gray-200 pr-4 mr-4">
                    <Link to="/candidate/dashboard">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 text-sm font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/candidate/apply">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Common Authenticated Links */}
                <Link to="/merit">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 text-sm font-medium"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Merit List
                  </Button>
                </Link>

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 px-4 py-2 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Public Navigation */}
                <Link to="/merit">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 text-sm font-medium"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Public Merit
                  </Button>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 px-4 py-2 text-sm font-medium"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-4 py-2 text-sm font-medium shadow-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {/* Admin Mobile Links */}
                  {(role === "ADMIN" || role === "ROLE_ADMIN") && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/papers"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Papers
                      </Link>
                      <Link
                        to="/admin/exam"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-orange-700 hover:bg-orange-50"
                      >
                        Exam
                      </Link>
                      <Link
                        to="/admin/vacancies"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50"
                      >
                        Vacancies
                      </Link>
                    </>
                  )}

                  {/* Student Mobile Links */}
                  {(role === "STUDENT" || role === "ROLE_STUDENT") && (
                    <>
                      <Link
                        to="/candidate/dashboard"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/candidate/apply"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                      >
                        Apply
                      </Link>
                    </>
                  )}

                  {/* Common Mobile Links */}
                  <Link
                    to="/merit"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Merit List
                  </Link>

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/merit"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Public Merit
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/merit" element={<PublicMeritView />} />
      <Route path="/" element={<PublicMeritView />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/papers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
            <PaperManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exam"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
            <AdminExamMerit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vacancies"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ROLE_ADMIN"]}>
            <AdminVacancies />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "ROLE_STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/apply"
        element={
          <ProtectedRoute allowedRoles={["STUDENT", "ROLE_STUDENT"]}>
            <CandidateApply />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navigation />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}
