import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Info,
  Clock,
  User,
  Tag,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useModerator } from "./useModeratorPage";

function ModeratorPage() {
  const { state, actions } = useModerator();
  const {
    useNewStyle,
    loading,
    error,
    actionLoading,
    isEmpty,
    itemId,
    category,
    timestamp,
    confidence,
    reason,
    content,
    f1,
    precision,
    recall,
  } = state;
  const { handleTrain } = actions;

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-600">Loading moderation...</div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-xl bg-gradient-to-br from-brand-danger to-brand-warning shadow-lg">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-headline">
            Content moderation
          </h1>
          <p className="text-brand-body mt-2 text-sm max-w-md mx-auto">
            Review content flagged by the AI moderator
          </p>
        </div>

        <div className="bg-white rounded-xl border border-brand-border/60 shadow-md overflow-hidden">
          {/* Alert Header State */}
          <div className="px-5 py-3 bg-gradient-to-r from-brand-danger/10 to-brand-warning/10 border-b border-brand-danger/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-danger flex items-center justify-center">
                  <ShieldAlert className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-bold text-brand-danger uppercase tracking-wider">
                  Pending review
                </span>
              </div>
              <span className="text-xs text-brand-body flex items-center gap-1">
                <Clock className="w-3 h-3" />#{itemId}
              </span>
            </div>
          </div>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-brand-nested-bg/30 border-b border-brand-border/40 text-xs">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-accent-sage">
              <Tag className="w-3 h-3 text-brand-primary" />
              <span className="text-[10px] font-bold text-brand-primary uppercase">
                Category: {category}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-body" />
              <span className="text-brand-body">
                {new Date(timestamp).toLocaleDateString("sl-SI")}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 bg-white border-b border-brand-border/40 min-h-[90px] flex items-center justify-center">
            {isEmpty ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-accent-sage/40 border border-brand-border/40 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-brand-body" />
                </div>
                <p className="text-sm text-brand-body">
                  No new content to moderate
                </p>
              </div>
            ) : (
              <p className="text-brand-slate text-base leading-relaxed italic">
                "{content}"
              </p>
            )}
          </div>

          {/* AI Intelligence Insights */}
          <div className="p-3 bg-brand-nested-bg border-b border-brand-border/60">
            <div className="flex items-center justify-center gap-2">
              <Info size={14} className="text-brand-hover-blue" />
              <p className="text-xs text-brand-hover-blue">
                AI is <span className="font-bold">{confidence}%</span> confident
                this is {reason}
              </p>
            </div>
          </div>

          {/* Performance Statistics Metrics */}
          <div className="p-3 bg-white border-b border-brand-border/40">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-brand-body uppercase tracking-wider">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-brand-hover-blue" />
                <span>
                  F1: <span className="font-bold text-brand-primary">{f1}</span>
                </span>
              </div>
              <span>
                Precision:{" "}
                <span className="font-bold text-brand-primary">{precision}</span>
              </span>
              <span>
                Recall:{" "}
                <span className="font-bold text-brand-primary">{recall}</span>
              </span>
            </div>
          </div>

          {/* Action Tray */}
          <div className="p-4 grid grid-cols-2 gap-3 bg-gradient-to-r from-brand-danger/5 to-brand-warning/5">
            <Button
              disabled={actionLoading || isEmpty}
              onClick={() => handleTrain(true)}
              variant="destructive"
              className="h-12 text-sm font-bold bg-brand-danger hover:bg-brand-danger/90 text-white rounded-button flex gap-2 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldAlert size={18} />
              REJECT
            </Button>
            <Button
              disabled={actionLoading || isEmpty}
              onClick={() => handleTrain(false)}
              className="h-12 text-sm font-bold rounded-button bg-brand-primary hover:bg-brand-hover-green text-white flex gap-2 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-sm text-gray-400">
                    No new content to moderate
                  </p>
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
                AI is <span className="font-bold">{confidence}%</span> confident
                that this is spam
              </p>
            </div>

            {/* Metrics */}
            <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
              <div className="flex gap-3 text-[10px] text-gray-500 uppercase tracking-wider">
                <span>
                  F1: <span className="font-bold text-blue-600">{f1}</span>
                </span>
                <span>
                  Precision:{" "}
                  <span className="font-bold text-blue-600">{precision}</span>
                </span>
                <span>
                  Recall:{" "}
                  <span className="font-bold text-blue-600">{recall}</span>
                </span>
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