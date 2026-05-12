import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, MessageSquare, User, Calendar, Clock, Mountain, AlertCircle, CheckCircle2 } from "lucide-react";
import { useChatCommentPage } from "./useChatCommentPage";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("sl-SI", { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("sl-SI", { hour: '2-digit', minute: '2-digit' });
};

function ChatCommentPage() {
  const navigate = useNavigate();
  const { state, actions } = useChatCommentPage();
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

  // New Style (Mountain Theme)
  if (useNewStyle) {
    if (state.loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#2f6b4f] animate-spin" />
            <p className="text-[#647067] text-sm">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <main className="w-full max-w-3xl mx-auto flex flex-col min-h-screen">
          
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-[#dce3d7] px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full text-[#647067] hover:text-[#2f6b4f] hover:bg-[#f0f4ea]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#17231b]">Post discussion</h1>
                  <p className="text-xs text-[#647067]">Community comments</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <section className="flex-1 p-4 overflow-y-auto space-y-5">
            {/* Original Post */}
            {state.post && (
              <div className="bg-white rounded-xl border border-[#dce3d7] shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#2f6b4f] to-[#316f8f]" />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/profile/${state.post?.userId}`)}
                          className="font-semibold text-[#17231b] text-sm hover:text-[#2f6b4f] hover:underline"
                        >
                          @{state.post.username}
                        </button>
                        {state.post.mountainName && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Mountain className="w-3 h-3 text-[#2f6b4f]" />
                            <span className="text-[#2f6b4f] text-[10px] uppercase font-semibold bg-[#edf8ee] px-2 py-0.5 rounded-full">
                              {state.post.mountainName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#647067]">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(state.post.timeStamp)}</span>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-[#17231b] mb-2">{state.post.tagline}</h2>
                  <p className="text-[#344255] text-sm leading-relaxed">{state.post.startMsg}</p>
                </div>
              </div>
            )}

            {/* Comments Section Header */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <MessageSquare className="w-4 h-4 text-[#2f6b4f]" />
              <h3 className="text-sm font-semibold text-[#17231b] uppercase tracking-wider">
                Comments ({state.comments.length})
              </h3>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {state.comments.length > 0 ? (
                state.comments.map((comment) => (
                  <CommentItemNew 
                    key={comment.id} 
                    username={comment.username} 
                    text={comment.message} 
                    time={comment.timeStamp}
                    onUserClick={() => navigate(`/profile/${comment.createdBy}`)} 
                  />
                ))
              ) : (
                <div className="text-center py-8 bg-[#fbfcf8] rounded-lg border border-dashed border-[#c9d4c5]">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f4ea] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#647067]" />
                  </div>
                  <p className="text-[#647067] text-sm">There are no comments yet.</p>
                  <p className="text-xs text-[#647067] mt-1">Be the first to comment!</p>
                </div>
              )}
            </div>
          </section>

          {/* Footer - Add Comment */}
          <footer className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-[#dce3d7] p-4">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Write a comment..."
                value={state.commentText}
                onChange={(e) => actions.setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && actions.handlePostComment()}
                className="flex-1 border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg bg-white"
              />
              <Button 
                size="icon" 
                onClick={actions.handlePostComment}
                disabled={!state.canSubmit}
                className={`rounded-full shrink-0 transition-all duration-200 ${
                  state.canSubmit 
                    ? "bg-[#2f6b4f] hover:bg-[#214b39] shadow-sm" 
                    : "bg-[#c9d4c5] cursor-not-allowed"
                }`}
              >
                {state.isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {state.showSuccess && (
              <div className="flex items-center gap-2 mt-2 text-[#2f6b4f] text-xs bg-[#edf8ee] p-2 rounded-lg">
                <CheckCircle2 className="w-3 h-3" />
                <span>Your comment has been successfully posted.</span>
              </div>
            )}
          </footer>
        </main>
      </div>
    );
  }

  // Old Style (Original Design)
  if (state.loading) {
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
          {state.post && (
            <div className="p-4 border rounded-lg shadow-sm bg-white border-blue-200 ring-1 ring-blue-50/50">
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/profile/${state.post?.userId}`)}
                    className="font-bold text-gray-900 hover:underline"
                  >
                    @{state.post.username}
                  </button>
                  {state.post.mountainName && (
                    <span className="text-blue-600 text-[10px] uppercase bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                      {state.post.mountainName}
                    </span>
                  )}
                </span>
                <span className="text-sm text-gray-500">{formatDate(state.post.timeStamp)}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{state.post.tagline}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{state.post.startMsg}</p>
            </div>
          )}

          <div className="pt-4 pb-2">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Comments</h3>
          </div>

          <div className="space-y-3">
            {state.comments.length > 0 ? (
              state.comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  username={comment.username} 
                  text={comment.message} 
                  time={comment.timeStamp} 
                  onUserClick={() => navigate(`/profile/${comment.createdBy}`)}
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
              value={state.commentText}
              onChange={(e) => actions.setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && actions.handlePostComment()}
              className="flex-1 bg-gray-50 border-gray-200 focus:ring-blue-500"
            />
            <Button 
              size="icon" 
              onClick={actions.handlePostComment}
              disabled={!state.canSubmit}
              className={`rounded-full shrink-0 transition-all duration-200 ${
                state.canSubmit 
                ? "bg-blue-600 hover:bg-blue-700 opacity-100 shadow-md" 
                : "bg-gray-300 opacity-50 cursor-not-allowed"
              }`}
            >
              {state.isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className={`w-4 h-4 ${state.canSubmit ? "text-white" : "text-gray-500"}`} />
              )}
            </Button>
          </div>
          {state.showSuccess && (
            <p className="text-red-500 text-xs mt-2">Your comment was successfully posted.</p>
          )}
        </footer>
      </main>
    </div>
  );
}

// New Style Comment Item
function CommentItemNew({ username,  text, time, onUserClick }: { username: string, text: string, time: string,  onUserClick: () => void; }) {
  return (
    <div className="bg-white rounded-lg border border-[#e5eadf] shadow-sm hover:shadow-md transition-all ml-0">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <button
              type = "button"
              onClick={onUserClick}
              className="font-semibold text-[#17231b] text-sm hover:text-[#2f6b4f] hover:underline"
            >
              @{username}
            </button>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#647067] font-medium">
            <Clock className="w-3 h-3" />
            <span>{formatTime(time)}</span>
          </div>
        </div>
        <p className="text-[#344255] text-sm leading-relaxed pl-8">{text}</p>
      </div>
    </div>
  );
}

// Old Style Comment Item
function CommentItem({ username, text, time, onUserClick }: { username: string, text: string, time: string, onUserClick?: () => void }) {
  return (
    <div className="p-3 bg-white/95 rounded-lg shadow-sm ml-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-center mb-1">
        <button
          type = "button"
          onClick={onUserClick}
          className="font-semibold text-[#17231b] text-sm hover:text-[#2f6b4f] hover:underline"
        >
          @{username}
        </button>
        <span className="text-[10px] text-gray-400 font-medium uppercase">
          {formatTime(time)}
        </span>
      </div>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  );
}

export default ChatCommentPage;