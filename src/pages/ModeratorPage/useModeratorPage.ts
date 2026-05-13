import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
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

export function useModerator() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  const [moderationItem, setModerationItem] = useState<ModerationItem | null>(
    null
  );
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
      window.removeEventListener(
        "styleToggle",
        handleStyleToggle as EventListener
      );
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
        api.get("/moderator/ambiguous").catch((err) => {
          if (err.response?.status === 404) return { data: null };
          throw err;
        }),
        api.get("/moderator/metrics"),
      ]);

      const item = ambiguousResponse.data;

      if (!item || (!item.id && !item.messageId)) {
        setModerationItem(null);
        setMetrics(metricsResponse.data);
        return;
      }

      setModerationItem({
        id: item.id ?? item.messageId ?? "-",
        username: item.username ?? "unknown",
        category: item.category ?? item.type ?? "Content",
        content:
          item.message ?? item.msg ?? item.content ?? item.text ?? "",
        timestamp:
          item.timestamp ?? item.timeStamp ?? item.createdAt ?? new Date().toISOString(),
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

  return {
    state: {
      useNewStyle,
      moderationItem,
      metrics,
      loading,
      actionLoading,
      error,
      f1,
      precision,
      recall,
      isEmpty,
      itemId,
      username,
      category,
      timestamp,
      confidence,
      reason,
      content,
    },
    actions: {
      handleTrain,
    },
  };
}