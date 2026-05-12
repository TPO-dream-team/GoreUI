import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock3, MessageSquare, Mountain, TrendingUp, Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

type BoardCardProps = {
  mountainName: string;
  mountainHeight: number;
  date: string;
  duration: string;
  organizer: string;
  description: string;
  difficulty: number;
  onChatClick?: () => void;
  hideCommentButton?: boolean;
};

function BoardCard({
  mountainName,
  mountainHeight,
  date,
  duration,
  organizer,
  description,
  difficulty,
  onChatClick,
  hideCommentButton,
}: BoardCardProps) {
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

  // Helper to determine difficulty color
  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return "text-[#2f6b4f] bg-[#edf8ee] border-[#bcd8c2]";
    if (diff <= 4) return "text-[#c7792b] bg-[#fff7eb] border-[#efd0a8]";
    return "text-[#b2473e] bg-[#fff4f2] border-[#ecc1bb]";
  };

  const getDifficultyLabel = (diff: number) => {
    if (diff <= 2) return "Easy";
    if (diff <= 4) return "Moderate";
    return "Difficult";
  };

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <Card className="w-[380px] overflow-hidden border border-[#dce3d7] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        {/* Mountain-inspired gradient header */}
        <div className="h-2 bg-gradient-to-r from-[#2f6b4f] via-[#316f8f] to-[#c7792b]" />
        
        <CardContent className="p-0">
          <div className="p-5">
            {/* Header with organizer */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#647067]">Organiser</p>
                  <p className="font-semibold text-[#17231b] text-sm">{organizer}</p>
                </div>
              </div>
              {!hideCommentButton && onChatClick && (
                <Button
                  onClick={onChatClick}
                  variant="ghost"
                  className="text-[#316f8f] hover:text-[#225c76] hover:bg-[#eef8fc] rounded-full gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Comments</span>
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-[#344255] italic text-base leading-relaxed">
                "{description}"
              </p>
            </div>

            {/* Mountain name and height - centered */}
            <div className="text-center mb-5 pt-2 border-t border-[#e5eadf]">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-[#f0f4ea]">
                <Mountain className="w-6 h-6 text-[#2f6b4f]" />
              </div>
              <p className="text-2xl font-bold text-[#17231b]">{mountainName}</p>
              <p className="text-lg font-semibold text-[#316f8f]">{mountainHeight} m</p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-[#e5eadf]">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbfcf8] border border-[#dce3d7]">
                <Calendar className="w-4 h-4 text-[#c7792b]" />
                <span className="text-sm text-[#344255]">{date}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbfcf8] border border-[#dce3d7]">
                <Clock3 className="w-4 h-4 text-[#316f8f]" />
                <span className="text-sm text-[#344255]">{duration} h</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getDifficultyColor(difficulty)}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{getDifficultyLabel(difficulty)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Old Style (Original Design)
  return (
    <Card className="w-[350px] bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
      <CardContent className="px-6 pb-3 pt-3">
        <div className="flex min-h-[350px] flex-col justify-between rounded-2xl bg-white p-6">
          <div>
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="text-base font-semibold text-black">
                <p>Organiser:</p>
                <p>
                  {organizer} <span className="text-sm text-zinc-500">• 12 peaks</span>
                </p>
              </div>

              {!hideCommentButton && onChatClick && (
                <Button onClick={onChatClick}>Comment</Button>
              )}
            </div>

            <p className="break-words text-base italic font-bold text-zinc-700">
              "{description}"
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-black">⛰️ {mountainName}</p>
            <p className="mt-3 text-2xl font-medium text-zinc-700">
              {mountainHeight} m
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start justify-center gap-23">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2 font-medium">
              <Calendar className="h-5 w-5" />
              <span>{date}</span>
            </div>

            <div className="rounded-full bg-zinc-300 px-3 py-2 text-base font-medium">
              Difficulty: {difficulty}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2 text-base font-medium">
            <Clock3 className="h-5 w-5" />
            <span>{duration}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BoardCard;