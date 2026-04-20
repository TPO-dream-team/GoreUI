import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/utility/axios";

interface Comment {
    id: number;
    createdBy: string;
    message: string;
    username: string;
    timeStamp: string; 
}

interface Post {
    id: string;
    username: string;
    tagline: string;
    startMsg: string;
    mountainName?: string;
    timeStamp: string;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

function ChatCommentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const canSubmit = commentText.trim().length > 0 && !isSubmitting;

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [postRes, commentRes] = await Promise.all([
                api.get(`/post/${id}`),
                api.get(`/post/${id}/comments`)
            ]);
            setPost(postRes.data);
            setComments(commentRes.data);
        } catch (err) {
            console.error("Error fetching discussion:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!canSubmit) return;

        try {
            setIsSubmitting(true);
            await api.post(`/post/${id}/comments`, { message: commentText });
            setCommentText(""); 

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            const response = await api.get(`/post/${id}/comments`);
            setComments(response.data);
        } catch (err) {
            console.error("Failed to post comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-cyan-900">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <main className="w-full md:max-w-2xl flex flex-col min-h-screen bg-cyan-900 shadow-md">
                
                <header className="p-4 border-b flex items-center gap-4 bg-white sticky top-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold text-gray-800">Post Discussion</h1>
                </header>

                <section className="flex-1 p-4 overflow-y-auto space-y-4">
                    {post && (
                        <div className="p-4 border rounded-lg shadow-sm bg-white border-blue-200 ring-1 ring-blue-50/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900">@{post.username}</span>
                                    {post.mountainName && (
                                        <span className="text-blue-600 text-[10px] uppercase bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                                            {post.mountainName}
                                        </span>
                                    )}
                                </span>
                                {/* Updated to use real post timestamp */}
                                <span className="text-sm text-gray-500">{formatDate(post.timeStamp)}</span>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.tagline}</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{post.startMsg}</p>
                        </div>
                    )}

                    <div className="pt-4 pb-2">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Comments</h3>
                    </div>

                    <div className="space-y-3">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentItem 
                                    key={comment.id} 
                                    username={comment.username} 
                                    text={comment.message} 
                                    time={comment.timeStamp} 
                                />
                            ))
                        ) : (
                            <p className="text-cyan-200 text-center text-sm py-4">No comments yet.</p>
                        )}
                    </div>
                </section>

                <footer className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                    <div className="flex gap-2 items-center">
                        <Input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                            className="flex-1 bg-gray-50 border-gray-200 focus:ring-blue-500"
                        />
                        <Button 
                            size="icon" 
                            onClick={handlePostComment}
                            disabled={!canSubmit}
                            className={`rounded-full shrink-0 transition-all duration-200 ${
                                canSubmit 
                                ? "bg-blue-600 hover:bg-blue-700 opacity-100 shadow-md" 
                                : "bg-gray-300 opacity-50 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className={`w-4 h-4 ${canSubmit ? "text-white" : "text-gray-500"}`} />
                            )}
                        </Button>
                    </div>
                    {showSuccess && <p className="text-red-500">Your comment was successfully posted.</p>}
                </footer>
            </main>
        </div>
    );
}

function CommentItem({ username, text, time }: { username: string, text: string, time: string }) {
    return (
        <div className="p-3 bg-white/95 rounded-lg shadow-sm ml-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-600 text-sm">@{username}</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase">
                    {formatTime(time)}
                </span>
            </div>
            <p className="text-gray-700 text-sm">{text}</p>
        </div>
    );
}

export default ChatCommentPage;

