import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/utility/store";
import { fetchGore, type Gora } from "@/utility/stores_slices/goreSlice";
import api from "@/utility/axios";

export type BackendBoard = {
  boardId: string;
  expiryDate: string;
  username: string;
  userId: string;
  mountainId: string;
  description: string;
  tourTime: number;
  difficulty: number;
};

export const useBoardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux State
  const { gore, loading: mountainsLoading } = useSelector(
    (state: RootState) => state.mountain
  );

  // UI State
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState<BackendBoard[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState("");
  const [creatingBoard, setCreatingBoard] = useState(false);

  // Form State
  const [selectedMountainId, setSelectedMountainId] = useState("");
  const [mountainQuery, setMountainQuery] = useState("");
  const [mountainSuggestion, setmountainSuggestion] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchGore());
    loadBoards();
  }, [dispatch]);

  const loadBoards = async () => {
    try {
      setBoardsLoading(true);
      setBoardsError("");
      const response = await api.get("/boards");
      setBoards(response.data ?? []);
    } catch (err: any) {
      setBoardsError(err.response?.data?.message || err.response?.data || "Error while loading tours.");
    } finally {
      setBoardsLoading(false);
    }
  };

  const selectedMountain = useMemo(
    () => gore?.find((gora) => String(gora.id) === String(selectedMountainId)) ?? null,
    [gore, selectedMountainId]
  );

  const filteredMountains = useMemo(() => {
    if (!gore) return [];
    const query = mountainQuery.trim().toLowerCase();
    const matches = query
      ? gore.filter((gora) => gora.name.toLowerCase().includes(query))
      : gore;
    return matches.slice(0, 5);
  }, [gore, mountainQuery]);

  const resetForm = () => {
    setSelectedMountainId("");
    setMountainQuery("");
    setmountainSuggestion(false);
    setDescription("");
    setDate("");
    setDuration("");
    setDifficulty("");
    setFormError("");
  };

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleMountainQueryChange = (value: string) => {
    setMountainQuery(value);
    setmountainSuggestion(true);
    if (!value.trim()) setSelectedMountainId("");
  };

  const handleSelectMountain = (gora: Gora) => {
    setSelectedMountainId(String(gora.id));
    setMountainQuery(gora.name);
    setmountainSuggestion(false);
    setFormError("");
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 150) setDescription(value);
  };

  const validateForm = () => {
    if (!selectedMountainId) return "Select mountain from the list.";
    if (Number(difficulty) > 5 || Number(difficulty) < 1) return "Select appropriate difficulty.";
    if (!description.trim() || !date || !duration.trim() || !difficulty.trim()) {
      return "Please fill the whole form.";
    }
    return null;
  };

  const handleCreatePost = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setCreatingBoard(true);
      setFormError("");
      await api.post("/boards", {
        description: description.trim(),
        difficulty: Number(difficulty),
        expiryDate: date,
        mountainId: selectedMountainId,
        tourTime: Number(duration),
      });
      await loadBoards();
      resetForm();
      setOpen(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.response?.data || "Error while saving the board.");
    } finally {
      setCreatingBoard(false);
    }
  };

  return {
    state: {
      open, boards, boardsLoading, boardsError, creatingBoard,
      selectedMountainId, mountainQuery, mountainSuggestion,
      description, date, duration, difficulty, formError,
      filteredMountains, selectedMountain, gore
    },
    actions: {
      setOpen, setDate, setDuration, setDifficulty,
      setmountainSuggestion, handleDialogChange,
      handleMountainQueryChange, handleSelectMountain,
      handleDescriptionChange, handleCreatePost
    }
  };
};

