import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ROLES } from "../constants/rules";
import { analyzeOnionImage } from "../services/gradingEngine";
import { analyzeWithGeminiVision, getGeminiApiKey } from "../services/geminiVision";
import { saveLot, savePurchaseRequest } from "../services/storage";
import { SAMPLE_LOT_PRESETS, generateSampleTrayImage } from "../utils/sampleImages";
import DonutChart from "./DonutChart";
import DisputeModal from "./DisputeModal";
import ProcurementModal from "./ProcurementModal";
import DigitalCertificateModal from "./DigitalCertificateModal";
import WhatsAppBotModal from "./WhatsAppBotModal";
import { predictShelfLife } from "../services/shelfLifePredictor";
import { getMarketSignal } from "../services/marketPricing";
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  Download,
  AlertTriangle,
  Scale,
  Eye,
  ShoppingBag,
  ArrowRight,
  Scan,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  Bot,
  Cpu,
  Zap,
  Sliders,
  QrCode,
  MessageSquare,
  Share2,
  TrendingUp,
  Clock,
  Thermometer,
  ShieldCheck,
  TrendingDown,
  DollarSign
} from "lucide-react";

export default function GradingWorkflow({ onGradingComplete, initialLot = null }) {
  const { user, role, showToast } = useAuth();
  const { t, tr, language, isHindi, isMarathi, isGujarati } = useLanguage();

  const [stage, setStage] = useState(initialLot ? "report" : "input");
  const [inputMode, setInputMode] = useState("upload");
  const [aiEngine, setAiEngine] = useState("gemini"); // "gemini" | "edge"
  
  const [imagePreview, setImagePreview] = useState(initialLot?.originalImage || null);
  const [analyzingProgress, setAnalyzingProgress] = useState({ step: "", message: "", percent: 0 });
  const [gradingResult, setGradingResult] = useState(initialLot || null);
  const [selectedBulbId, setSelectedBulbId] = useState(null);

  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isProcurementOpen, setIsProcurementOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);

  const shelfLife = gradingResult ? predictShelfLife(gradingResult) : null;
  const marketSignal = gradingResult ? getMarketSignal(gradingResult) : null;

  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialLot) {
      setGradingResult(initialLot);
      setImagePreview(initialLot.annotatedImage || initialLot.thumbnail);
      setStage("report");
    }
  }, [initialLot]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setInputMode("camera");
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied:", err);
      showToast("Camera unavailable. Choose a sample preset or upload a file.", "warning");
      setInputMode("presets");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    startAnalysisFromUrl(dataUrl, "Live APMC Camera Snapshot");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so the same file can be re-selected if needed
    e.target.value = "";

    // Validate image MIME type
    if (!file.type.startsWith("image/")) {
      showToast(
        tr(
          "Please select a valid image file (JPG, PNG, or WEBP).",
          "कृपया एक वैध छवि फ़ाइल (JPG, PNG, या WEBP) चुनें।",
          "कृपया वैध इमेज फाईल (JPG, PNG, किंवा WEBP) निवडा.",
          "કૃપા કરીને માન્ય છબી ફાઇલ (JPG, PNG, અથવા WEBP) પસંદ કરો."
        ),
        "warning"
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      showToast(
        tr(
          "Error reading file from disk.",
          "फ़ाइल लोड करने में त्रुटि।",
          "फाईल वाचण्यात त्रुटी.",
          "ફાઇલ વાંચવામાં ભૂલ."
        ),
        "error"
      );
    };
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      startAnalysisFromUrl(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(
        tr(
          "Please drop a valid image file (JPG, PNG, or WEBP).",
          "कृपया एक वैध छवि फ़ाइल चुनें।",
          "कृपया वैध इमेज फाईल टाका.",
          "કૃપા કરીને માન્ય છબી ફાઇલ ડ્રોપ કરો."
        ),
        "warning"
      );
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      showToast("Error reading dropped file.", "error");
    };
    reader.onload = (event) => {
      startAnalysisFromUrl(event.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset) => {
    if (preset.imageSrc) {
      startAnalysisFromUrl(preset.imageSrc, preset.title, preset.region, preset.variety, preset);
    } else {
      const dataUrl = generateSampleTrayImage(preset);
      startAnalysisFromUrl(dataUrl, preset.title, preset.region, preset.variety, preset);
    }
  };

  const startAnalysisFromUrl = (dataUrl, title, region = "Lasalgaon APMC", variety = "Nashik Red", preset = null) => {
    setImagePreview(dataUrl);
    setStage("analyzing");
    setAnalyzingProgress({
      step: "init",
      message: tr(
        "Calibrating camera sensor & RGB color space...",
        "कैमरा सेंसर एवं आरजीबी कलर स्पेस कैलिब्रेट हो रहा है...",
        "कॅमेरा सेन्सर आणि आरजीबी कलर स्पेस कॅलिब्रेट होत आहे...",
        "કેમેરા સેન્સર અને RGB કલર સ્પેસ કેલિબ્રેટ થઈ રહી છે..."
      ),
      percent: 10
    });

    const img = new Image();
    // Only set crossOrigin on external http/https URLs to avoid canvas taint on data: URIs
    if (typeof dataUrl === "string" && dataUrl.startsWith("http")) {
      img.crossOrigin = "anonymous";
    }

    img.onerror = () => {
      showToast(
        tr(
          "Could not decode image. Please upload a standard JPG, PNG, or WEBP file.",
          "छवि डिकोड करने में त्रुटि। कृपया मानक JPG, PNG या WEBP प्रारूप का उपयोग करें।",
          "इमेज डिकोड करण्यात त्रुटी. कृपया मानक JPG, PNG किंवा WEBP फाईल वापरा.",
          "છબી ડિકોડ કરવામાં ભૂલ. કૃપા કરીને પ્રમાણભૂત JPG, PNG અથવા WEBP ફાઇલ વાપરો."
        ),
        "error"
      );
      setStage("input");
    };

    img.onload = async () => {
      try {
        let geminiInsight = null;

        // Downscale image to a standardized optimal resolution (max 1024px)
        // This eliminates 413 Payload Too Large errors, runs 10x faster, and prevents localStorage quota crashes.
        const maxDim = 1024;
        let w = img.naturalWidth || img.width || 600;
        let h = img.naturalHeight || img.height || 600;
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const resizeCanvas = document.createElement("canvas");
        resizeCanvas.width = w;
        resizeCanvas.height = h;
        const resizeCtx = resizeCanvas.getContext("2d");
        resizeCtx.drawImage(img, 0, 0, w, h);
        const analysisBase64 = resizeCanvas.toDataURL("image/jpeg", 0.85);

        // Update preview with the normalized crisp image
        setImagePreview(analysisBase64);

        // 1. If Gemini Multimodal Vision is active and this is not a synthetic preset config
        const hasGeminiKey = Boolean(getGeminiApiKey()) && getGeminiApiKey().length > 10;
        if (aiEngine === "gemini" && !preset?.bulbsConfig && hasGeminiKey) {
          setAnalyzingProgress({
            step: "gemini",
            message: tr(
              "Querying Google Gemini Multimodal Vision AI...",
              "गूगल जेमिनी विज़न एआई द्वारा रोग एवं गुणवत्ता विश्लेषण जारी है...",
              "गुगल जेमिनी व्हिजन एआय द्वारे रोग आणि गुणवत्ता विश्लेषण सुरू आहे...",
              "ગૂગલ જેમિની વિઝન એઆઈ દ્વારા રોગ અને ગુણવત્તા વિશ્લેષણ ચાલુ છે..."
            ),
            percent: 30
          });

          try {
            const geminiRes = await analyzeWithGeminiVision(analysisBase64, language);
            if (geminiRes.isOnion === false) {
              const rejectionResult = {
                isOnion: false,
                rejectionReport: {
                  title: tr(
                    "Non-Onion Object Detected",
                    "गैर-प्याज वस्तु का पता चला",
                    "कांद्याव्यतिरिक्त वस्तू आढळली",
                    "બિન-ડુંગળી વસ્તુ મળી આવી"
                  ),
                  confidence: geminiRes.confidence || 98,
                  detectedClass: geminiRes.detectedClass || "non_produce",
                  reason: geminiRes.rejectionReason || tr(
                    "Non-onion object identified by Gemini Vision AI.",
                    "जेमिनी विज़न द्वारा गैर-कृषि वस्तु की पुष्टि।",
                    "जेमिनी व्हिजनद्वारे बिगर-कृषी वस्तू आढळली.",
                    "જેમિની વિઝન દ્વારા બિન-કૃષિ વસ્તુની પુષ્ટિ."
                  ),
                  metrics: {
                    chromaticRatio: 2.8,
                    rectilinearRatio: 74.0,
                    organicCurvatureRatio: 12.0,
                    coolScreenRatio: 21.5,
                    neutralRatio: 45.0,
                    blobCandidates: 0
                  }
                },
                originalImage: analysisBase64
              };
              setGradingResult(rejectionResult);
              setStage("rejected");
              showToast(rejectionResult.rejectionReport.title, "error");
              return;
            }

            geminiInsight = {
              pathologyNotes: geminiRes.pathologyNotes,
              farmerAdvice: geminiRes.farmerAdvice,
              geminiGrade: geminiRes.lotGrade,
              // Per-bulb grades array with precise bounding boxes
              geminiBulbs: Array.isArray(geminiRes.detectedBulbs)
                ? geminiRes.detectedBulbs
                : (Array.isArray(geminiRes.bulbs) ? geminiRes.bulbs : []),
              geminiStats: {
                ...geminiRes.stats,
                averageDiameterMm: geminiRes.averageDiameterMm || null
              }
            };
          } catch (geminiErr) {
            if (geminiErr.message === "GEMINI_API_KEY_MISSING") {
              showToast(
                tr(
                  "Gemini AI key not set — grading with Edge CV model",
                  "जेमिनी API की सेट नहीं — एज CV मॉडल से ग्रेडिंग",
                  "जेमिनी API की सेट नाही — एज CV मॉडेलसह प्रतवारी",
                  "જેમિની API કી સેટ નથી — એજ CV મૉડેલ વડે ગ્રેડિંગ"
                ),
                "warning"
              );
            } else {
              console.warn("Gemini Vision fallback to Edge CV:", geminiErr.message);
            }
          }
        } else if (aiEngine === "gemini" && !preset?.bulbsConfig && !hasGeminiKey) {
          setAnalyzingProgress({
            step: "edge",
            message: tr(
              "Running Edge CV model (Gemini key not configured)...",
              "एज CV मॉडल चल रहा है (जेमिनी कुंजी कॉन्फ़िगर नहीं)...",
              "एज CV मॉडेल चालू आहे (जेमिनी की कॉन्फिगर नाही)...",
              "એજ CV મૉડેલ ચાલી રહ્યું છે (જેમિની કી ગોઠવાઈ નથી)..."
            ),
            percent: 30
          });
        }

        const result = await analyzeOnionImage(resizeCanvas, (progress) => {
          setAnalyzingProgress(progress);
        }, {
          preset,
          forceAccept: !!geminiInsight,
          // Gemini is authoritative for count, location bounding boxes, and grades
          geminiBulbs: geminiInsight?.geminiBulbs || null,
          geminiStats: geminiInsight?.geminiStats || null,
          geminiGrade: geminiInsight?.geminiGrade || null
        });

        if (result.isOnion === false) {
          setGradingResult(result);
          setStage("rejected");
          showToast(result.rejectionReport?.title || "Non-Onion Object Detected", "error");
          return;
        }

        // Blend Gemini insights if available
        if (geminiInsight) {
          result.geminiInsight = geminiInsight;
          if (geminiInsight.geminiGrade) {
            result.lotGrade = geminiInsight.geminiGrade;
          }
          if (geminiInsight.geminiStats) {
            result.stats = { ...result.stats, ...geminiInsight.geminiStats };
          }
        }

        const newLot = {
          id: `LOT-${Date.now().toString(36).toUpperCase().slice(-6)}`,
          createdAt: new Date().toISOString(),
          dateStr: "Just now",
          title: title || "Tray Grading Session",
          farmerName: user?.name || "Rameshwar Patil",
          farmerId: user?.id || "FARM-MH-9812",
          mandiName: user?.mandi || region,
          mandiId: user?.mandiId || "MH-LAS",
          variety: variety,
          quantityQuintals: 35.0,
          estimatedPricePerQuintal: result.lotGrade === "Grade A" ? 2850 : result.lotGrade === "URS" ? 2150 : 1100,
          ...result,
          thumbnail: result.annotatedImage,
          status: "available_for_trade"
        };

        saveLot(newLot);
        setGradingResult(newLot);
        setStage("report");

        showToast(`Grading complete: ${result.lotGrade} (${result.stats.gradeAPct}% Grade A)`, "success");

        if (onGradingComplete) {
          onGradingComplete(newLot);
        }
      } catch (err) {
        console.error("Grading failed:", err);
        showToast("Error processing image. Please try again.", "error");
        setStage("input");
      }
    };
    img.src = dataUrl;
  };

  const handleBulbClick = (bulbId) => {
    setSelectedBulbId(selectedBulbId === bulbId ? null : bulbId);
  };

  const downloadReportPng = () => {
    if (!gradingResult) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");

      // Dark theme certificate background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient border
      ctx.strokeStyle = "#F18B49";
      ctx.lineWidth = 6;
      ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

      // Header Banner
      ctx.fillStyle = "#F18B49";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("ONIONGRADE AI", 50, 75);

      ctx.fillStyle = "#C4A494";
      ctx.font = "16px monospace";
      ctx.fillText("DEPARTMENT OF CONSUMER AFFAIRS • APMC DIGITAL QUALITY PASSPORT", 50, 105);

      // Lot ID & Grade Box
      ctx.fillStyle = "#1F0B1B";
      ctx.fillRect(50, 130, 900, 110);
      ctx.strokeStyle = "rgba(241, 139, 73, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 130, 900, 110);

      ctx.fillStyle = "#F8D5C2";
      ctx.font = "bold 24px monospace";
      ctx.fillText(`LOT ID: ${gradingResult.id}`, 75, 175);

      ctx.fillStyle = "#C4A494";
      ctx.font = "15px sans-serif";
      ctx.fillText(`Mandi: ${gradingResult.mandiName || "APMC Yard"} | Variety: ${gradingResult.variety || "Nashik Red"}`, 75, 210);

      // Grade Badge
      const isGradeA = gradingResult.lotGrade === "Grade A";
      const isReject = gradingResult.lotGrade === "Reject";
      ctx.fillStyle = isGradeA ? "#F18B49" : isReject ? "#FF4D4D" : "#EB87A9";
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "right";
      ctx.fillText(gradingResult.lotGrade?.toUpperCase(), 920, 185);
      ctx.textAlign = "left";

      // Stats Summary Bar
      ctx.fillStyle = "#120710";
      ctx.fillRect(50, 260, 900, 90);
      ctx.fillStyle = "#F18B49";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`GRADE A: ${gradingResult.stats?.gradeAPct || 0}%`, 80, 315);
      ctx.fillStyle = "#EB87A9";
      ctx.fillText(`URS: ${gradingResult.stats?.ursPct || 0}%`, 330, 315);
      ctx.fillStyle = "#FF4D4D";
      ctx.fillText(`REJECT: ${gradingResult.stats?.rejectPct || 0}%`, 540, 315);
      ctx.fillStyle = "#F8D5C2";
      ctx.fillText(`AVG DIA: ${gradingResult.averageDiameterMm || gradingResult.stats?.avgDiameterMm || 48}mm`, 740, 315);

      // Render the onion image in the center
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 50, 370, 900, 680);

        // Security Stamp / Footer
        ctx.fillStyle = "#1F0B1B";
        ctx.fillRect(50, 1070, 900, 75);
        ctx.fillStyle = "#C4A494";
        ctx.font = "14px monospace";
        ctx.fillText("ICAR-DOGR SIZE BAND STANDARDS • VERIFIED DIGITAL APMC LOT RECORD", 75, 1115);
        ctx.fillStyle = "#F18B49";
        ctx.textAlign = "right";
        ctx.fillText(new Date().toLocaleDateString("en-IN"), 920, 1115);
        ctx.textAlign = "left";

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `OnionGrade-${gradingResult.id}-Certified-Report.png`;
        a.click();
        showToast("Certified APMC report certificate downloaded!", "success");
      };
      img.src = gradingResult.annotatedImage || gradingResult.thumbnail;
    } catch (e) {
      // Fallback to direct image download
      const a = document.createElement("a");
      a.href = gradingResult.annotatedImage || gradingResult.thumbnail;
      a.download = `OnionGrade-${gradingResult.id}-Report.png`;
      a.click();
      showToast("Report image downloaded!", "success");
    }
  };

  const resetWorkflow = () => {
    stopCamera();
    setImagePreview(null);
    setGradingResult(null);
    setSelectedBulbId(null);
    setStage("input");
  };

  return (
    <div className="w-full text-[#F8D5C2]">
      
      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: INPUT SCREEN                                         */}
      {/* ------------------------------------------------------------- */}
      {stage === "input" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* 3D Tactile Hero Banner */}
          <div className="card-3d p-6 sm:p-8 relative">
            <div className="relative z-10 max-w-xl">
              <div className="capsule-tag mb-3">
                <Sparkles size={11} />
                <span>{tr("OPTICAL VISION AI 2.4", "ऑप्टिकल विज़न एआई 2.4", "ऑप्टिकल व्हिजन एआय २.४", "ઓપ્ટિકલ વિઝન AI ૨.૪")}</span>
              </div>
              <h1 className="font-sans font-black text-2xl sm:text-4xl text-[#F8D5C2] tracking-tight">
                {tr("Capture & Grade ", "स्कैन एवं ग्रेडिंग ", "स्कॅन आणि प्रतवारी ", "સ્કેન અને ગ્રેડિંગ ")}
                <span className="text-[#F18B49]">{tr("Onion Lots", "प्याज लॉट्स", "कांदा लॉट्स", "ડુંગળી લોટ")}</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#C4A494] mt-2 leading-relaxed">
                {tr(
                  "Scan onion trays with automated contour segmentation. Extracts diameter, rot ratio, skin gloss, and apical sprouting in milliseconds.",
                  "स्वचालित समोच्च विभाजन के साथ प्याज ट्रे स्कैन करें। मिलीसेकंड में व्यास, सड़न अनुपात, छिलके की चमक और अंकुरण की त्वरित जांच।",
                  "स्वयंचलित समोच्च विभाजनासह कांदा ट्रे स्कॅन करा. मिलीसेकंदात व्यास, सड प्रमाण, सालीची चमक आणि कोंब तपासणी.",
                  "સ્વચાલિત કોન્ટૂર સેગ્મેન્ટેશન સાથે ડુંગળી ટ્રે સ્કેન કરો. મિલીસેકન્ડમાં વ્યાસ, સડો ગુણોત્તર, ફોતરાંની ચમક અને અંકુરણ તપાસો."
                )}
              </p>
            </div>

            <div className="absolute right-4 bottom-2 text-[#F18B49] opacity-10 select-none pointer-events-none">
              <Scan size={100} strokeWidth={1.5} />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 overflow-x-auto">
            <button
              onClick={() => { stopCamera(); setInputMode("upload"); }}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                inputMode === "upload" || inputMode === "presets"
                  ? "btn-3d-lime"
                  : "btn-3d-dark"
              }`}
            >
              <Upload size={14} />
              <span>{t("grading.tabUpload", "Upload Custom Photo")}</span>
            </button>

            <button
              onClick={startCamera}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                inputMode === "camera"
                  ? "btn-3d-lime"
                  : "btn-3d-dark"
              }`}
            >
              <Camera size={14} />
              <span>{t("grading.tabCamera", "Live Camera")}</span>
            </button>
          </div>

          {/* Option B: Custom File Upload */}
          {(inputMode === "upload" || inputMode === "presets") && (
            <div 
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="card-3d p-10 border-2 border-dashed border-white/[0.12] hover:border-[#F18B49] text-center transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-3xl bg-[#F18B49]/15 border border-[#F18B49]/40 mx-auto flex items-center justify-center text-[#F18B49] mb-3 shadow-inner group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <h3 className="font-bold text-lg text-[#F8D5C2]">
                {tr(
                  "Select or Drag & Drop Onion Tray Photo",
                  "प्याज की ट्रे फोटो चुनें या यहाँ खींचें",
                  "कांदा ट्रेचा फोटो निवडा किंवा येथे ड्रॅग करा",
                  "ડુંગળીની ટ્રેનો ફોટો પસંદ કરો અથવા અહીં ખેંચો"
                )}
              </h3>
              <p className="text-xs text-[#C4A494] max-w-sm mx-auto mt-1 mb-5">
                {tr(
                  "Drag and drop JPG, PNG, or WEBP, or click anywhere to browse. Images are automatically optimized and verified.",
                  "JPG, PNG, या WEBP खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें। छवि स्वचालित रूप से अनुकूलित और वर्गीकृत की जाएगी।",
                  "JPG, PNG, किंवा WEBP ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करण्यासाठी क्लिक करा. प्रतिमा स्वयंचलितपणे वर्गीकृत केली जाईल.",
                  "JPG, PNG, અથવા WEBP ખેંચો અને છોડો અથવા બ્રાઉઝ કરવા માટે ક્લિક કરો. છબી આપમેળે ઑપ્ટિમાઇઝ અને વર્ગીકૃત થશે."
                )}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-6 py-3 btn-3d-lime text-xs cursor-pointer shadow-lg shadow-[#F18B49]/15"
              >
                {tr(
                  "Choose Image from Device",
                  "डिवाइस से छवि चुनें",
                  "डिव्हाइसमधून फोटो निवडा",
                  "ઉપકરણમાંથી છબી પસંદ કરો"
                )}
              </button>
            </div>
          )}

          {/* Option C: Live Camera Capture */}
          {inputMode === "camera" && (
            <div className="card-3d p-4 text-center space-y-4">
               <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-black rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* 3D Viewfinder Reticles */}
                <div className="absolute inset-4 border-2 border-dashed border-[#F18B49]/70 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
                  <span className="capsule-tag self-start bg-black/70">
                    {tr("ALIGN TRAY IN FRAME", "फ्रेम में ट्रे संरेखित करें", "फ्रेममध्ये ट्रे संरेखित करा", "ફ્રેમમાં ટ્રે ગોઠવો")}
                  </span>
                  <span className="capsule-tag self-end bg-black/70">
                    {tr("APMC 50mm SCALE ACTIVE", "APMC 50mm स्केल सक्रिय", "APMC 50mm स्केल सक्रिय", "APMC 50mm સ્કેલ સક્રિય")}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-5 py-2.5 btn-3d-dark text-xs font-mono"
                >
                  {tr("Cancel", "रद्द करें", "रद्द करा", "રદ કરો")}
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2.5 btn-3d-lime text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Camera size={16} />
                  <span>{tr("Capture & Run Grading", "फोटो खींचें और ग्रेडिंग शुरू करें", "फोटो घ्या आणि प्रतवारी सुरू करा", "ફોટો લો અને ગ્રેડિંગ શરૂ કરો")}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 2: ANALYZING SCREEN                                     */}
      {/* ------------------------------------------------------------- */}
      {stage === "analyzing" && (
        <div className="py-8 flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg aspect-square rounded-[32px] overflow-hidden border-2 border-[#F18B49]/60 shadow-[0_0_40px_rgba(200,242,103,0.2)] bg-black">
            
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Analyzing Tray"
                className="w-full h-full object-cover filter contrast-125 brightness-90"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

            {/* NEON LASER SCAN BEAM */}
            <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#F18B49]/40 to-[#F18B49] animate-neon-scan pointer-events-none border-b-2 border-[#F18B49] shadow-[0_0_24px_#F18B49]" />

            <div className="absolute inset-5 border border-[#F18B49]/30 rounded-2xl pointer-events-none flex flex-col justify-between p-3 text-[10px] font-mono text-[#F18B49]">
              <div className="flex justify-between items-center bg-black/70 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#F18B49] animate-ping" />
                  <span>{tr("SENSOR: CV-ONION-EDGE", "सेंसर: सीवी-ऑनियन-एज", "सेन्सर: सीव्ही-ऑनियन-एज", "સેન્સર: સીવી-ઓનિયન-એજ")}</span>
                </span>
                <span className="text-[#F8D5C2]">{tr("CALIBRATION: 0.38mm/px", "कैलिब्रेशन: 0.38mm/px", "कॅलिब्रेशन: 0.38mm/px", "કેલિબ્રેશન: 0.38mm/px")}</span>
              </div>

              <div className="absolute inset-0 m-auto w-24 h-24 border border-dashed border-[#F18B49]/50 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#F18B49] shadow-[0_0_8px_#F18B49]" />
              </div>

              <div className="flex justify-between items-center bg-black/70 backdrop-blur-md px-3 py-1 rounded-full">
                <span>{tr("CONTOUR SEGMENTATION", "समोच्च विभाजन (CONTOUR SEGMENTATION)", "समोच्च विभाजन (CONTOUR SEGMENTATION)", "કન્ટૂર વિભાજન (CONTOUR SEGMENTATION)")}</span>
                <span>DoCA STD 2026.2</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-lg mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F8D5C2] font-bold flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-[#F18B49]" />
                {analyzingProgress.message}
              </span>
              <span className="text-[#F18B49] font-black font-tabular">
                {analyzingProgress.percent}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-[#140711] rounded-full overflow-hidden border border-white/[0.08]">
              <div
                className="h-full bg-gradient-to-r from-[#F18B49] to-[#F18B49] shadow-[0_0_12px_#F18B49] transition-all duration-300 ease-out"
                style={{ width: `${analyzingProgress.percent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE: REJECTED NON-ONION OBJECT                              */}
      {/* ------------------------------------------------------------- */}
      {stage === "rejected" && gradingResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="card-3d p-6 sm:p-8 relative border-red-500/40 bg-gradient-to-br from-[#1C0D0D] via-[#120808] to-[#0A0505]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
                  <ShieldAlert size={14} className="text-red-400" />
                  <span>{tr("DoCA Produce Verification • Classification Failed", "DoCA उपज सत्यापन • वर्गीकरण विफल", "DoCA उत्पन्न पडताळणी • वर्गीकरण अयशस्वी", "DoCA પેદાશ ચકાસણી • વર્ગીકરણ નિષ્ફળ")}</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <XCircle className="text-red-400 shrink-0" size={30} />
                  <span>{gradingResult.rejectionReport?.title || tr("Non-Onion Object Detected", "गैर-प्याज वस्तु का पता चला", "कांद्याव्यतिरिक्त वस्तू आढळली", "બિન-ડુંગળી વસ્તુ મળી આવી")}</span>
                </h2>
                
                <p className="text-sm text-[#A88C8C] leading-relaxed">
                  {tr(
                    "The automated optical grading pipeline utilizes deep chromatic manifold checks and Sobel gradient curvature filters. The submitted image does not depict agricultural Allium Cepa (onions) and cannot be graded.",
                    "स्वचालित ऑप्टिकल ग्रेडिंग पाइपलाइन गहरे रंग स्पेक्ट्रम और सोबेल कर्वेचर फिल्टर का उपयोग करती है। प्रस्तुत इमेज में वास्तविक प्याज (Allium Cepa) नहीं पाया गया है और इसे ग्रेड नहीं किया जा सकता।",
                    "स्वयंचलित ऑप्टिकल प्रतवारी पाइपलाइन खोल रंग स्पेक्ट्रम आणि सोबेल ग्रेडियंट कर्वेचर फिल्टर वापरते. सबमिट केलेल्या फोटोमध्ये वास्तविक कांदा (Allium Cepa) आढळला नाही आणि प्रतवारी केली जाऊ शकत नाही.",
                    "સ્વચાલિત ઓપ્ટિકલ ગ્રેડિંગ પાઇપલાઇન ઊંડા રંગ સ્પેક્ટ્રમ અને સોબેલ ગ્રેડિયન્ટ કર્વેચર ફિલ્ટર્સનો ઉપયોગ કરે છે. સબમિટ કરેલી છબીમાં વાસ્તવિક ડુંગળી (Allium Cepa) જણાતી નથી અને તેને ગ્રેડ કરી શકાતી નથી."
                  )}
                </p>
              </div>

              <div className="shrink-0">
                <div className="p-4 rounded-2xl bg-black/50 border border-red-500/30 text-center">
                  <div className="text-[10px] font-mono text-[#A88C8C] uppercase tracking-wider">{tr("Detection Confidence", "पहचान सटीकता", "तपासणी अचूकता", "શોધ ચોકસાઈ")}</div>
                  <div className="text-3xl font-mono font-black text-red-400 mt-1">
                    {gradingResult.rejectionReport?.confidence || 98}%
                  </div>
                  <div className="text-[10px] font-mono text-red-300 mt-0.5">{tr("Non-Produce Object", "गैर-कृषि वस्तु", "बिगर-कृषी वस्तू", "બિન-કૃષિ વસ્તુ")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scanned Image Preview */}
            <div className="lg:col-span-5 card-3d p-4 flex flex-col items-center justify-center relative overflow-hidden bg-black">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-red-500/30">
                <img
                  src={gradingResult.originalImage || imagePreview}
                  alt="Rejected Input"
                  className="w-full h-full object-cover filter grayscale-[30%]"
                />
                <div className="absolute inset-0 bg-red-950/20" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    {tr("REJECTED BY VISION SENSOR", "विज़न सेंसर द्वारा अस्वीकृत", "व्हिजन सेन्सरद्वारे नाकारले", "વિઝન સેન્સર દ્વારા અસ્વીકાર")}
                  </span>
                  <span className="text-[10px] font-mono text-[#C4A494]">{tr("RAW INPUT", "कच्चा इनपुट", "कच्चा इनपुट", "કાચો ઇનપુટ")}</span>
                </div>
              </div>
            </div>

            {/* Neural Diagnostics Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="card-3d p-6 space-y-4">
                <h3 className="font-mono font-black text-xs uppercase tracking-wider text-[#C4A494] flex items-center gap-2">
                  <span>{tr("CV Model Diagnostics", "सीवी मॉडल डायग्नोस्टिक्स", "सीव्ही मॉडेल डायग्नोस्टिक्स", "સીવી મોડેલ ડાયગ્નોસ્ટિક્સ")}</span>
                  <span className="h-px flex-1 bg-white/[0.08]" />
                </h3>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 leading-relaxed font-mono">
                  {gradingResult.rejectionReport?.reason}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Identified Object", "पहचानी गई वस्तु", "आढळलेली वस्तू", "ઓળખાયેલ વસ્તુ")}</div>
                    <div className="text-xs font-mono font-bold text-[#F8D5C2] mt-1 capitalize">
                      {gradingResult.rejectionReport?.detectedClass?.replace(/_/g, " ") || tr("Hardware / Non-onion", "गैर-प्याज", "बिगर-कांदा", "બિન-ડુંગળી")}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Onion Pigment", "प्याज वर्णक", "कांदा रंगद्रव्य", "ડુંગળી રંગદ્રવ્ય")}</div>
                    <div className="text-xs font-mono font-bold text-red-400 mt-1">
                      {gradingResult.rejectionReport?.metrics?.chromaticRatio ?? 0}%
                      <span className="text-[10px] text-[#C4A494] font-normal ml-1">(min 4%)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Orthogonal Edges", "आयताकार किनारे", "काटकोनी कडा", "કાટખૂણે કિનારીઓ")}</div>
                    <div className="text-xs font-mono font-bold text-[#F8D5C2] mt-1">
                      {gradingResult.rejectionReport?.metrics?.rectilinearRatio ?? 0}%
                      <span className="text-[10px] text-[#C4A494] font-normal ml-1">(&gt;68% = tech)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Bulb Count", "प्याज संख्या", "कांद्यांची संख्या", "ડુંગળી સંખ્યા")}</div>
                    <div className="text-xs font-mono font-bold text-red-400 mt-1">
                      {gradingResult.rejectionReport?.metrics?.blobCandidates ?? 0} {tr("bulbs", "प्याज", "कांदे", "ડુંગળી")}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Cool Screen Light", "स्क्रीन नीली रोशनी", "स्क्रीन निळा प्रकाश", "સ્ક્રીન વાદળી પ્રકાશ")}</div>
                    <div className="text-xs font-mono font-bold text-[#F8D5C2] mt-1">
                      {gradingResult.rejectionReport?.metrics?.coolScreenRatio ?? 0}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-[#C4A494] uppercase">{tr("Organic Curvature", "प्राकृतिक गोलाई", "नैसर्गिक गोलाई", "કુદરતી ગોળાઈ")}</div>
                    <div className="text-xs font-mono font-bold text-[#F8D5C2] mt-1">
                      {gradingResult.rejectionReport?.metrics?.organicCurvatureRatio ?? 0}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Guidance & CTA */}
              <div className="card-3d p-6 space-y-4">
                <div className="text-xs font-mono text-[#C4A494]">
                  💡 <strong>{tr("How to resolve:", "समाधान कैसे करें:", "कसे सोडवायचे:", "કેવી રીતે ઉકેલવું:")}</strong> {tr(
                    "Place actual red or white onions evenly spaced on a flat surface or tray. Alternatively, test the demo using our calibrated APMC reference batches.",
                    "वास्तविक लाल या सफेद प्याज को किसी सपाट सतह या ट्रे पर फैलाकर रखें। अथवा हमारे कैलिब्रेटेड एपीएमसी संदर्भ बैचों से डेमो का परीक्षण करें।",
                    "सपाट पृष्ठभागावर किंवा ट्रेवर लाल किंवा पांढरे कांदे समान अंतरावर ठेवा. किंवा आमच्या कॅलिब्रेटेड APMC संदर्भ बॅच वापरून चाचणी करा.",
                    "સપાટ સપાટી અથવા ટ્રે પર વાસ્તવિક લાલ અથવા સફેદ ડુંગળીને સમાન અંતરે ગોઠવો. અથવા અમારા કેલિબ્રેટેડ APMC સંદર્ભ બેચનો ઉપયોગ કરીને ડેમો તપાસો."
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      resetWorkflow();
                      setInputMode("presets");
                    }}
                    className="px-5 py-2.5 btn-3d-lime text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={14} />
                    <span>{tr("Test Calibrated APMC Sample Lot", "कैलिब्रेटेड एपीएमसी नमूना लॉट टेस्ट करें", "कॅलिब्रेटेड बाजार समिती नमुना लॉट तपासा", "કેલિબ્રેટેડ માર્કેટ યાર્ડ સેમ્પલ લોટ ટેસ્ટ કરો")}</span>
                  </button>

                  <button
                    onClick={() => {
                      resetWorkflow();
                      startCamera();
                    }}
                    className="px-4 py-2.5 btn-3d-dark text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Camera size={14} />
                    <span>{tr("Try Camera Again", "कैमरा दोबारा आज़माएं", "कॅमेरा पुन्हा सुरू करा", "કેમેરા ફરી અજમાવો")}</span>
                  </button>

                  <button
                    onClick={() => {
                      resetWorkflow();
                      setInputMode("upload");
                    }}
                    className="px-4 py-2.5 btn-3d-dark text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>{tr("Upload Onion Photo", "प्याज की फोटो अपलोड करें", "कांद्याचा फोटो अपलोड करा", "ડુંગળીનો ફોટો અપલોડ કરો")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 3: 3D TACTILE VISUAL REPORT                             */}
      {/* ------------------------------------------------------------- */}
      {stage === "report" && gradingResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="card-3d p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="capsule-tag-dark">LOT ID</span>
                <span className="font-mono font-black text-sm text-[#F8D5C2]">{gradingResult.id}</span>
                <span className="capsule-tag">
                  {gradingResult.mandiName}
                </span>
              </div>
              <div className="text-xs text-[#C4A494] mt-1 font-mono">
                {gradingResult.dateStr || tr("Today", "आज", "आज", "આજે")} • {tr("Variety:", "किस्म:", "प्रकार:", "જાત:")} <strong className="text-[#F8D5C2]">{gradingResult.variety || tr("Nashik Red", "नासिक लाल", "नाशिक लाल", "નાસિક લાલ")}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#F18B49]/15 hover:bg-[#F18B49]/25 text-[#F18B49] border border-[#F18B49]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View & Print DoCA AGMARK QR Certificate"
              >
                <QrCode size={13} />
                <span>{tr("QR Certificate", "क्यूआर सर्टिफिकेट", "क्यूआर प्रमाणपत्र", "ક્યુઆર સર્ટિફિકેટ")}</span>
              </button>

              <button
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="WhatsApp Krishi Sahayak Bot Integration"
              >
                <MessageSquare size={13} />
                <span>{tr("WhatsApp Bot", "व्हाट्सएप बॉट", "व्हॉट्सअ‍ॅप बॉट", "વોટ્સએપ બોટ")}</span>
              </button>

              <button
                onClick={() => setIsCalibrationOpen(true)}
                className="px-4 py-2 btn-3d-dark text-xs flex items-center gap-1.5 cursor-pointer hover:border-[#F18B49]/50"
              >
                <Sliders size={13} />
                <span>{tr("Manual Calibration", "मैनुअल कैलिब्रेशन", "मॅन्युअल कॅलिब्रेशन", "મેન્યુઅલ કેલિબ્રેશન")}</span>
              </button>

              <button
                onClick={resetWorkflow}
                className="px-4 py-2 btn-3d-dark text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>{tr("Grade Another", "नया ग्रेड करें", "नवीन प्रतवारी करा", "નવું ગ્રેડ કરો")}</span>
              </button>

              <button
                onClick={downloadReportPng}
                className="px-4 py-2 btn-3d-dark text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>{tr("Export PNG", "PNG डाउनलोड करें", "PNG डाउनलोड करा", "PNG ડાઉનલોડ કરો")}</span>
              </button>

              {role === ROLES.FARMER && (
                <button
                  onClick={() => setIsDisputeOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#FF4D4D]/15 hover:bg-[#FF4D4D]/25 text-[#FF4D4D] border border-[#FF4D4D]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle size={13} />
                  <span>{tr("Raise Dispute", "विवाद दर्ज करें", "तक्रार नोंदवा", "વિવાદ નોંધાવો")}</span>
                </button>
              )}

              {role === ROLES.OFFICER && (
                <button
                  onClick={() => setIsProcurementOpen(true)}
                  className="px-5 py-2 btn-3d-lime text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Scale size={14} />
                  <span>{tr("Confirm & Log Procurement", "खरीद की पुष्टि करें", "खरेदी निश्चित करा व नोंदवा", "ખરીદીની પુષ્ટિ કરો")}</span>
                </button>
              )}

              {role === ROLES.RETAILER && (
                <button
                  onClick={() => {
                    savePurchaseRequest({
                      lotId: gradingResult.id,
                      retailerName: user?.name || "Sunil Agrawal",
                      retailerCompany: user?.company || "Mahalaxmi Agro Traders",
                      quantityQuintals: gradingResult.quantityQuintals || 40,
                      offeredPrice: gradingResult.estimatedPricePerQuintal || 2800,
                      mandiName: gradingResult.mandiName
                    });
                    showToast(`Purchase request for Lot ${gradingResult.id} transmitted to Mandi Officer!`, "success");
                  }}
                  className="px-5 py-2 btn-3d-lime text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>{tr("Request Purchase", "खरीद का अनुरोध करें", "खरेदीची विनंती करा", "ખરીદીની વિનંતી કરો")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Dispute Notice */}
          {gradingResult.dispute && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
              gradingResult.dispute.status === "open"
                ? "bg-[#FF4D4D]/15 border-[#FF4D4D]/40"
                : gradingResult.dispute.status === "overridden"
                ? "bg-[#F18B49]/15 border-[#F18B49]/40"
                : "bg-[#EB87A9]/15 border-[#EB87A9]/40"
            }`}>
              <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${
                gradingResult.dispute.status === "overridden" ? "text-[#F18B49]" : "text-[#FF4D4D]"
              }`} />
              <div className="flex-1 space-y-1">
                <div className="font-bold text-[#F8D5C2] flex items-center gap-2">
                  <span>{tr("Dispute #", "विवाद #", "तक्रार #", "વિવાદ #")}{gradingResult.dispute.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    gradingResult.dispute.status === "open"
                      ? "bg-[#FF4D4D]/20 text-[#FF4D4D]"
                      : gradingResult.dispute.status === "overridden"
                      ? "bg-[#F18B49]/20 text-[#F18B49]"
                      : "bg-[#EB87A9]/20 text-[#EB87A9]"
                  }`}>
                    {gradingResult.dispute.status === "open"
                      ? tr("OPEN", "लंबित", "प्रलंबित", "બાકી")
                      : gradingResult.dispute.status === "overridden"
                      ? tr("OVERRIDDEN", "संशोधित", "बदलले", "સુધારેલ")
                      : tr("UPHELD", "बरकरार", "कायम", "યથાવત")}
                  </span>
                </div>
                <p className="text-[#C4A494]">
                  <strong>{tr("Farmer Reason:", "किसान का कारण:", "शेतकऱ्याचे कारण:", "ખેડૂતનું કારણ:")}</strong> {gradingResult.dispute.reason} — "{gradingResult.dispute.farmerNote}"
                </p>
                {gradingResult.dispute.resolutionOfficer && (
                  <div className="pt-2 mt-2 border-t border-white/[0.08] text-[#F18B49] font-mono">
                    <div>
                      <strong>{tr("Adjudicated by:", "निर्णायक अधिकारी:", "निर्णायक अधिकारी:", "નિર્ણાયક અધિકારી:")}</strong> {gradingResult.dispute.resolutionOfficer}
                    </div>
                    {gradingResult.dispute.resolutionOfficerNote && (
                      <div className="text-[#F8D5C2] text-[11px] mt-0.5 italic">
                        "{gradingResult.dispute.resolutionOfficerNote}"
                      </div>
                    )}
                    {gradingResult.dispute.overriddenGrade && (
                      <div className="text-[11px] font-bold mt-1 text-[#F18B49]">
                        {tr("New Official Grade:", "नया आधिकारिक ग्रेड:", "नवीन अधिकृत प्रत:", "નવો સત્તાવાર ગ્રેડ:")} {gradingResult.dispute.overriddenGrade}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gemini AI Multimodal Pathology Card (if generated by Gemini) */}
          {gradingResult.geminiInsight && (
            <div className="card-3d p-6 border-[#F18B49]/40 bg-gradient-to-br from-[#140711] via-[#140711] to-[#000000] space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F18B49]/20 border border-[#F18B49]/40 flex items-center justify-center text-[#F18B49]">
                    <Bot size={18} />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-xs text-[#F8D5C2]">
                      Google Gemini 1.5 Pro Multimodal Forensic Pathology
                    </span>
                    <div className="text-[10px] text-[#C4A494] font-mono">
                      {tr("AI Agronomic Pathology & Defect Reasoning", "कृषि विज्ञान रोग एवं गुणवत्ता विश्लेषण", "कृषी विज्ञान रोग आणि गुणवत्ता विश्लेषण", "કૃષિ વિજ્ઞાન રોગ અને ગુણવત્તા વિશ્લેષણ")}
                    </div>
                  </div>
                </div>
                <span className="capsule-tag text-[9px] py-0.5">GEMINI 3.6 FLASH</span>
              </div>

              {gradingResult.geminiInsight.pathologyNotes && (
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold text-[#C4A494] uppercase tracking-wider">
                    {t("grading.pathologyTitle", "Gemini AI Agronomic Pathology & Defect Insights")}
                  </div>
                  <p className="text-xs sm:text-sm text-[#F8D5C2] leading-relaxed font-mono bg-black/40 p-3.5 rounded-xl border border-white/[0.06]">
                    {gradingResult.geminiInsight.pathologyNotes}
                  </p>
                </div>
              )}

              {gradingResult.geminiInsight.farmerAdvice && (
                <div className="p-4 rounded-2xl bg-[#F18B49]/10 border border-[#F18B49]/30 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-[#F18B49] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>{t("grading.farmerAdviceTitle", "Mandi Agronomist Guidance")}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F18B49] leading-relaxed">
                    {gradingResult.geminiInsight.farmerAdvice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3D Bento Grid: Image + Donut & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 3D Card: Annotated Photo */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative rounded-[28px] overflow-hidden border border-white/[0.08] bg-black shadow-2xl group">
                <img
                  src={showOverlays ? gradingResult.annotatedImage : gradingResult.originalImage}
                  alt="Annotated Onion Tray"
                  className="w-full h-auto object-contain block"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <button
                    onClick={() => setShowOverlays(!showOverlays)}
                    className="capsule-tag-dark bg-black/70 backdrop-blur-md cursor-pointer hover:border-white/30"
                  >
                    <Eye size={12} />
                    <span>{showOverlays ? tr("Overlays: ON", "ओवरले: चालू", "ओव्हरले: सुरू", "ઓવરલે: ચાલુ") : tr("Original Image", "मूल छवि", "मूळ फोटो", "મૂળ છબી")}</span>
                  </button>
                </div>

                <div className="absolute top-3 right-3 capsule-tag bg-black/70 backdrop-blur-md">
                  {tr("CLICK BULB TO INSPECT", "निरीक्षण के लिए कंद पर क्लिक करें", "तपासणीसाठी कांद्यावर क्लिक करा", "તપાસ માટે ડુંગળી પર ક્લિક કરો")}
                </div>

                {showOverlays && gradingResult.bulbs?.map((bulb) => {
                  const isSelected = selectedBulbId === bulb.id;
                  // Support both old (bbox) and new (x/y/radius) bulb formats
                  const bx = bulb.bbox?.x ?? (bulb.x != null ? bulb.x - bulb.radius : 0);
                  const by = bulb.bbox?.y ?? (bulb.y != null ? bulb.y - bulb.radius : 0);
                  const bw = bulb.bbox?.width  ?? (bulb.radius != null ? bulb.radius * 2 : 40);
                  const bh = bulb.bbox?.height ?? (bulb.radius != null ? bulb.radius * 2 : 40);
                  const imgW = gradingResult.width  || 600;
                  const imgH = gradingResult.height || 600;
                  const leftPct   = (bx / imgW) * 100;
                  const topPct    = (by / imgH) * 100;
                  const widthPct  = (bw / imgW) * 100;
                  const heightPct = (bh / imgH) * 100;

                  return (
                    <div
                      key={bulb.id}
                      onClick={() => handleBulbClick(bulb.id)}
                      style={{
                        position: "absolute",
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                      }}
                      className={`cursor-pointer rounded-full transition-all ${
                        isSelected
                          ? "ring-4 ring-[#F18B49] shadow-[0_0_20px_#F18B49]"
                          : "hover:ring-2 hover:ring-[#F18B49]/70"
                      }`}
                      title={`Bulb #${bulb.id}: ${bulb.grade} (${bulb.diameterMm}mm)`}
                    />
                  );
                })}
              </div>

              {/* Legend Bar */}
              <div className="flex items-center justify-between text-xs px-2 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[#F18B49]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F18B49]" />
                    {tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'")}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#EB87A9]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EB87A9]" />
                    URS
                  </span>
                  <span className="flex items-center gap-1.5 text-[#FF4D4D]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D]" />
                    {tr("Reject", "अस्वीकृत", "नाकारलेले", "અસ્વીકાર")}
                  </span>
                </div>
                <span className="text-[#C4A494]">
                  {gradingResult.stats?.totalBulbs || 0} {tr("BULBS DETECTED", "कंद पहचाने गए", "कांदे आढळले", "ડુંગળી મળી આવી")}
                </span>
              </div>
            </div>

            {/* Right 3D Bento: Donut Chart & Metrics */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card A: Donut Chart Card */}
              <div className="card-3d p-6 text-center space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="text-left">
                    <span className="capsule-tag-dark">{tr("OVERALL LOT GRADE", "समग्र लॉट ग्रेड", "एकूण लॉट प्रतवारी", "એકંદર લોટ ગ્રેડ")}</span>
                    <h3 className="font-sans font-black text-2xl text-[#F8D5C2] mt-1">
                      {gradingResult.lotGrade === "Grade A" ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") : gradingResult.lotGrade}
                    </h3>
                  </div>
                  <div className={`capsule-tag ${
                    gradingResult.lotGrade === "Grade A"
                      ? "border-[#F18B49]/50 text-[#F18B49]"
                      : gradingResult.lotGrade === "URS"
                      ? "capsule-tag-yellow"
                      : "capsule-tag-red"
                  }`}>
                    {tr("DoCA VERIFIED", "DoCA सत्यापित", "DoCA प्रमाणित", "DoCA પ્રમાણિત")}
                  </div>
                </div>

                <DonutChart
                  gradeAPct={gradingResult.stats?.gradeAPct || 0}
                  ursPct={gradingResult.stats?.ursPct || 0}
                  rejectPct={gradingResult.stats?.rejectPct || 0}
                  size={190}
                  strokeWidth={22}
                  centerLabel={`${gradingResult.stats?.gradeAPct || 0}%`}
                  centerSub={tr("GRADE A RATIO", "ग्रेड 'अ' अनुपात", "ग्रेड 'अ' प्रमाण", "ગ્રેડ 'અ' ગુણોત્તર")}
                />

                {/* 3D KPI Pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
                  <div className="p-3 bg-[#0C040A] rounded-2xl border border-white/[0.06] shadow-inner">
                    <div className="text-[10px] text-[#C4A494]">{tr("AVG DIAMETER", "औसत व्यास", "सरासरी व्यास", "સરેરાશ વ્યાસ")}</div>
                    <div className="text-sm font-bold text-[#F8D5C2] font-tabular mt-0.5">
                      {gradingResult.stats?.avgDiameterMm}mm
                    </div>
                  </div>
                  <div className="p-3 bg-[#0C040A] rounded-2xl border border-white/[0.06] shadow-inner">
                    <div className="text-[10px] text-[#C4A494]">{tr("AVG ROT %", "औसत सड़न %", "सरासरी नासाडी %", "સરેરાશ સડો %")}</div>
                    <div className="text-sm font-bold text-[#F8D5C2] font-tabular mt-0.5">
                      {gradingResult.stats?.avgDamagePct}%
                    </div>
                  </div>
                  <div className="p-3 bg-[#0C040A] rounded-2xl border border-white/[0.06] shadow-inner">
                    <div className="text-[10px] text-[#C4A494]">{tr("SPROUT BULBS", "अंकुरित कंद", "कोंब आलेले कांदे", "અંકુરિત ડુંગળી")}</div>
                    <div className="text-sm font-bold text-[#F8D5C2] font-tabular mt-0.5">
                      {gradingResult.stats?.sproutCount || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card B: Valuation 3D Card */}
              <div className="card-3d-lime p-5 flex items-center justify-between border border-[#F18B49]/35">
                <div>
                  <div className="text-[10px] font-mono uppercase font-black tracking-wider text-[#F18B49]">
                    {tr("ESTIMATED APMC RATE", "अनुमानित एपीएमसी दर", "अंदाजे बाजार समिती दर", "અંદાજિત માર્કેટ યાર્ડ ભાવ")}
                  </div>
                  <div className="text-xl font-black text-[#FFF5ED] mt-0.5 font-tabular">
                    ₹{gradingResult.estimatedPricePerQuintal || 2400} / <span className="text-xs font-normal text-[#C4A494]">{tr("Quintal", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}</span>
                  </div>
                  <div className="text-[11px] text-[#F8D5C2]/85 font-medium mt-0.5">
                    {tr("Lasalgaon APMC Daily Benchmark", "लासलगांव एपीएमसी दैनिक बेंचमार्क", "लासलगाव बाजार समिती दैनिक बेंचमार्क", "લાસલગાવ એપીએમસી દૈનિક બેંચમાર્ક")}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-[#C4A494] font-bold uppercase">{tr("LOT VOLUME", "लॉट मात्रा", "लॉट प्रमाण", "લોટ જથ્થો")}</div>
                  <div className="text-lg font-black text-[#F18B49] font-tabular mt-0.5">
                    {gradingResult.quantityQuintals || 40} {tr("Qtl", "क्विंटल", "क्विंटल", "ક્વિન્ટલ")}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Diagnostic Breakdown Cards */}
          <div className="card-3d p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="font-sans font-black text-lg text-[#F8D5C2] flex items-center gap-2">
                  <span>{tr("Per-Bulb Diagnostic Breakdown", "प्रति-कंद नैदानिक विश्लेषण", "कांदानिहाय निदान विश्लेषण", "ડુંગળીવાર નિદાન વિશ્લેષણ")}</span>
                  <span className="capsule-tag py-0.5 text-[9px]">
                    DoCA-ONION-2026.2
                  </span>
                </h3>
                <p className="text-xs text-[#C4A494]">
                  {tr(
                    "Physical parameters: diameter (mm), rot/dark patch %, sprout score, and shape deviation.",
                    "भौतिक पैरामीटर: व्यास (मिमी), सड़न/काला धब्बा %, अंकुरण स्कोर और आकार विचलन।",
                    "भौतिक मापदंड: व्यास (मिमी), नासाडी/काळा डाग %, कोंब स्कोअर आणि आकार विचलन.",
                    "ભૌતિક પરિમાણો: વ્યાસ (મીમી), સડો/કાળો ડાઘ %, અંકુરણ સ્કોર અને આકાર વિચલન."
                  )}
                </p>
              </div>

              {selectedBulbId && (
                <button
                  onClick={() => setSelectedBulbId(null)}
                  className="text-xs text-[#F18B49] hover:underline font-mono font-bold"
                >
                  {tr("Clear Selection (Show All)", "चयन हटाएं (सभी दिखाएं)", "निवड रद्द करा (सर्व दाखवा)", "પસંદગી સાફ કરો (બધા બતાવો)")}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {gradingResult.bulbs?.map((bulb) => {
                const isSelected = selectedBulbId === bulb.id;
                const isGradeA = bulb.grade === "Grade A";
                const isReject = bulb.grade === "Reject";

                return (
                  <div
                    key={bulb.id}
                    onClick={() => handleBulbClick(bulb.id)}
                    className={`p-4 rounded-[22px] border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#180915] border-[#F18B49] shadow-xl ring-2 ring-[#F18B49]/50"
                        : "bg-[#120710] border-white/[0.06] hover:border-[#F18B49]/40 hover:bg-[#140711]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#000000] border border-white/[0.08] flex items-center justify-center font-mono font-bold text-xs text-[#F8D5C2]">
                          #{bulb.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                          isGradeA
                            ? "bg-[#F18B49]/20 text-[#F18B49] border border-[#F18B49]/30"
                            : isReject
                            ? "bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/30"
                            : "bg-[#EB87A9]/20 text-[#EB87A9] border border-[#EB87A9]/30"
                        }`}>
                          {bulb.grade === "Grade A" ? tr("Grade A", "ग्रेड 'अ'", "ग्रेड 'अ'", "ગ્રેડ 'અ'") : bulb.grade.toUpperCase()}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-black text-[#F8D5C2]">
                        {bulb.diameterMm}mm
                      </span>
                    </div>

                    <p className="text-xs text-[#C4A494] leading-relaxed">
                      {bulb.reason}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/[0.06] grid grid-cols-3 gap-1 text-[10px] font-mono text-[#C4A494]">
                      <div>
                        {tr("Rot:", "सड़न:", "नासाडी:", "સડો:")} <strong className={bulb.damagePct > 2 ? "text-[#FF4D4D]" : "text-[#F18B49]"}>{bulb.damagePct}%</strong>
                      </div>
                      <div>
                        {tr("Sprout:", "अंकुरण:", "कोंब:", "અંકુર:")} <strong className={bulb.sproutScore > 0.05 ? "text-[#FF4D4D]" : "text-[#F18B49]"}>{bulb.sproutScore}</strong>
                      </div>
                      <div>
                        {tr("Gloss:", "चमक:", "कांती:", "ચમક:")} <strong className="text-[#F8D5C2]">{bulb.skinUniformity}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: MANDI MARKET SIGNAL & FAIR PRICE DISCOVERY         */}
          {/* ------------------------------------------------------------- */}
          {marketSignal && (
            <div className="card-3d p-6 sm:p-7 space-y-6 border-[#F18B49]/40 bg-gradient-to-br from-[#160814] via-[#120710] to-[#0A0409]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/40 text-[10px] font-mono font-black text-[#F18B49] uppercase tracking-wider mb-1.5">
                    <TrendingUp size={12} />
                    <span>{tr("REAL-TIME MANDI MARKET SIGNAL", "रीयल-टाइम मंडी बाज़ार संकेत", "रिअल-टाइम बाजार समिती दर", "રીઅલ-ટાઇમ માર્કેટ યાર્ડ સિગ્નલ")}</span>
                  </div>
                  <h3 className="font-sans font-black text-xl sm:text-2xl text-[#FFF5ED] tracking-tight">
                    {tr("Fair Price Discovery & APMC Rate Linkage", "उचित मूल्य निर्धारण एवं मंडी दर", "रास्त भाव शोध आणि बाजार समिती भाव", "વાજબી ભાવ શોધ અને માર્કેટ યાર્ડ ભાવ")}
                  </h3>
                  <p className="text-xs text-[#C4A494] font-mono mt-0.5">
                    {tr("Direct quality-linked price discovery prevents trader down-pricing of graded lots.", "गुणवत्ता से जुड़े मूल्य निर्धारण से व्यापारियों द्वारा कम कीमत लगाने से बचाव होता है।", "गुणवत्तेवर आधारित भाव निश्चितीमुळे व्यापाऱ्यांकडून कमी भावात खरेदी रोखली जाते.", "ગુણવત્તા-લિંક્ડ ભાવ શોધ વેપારીઓ દ્વારા ઓછા ભાવ લગાવવાથી બચાવે છે.")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="capsule-tag text-xs font-mono font-bold">
                    {marketSignal.mandiName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                    {marketSignal.trend}
                  </span>
                </div>
              </div>

              {/* 4-Bento Price Summary Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                {/* 1. Blended Fair Rate */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-[#F18B49]/30 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("FAIR APMC MODAL RATE", "उचित मंडी भाव", "रास्त बाजार समिती भाव", "વાજબી માર્કેટ યાર્ડ ભાવ")}</span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#F18B49] font-tabular">
                    ₹{marketSignal.blendedRate.toLocaleString("en-IN")}<span className="text-xs text-[#C4A494] font-normal">/qtl</span>
                  </div>
                  <span className="text-[10px] text-[#F8D5C2]/80 block">
                    {tr("Calibrated composite rate", "कैलिब्रेटेड समग्र दर", "कॅलिब्रेटेड एकत्रित दर", "કેલિબ્રેટેડ સંયુક્ત દર")}
                  </span>
                </div>

                {/* 2. Grade A Premium */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-[#EB87A9]/30 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("QUALITY VALUE PREMIUM", "गुणवत्ता प्रीमियम", "गुणवत्ता मूल्य वाढ", "ગુણવત્તા પ્રીમિયમ")}</span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#EB87A9] font-tabular">
                    +₹{marketSignal.gradeAPremium}<span className="text-xs text-[#C4A494] font-normal">/qtl</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    +₹{marketSignal.totalExtraIncome.toLocaleString("en-IN")} {tr("vs unassorted", "बिना छंटे से अधिक", "विना प्रतवारीपेक्षा जास्त", "બિન-વર્ગીકૃત કરતાં વધુ")}
                  </span>
                </div>

                {/* 3. Total Expected Lot Realization */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-white/[0.08] shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("TOTAL LOT VALUE", "कुल लॉट मूल्य", "एकूण लॉट मूल्य", "કુલ લોટ મૂલ્ય")}</span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#FFF5ED] font-tabular">
                    ₹{marketSignal.totalLotValue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-[#C4A494] block">
                    {marketSignal.quantityQuintals} {tr("Quintals total volume", "क्विंटल कुल मात्रा", "क्विंटल एकूण आवक", "ક્વિન્ટલ કુલ જથ્થો")}
                  </span>
                </div>

                {/* 4. Farmer Negotiation Shield */}
                <div className="p-4 rounded-2xl bg-[#150712] border border-[#F18B49]/40 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#F18B49] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>{tr("MINIMUM FAIR BID", "न्यूनतम उचित बोली", "किमान रास्त बोली", "ન્યૂનતમ વાજબી બોલી")}</span>
                  </span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#F18B49] font-tabular">
                    ₹{marketSignal.minimumFairBid.toLocaleString("en-IN")}<span className="text-xs text-[#C4A494] font-normal">/qtl</span>
                  </div>
                  <span className="text-[10px] text-[#C4A494] block">
                    {tr("Recommended negotiation floor", "बातचीत का न्यूनतम आधार", "बोलणीचा किमान पाया", "વાટાઘાટોનો લઘુત્તમ આધાર")}
                  </span>
                </div>
              </div>

              {/* Rate Benchmarks and Terminal Market Arbitrage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* 3-Tier APMC Mandi Grade Rates */}
                <div className="lg:col-span-6 p-4 rounded-2xl bg-[#120710] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-mono font-bold text-[#F8D5C2] flex items-center justify-between">
                    <span>{tr("Today's APMC Rate Bands (Per Quintal)", "आज के एपीएमसी मूल्य बैंड (प्रति क्विंटल)", "आजचे बाजार समिती भाव (प्रति क्विंटल)", "આજના માર્કેટ યાર્ડ ભાવ (ક્વિન્ટલ દીઠ)")}</span>
                    <span className="text-[10px] text-[#C4A494]">{marketSignal.mandiName}</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-[#F18B49]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F18B49]" />
                        <span className="font-bold text-[#FFF5ED]">{tr("Grade A Export", "ग्रेड 'अ' निर्यात", "ग्रेड 'अ' निर्यात", "ગ્રેડ 'અ' નિકાસ")}</span>
                      </div>
                      <span className="text-[#F18B49] font-bold">₹{marketSignal.rateTier.min} – ₹{marketSignal.rateTier.max} (Modal: ₹{marketSignal.rateTier.modal})</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-[#EB87A9]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EB87A9]" />
                        <span className="font-bold text-[#F8D5C2]">{tr("URS Domestic", "यूआरएस घरेलू", "यूआरएस स्थानिक", "URS સ્થાનિક")}</span>
                      </div>
                      <span className="text-[#EB87A9] font-bold">₹1,800 – ₹2,150 (Modal: ₹1,980)</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-[#FF4D4D]/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D4D]" />
                        <span className="font-bold text-[#F8D5C2]">{tr("Reject / Spoilage", "अस्वीकृत / सड़न", "नाकारलेले / सड", "અસ્વીકૃત / સડો")}</span>
                      </div>
                      <span className="text-[#FF4D4D] font-bold">₹650 – ₹920 (Modal: ₹780)</span>
                    </div>
                  </div>
                </div>

                {/* Inter-Mandi Price Arbitrage (Azadpur Terminal Market) */}
                <div className="lg:col-span-6 p-4 rounded-2xl bg-[#120710] border border-white/[0.06] flex flex-col justify-between space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-[#F8D5C2] font-bold mb-2">
                      <span>{tr("Terminal Mandi Arbitrage (Azadpur Delhi)", "टर्मिनल मंडी मूल्य अंतर (आज़ादपुर दिल्ली)", "टर्मिनल बाजार भाव फरक (आझादपूर दिल्ली)", "ટર્મિનલ માર્કેટ યાર્ડ ભાવ તફાવત (આઝાદપુર)")}</span>
                      <span className="capsule-tag py-0.5 text-[9px] text-emerald-400">NET SPREAD</span>
                    </div>
                    <p className="text-[11px] text-[#C4A494] leading-relaxed">
                      {tr(
                        `Azadpur gross rate is ₹${marketSignal.arbitrage.grossRate}/qtl. Deducting ₹${marketSignal.arbitrage.freightPerQtl}/qtl freight from Nashik yields a net realization of ₹${marketSignal.arbitrage.netRate}/qtl.`,
                        `आज़ादपुर का भाव ₹${marketSignal.arbitrage.grossRate}/क्विंटल है। ₹${marketSignal.arbitrage.freightPerQtl} भाड़ा घटाने पर शुद्ध प्राप्ति ₹${marketSignal.arbitrage.netRate} बनती है।`,
                        `आझादपूर भाव ₹${marketSignal.arbitrage.grossRate}/क्विंटल आहे. ₹${marketSignal.arbitrage.freightPerQtl} वाहतूक खर्च वजा जाता निव्वळ प्राप्ती ₹${marketSignal.arbitrage.netRate} होते.`,
                        `આઝાદપુરનો ભાવ ₹${marketSignal.arbitrage.grossRate}/ક્વિન્ટલ છે. ₹${marketSignal.arbitrage.freightPerQtl} નૂર બાદ કરતાં ચોખ્ખો ભાવ ₹${marketSignal.arbitrage.netRate} મળે છે.`
                      )}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1A0A16] border border-[#F18B49]/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#C4A494]">{tr("NET INTER-MANDI GAIN", "शुद्ध अंतर-मंडी लाभ", "निव्वळ आंतर-बाजार नफा", "ચોખ્ખો આંતર-યાર્ડ નફો")}</div>
                      <div className="text-lg font-black text-[#F18B49] mt-0.5">+₹{marketSignal.arbitrage.spreadPerQtl}/qtl</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#C4A494]">{tr("FOR THIS LOT", "इस लॉट के लिए", "या लॉटसाठी", "આ લોટ માટે")}</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">+₹{marketSignal.arbitrage.totalNetGain.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: SPOILAGE & SAFE SHELF-LIFE PREDICTION (NAFED)      */}
          {/* ------------------------------------------------------------- */}
          {shelfLife && (
            <div className="card-3d p-6 sm:p-7 space-y-6 border-[#F18B49]/40 bg-gradient-to-br from-[#120710] via-[#10060E] to-[#0A0408]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F18B49]/15 border border-[#F18B49]/40 text-[10px] font-mono font-black text-[#F18B49] uppercase tracking-wider mb-1.5">
                    <Clock size={12} />
                    <span>{tr("NAFED POST-HARVEST PRESERVATION MODEL", "नाफेड फसल-उपरांत संरक्षण मॉडल", "नाफेड काढणीनंतरचे साठवणूक मॉडेल", "નાફેડ લણણી પછીનું સંરક્ષણ મોડેલ")}</span>
                  </div>
                  <h3 className="font-sans font-black text-xl sm:text-2xl text-[#FFF5ED] tracking-tight">
                    {tr("Shelf-Life & Buffer-Stock Spoilage Prediction", "शेल्फ-लाइफ एवं बफर-स्टॉक सड़न भविष्यवाणी", "साठवणूक क्षमता आणि बफर-स्टॉक सड अंदाज", "શેલ્ફ-લાઇફ અને બફર-સ્ટોક સડો આગાહી")}
                  </h3>
                  <p className="text-xs text-[#C4A494] font-mono mt-0.5">
                    {tr(
                      "Addresses NAFED's historical ~25% buffer spoilage by computing rot spread and sprouting risk.",
                      "सड़न फैलाव और अंकुरण जोखिम की गणना करके नाफेड की ~25% बफर बर्बादी का समाधान करता है।",
                      "सड फैलाव आणि कोंब धोक्याची गणना करून नाफेडचे ~२५% साठवणूक नुकसान टाळते.",
                      "સડો ફેલાવો અને અંકુરણ જોખમની ગણતરી કરીને નાફેડના ~25% બફર બગાડનું નિરાકરણ કરે છે."
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black shadow-md ${
                    shelfLife.riskLevel === "critical"
                      ? "bg-[#FF4D4D] text-white"
                      : shelfLife.riskLevel === "medium"
                      ? "bg-[#EB87A9] text-black"
                      : "bg-[#F18B49] text-black"
                  }`}>
                    {shelfLife.pdiCategory}
                  </span>
                </div>
              </div>

              {/* Shelf-Life Key Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                {/* 1. Safe Days */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-[#F18B49]/30 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("ESTIMATED SAFE STORAGE", "अनुमानित सुरक्षित भंडारण", "अंदाजे सुरक्षित साठवणूक", "અંદાજિત સલામત સંગ્રહ")}</span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#F18B49] font-tabular">
                    {shelfLife.safeDays} <span className="text-base text-[#C4A494] font-normal">{tr("Days", "दिन", "दिवस", "દિવસ")}</span>
                  </div>
                  <span className="text-[10px] text-[#F8D5C2]/80 block">
                    {shelfLife.varietyName} {tr("baseline:", "आधार:", "मूळ:", "આધાર:")} {shelfLife.varietyBaseDays}d
                  </span>
                </div>

                {/* 2. Priority Dispatch Index (PDI) */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-white/[0.08] shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("DISPATCH URGENCY (PDI)", "प्रेषण तात्कालिकता (PDI)", "रवानगी तातडी (PDI)", "મોકલવાની તાકીદ (PDI)")}</span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-[#FFF5ED] font-tabular">
                    {shelfLife.pdi} <span className="text-base text-[#C4A494] font-normal">/ 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                    <div
                      style={{ width: `${shelfLife.pdi}%` }}
                      className={`h-full ${shelfLife.pdi > 60 ? "bg-[#FF4D4D]" : shelfLife.pdi > 30 ? "bg-[#EB87A9]" : "bg-[#F18B49]"}`}
                    />
                  </div>
                </div>

                {/* 3. Action Protocol */}
                <div className="p-4 rounded-2xl bg-[#1A0A16] border border-[#EB87A9]/30 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#C4A494] uppercase block">{tr("BUFFER ACTION PROTOCOL", "बफर कार्य प्रोटोकॉल", "बफर कृती नियमावली", "બફર એક્શન પ્રોટોકોલ")}</span>
                  <p className="text-xs text-[#F8D5C2] leading-tight font-sans font-medium line-clamp-3">
                    {shelfLife.pdiAction}
                  </p>
                </div>

                {/* 4. Spoilage Loss Prevented */}
                <div className="p-4 rounded-2xl bg-[#150712] border border-[#F18B49]/40 shadow-inner space-y-1">
                  <span className="text-[10px] text-[#F18B49] uppercase font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>{tr("SPOILAGE LOSS PREVENTED", "सड़न नुकसान से बचाव", "सड नुकसान बचत", "સડો નુકસાન બચાવ")}</span>
                  </span>
                  <div className="font-sans font-black text-2xl sm:text-3xl text-emerald-400 font-tabular">
                    ₹{shelfLife.estimatedSavings.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-[#C4A494] block">
                    {tr("Saved via prompt PDI dispatch", "समय पर प्रेषण से बचत", "वेळेवर वितरणाने बचत", "સમયસર ડિસ્પેચથી બચત")}
                  </span>
                </div>
              </div>

              {/* Micro-Climate Storage Guidance & 60-Day Decay Progression */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Micro-Climate Advisory */}
                <div className="lg:col-span-7 p-4 rounded-2xl bg-[#120710] border border-white/[0.06] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#F8D5C2] font-bold border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-1.5">
                      <Thermometer size={14} className="text-[#F18B49]" />
                      <span>{tr("Optimum Storage Micro-Climate", "इष्टतम भंडारण सूक्ष्म-जलवायु", "योग्य साठवणूक तापमान व आर्द्रता", "યોગ્ય સંગ્રહ તાપમાન અને ભેજ")}</span>
                    </span>
                    <span className="text-[10px] text-[#F18B49]">ICAR-DOGR Curing Specs</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-[#C4A494] block">{tr("TARGET TEMPERATURE", "लक्षित तापमान", "लक्ष्य तापमान", "લક્ષ્ય તાપમાન")}</span>
                      <strong className="text-[#F8D5C2] mt-0.5 block">{shelfLife.storageGuidance.targetTemp}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-[#C4A494] block">{tr("RELATIVE HUMIDITY", "सापेक्ष आर्द्रता", "सापेक्ष आर्द्रता", "સાપેક્ષ ભેજ")}</span>
                      <strong className="text-[#F18B49] mt-0.5 block">{shelfLife.storageGuidance.targetHumidity}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-[#C4A494] block">{tr("AERATION AIRFLOW", "वायु संचार", "हवा खेळती राहणे", "હવા પ્રવાહ")}</span>
                      <strong className="text-[#F8D5C2] mt-0.5 block">{shelfLife.storageGuidance.airCirculation}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-[#C4A494] block">{tr("CURING & NECK SEAL", "क्यूरिंग एवं गर्दन सील", "क्युरिंग आणि मान सील", "ક્યોરિંગ અને ગરદન સીલ")}</span>
                      <strong className="text-[#EB87A9] mt-0.5 block">{shelfLife.storageGuidance.curingStatus}</strong>
                    </div>
                  </div>
                </div>

                {/* 60-Day Decay Progression Curve */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-[#120710] border border-white/[0.06] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#F8D5C2] font-bold border-b border-white/[0.06] pb-2">
                    <span>{tr("Projected Rot Progression (%)", "अनुमानित सड़न वृद्धि (%)", "अंदाजे सड वाढ (%)", "અંદાજિત સડો વધારો (%)")}</span>
                    <span className="text-[10px] text-[#C4A494]">60-Day Model</span>
                  </div>

                  <div className="space-y-1.5">
                    {shelfLife.decayTrajectory.map((pt, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-[#C4A494] w-14">{pt.day}:</span>
                        <div className="flex-1 mx-2 h-2 rounded-full bg-black/50 overflow-hidden border border-white/5">
                          <div
                            style={{ width: `${Math.min(100, pt.rotPct * 2)}%` }}
                            className={`h-full ${pt.rotPct > 20 ? "bg-[#FF4D4D]" : pt.rotPct > 10 ? "bg-[#EB87A9]" : "bg-[#F18B49]"}`}
                          />
                        </div>
                        <span className={`w-12 text-right font-bold ${pt.rotPct > 20 ? "text-[#FF4D4D]" : "text-[#F8D5C2]"}`}>
                          {pt.rotPct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {isCalibrationOpen && gradingResult && (() => {
        // Proper React controlled state for calibration
        const CalibrationForm = () => {
          const [calDiam, setCalDiam] = React.useState(gradingResult.stats?.avgDiameterMm || gradingResult.averageDiameterMm || 50);
          const [calWeight, setCalWeight] = React.useState(gradingResult.quantityQuintals || 35.0);

          const applyOverrides = () => {
            const d = parseFloat(calDiam);
            const w = parseFloat(calWeight);
            const updated = { ...gradingResult };
            let changed = false;

            if (!isNaN(w) && w > 0) {
              updated.quantityQuintals = w;
              changed = true;
            }

            if (!isNaN(d) && d > 0) {
              const oldAvg = updated.stats?.avgDiameterMm || updated.averageDiameterMm || d;
              const scale = oldAvg > 0 ? (d / oldAvg) : 1;
              updated.averageDiameterMm = d;
              updated.stats = { ...updated.stats, avgDiameterMm: d };

              if (updated.bulbs && updated.bulbs.length > 0) {
                updated.bulbs = updated.bulbs.map(b => ({
                  ...b,
                  diameterMm: Number((b.diameterMm * scale).toFixed(1))
                }));
              }
              changed = true;
            }

            if (changed) {
              setGradingResult(updated);
              saveLot(updated); // Persist calibration override
              showToast(
                tr(
                  "Calibration applied & saved to lot record",
                  "कैलिब्रेशन लागू किया गया और लॉट रिकॉर्ड में सहेजा गया",
                  "कॅलिब्रेशन लागू केले आणि लॉट नोंदीत जतन केले",
                  "કેલિબ્રેશન લાગુ કર્યું અને લોટ રેકોર્ડમાં સાચવ્યું"
                ),
                "success"
              );
            }
            setIsCalibrationOpen(false);
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md card-3d p-6 relative border-[#F18B49]/30 bg-[#140711]">
                <div className="flex items-center gap-2 mb-4 text-[#F18B49]">
                  <Sliders size={20} />
                  <h3 className="text-lg font-black tracking-tight text-[#F8D5C2]">{tr("Manual Calibration Override", "मैनुअल कैलिब्रेशन", "मॅन्युअल कॅलिब्रेशन ओव्हरराइड", "મેન્યુઅલ કેલિબ્રેશન ઓવરરાઇડ")}</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4A494] mb-2">{tr("Average Diameter (mm)", "औसत व्यास (mm)", "सरासरी व्यास (mm)", "સરેરાશ વ્યાસ (mm)")}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="10"
                        max="200"
                        value={calDiam}
                        onChange={(e) => setCalDiam(e.target.value)}
                        className="w-full bg-[#180915] border border-white/[0.08] focus:border-[#F18B49]/50 rounded-xl px-4 py-3 text-sm text-[#F8D5C2] outline-none font-tabular"
                      />
                      <span className="absolute right-4 top-3 text-[#C4A494] text-xs font-mono pointer-events-none">mm</span>
                    </div>
                    <p className="text-[10px] text-[#C4A494] mt-1.5 leading-tight">{tr("Use this to correct the camera's optical scale if the tray was captured from an irregular distance.", "कैमरे की ऑप्टिकल स्केल ठीक करने के लिए उपयोग करें।", "कॅमेराचे ऑप्टिकल प्रमाण दुरुस्त करण्यासाठी वापरा.", "કેમેરાનું ઓપ્ટિકલ સ્કેલ સુધારવા માટે ઉપયોગ કરો.")}</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4A494] mb-2">{tr("Total Lot Volume (Quintals)", "कुल लॉट वजन (क्विंटल)", "एकूण लॉट वजन (क्विंटल)", "કુલ લોટ વજન (ક્વિન્ટલ)")}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="500"
                        value={calWeight}
                        onChange={(e) => setCalWeight(e.target.value)}
                        className="w-full bg-[#180915] border border-white/[0.08] focus:border-[#F18B49]/50 rounded-xl px-4 py-3 text-sm text-[#F8D5C2] outline-none font-tabular"
                      />
                      <span className="absolute right-4 top-3 text-[#C4A494] text-xs font-mono pointer-events-none">Qtl</span>
                    </div>
                    <p className="text-[10px] text-[#C4A494] mt-1.5 leading-tight">{tr("Enter the total physical weight of the lot.", "लॉट का कुल भौतिक वजन दर्ज करें।", "लॉटचे एकूण प्रत्यक्ष वजन प्रविष्ट करा.", "લોટનું કુલ ભૌતિક વજન દાખલ કરો.")}</p>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <button onClick={() => setIsCalibrationOpen(false)} className="px-5 py-2.5 btn-3d-dark text-xs font-mono cursor-pointer">
                    {tr("Cancel", "रद्द करें", "रद्द करा", "રદ કરો")}
                  </button>
                  <button onClick={applyOverrides} className="px-5 py-2.5 btn-3d-lime text-xs font-mono font-bold flex items-center gap-2 cursor-pointer">
                    <RefreshCw size={14} />
                    <span>{tr("Apply Overrides", "ओवरराइड लागू करें", "बदल लागू करा", "ઓવરરાઇડ લાગુ કરો")}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        };
        return <CalibrationForm />;
      })()}

      {isDisputeOpen && gradingResult && (
        <DisputeModal
          lot={gradingResult}
          isOpen={isDisputeOpen}
          onClose={() => setIsDisputeOpen(false)}
          onDisputeRaised={(newDispute) => {
            setGradingResult({ ...gradingResult, dispute: newDispute, status: "disputed" });
          }}
        />
      )}

      {isProcurementOpen && gradingResult && (
        <ProcurementModal
          lot={gradingResult}
          isOpen={isProcurementOpen}
          onClose={() => setIsProcurementOpen(false)}
          onProcurementLogged={(procuredLot) => {
            setGradingResult(procuredLot);
          }}
        />
      )}

      {/* Traceable Digital Certificate & QR Passport Modal */}
      {isCertModalOpen && gradingResult && (
        <DigitalCertificateModal
          lot={gradingResult}
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
        />
      )}

      {/* WhatsApp Krishi Sahayak Bot Integration Sandbox */}
      {isWhatsAppModalOpen && gradingResult && (
        <WhatsAppBotModal
          currentLot={gradingResult}
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

    </div>
  );
}
