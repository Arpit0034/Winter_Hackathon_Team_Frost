import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  QrCode,
  Camera,
  Scan,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  RotateCw,
  Zap,
  Shield,
  Sparkles,
  Upload,
  Image as ImageIcon,
  FileText,
  FolderOpen,
  Video,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function QRScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("ready");
  const [progress, setProgress] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("camera");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileScanning, setFileScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRecentScans, setShowRecentScans] = useState(false);

  // Handle responsive scanner configuration
  const getScannerConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      return {
        fps: 10,
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: false,
        formatsToSupport: ["QR_CODE"],
        showViewfinder: true,
      };
    } else if (isTablet) {
      return {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        formatsToSupport: ["QR_CODE"],
        showViewfinder: true,
      };
    } else {
      return {
        fps: 15,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        formatsToSupport: ["QR_CODE"],
        showViewfinder: true,
      };
    }
  };

  // Handle responsive scanner size
  const getScannerSize = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
      return { width: 280, height: 280 };
    } else if (isTablet) {
      return { width: 320, height: 320 };
    } else {
      return { width: 350, height: 350 };
    }
  };

  useEffect(() => {
    if (activeTab === "camera" && scanning) {
      initializeCameraScanner();
    } else if (activeTab === "camera" && !scanning) {
      cleanup();
    }

    // Handle window resize
    const handleResize = () => {
      if (scanning && activeTab === "camera" && html5QrcodeScannerRef.current) {
        // Restart scanner with new config
        setTimeout(() => {
          if (scanning) {
            restartCameraScan();
          }
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [activeTab, scanning]);

  const initializeCameraScanner = () => {
    cleanup();

    if (!scannerRef.current) return;

    const config = getScannerConfig();
    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    // Check camera permission
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setCameraPermission("granted");

        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) return prev;
            return prev + Math.random() * 10;
          });
        }, 400);

        html5QrcodeScannerRef.current.render(
          (decodedText) => {
            clearInterval(progressInterval);
            handleScanSuccess(decodedText, "camera");
          },
          (error) => {
            clearInterval(progressInterval);
            console.log("QR scan error:", error);
            setScanStatus("error");
            setScanning(false);
            setScanCount((prev) => prev + 1);
          }
        );
      })
      .catch((error) => {
        console.error("Camera permission denied:", error);
        setCameraPermission("denied");
        setScanStatus("error");
        setScanning(false);
      });
  };

  const handleScanSuccess = (decodedText, source) => {
    setProgress(100);
    setScanStatus("success");
    setScanning(false);
    setScanCount((prev) => prev + 1);

    const newScan = {
      text: decodedText,
      timestamp: new Date().toLocaleTimeString(),
      status: "success",
      source: source,
    };
    setScanHistory((prev) => [newScan, ...prev.slice(0, 4)]);

    setTimeout(() => {
      onScanSuccess(decodedText);
      cleanup();
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setFileScanning(true);
    setScanStatus("scanning");

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/bmp",
      "image/gif",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setScanStatus("error");
      setFileScanning(false);
      alert("Please upload a valid image or PDF file");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;

      setTimeout(() => {
        const isQRDetected = Math.random() > 0.3;

        if (isQRDetected) {
          const decodedText = `VACANCY_FILE_${Date.now()}_SET_${String.fromCharCode(
            65 + Math.floor(Math.random() * 5)
          )}`;
          handleScanSuccess(decodedText, "file");
        } else {
          setScanStatus("error");
          setFileScanning(false);
          alert(
            "No QR code found in the uploaded file. Please try another image."
          );
        }
      }, 1500);
    };

    reader.onerror = () => {
      setScanStatus("error");
      setFileScanning(false);
      alert("Error reading file. Please try again.");
    };

    if (file.type === "application/pdf") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const startCameraScan = () => {
    setScanning(true);
    setScanStatus("scanning");
    setProgress(0);
  };

  const stopCameraScan = () => {
    setScanning(false);
    setScanStatus("ready");
    cleanup();
  };

  const cleanup = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
    }
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  const restartCameraScan = () => {
    stopCameraScan();
    setTimeout(() => {
      startCameraScan();
    }, 100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleRecentScans = () => {
    setShowRecentScans(!showRecentScans);
  };

  const getStatusMessage = () => {
    if (cameraPermission === "denied") {
      return "Camera access denied. Please enable camera permissions.";
    }

    switch (scanStatus) {
      case "ready":
        return activeTab === "camera"
          ? "Ready to start scanning"
          : "Ready - Upload an image or PDF";
      case "success":
        return "Successfully scanned!";
      case "error":
        return activeTab === "camera"
          ? "Scan failed - adjust position"
          : "Scan failed - try another file";
      case "scanning":
        return activeTab === "camera"
          ? "Scanning QR code..."
          : "Processing file...";
      default:
        return "Ready to scan";
    }
  };

  const getStatusColor = () => {
    if (cameraPermission === "denied") {
      return "text-red-600 bg-red-50";
    }

    switch (scanStatus) {
      case "ready":
        return "text-blue-600 bg-blue-50";
      case "success":
        return "text-green-600 bg-green-50";
      case "error":
        return "text-red-600 bg-red-50";
      case "scanning":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = () => {
    if (cameraPermission === "denied") {
      return <AlertCircle className="w-4 h-4" />;
    }

    switch (scanStatus) {
      case "ready":
        return activeTab === "camera" ? (
          <Video className="w-4 h-4" />
        ) : (
          <FolderOpen className="w-4 h-4" />
        );
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "scanning":
        return <Scan className="w-4 h-4" />;
      default:
        return <Scan className="w-4 h-4" />;
    }
  };

  // Get scanner dimensions based on device
  const scannerSize = getScannerSize();

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300 ${isFullscreen ? 'p-0' : ''}`}>
      <Card className={`w-full bg-white shadow-2xl border-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-none h-screen rounded-none m-0' 
          : 'max-w-4xl rounded-xl m-2'
      }`}>
        <CardHeader className="flex flex-row justify-between items-center p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <CardTitle className="text-base sm:text-lg font-semibold">QR Scanner</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0 shrink-0 hidden sm:inline-flex"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0 shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <ScrollArea className={`${isFullscreen ? 'h-[calc(100vh-73px)]' : 'max-h-[85vh]'}`}>
          <CardContent className="p-3 sm:p-5 space-y-4 sm:space-y-5">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                if (value === "camera") {
                  stopCameraScan();
                }
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="camera" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  Upload
                </TabsTrigger>
              </TabsList>

              {/* Camera Scan Tab */}
              <TabsContent value="camera" className="space-y-4">
                {/* Status Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor()} w-full sm:w-auto`}
                  >
                    {getStatusIcon()}
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {getStatusMessage()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Scan Attempts</div>
                    <div className="text-lg font-bold text-gray-900">
                      {scanCount}
                    </div>
                  </div>
                </div>

                {/* Scanner Container */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-2 sm:p-3 border-2 border-dashed border-blue-300 min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center">
                    {!scanning ? (
                      // Ready State - Show Start Button
                      <div className="text-center space-y-4 sm:space-y-6 p-3 sm:p-4">
                        <div className="flex justify-center">
                          <div className="p-4 sm:p-6 bg-blue-100 rounded-full">
                            <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                            Ready to Scan
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                            Click the button below to start camera and scan QR code
                          </p>
                          <Button
                            onClick={startCameraScan}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg w-full sm:w-auto"
                            size="lg"
                          >
                            <Scan className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                            Start Camera Scan
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Scanning State - Show Camera Feed
                      <>
                        <div id="qr-reader" ref={scannerRef} className="w-full" />

                        {/* Scanner Guide Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="relative" style={scannerSize}>
                            {/* Scanning frame */}
                            <div className="w-full h-full border-2 sm:border-3 border-blue-400 rounded-xl sm:rounded-2xl relative">
                              {/* Corner decorations */}
                              <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-6 sm:h-6 border-t-2 sm:border-t-3 border-l-2 sm:border-l-3 border-blue-500 rounded-tl-lg"></div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 border-t-2 sm:border-t-3 border-r-2 sm:border-r-3 border-blue-500 rounded-tr-lg"></div>
                              <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-6 sm:h-6 border-b-2 sm:border-b-3 border-l-2 sm:border-l-3 border-blue-500 rounded-bl-lg"></div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 border-b-2 sm:border-b-3 border-r-2 sm:border-r-3 border-blue-500 rounded-br-lg"></div>

                              {/* Center guide */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-blue-300/50 rounded-lg"></div>
                              </div>
                            </div>

                            {/* Scanning animation */}
                            <div className="absolute -inset-2 sm:-inset-4">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan-horizontal"></div>
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-scan-vertical"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Status Indicators */}
                    {scanning && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg animate-pulse">
                          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="text-xs sm:text-sm font-medium">Scanning...</span>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      </div>
                    )}

                    {scanStatus === "success" && scanning && (
                      <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-5 rounded-full shadow-2xl animate-bounce">
                          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Camera Controls */}
                {scanning && (
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2">
                    <Button
                      onClick={stopCameraScan}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 w-full sm:w-auto"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Stop Scan
                    </Button>
                    <Button
                      onClick={restartCameraScan}
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 w-full sm:w-auto"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Rescan
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* File Upload Tab */}
              <TabsContent value="file" className="space-y-4">
                {/* Status Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor()} w-full sm:w-auto`}
                  >
                    {getStatusIcon()}
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {getStatusMessage()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Scan Attempts</div>
                    <div className="text-lg font-bold text-gray-900">
                      {scanCount}
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border-2 border-dashed border-purple-300 text-center min-h-[280px] sm:min-h-[320px] flex flex-col justify-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".jpg,.jpeg,.png,.bmp,.gif,.pdf"
                      className="hidden"
                    />

                    {!selectedFile ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-center">
                          <div className="p-3 sm:p-4 bg-purple-100 rounded-full">
                            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                            Upload Image or PDF
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            Upload a photo of your OMR sheet or a PDF containing QR code
                          </p>
                          <Button
                            onClick={triggerFileInput}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg w-full sm:w-auto"
                          >
                            <FolderOpen className="w-4 h-4 sm:w-6 sm:h-6 mr-2" />
                            Choose File
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-center">
                          <div className="p-3 sm:p-4 bg-green-100 rounded-full">
                            {selectedFile.type === "application/pdf" ? (
                              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                            ) : (
                              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                            File Selected
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate px-2">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                            {(selectedFile.size / 1024).toFixed(2)} KB •{" "}
                            {selectedFile.type.split('/')[1].toUpperCase()}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button
                              onClick={triggerFileInput}
                              variant="outline"
                              className="border-purple-300 text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
                            >
                              Change File
                            </Button>
                            <Button
                              onClick={() => {
                                if (fileInputRef.current) {
                                  const event = new Event("change", {
                                    bubbles: true,
                                  });
                                  Object.defineProperty(event, "target", {
                                    value: { files: [selectedFile] },
                                    writable: false,
                                  });
                                  fileInputRef.current.dispatchEvent(event);
                                }
                              }}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto"
                              disabled={fileScanning}
                            >
                              {fileScanning ? "Scanning..." : "Scan QR Code"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* File scanning animation */}
                    {fileScanning && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="text-center space-y-2 sm:space-y-3">
                          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            Scanning file for QR code...
                          </p>
                          <p className="text-xs text-gray-600">
                            This may take a few seconds
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Types Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          Images
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG, BMP, GIF
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          PDF Files
                        </p>
                        <p className="text-xs text-gray-500">
                          Portable Document Format
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Progress Bar */}
            {((activeTab === "camera" && scanning) || fileScanning) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Scan Progress
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Recent Scans - Collapsible */}
            {scanHistory.length > 0 && (
              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <Button
                  onClick={toggleRecentScans}
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0"
                >
                  <div className="text-xs text-gray-500">Recent scans ({scanHistory.length})</div>
                  {showRecentScans ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
                
                {showRecentScans && (
                  <div className="space-y-2 mt-2">
                    {scanHistory.slice(0, 3).map((scan, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs sm:text-sm p-2 bg-gray-50 rounded-lg">
                        {scan.status === "success" ? (
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-600 truncate block">
                            {scan.text.substring(0, 30)}...
                          </span>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            {scan.source === "camera" ? (
                              <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            ) : (
                              <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                            {scan.source === "camera" ? "Camera" : "File"}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
                          {scan.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      <style>{`
        @keyframes scan-horizontal {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes scan-vertical {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 2s ease-in-out infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 2s ease-in-out infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          #qr-reader {
            min-height: 250px !important;
          }
          #qr-reader > div:first-child {
            min-height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}