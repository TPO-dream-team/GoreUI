import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Info, Mountain, Clock, User, Tag, AlertCircle, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/utility/axios";

type ModerationItem = {
  id: number | string;
  username: string;
  category: string;
  content: string;
  timestamp: string;
  aiConfidence: number;
  reason: string;
};

type ModelMetrics = {
  f1Score?: number | string;
  precision?: number | string;
  recall?: number | string;
  trainingExamples?: number | string;
  testExamples?: number | string;
};

function ModeratorPage() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  const [moderationItem, setModerationItem] = useState<ModerationItem | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function loadModerationData() {
    try {
      setLoading(true);
      setError("");

      const [ambiguousResponse, metricsResponse] = await Promise.all([
        api.get("/moderator/ambiguous").catch(err => {
          if (err.response?.status === 404) return { data: null }; // da ne vrze napake ko ni vec za moderirat
          throw err; 
        }),
        api.get("/moderator/metrics"),
      ]);

      const item = ambiguousResponse.data;

      if (!item || !item.id && !item.messageId) {
        setModerationItem(null);
        setMetrics(metricsResponse.data);
        return;
      }

      setModerationItem({
        id: item.id ?? item.messageId ?? "-",
        username: item.username ?? "unknown",
        category: item.category ?? item.type ?? "Content",
        content: item.message ?? item.msg ?? item.content ?? item.text ?? "",
        timestamp: item.timestamp ?? item.timeStamp ?? item.createdAt ?? new Date().toISOString(),
        aiConfidence: Number(
          item.confidencePercentage ??
            item.aiConfidence ??
            item.confidence ??
            item.probability ??
            0
        ),
        reason: item.reason ?? "possible spam content",
      });

      setMetrics(metricsResponse.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error while loading moderation."
      );
    } finally {
      setLoading(false);
    }
  }

   useEffect(() => {
    loadModerationData();
  }, []);

  async function handleTrain(isSpam: boolean) {
    if (!moderationItem) return;

    try {
      setActionLoading(true);
      setError("");

      await api.post("/moderator/train", null, {
        params: {
          messageId: moderationItem.id,
          isSpam,
        },
      });

      await loadModerationData();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Error while saving decision."
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Loading moderation...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  const f1 = Number(metrics?.f1Score ?? 0).toFixed(2);
  const precision = Number(metrics?.precision ?? 0).toFixed(2);
  const recall = Number(metrics?.recall ?? 0).toFixed(2);
  const isEmpty = !moderationItem;
  const itemId = moderationItem?.id ?? "-";
  const username = moderationItem?.username ?? "unknown";
  const category = moderationItem?.category ?? "-";
  const timestamp = moderationItem?.timestamp ?? new Date().toISOString();
  const confidence = moderationItem?.aiConfidence ?? 0;
  const reason = moderationItem?.reason ?? "possible spam content";
  const content = moderationItem?.content ?? "";

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
            <h1 className="text-2xl md:text-3xl font-bold text-[#17231b]">Content moderation</h1>
            <p className="text-[#647067] mt-2 text-sm max-w-md mx-auto">
              Review content flagged by the AI moderator
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#dce3d7] shadow-md overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-[#b2473e]/10 to-[#c7792b]/10 border-b border-[#ecc1bb]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#b2473e] flex items-center justify-center">
                    <ShieldAlert className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-[#b2473e] uppercase tracking-wider">
                    Pending review
                  </span>
                </div>
                <span className="text-xs text-[#647067] flex items-center gap-1">
                  <Clock className="w-3 h-3" />#{itemId }
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#fbfcf8] border-b border-[#e5eadf] text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-[#647067]" />
                <span className="text-[#647067]">From:</span>
                <span className="font-semibold text-[#2f6b4f]">@{username}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#edf8ee]">
                <Tag className="w-3 h-3 text-[#2f6b4f]" />
                <span className="text-[10px] font-bold text-[#2f6b4f] uppercase">
                  Category: {category}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#647067]" />
                <span className="text-[#647067]">
                  {new Date(timestamp).toLocaleDateString("sl-SI")}
                </span>
              </div>
            </div>

            <div className="p-6 bg-white border-b border-[#e5eadf] min-h-[90px] flex items-center justify-center">
              {isEmpty ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#f0f4ea] border border-[#dce3d7] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#647067]" />
                  </div>
                  <p className="text-sm text-[#647067]">No new content to moderate</p>
                </div>
              ) : (
                <p className="text-[#344255] text-base leading-relaxed italic">
                  "{content}"
                </p>
              )}
            </div>

            <div className="p-3 bg-[#f0f4ea] border-b border-[#dce3d7]">
              <div className="flex items-center justify-center gap-2">
                <Info size={14} className="text-[#316f8f]" />
                <p className="text-xs text-[#316f8f]">
                  AI is <span className="font-bold">{confidence}%</span>{" "}
                  confident this is {reason}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white border-b border-[#e5eadf]">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#647067] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#316f8f]" />
                  <span>F1: <span className="font-bold text-[#2f6b4f]">{f1}</span></span>
                </div>
                <span>Precision: <span className="font-bold text-[#2f6b4f]">{precision}</span></span>
                <span>Recall: <span className="font-bold text-[#2f6b4f]">{recall}</span></span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 bg-gradient-to-r from-[#b2473e]/5 to-[#c7792b]/5">
              <Button
                disabled={actionLoading || isEmpty}
                onClick={() => handleTrain(true)}
                variant="destructive"
                className="h-12 text-sm font-bold bg-[#b2473e] hover:bg-[#96362d] rounded-lg flex gap-2 shadow-sm active:scale-95 transition-all"
              >
                <ShieldAlert size={18} />
                REJECT
              </Button>
              <Button
                disabled={actionLoading || isEmpty}
                onClick={() => handleTrain(false)}
                className="h-12 text-sm font-bold rounded-lg bg-[#2f6b4f] hover:bg-[#214b39] flex gap-2 shadow-sm active:scale-95 transition-all"
              >
                <ShieldCheck size={18} />
                APPROVE
              </Button>
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

            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b text-[11px] text-gray-500 font-medium">
              <div className="flex gap-1">
                <span>From:</span>
                <span className="text-cyan-700 font-bold">@{username}</span>
              </div>
              <div className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">
                Category: {category}
              </div>
              <div className="flex gap-1">
                <span>At:</span>
                <span className="text-gray-700">
                  {new Date(timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-8 flex items-center justify-center border-b overflow-y-auto max-h-[40vh] bg-white">
              {isEmpty ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-gray-400" />
                  <p className="text-sm text-gray-400">No new content to moderate</p>
                </div>
              ) : (
                <p className="text-lg md:text-xl text-gray-800 text-center italic leading-relaxed">
                  "{content}"
                </p>
              )}
            </div>

            {/* Confidence Info */}
            <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
              <Info size={14} className="text-blue-400" />
              <p className="text-xs text-blue-600">
                AI is <span className="font-bold">{confidence}%</span> confident that this is spam
              </p>
            </div>

            {/* Metrics */}
            <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
              <div className="flex gap-3 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>F1: <span className="font-bold text-blue-600">{f1}</span></span>
                <span>Precision: <span className="font-bold text-blue-600">{precision}</span></span>
                <span>Recall: <span className="font-bold text-blue-600">{recall}</span></span>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 shrink-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
              <Button
                disabled={actionLoading || isEmpty}
                onClick={() => handleTrain(true)}
                variant="destructive"
                className="h-12 text-sm font-bold bg-red-500 hover:bg-red-600 rounded-lg flex gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <ShieldAlert size={18} />
                SPAM
              </Button>
              <Button
                disabled={actionLoading || isEmpty}
                onClick={() => handleTrain(false)}
                className="h-12 text-sm font-bold rounded-lg bg-green-600 hover:bg-green-700 flex gap-2 shadow-sm active:scale-95 transition-transform"
              >
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