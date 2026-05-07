import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Info, Mountain, Clock, User, Tag, AlertCircle, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

function ModeratorPage() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("useNewStyle");
    setUseNewStyle(saved !== null ? saved === "true" : true);

    const handleStyleToggle = (event: CustomEvent) => {
      setUseNewStyle(event.detail.useNewStyle);
    };

    window.addEventListener("styleToggle", handleStyleToggle as EventListener);
    return () => {
      window.removeEventListener("styleToggle", handleStyleToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    if (outletContext?.useNewStyle !== undefined) {
      setUseNewStyle(outletContext.useNewStyle);
    }
  }, [outletContext]);

  // Mock data for demonstration (would come from props/state in real implementation)
  const moderationItem = {
    id: "m1",
    username: "planinec123",
    category: "Tura",
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat nesciunt ad neque sunt quisquam culpa ducimus aperiam accusamus modi ea. Pot na Triglav je bila zaradi snežišč zahtevna, priporočam dereze in cepin.",
    timestamp: "2026-05-03T14:30:00",
    aiConfidence: 69,
    metrics: {
      f1: 0.82,
      precision: 0.85,
      recall: 0.79
    },
    reason: "Možna žaljiva vsebina"
  };

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-xl bg-gradient-to-br from-[#b2473e] to-[#c7792b] shadow-lg">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#17231b]">Moderacija vsebin</h1>
            <p className="text-[#647067] mt-2 text-sm max-w-md mx-auto">
              Pregled vsebin, ki jih je označil AI moderator
            </p>
          </div>

          {/* Queue Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-[#dce3d7] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[#c7792b]">3</div>
              <div className="text-xs text-[#647067]">Čaka na pregled</div>
            </div>
            <div className="bg-white border border-[#dce3d7] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[#2f6b4f]">12</div>
              <div className="text-xs text-[#647067]">Odobrene danes</div>
            </div>
            <div className="bg-white border border-[#dce3d7] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-[#b2473e]">4</div>
              <div className="text-xs text-[#647067]">Zavrnjene danes</div>
            </div>
          </div>

          {/* Moderation Card */}
          <div className="bg-white rounded-xl border border-[#dce3d7] shadow-md overflow-hidden">
            
            {/* Status Header */}
            <div className="px-5 py-3 bg-gradient-to-r from-[#b2473e]/10 to-[#c7792b]/10 border-b border-[#ecc1bb]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#b2473e] flex items-center justify-center">
                    <ShieldAlert className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#b2473e] uppercase tracking-wider">
                    Čaka na pregled
                  </span>
                </div>
                <span className="text-xs text-[#647067] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  #{moderationItem.id}
                </span>
              </div>
            </div>

            {/* Meta Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#fbfcf8] border-b border-[#e5eadf] text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-[#647067]" />
                <span className="text-[#647067]">Od:</span>
                <span className="font-semibold text-[#2f6b4f]">@{moderationItem.username}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#edf8ee]">
                <Tag className="w-3 h-3 text-[#2f6b4f]" />
                <span className="text-[10px] font-bold text-[#2f6b4f] uppercase">
                  Kategorija: {moderationItem.category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#647067]" />
                <span className="text-[#647067]">
                  {new Date(moderationItem.timestamp).toLocaleDateString("sl-SI")}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white border-b border-[#e5eadf]">
              <p className="text-[#344255] text-base leading-relaxed italic">
                "{moderationItem.content}"
              </p>
            </div>

            {/* AI Confidence */}
            <div className="p-3 bg-[#f0f4ea] border-b border-[#dce3d7]">
              <div className="flex items-center justify-center gap-2">
                <Info size={14} className="text-[#316f8f]" />
                <p className="text-xs text-[#316f8f]">
                  AI je <span className="font-bold">{moderationItem.aiConfidence}%</span> prepričan, da gre za {moderationItem.reason}
                </p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="p-3 bg-white border-b border-[#e5eadf]">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-[#647067] flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Stopnja tveganja
                </span>
                <span className="font-semibold text-[#c7792b]">{moderationItem.aiConfidence}%</span>
              </div>
              <div className="h-2 bg-[#e5eadf] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2f6b4f] via-[#c7792b] to-[#b2473e] rounded-full transition-all duration-500"
                  style={{ width: `${moderationItem.aiConfidence}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="p-3 bg-white border-b border-[#e5eadf]">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#647067] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#316f8f]" />
                  <span>F1: <span className="font-bold text-[#2f6b4f]">{moderationItem.metrics.f1}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Natančnost: <span className="font-bold text-[#2f6b4f]">{moderationItem.metrics.precision}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Priklice: <span className="font-bold text-[#2f6b4f]">{moderationItem.metrics.recall}</span></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-gradient-to-r from-[#b2473e]/5 to-[#c7792b]/5">
              <Button
                variant="destructive"
                className="h-12 text-sm font-bold bg-[#b2473e] hover:bg-[#96362d] rounded-lg flex gap-2 shadow-sm active:scale-95 transition-all"
              >
                <ShieldAlert size={18} />
                ZAVRNI
              </Button>
              <Button className="h-12 text-sm font-bold rounded-lg bg-[#2f6b4f] hover:bg-[#214b39] flex gap-2 shadow-sm active:scale-95 transition-all">
                <ShieldCheck size={18} />
                ODOBRI
              </Button>
            </div>
          </div>

          {/* AI Learning Info */}
          <div className="mt-6 p-4 bg-[#f0f4ea] rounded-xl border border-[#dce3d7]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#316f8f] to-[#2f6b4f] flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-[#17231b] text-sm mb-1">Učenje AI modela</h4>
                <p className="text-[#647067] text-xs leading-relaxed">
                  Vaše odločitve se samodejno dodajo v učni nabor. Ko zberemo 10 novih komentarjev, se model ponovno nauči za izboljšanje natančnosti.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#dce3d7] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2f6b4f] rounded-full" style={{ width: "64%" }} />
                  </div>
                  <span className="text-xs font-medium text-[#2f6b4f]">6/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Old Style (Original Design)
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col items-center justify-center h-full overflow-hidden relative">

        <section className="w-full md:max-w-xl flex flex-col p-4 z-10 pb-30">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-cyan-800/20">

            {/* Header Meta */}
            <div className="p-2 border-b text-center shrink-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Pending Review
              </span>
            </div>

            {/* New User/Time/Category Meta Bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b text-[11px] text-gray-500 font-medium">
              <div className="flex gap-1">
                <span>From:</span>
                <span className="text-cyan-700 font-bold">@{moderationItem.username}</span>
              </div>
              <div className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">
                Category: {moderationItem.category}
              </div>
              <div className="flex gap-1">
                <span>At:</span>
                <span className="text-gray-700">{new Date(moderationItem.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8 flex items-center justify-center border-b overflow-y-auto max-h-[40vh] bg-white">
              <p className="text-lg md:text-xl text-gray-800 text-center italic leading-relaxed">
                "{moderationItem.content}"
              </p>
            </div>

            {/* Confidence Info */}
            <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
              <Info size={14} className="text-blue-400" />
              <p className="text-xs text-blue-600">
                AI is <span className="font-bold">{moderationItem.aiConfidence}%</span> confident that this is spam
              </p>
            </div>

            {/* Metrics */}
            <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
              <div className="flex gap-3 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>F1: <span className="font-bold text-blue-600">{moderationItem.metrics.f1}</span></span>
                <span>Precision: <span className="font-bold text-blue-600">{moderationItem.metrics.precision}</span></span>
                <span>Recall: <span className="font-bold text-blue-600">{moderationItem.metrics.recall}</span></span>
              </div>
            </div>

            {/* Integrated Action Buttons */}
            <div className="p-4 grid grid-cols-2 gap-3 shrink-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
              <Button
                variant="destructive"
                className="h-12 text-sm font-bold bg-red-500 hover:bg-red-600 rounded-lg flex gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <ShieldAlert size={18} />
                SPAM
              </Button>
              <Button className="h-12 text-sm font-bold rounded-lg bg-green-600 hover:bg-green-700 flex gap-2 shadow-sm active:scale-95 transition-transform">
                <ShieldCheck size={18} />
                SAFE
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ModeratorPage;