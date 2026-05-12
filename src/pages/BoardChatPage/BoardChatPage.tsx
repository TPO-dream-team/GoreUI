import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BoardCard from "@/components/common/BoardCard";
import { useBoardChatPage } from "./useBoardChatPage";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Send, User, Clock, AlertCircle, Loader2 } from "lucide-react";

function BoardChatPage() {
  const navigate = useNavigate();
  const { state, actions } = useBoardChatPage();
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

  // Helper to format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} h ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("sl-SI");
  };

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#dce3d7]">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/board")}
                className="text-[#647067] hover:text-[#2f6b4f] hover:bg-[#f0f4ea] rounded-lg gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to tours
              </Button>
              <div className="h-6 w-px bg-[#dce3d7]" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-[#17231b]">Tour comments</h1>
              </div>
            </div>
          </div>

          {/* Error State */}
          {state.boardError && (
            <div className="mb-6 flex items-center gap-2 text-[#b2473e] bg-[#fff4f2] p-3 rounded-lg border border-[#ecc1bb]">
              <AlertCircle className="w-5 h-5" />
              <span>{state.boardError}</span>
            </div>
          )}

          {/* Board Card */}
          {state.board && (
            <div className="mb-8 flex justify-center">
              <BoardCard
                mountainName={state.mountain?.name ?? "Unknown mountain"}
                mountainHeight={state.mountain?.height ?? 0}
                date={state.board.expiryDate}
                duration={String(state.board.tourTime)}
                organizer={state.organizerFromState ?? "Unknown organizer"}
                description={state.board.description}
                difficulty={state.board.difficulty}
                onOrganizerClick={() => navigate(`/profile/${state.board?.userId}`)}
                onChatClick={undefined}
                hideCommentButton
              />
            </div>
          )}

          {/* Comments Section */}
          <div className="rounded-xl border border-[#dce3d7] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#fbfcf8] px-5 py-3 border-b border-[#dce3d7]">
              <h2 className="text-base font-semibold text-[#17231b] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2f6b4f]" />
                Comments
                {state.messages.length > 0 && (
                  <span className="text-xs text-[#647067] font-normal ml-1">
                    ({state.messages.length})
                  </span>
                )}
              </h2>
            </div>

            <div className="p-5">
              {state.loadingMessages ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin h-6 w-6 text-[#2f6b4f]" />
                  <span className="ml-3 text-[#647067]">Loading comments...</span>
                </div>
              ) : state.messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f0f4ea] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#647067]" />
                  </div>
                  <p className="text-[#647067]">No comments yet.</p>
                  <p className="text-sm text-[#647067] mt-1">Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.messages.map((chat) => (
                    <div
                      key={chat.id}
                      className="bg-[#fbfcf8] rounded-lg border border-[#e5eadf] p-4 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(`/profile/${chat.userId}`)}
                            className="font-semibold text-[#17231b] text-sm cursor-pointer hover:text-[#2f6b4f] hover:underline"
                          >
                            {chat.username}
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#647067]">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(chat.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-[#344255] text-sm leading-relaxed pl-8">
                        {chat.msg}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Comment Section */}
          <div className="mt-6 rounded-xl border border-[#dce3d7] bg-white shadow-sm overflow-hidden">
            <div className="bg-[#fbfcf8] px-5 py-3 border-b border-[#dce3d7]">
              <h2 className="text-base font-semibold text-[#17231b] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#c7792b]" />
                Add comment
              </h2>
            </div>

            <div className="p-5">
              <div className="space-y-3">
                <Input
                  placeholder="Write a comment..."
                  value={state.message}
                  onChange={(e) => actions.setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      actions.handleSendMessage();
                    }
                  }}
                  className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                />

                {state.commentError && (
                  <div className="flex items-center gap-2 text-sm text-[#b2473e] bg-[#fff4f2] p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {state.commentError}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={actions.handleSendMessage}
                    disabled={state.sending || !state.message.trim()}
                    className="bg-[#2f6b4f] hover:bg-[#214b39] text-white rounded-lg gap-2"
                  >
                    {state.sending ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Old Style (Original Design)
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Board comments</h1>
          <Button variant="outline" onClick={() => navigate("/board")}>
            Back to boards
          </Button>
        </div>

        {state.boardError && <p className="text-red-500">{state.boardError}</p>}

        {state.board && (
          <div className="flex justify-center">
            <BoardCard
              mountainName={state.mountain?.name ?? "Unknown mountain"}
              mountainHeight={state.mountain?.height ?? 0}
              date={state.board.expiryDate}
              duration={String(state.board.tourTime)}
              organizer={state.organizerFromState ?? "Unknown organizer"}
              description={state.board.description}
              difficulty={state.board.difficulty}
              onOrganizerClick={() => navigate(`/profile/${state.board?.userId}`)}
              onChatClick={undefined}
              hideCommentButton
            />
          </div>
        )}

        <div className="rounded-lg border p-4 space-y-4">
          <h2 className="text-lg font-semibold">Comments</h2>

          {state.loadingMessages ? (
            <p>Loading comments...</p>
          ) : state.messages.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {state.messages.map((chat) => (
                <div key={chat.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <button
                      type = "button"
                      onClick={() => navigate(`/profile/${chat.userId}`)}
                      className="font-semibold text-[#17231b] text-sm cursor-pointer hover:text-[#2f6b4f] hover:underline"
                    >
                      {chat.username}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(chat.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{chat.msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <h2 className="text-lg font-semibold">Add comment</h2>

          <Input
            placeholder="Write a comment..."
            value={state.message}
            onChange={(e) => actions.setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                actions.handleSendMessage();
              }
            }}
          />

          {state.commentError && <p className="text-red-500 text-sm">{state.commentError}</p>}

          <div className="flex justify-end">
            <Button 
              onClick={actions.handleSendMessage} 
              disabled={state.sending || !state.message.trim()}
            >
              {state.sending ? "Sending..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardChatPage;