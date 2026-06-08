"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Upload, 
  FileText, 
  Pill, 
  ShieldAlert, 
  MessageSquare, 
  Volume2, 
  VolumeX,
  Languages, 
  Download, 
  Camera, 
  Activity, 
  ArrowLeft, 
  Sparkles,
  RefreshCw,
  Edit2,
  Check,
  Send,
  X,
  Clock,
  HeartPulse,
  Brain
} from "lucide-react";

interface Medicine {
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
  sideEffects: string[];
  warnings: string;
  interactions: string;
  confidenceScore: number;
}

interface SafetyAlert {
  type: "interaction" | "overdose" | "duplicate" | "warning";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
}

interface Prescription {
  _id: string;
  extractedText: string;
  simplifiedSummary: string;
  language: string;
  imagePath: string;
  medicines: Medicine[];
  safetyAlerts: SafetyAlert[];
  createdAt: string;
}

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "Hindi (हिन्दी)" },
  { code: "Tamil", name: "Tamil (தமிழ்)" },
  { code: "Telugu", name: "Telugu (తెలుగు)" },
  { code: "Bengali", name: "Bengali (বাংলা)" },
  { code: "Arabic", name: "Arabic (العربية)" },
  { code: "Spanish", name: "Spanish (Español)" }
];

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedLanguage, setSelectedLanguage] = useState("English");
  
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [isEditingOcr, setIsEditingOcr] = useState(false);

  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
        setError(null);
      } else {
        setError("Only image files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    setPrescription(null);
    setError(null);
    setChatHistory([]);
    window.speechSynthesis?.cancel();
  };

  const startAnalysis = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setScanStep("Translating handwritten details...");

    const formData = new FormData();
    formData.append("prescription", file);
    formData.append("language", selectedLanguage);

    try {
      const timers = [
        setTimeout(() => setScanStep("Scribing chemical index lookup..."), 2000),
        setTimeout(() => setScanStep("Cross-referencing safety alerts..."), 4000),
        setTimeout(() => setScanStep("Formulating patient guidelines..."), 6000),
      ];

      const response = await fetch(`${API_URL}/api/prescription/upload`, {
        method: "POST",
        body: formData,
      });

      timers.forEach(t => clearTimeout(t));

      const data = await response.json();

      if (data.success && data.prescription) {
        setPrescription(data.prescription);
        setOcrText(data.prescription.extractedText);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      } else {
        setError(data.message || "Failed to parse prescription.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server. Ensure Express API is listening.");
    } finally {
      setLoading(false);
      setScanStep("");
    }
  };

  const speakText = (textId: string, textContent: string) => {
    if (speakingTextId === textId) {
      window.speechSynthesis.cancel();
      setSpeakingTextId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textContent.replace(/[^\w\s\d,.]/gi, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingTextId(null);
    utterance.onerror = () => setSpeakingTextId(null);

    setSpeakingTextId(textId);
    window.speechSynthesis.speak(utterance);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !prescription) return;

    const query = chatMessage;
    setChatMessage("");
    const newHistory = [...chatHistory, { role: "user" as const, text: query }];
    setChatHistory(newHistory);
    setChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/prescription/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId: prescription._id,
          message: query,
          chatHistory: newHistory.map(h => ({
            role: h.role,
            text: h.text
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory([...newHistory, { role: "model", text: data.response }]);
      } else {
        setChatHistory([...newHistory, { role: "model", text: "Error fetching AI response." }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory([...newHistory, { role: "model", text: "Connection error. Chat desk offline." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* Decorative Red margin line */}
      <div className="absolute left-[30px] sm:left-[50px] top-0 bottom-0 w-[2px] bg-red-400/35 pointer-events-none" />

      <div className="w-full flex flex-col items-center print:p-0 relative z-10 pl-6 sm:pl-10">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8 print:hidden">
          <h1 className="text-3xl sm:text-4xl font-heading tracking-tight text-foreground">
            PatientPilot AI Portal
          </h1>
          <p className="text-sm text-muted-foreground font-bold font-body">
            {prescription ? "Review your parsed prescription details and consult warnings." : "Provide your handwritten medical notes to translate chemical structures."}
          </p>
        </div>

        {/* Uploader / Upload & Preview Pane */}
        {!prescription && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white bg-card p-6 md:p-8 relative shadow-md hard-shadow-md"
          >
            {/* Tack pin decor */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <div className="flex flex-col space-y-6">
              {/* Language Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-heading">
                  <Languages className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                  <span>Translate explanations to</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`wobbly-border border-2 px-3 py-1.5 text-xs font-bold text-center transition-all cursor-pointer ${
                        selectedLanguage === lang.code 
                          ? "bg-[#fff9c4] dark:bg-[#fff9a6] text-black border-[#2d2d2d] dark:border-white shadow-sm scale-102 rotate-1" 
                          : "bg-card border-border hover:bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag Dropzone */}
              {!previewUrl ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`wobbly-border border-[3px] border-dashed p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    dragActive 
                      ? "border-primary bg-primary/5 rotate-1" 
                      : "border-[#2d2d2d] dark:border-white bg-card/40 hover:bg-secondary/25 hover:rotate-1"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-11 h-11 rounded-full border-2 border-[#2d2d2d] dark:border-white flex items-center justify-center mb-3 bg-card">
                    <Upload className="w-5 h-5 text-primary stroke-[2.5]" />
                  </div>
                  <p className="font-heading font-bold text-sm text-center mb-1">
                    Drag and drop prescription image
                  </p>
                  <p className="text-xs text-muted-foreground text-center mb-4 font-semibold font-body">
                    Supports PNG, JPEG up to 10MB
                  </p>
                  
                  {/* Camera Snap */}
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      className="press-btn wobbly-border border-2 border-[#2d2d2d] dark:border-white px-4 py-1.5 bg-card hover:bg-secondary/30 text-foreground text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-muted-foreground stroke-[2.5]" />
                      <span>Take Photo</span>
                    </button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                /* File preview details */
                <div className="space-y-4">
                  <div className="relative wobbly-border-md border-2 border-[#2d2d2d] dark:border-white overflow-hidden aspect-[4/3] max-h-[300px] bg-black/40 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Prescription preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/15">
                    <div className="flex items-center gap-2 font-bold font-body text-foreground">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="truncate max-w-[200px]">{file?.name}</span>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Error logs */}
              {error && (
                <div className="wobbly-border border-2 border-dashed border-red-500 bg-red-500/5 p-3.5 text-xs font-bold text-red-500">
                  {error}
                </div>
              )}

              {/* Action trigger button */}
              {previewUrl && (
                <button
                  onClick={startAnalysis}
                  className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white w-full py-3.5 text-base font-bold text-white bg-primary hover:-rotate-1 shadow-md hard-shadow font-heading"
                >
                  Analyze Prescription
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Scanning status/Loading indicator card */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white bg-card p-8 text-center flex flex-col items-center justify-center space-y-6 aspect-[4/3] shadow-md hard-shadow-md"
          >
            {/* Tack pin decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm" />

            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-primary animate-spin" style={{ animationDuration: '6s' }} />
              <div className="w-14 h-14 rounded-full border-2 border-[#2d2d2d] dark:border-white flex items-center justify-center bg-[#fff9c4] dark:bg-neutral-800 text-black dark:text-white shadow-sm">
                <Brain className="w-6 h-6 animate-pulse text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-foreground">Scribing Prescription Details</h3>
              <p className="text-xs text-primary font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{scanStep}</span>
              </p>
            </div>
            <div className="w-full max-w-xs h-3 border-2 border-[#2d2d2d] dark:border-white bg-muted rounded-full overflow-hidden p-0.5">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: "5%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Results Analysis View */}
        {prescription && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 print:block"
          >
            {/* Left: original image, editable OCR pane, download buttons */}
            <div className="lg:col-span-1 space-y-6 print:hidden">
              <button
                onClick={clearSelection}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-4 font-heading"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                <span>Back to uploader</span>
              </button>

              {/* Upload image */}
              <div className="wobbly-border-md border-2 border-[#2d2d2d] dark:border-white overflow-hidden bg-black/40 aspect-[4/3] flex items-center justify-center shadow-sm">
                <img
                  src={`${API_URL}${prescription.imagePath}`}
                  alt="Original prescription"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* OCR edit text box */}
              <div className="wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-5 bg-card space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 font-heading">
                    <FileText className="w-4 h-4 text-primary stroke-[2.5]" />
                    <span>Raw OCR Sketch</span>
                  </h3>
                  <button
                    onClick={() => setIsEditingOcr(!isEditingOcr)}
                    className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 font-heading"
                  >
                    {isEditingOcr ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </div>
                
                {isEditingOcr ? (
                  <textarea
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                    className="w-full h-32 p-3 text-xs bg-muted border-2 border-[#2d2d2d] wobbly-border focus:outline-none focus:ring-1 focus:ring-primary font-mono text-foreground"
                  />
                ) : (
                  <div className="max-h-32 overflow-y-auto p-3 bg-muted/40 rounded-xl text-xs leading-relaxed text-muted-foreground font-mono whitespace-pre-wrap border border-dashed border-border/50">
                    {ocrText || "No text read."}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => window.print()}
                  className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white py-3 px-4 bg-secondary text-white font-bold rounded-xl text-xs shadow-sm hard-shadow-sm font-heading"
                >
                  <Download className="w-4 h-4 inline-block mr-1 stroke-[2.5]" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white py-3 px-4 bg-primary text-white font-bold rounded-xl text-xs shadow-sm hard-shadow-sm font-heading"
                >
                  <MessageSquare className="w-4 h-4 inline-block mr-1 stroke-[2.5]" />
                  <span>Ask Health Assistant</span>
                </button>
              </div>
            </div>

            {/* Right: summaries, alerts, identified medicines */}
            <div className="lg:col-span-2 space-y-6 print:w-full">
              
              {/* Summary Post-it page */}
              <div className="wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white p-6 bg-card relative shadow-md hard-shadow-md text-left">
                {/* Tack pin decor */}
                <div className="absolute -top-3 left-10 w-4.5 h-4.5 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm" />

                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-heading font-extrabold text-lg flex items-center gap-1.5 text-foreground">
                    <HeartPulse className="w-5 h-5 text-primary stroke-[2.5]" />
                    <span>Prescription Scribe Summary</span>
                  </h2>
                  <button
                    onClick={() => speakText("summary", prescription.simplifiedSummary)}
                    className="p-1.5 rounded-lg border border-border hover:bg-secondary/40 text-muted-foreground transition-all cursor-pointer print:hidden"
                  >
                    {speakingTextId === "summary" ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground font-bold font-body">
                  {prescription.simplifiedSummary}
                </p>
              </div>

              {/* Safety alerts */}
              {prescription.safetyAlerts && prescription.safetyAlerts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pl-1 font-heading">
                    <ShieldAlert className="w-4.5 h-4.5 text-primary animate-pulse" />
                    <span>Safety Alerts ({prescription.safetyAlerts.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {prescription.safetyAlerts.map((alert, idx) => {
                      const colorMap = {
                        high: "border-red-500 bg-red-500/5 text-red-500 dark:text-red-400",
                        medium: "border-[#ffaa00] bg-[#ffaa00]/5 text-[#ffaa00]",
                        low: "border-secondary bg-secondary/5 text-secondary"
                      };
                      return (
                        <div
                          key={idx}
                          className={`wobbly-border border-2 p-4 flex gap-3 items-start font-bold ${colorMap[alert.severity || "medium"]}`}
                        >
                          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 stroke-[2.5]" />
                          <div className="space-y-1 text-left">
                            <div className="font-heading text-sm text-foreground">{alert.title}</div>
                            <p className="text-xs text-muted-foreground font-semibold font-body leading-relaxed">{alert.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Identified medicines list */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pl-1 font-heading">
                  <Pill className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                  <span>Scribed Medicines ({prescription.medicines?.length || 0})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-1">
                  {prescription.medicines?.map((med, idx) => (
                    <div
                      key={idx}
                      className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-5 bg-[#fff9c4] dark:bg-card/50 text-black dark:text-white flex flex-col justify-between hover:rotate-1 transition-transform shadow-sm relative group text-left"
                    >
                      {/* Tape decor */}
                      <div className="absolute -top-3 left-1/3 w-10 h-4 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/30 rotate-2 pointer-events-none" />

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-heading font-bold text-base flex items-center gap-1 text-foreground">
                              <Pill className="w-4 h-4 text-primary" />
                              <span>{med.name}</span>
                            </h4>
                            <span className="text-[10px] text-muted-foreground font-semibold border-b border-dashed border-[#2d2d2d]/30 pb-0.5">
                              Dosage: {med.dosage}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => speakText(`med-${idx}`, `${med.name}. Dosage size ${med.dosage}. Instruction is ${med.timing}`)}
                              className="p-1 rounded border border-[#2d2d2d]/25 opacity-60 hover:opacity-100 transition-opacity cursor-pointer print:hidden"
                            >
                              {speakingTextId === `med-${idx}` ? <VolumeX className="w-3 h-3 text-primary" /> : <Volume2 className="w-3 h-3 text-black" />}
                            </button>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              med.confidenceScore >= 85 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                                : "bg-amber-500/10 border-amber-500/30 text-amber-600"
                            }`}>
                              {med.confidenceScore}% AI
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs border-t border-dashed border-[#2d2d2d]/20 pt-2.5 font-bold font-body">
                          <div className="flex gap-1">
                            <span className="text-foreground w-16">Timing:</span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                              {med.timing}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-foreground w-16">Purpose:</span>
                            <span className="text-muted-foreground">{med.purpose}</span>
                          </div>
                          {med.sideEffects && med.sideEffects.length > 0 && (
                            <div className="flex gap-1">
                              <span className="text-foreground w-16">Effects:</span>
                              <span className="text-muted-foreground italic text-[11px]">
                                {med.sideEffects.join(", ")}
                              </span>
                            </div>
                          )}
                          {med.warnings && (
                            <div className="p-2 wobbly-border border border-dashed border-primary bg-primary/5 text-primary text-[10.5px] leading-normal font-bold">
                              {med.warnings}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button for Chat */}
      {prescription && !isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 wobbly-border border-[3px] border-[#2d2d2d] dark:border-white bg-primary text-white shadow-md hard-shadow hover:scale-105 transition-transform cursor-pointer print:hidden"
        >
          <MessageSquare className="w-5 h-5 stroke-[2.5]" />
        </motion.button>
      )}

      {/* AI Health Assistant Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && prescription && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-40 print:hidden"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-card border-l-[3px] border-[#2d2d2d] dark:border-white z-50 flex flex-col justify-between shadow-2xl print:hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-dashed border-[#2d2d2d]/30 dark:border-white/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#2d2d2d] dark:border-white bg-primary/10 flex items-center justify-center">
                    <Activity className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">Health Assistant Chat</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Decipher compound schedules safely</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg border border-border hover:bg-secondary/40 text-muted-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* History logs */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <MessageSquare className="w-10 h-10 text-muted-foreground opacity-30 stroke-[2.5]" />
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-sm">Ask PatientPilot Assistant</h4>
                      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-bold font-body">
                        Ask follow-up questions about dosage schedules, timings, missed doses, or interactions safely.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 w-full pt-4 font-bold font-body">
                      {[
                        "Can I take these medicines before food?",
                        "What should I do if I miss a dose?",
                        "Is it safe to consume alcohol with this therapy?"
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => {
                            setChatMessage(chip);
                            sendChatMessage();
                          }}
                          className="px-3.5 py-2 wobbly-border border-2 border-[#2d2d2d] dark:border-white hover:border-primary text-xs text-left bg-muted/20 text-muted-foreground hover:bg-[#fff9c4] dark:hover:bg-neutral-800 hover:text-foreground transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] wobbly-border border-2 border-[#2d2d2d] dark:border-white px-3 py-2 text-xs font-bold leading-normal font-body ${
                          chat.role === "user"
                            ? "bg-primary text-white border-primary"
                            : "bg-card text-foreground"
                        }`}
                      >
                        {chat.text}
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="px-3.5 py-2 wobbly-border border-2 border-dashed border-primary bg-primary/5 text-primary text-[10px] flex items-center gap-1.5 font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-dashed border-[#2d2d2d]/30 dark:border-white/30 bg-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage();
                  }}
                  className="flex gap-2 relative items-center"
                >
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask dosage questions..."
                    className="flex-1 px-4 py-2.5 bg-muted border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary pr-10 text-foreground font-semibold font-body"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-1.5 rounded-lg bg-primary text-white cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                <div className="text-[10px] text-center text-muted-foreground/60 mt-3 flex items-center justify-center gap-1 leading-snug font-bold">
                  <ShieldAlert className="w-3 h-3 text-amber-500/70 stroke-[2.5]" />
                  <span>AI chat is educational. Always verify compound schedules with doctors.</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
