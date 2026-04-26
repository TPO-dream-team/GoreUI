import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utility/axios";
import type { AppDispatch, RootState } from "@/utility/store";
import type { Gora } from "@/utility/stores_slices/goreSlice";

export const LIMIT = 5;

export const useChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mountainRef = useRef<HTMLDivElement>(null);

  // Board State
  const [boards, setBoards] = useState<any[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState("");
  const [offset, setOffset] = useState(0);

  // Form State
  const [mountainQuery, setMountainQuery] = useState("");
  const [mountainSuggestion, setmountainSuggestion] = useState(false);
  const [selectedMountainId, setSelectedMountainId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Redux State
  const { gore, loading: mountainsLoading, error: mountainsError } = useSelector(
    (state: RootState) => state.mountain
  );

  // Handle outside clicks for autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mountainRef.current && !mountainRef.current.contains(event.target as Node)) {
        setmountainSuggestion(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logic
  const filteredMountains = useMemo(() => {
    if (!gore) return [];
    const query = mountainQuery.trim().toLowerCase();
    if (!query) return gore.slice(0, 5);
    const matches = gore.filter((gora) => gora.name.toLowerCase().includes(query));
    return matches.slice(0, 5);
  }, [gore, mountainQuery]);

  const loadBoards = async () => {
    try {
      setBoardsLoading(true);
      setBoardsError("");
      const response = await api.get("/post", {
        params: { offset, limit: LIMIT },
      });
      setBoards(response.data ?? []);
    } catch (err: any) {
      setBoardsError(err.response?.data?.message || "Error while loading posts.");
    } finally {
      setBoardsLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [offset]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setOffset((prev) => prev + LIMIT);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setOffset((prev) => Math.max(0, prev - LIMIT));
  };

  const handleSelectMountain = (gora: Gora) => {
    setSelectedMountainId(String(gora.id));
    setMountainQuery(gora.name);
    setmountainSuggestion(false);
  };

  const handleMountainQueryChange = (value: string) => {
    setMountainQuery(value);
    setmountainSuggestion(true);
    setSelectedMountainId("");
  };

  const handlePostSubmit = async () => {
    setValidationError("");

    if (!title.trim() || !content.trim()) {
      setValidationError("Post title and Content are required.");
      return;
    }

    let finalMountainId = selectedMountainId;
    if (mountainQuery.trim() !== "" && !finalMountainId) {
      const exactMatch = gore?.find(
        (g) => g.name.toLowerCase() === mountainQuery.toLowerCase().trim()
      );
      if (exactMatch) {
        finalMountainId = String(exactMatch.id);
      } else {
        setValidationError("Please select a valid mountain from the list.");
        return;
      }
    }

    try {
      const payload = {
        tagline: title,
        startMsg: content,
        mountainId: finalMountainId ? finalMountainId : null,
      };

      await api.post("/post/new", payload);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setTitle("");
      setContent("");
      setMountainQuery("");
      setSelectedMountainId("");
      setIsDialogOpen(false);
      loadBoards();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create post. Try again.";
      setValidationError(errorMsg);
    }
  };

  return {
    state: {
      boards, boardsLoading, boardsError, offset,
      mountainQuery, mountainSuggestion, selectedMountainId,
      title, content, validationError, showSuccess, isDialogOpen,
      filteredMountains, mountainRef
    },
    actions: {
      setOffset, setMountainQuery, setmountainSuggestion,
      setTitle, setContent, setIsDialogOpen,
      handleNext, handlePrevious, handleSelectMountain,
      handleMountainQueryChange, handlePostSubmit
    }
  };
};