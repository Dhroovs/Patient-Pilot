"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Trash2, 
  Download, 
  Calendar, 
  Clock, 
  Languages, 
  ArrowLeft, 
  Pill, 
  ShieldAlert, 
  MessageSquare,
  Volume2,
  VolumeX,
  HeartPulse,
  Eye,
  X,
  FileText,
  Send,
  RefreshCw
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

export default function History() {
  const [history, setHistory] = useState<Prescription[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<Prescription | null>(null);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchHistory();
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatLoading]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/prescription/history`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to history database.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(`${API_URL}/api/prescription/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setHistory(history.filter(item => item._id !== id));
        if (selectedItem?._id === id) {
          setSelectedItem(null);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    }
  };

  const clearAllHistory = async () => {
    if (!confirm("⚠️ WARNING: This will permanently delete ALL prescription history. Proceed?")) return;

    try {
      const response = await fetch(`${API_URL}/api/prescription/delete-all`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setHistory([]);
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to clear database history.");
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
    if (!chatMessage.trim() || !selectedItem) return;

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
          prescriptionId: selectedItem._id,
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
      setChatHistory([...newHistory, { role: "model", text: "Connection error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const text = item.simplifiedSummary?.toLowerCase() || "";
    const ocr = item.extractedText?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    const matchesMed = item.medicines?.some(m => m.name.toLowerCase().includes(query));
    return text.includes(query) || ocr.includes(query) || matchesMed;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Red guideline margin overlay */}
      <div className="absolute left-[30px] sm:left-[50px] top-0 bottom-0 w-[2px] bg-red-400/35 pointer-events-none" />

      <div className="w-full pl-6 sm:pl-10">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading tracking-tight text-foreground">Scan Archive</h1>
            <p className="text-sm text-muted-foreground font-bold font-body">Revisit or clear previous prescription scans.</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="press-btn wobbly-border border-2 border-red-500 bg-red-500/5 hover:bg-red-500/15 text-red-500 font-bold px-4 py-2 text-xs transition-all cursor-pointer shadow-sm"
            >
              Clear All Records
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-muted-foreground stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search drug names or summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold font-body"
          />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-primary stroke-[2.5]" />
            <p className="text-xs text-muted-foreground font-bold">Accessing catalog drawer...</p>
          </div>
        )}

        {/* Error logs */}
        {error && (
          <div className="wobbly-border border-2 border-dashed border-red-500 bg-red-500/5 p-4 text-red-500 text-xs font-bold max-w-md">
            {error}
          </div>
        )}

        {/* History Catalog Cards Grid */}
        {!loading && !error && (
          filteredHistory.length === 0 ? (
            <div className="text-center py-20 wobbly-border-md border-2 border-dashed border-border bg-card/10 max-w-xl mx-auto space-y-4">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground opacity-30 stroke-[2.5]" />
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm">No Prescriptions Found</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto font-bold font-body">
                  {history.length === 0 
                    ? "Your uploaded prescription history will automatically populate here." 
                    : "No index cards match your search queries."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((item, idx) => {
                const rotClasses = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];
                const rotVal = rotClasses[idx % rotClasses.length];
                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedItem(item);
                      setChatHistory([]);
                      window.speechSynthesis?.cancel();
                    }}
                    className={`wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-5 bg-card/60 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.01] transition-transform relative ${rotVal}`}
                  >
                    {/* Tape decor */}
                    <div className="absolute -top-3 left-1/3 w-10 h-4 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/20 rotate-1 pointer-events-none" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold font-body">
                          <Calendar className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={(e) => deleteRecord(item._id, e)}
                          className="p-1 rounded border border-[#2d2d2d]/25 dark:border-white/20 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-foreground line-clamp-3 leading-relaxed font-body">
                        {item.simplifiedSummary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.medicines?.slice(0, 3).map((med, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-0.5 text-[9px] px-2 py-0.5 wobbly-border border border-[#2d2d2d] dark:border-white bg-[#fff9c4] dark:bg-neutral-800 text-black dark:text-white font-bold"
                          >
                            <Pill className="w-3 h-3 text-primary stroke-[2.5]" />
                            <span>{med.name}</span>
                          </span>
                        ))}
                        {item.medicines && item.medicines.length > 3 && (
                          <span className="text-[9px] text-muted-foreground font-bold px-1.5 py-0.5 rounded border border-[#2d2d2d]/20 bg-secondary">
                            +{item.medicines.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-border/50 pt-3 mt-4 text-[10px] text-muted-foreground font-bold font-body">
                      <div className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                        <span>{item.language}</span>
                      </div>
                      <span className="text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-heading">
                        <span>Details</span>
                        <Eye className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Detail slide drawer modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <div
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 print:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full lg:w-[760px] bg-card border-l-[3px] border-[#2d2d2d] dark:border-white z-50 overflow-y-auto flex flex-col justify-between shadow-2xl print:relative print:w-full print:border-none print:shadow-none"
            >
              {/* Header */}
              <div className="p-4 border-b border-dashed border-[#2d2d2d]/30 dark:border-white/30 flex items-center justify-between print:hidden">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground mr-3 font-heading"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs text-muted-foreground font-bold font-body">({new Date(selectedItem.createdAt).toLocaleDateString()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 border border-[#2d2d2d] dark:border-white hover:bg-secondary/40 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Print"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 border border-[#2d2d2d] dark:border-white hover:bg-secondary/40 rounded-xl text-muted-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Panel */}
              <div className="flex-grow p-6 space-y-6">
                
                {/* Summary card */}
                <div className="wobbly-border-lg border-2 border-[#2d2d2d] dark:border-white p-6 bg-card relative shadow-sm text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.01] rounded-full blur-2xl -z-10" />
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-heading font-extrabold text-lg flex items-center gap-1.5 text-foreground">
                      <HeartPulse className="w-5 h-5 text-primary stroke-[2.5]" />
                      <span>Prescription Scribe Summary</span>
                    </h2>
                    <button
                      onClick={() => speakText("history-summary", selectedItem.simplifiedSummary)}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary/40 text-muted-foreground transition-all print:hidden"
                    >
                      {speakingTextId === "history-summary" ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground font-bold font-body">
                    {selectedItem.simplifiedSummary}
                  </p>
                </div>

                {/* Warnings list */}
                {selectedItem.safetyAlerts && selectedItem.safetyAlerts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pl-1 font-heading">
                      <ShieldAlert className="w-4.5 h-4.5 text-primary animate-pulse" />
                      <span>Safety Dangers ({selectedItem.safetyAlerts.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedItem.safetyAlerts.map((alert, idx) => {
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

                {/* Medicines List cards */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pl-1 font-heading">
                    <Pill className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                    <span>Identified Medicines ({selectedItem.medicines?.length || 0})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedItem.medicines?.map((med, idx) => (
                      <div
                        key={idx}
                        className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-5 bg-[#fff9c4] dark:bg-card/50 text-black dark:text-white flex flex-col justify-between hover:rotate-1 transition-transform shadow-sm relative text-left"
                      >
                        {/* Tape decor */}
                        <div className="absolute -top-3 left-1/3 w-10 h-4 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/20 rotate-1 pointer-events-none" />

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
                            <button
                              onClick={() => speakText(`med-${idx}`, `${med.name}. Dosage is ${med.dosage}. Instruction: ${med.timing}`)}
                              className="p-1 rounded border border-[#2d2d2d]/20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer print:hidden"
                            >
                              {speakingTextId === `med-${idx}` ? <VolumeX className="w-3.5 h-3.5 text-primary" /> : <Volume2 className="w-3.5 h-3.5 text-black" />}
                            </button>
                          </div>
                          <div className="space-y-2 text-xs border-t border-dashed border-[#2d2d2d]/10 pt-2.5 font-bold font-body">
                            <div className="flex gap-1">
                              <span className="text-foreground w-16">Timing:</span>
                              <span className="text-muted-foreground">{med.timing}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="text-foreground w-16">Purpose:</span>
                              <span className="text-muted-foreground">{med.purpose}</span>
                            </div>
                            {med.warnings && (
                              <div className="p-2 wobbly-border border border-dashed border-primary bg-primary/5 text-primary text-[10.5px] leading-normal font-bold mt-2">
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

              {/* Chat panel context sandbox */}
              <div className="border-t-2 border-dashed border-[#2d2d2d]/30 p-4 bg-muted/20 print:hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-bold font-heading">
                    <MessageSquare className="w-4 h-4 text-primary stroke-[2.5]" />
                    <span>Query this record catalog</span>
                  </div>
                  {chatHistory.length > 0 && (
                    <button
                      onClick={() => setChatHistory([])}
                      className="text-[10px] font-bold text-red-500 hover:text-red-400"
                    >
                      Clear Chats
                    </button>
                  )}
                </div>

                <div className="max-h-[160px] overflow-y-auto space-y-3 mb-3 p-3 bg-card border-2 border-[#2d2d2d] dark:border-white wobbly-border-md">
                  {chatHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4 font-bold font-body">
                      No follow-up questions asked yet. Ask about dosage warnings or directions.
                    </p>
                  ) : (
                    chatHistory.map((chat, idx) => (
                      <div
                        key={idx}
                        className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] wobbly-border border border-[#2d2d2d] px-3 py-1.5 text-xs font-bold leading-normal font-body ${
                            chat.role === "user"
                              ? "bg-primary text-white border-primary"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {chat.text}
                        </div>
                      </div>
                    ))
                  )}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="px-3 py-1.5 rounded-xl border border-dashed border-primary bg-primary/5 text-primary text-[10px] flex items-center gap-1.5 font-bold">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Generating...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask dosage questions..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendChatMessage();
                    }}
                    className="flex-1 px-3 py-2 bg-card border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold font-body"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="px-3.5 py-2 wobbly-border border-2 border-[#2d2d2d] bg-primary text-white cursor-pointer flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
