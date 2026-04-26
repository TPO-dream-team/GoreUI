import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utility/axios";

export interface Comment {
  id: number;
  createdBy: string;
  message: string;
  username: string;
  timeStamp: string;
}

export interface Post {
  id: string;
  username: string;
  tagline: string;
  startMsg: string;
  mountainName?: string;
  timeStamp: string;
}

export const useChatCommentPage = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const canSubmit = commentText.trim().length > 0 && !isSubmitting;

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [postRes, commentRes] = await Promise.all([
        api.get(`/post/${id}`),
        api.get(`/post/${id}/comments`),
      ]);
      setPost(postRes.data);
      setComments(commentRes.data);
    } catch (err) {
      console.error("Error fetching discussion:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePostComment = async () => {
    if (!canSubmit || !id) return;

    try {
      setIsSubmitting(true);
      await api.post(`/post/${id}/comments`, { message: commentText });
      setCommentText("");

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Refresh comments
      const response = await api.get(`/post/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      post,
      comments,
      loading,
      commentText,
      isSubmitting,
      showSuccess,
      canSubmit,
    },
    actions: {
      setCommentText,
      handlePostComment,
      refreshData: fetchData,
    },
  };
};