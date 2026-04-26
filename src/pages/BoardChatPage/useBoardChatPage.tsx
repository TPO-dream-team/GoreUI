import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import api from "@/utility/axios";
import type { RootState, AppDispatch } from "@/utility/store";
import { fetchGore } from "@/utility/stores_slices/goreSlice";

export type BoardDetails = {
  id: string;
  expiryDate: string;
  userId: string;
  mountainId: string;
  description: string;
  tourTime: number;
  difficulty: number;
};

export type ChatMessage = {
  id: number;
  boardId: string;
  userId: string;
  username: string;
  msg: string;
  timestamp: string;
};

export const useBoardChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const organizerFromState = (location.state as { organizer?: string } | null)?.organizer;
  const { gore } = useSelector((state: RootState) => state.mountain);

  const [board, setBoard] = useState<BoardDetails | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  const [loadingBoard, setLoadingBoard] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sending, setSending] = useState(false);
  const [boardError, setBoardError] = useState("");
  const [commentError, setCommentError] = useState("");

  const mountain = gore?.find(
    (gora) => String(gora.id) === String(board?.mountainId)
  );

  useEffect(() => {
    dispatch(fetchGore());
  }, [dispatch]);

  const loadBoard = async () => {
    if (!id) return;
    try {
      setLoadingBoard(true);
      const response = await api.get(`/boards/${id}`);
      setBoard(response.data);
    } catch (err: any) {
      setBoardError(err.response?.data?.message || "Error while loading board.");
    } finally {
      setLoadingBoard(false);
    }
  };

  const loadMessages = async () => {
    if (!id) return;
    try {
      setLoadingMessages(true);
      const response = await api.get(`/boards/${id}/chats`);
      setMessages(response.data ?? []);
    } catch (err: any) {
      setCommentError(err.response?.data?.message || "Error while loading comments.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadBoard();
    loadMessages();
  }, [id]);

  const handleSendMessage = async () => {
    if (!id) return;

    const trimmed = message.trim();
    if (!trimmed) {
      setCommentError("Write the comment first.");
      return;
    }

    try {
      setSending(true);
      setCommentError("");
      await api.post(`/boards/${id}/chats`, {
        Message: trimmed,
      });
      setMessage("");
      await loadMessages();
    } catch (err: any) {
      setCommentError(err.response?.data?.message || "Error while sending message.");
    } finally {
      setSending(false);
    }
  };

  return {
    state: {
      board,
      messages,
      message,
      loadingBoard,
      loadingMessages,
      sending,
      boardError,
      commentError,
      mountain,
      organizerFromState,
    },
    actions: {
      setMessage,
      handleSendMessage,
      loadMessages,
    },
  };
};