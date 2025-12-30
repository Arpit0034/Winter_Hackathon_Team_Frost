import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ShieldAlert, 
  FileWarning, 
  AlertCircle,
  Eye,
  Clock,
  Users,
  Hash
} from "lucide-react";

export default function FraudAlert({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  const getTotalSuspects = () => {
    return alerts.reduce((sum, alert) => sum + alert.suspectCount, 0);
  };

  const getAlertTypeConfig = (type) => {
    const config = {
      PAPER_LEAK: { 
        variant: "destructive", 
        label: "Paper Leak", 
        icon: ShieldAlert,
        color: "text-red-600",
        bgColor: "bg-red-50"
      },
      MARKS_ANOMALY: { 
        variant: "destructive", 
        label: "Marks Anomaly", 
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
      },
      OMR_TAMPER: { 
        variant: "destructive", 
        label: "OMR Tampering", 
        icon: FileWarning,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
      },
    };

    return config[type] || { 
      variant: "destructive", 
      label: type, 
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    };
  };

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Fraud Detection Alert
            </CardTitle>
          </div>
        </CardHeader>
      </div>
      
      <CardContent className="p-6 space-y-6">
        {/* Summary Banner */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-700 uppercase tracking-wider">
                  Critical Alert
                </span>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900">
                {getTotalSuspects()}
                <span className="text-xl md:text-2xl font-normal text-gray-600 ml-2">
                  suspicious activities
                </span>
              </p>
              <p className="text-gray-600 mt-2">
                AI-powered analysis detected {alerts.length} potential fraud pattern{alerts.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="bg-white rounded-lg px-6 py-4 shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
                <div className="text-sm text-gray-600 font-medium">Active Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Detected Anomalies
              </h3>
              <Badge variant="outline" className="border-red-200 text-red-700">
                Requires Immediate Attention
              </Badge>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Alert Type
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Suspect Count
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Pattern Hash
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Detected At
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => {
                const config = getAlertTypeConfig(alert.alertType);
                const Icon = config.icon;
                
                return (
                  <TableRow 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <Badge 
                        variant={config.variant} 
                        className={`${config.bgColor} ${config.color} border-0 px-3 py-1.5 flex items-center gap-2`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {alert.suspectCount}
                        </span>
                        <span className="text-sm text-gray-600">candidates</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-xs bg-gray-100 px-3 py-2 rounded border border-gray-200 break-all">
                        {alert.patternHash.substring(0, 24)}...
                        <div className="text-xs text-gray-500 mt-1">
                          Blockchain verified
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {new Date(alert.timestamp).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Action Required Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 text-lg mb-3">
                Immediate Action Required
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-yellow-800">
                      Investigate all flagged candidates immediately
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-yellow-800">
                      Review blockchain records for digital evidence
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-yellow-800">
                      Merit list publication blocked until resolution
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-yellow-800">
                      All activities permanently recorded on blockchain
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <p className="text-xs text-yellow-700 font-medium">
                  ⚠️ Time-sensitive: Resolution required within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}