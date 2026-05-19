import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import api from "@/utility/axios";

type UserProfileDto = {
  user: {
    id: string;
    username: string;
  };
  scans: {
    id: number | string;
    userId: string;
    mountainId: string;
    timestamp: string;
    mountainName?: string;
    mountainHeight?: number;
  }[];
};

type UserBoardDto = {
  boardId: string;
  expiryDate: string;
  username: string;
  userId: string;
  mountainId: string;
  description: string;
  tourTime: number | string;
  difficulty: number | string;
};

type UserPostDto = {
  id: number | string;
  tagline: string;
  username: string;
  mountainName: string;
  commentCount: number | string;
  startMsg: string;
  timeStamp: string;
};

export function useUserProfile() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const { id } = useParams<{ id: string }>();

  const [useNewStyle, setUseNewStyle] = useState(true);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [boards, setBoards] = useState<UserBoardDto[]>([]);
  const [posts, setPosts] = useState<UserPostDto[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setError("Missing user id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [profileResponse, boardsResponse, postsResponse] = await Promise.all([
          api.get(`/user/${id}/profile`),
          api.get(`/user/${id}/boards`),
          api.get("/post"),
        ]);

        const loadedProfile = profileResponse.data;

        setProfile(loadedProfile);
        setBoards(boardsResponse.data ?? []);
        setPosts(
          (postsResponse.data ?? []).filter(
            (post: UserPostDto) => post.username === loadedProfile.user.username
          )
        );
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  const userScans = useMemo(() => {
    return (profile?.scans ?? [])
      .map((scan) => ({
        scanId: scan.id,
        mountainId: scan.mountainId,
        mountainName: scan.mountainName ?? "Unknown mountain",
        mountainHeight: scan.mountainHeight ?? 0,
        verifiedAt: scan.timestamp,
        difficulty: 1,
      }))
      .sort(
        (a, b) =>
          new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime()
      );
  }, [profile]);

  const userBoards = useMemo(() => {
    return boards
      .map((board) => ({
        ...board,
        mountainName: "Unknown mountain",
        difficulty: Number(board.difficulty),
        tourTime: Number(board.tourTime),
      }))
      .sort(
        (a, b) =>
          new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
      );
  }, [boards]);

  const userPosts = useMemo(() => {
    return posts.sort(
      (a, b) =>
        new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
    );
  }, [posts]);

  const totalSummits = userScans.length;
  const uniqueSummits = useMemo(() => {
    return new Set(userScans.map((a) => a.mountainId)).size;
  }, [userScans]);

  const lastAchievement = userScans[0] ?? null;

  const highestPeak = useMemo(() => {
    return (
      [...userScans].sort((a, b) => b.mountainHeight - a.mountainHeight)[0] ??
      null
    );
  }, [userScans]);

  const mostClimbed = useMemo(() => {
    const counts = userScans.reduce<
      Record<string, { name: string; count: number }>
    >((acc, item) => {
      if (!acc[item.mountainId]) {
        acc[item.mountainId] = {
          name: item.mountainName,
          count: 0,
        };
      }
      acc[item.mountainId].count += 1;
      return acc;
    }, {});

    return (
      Object.values(counts).sort((a, b) => b.count - a.count)[0] ?? null
    );
  }, [userScans]);

  const averageDifficulty = useMemo(() => {
    if (!userBoards.length) return "0.0";
    const sum = userBoards.reduce((acc, item) => acc + item.difficulty, 0);
    return (sum / userBoards.length).toFixed(1);
  }, [userBoards]);

  const derivedLevel = getExperienceLevel(totalSummits);

  return {
    state: {
      useNewStyle,
      profile,
      boards,
      posts,
      loading,
      error,
      userScans,
      userBoards,
      userPosts,
      totalSummits,
      uniqueSummits,
      lastAchievement,
      highestPeak,
      mostClimbed,
      averageDifficulty,
      derivedLevel,
    },
    actions: {},
  };
}

function getExperienceLevel(totalSummits: number) {
  if (totalSummits >= 20) return "Expert";
  if (totalSummits >= 10) return "Advanced";
  if (totalSummits >= 5) return "Intermediate";
  return "Beginner";
}