import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatPage, LIMIT } from "./useChatPage";
import type { Gora } from "@/utility/stores_slices/goreSlice";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Mountain, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("sl-SI", { month: 'short', day: 'numeric', year: 'numeric' });
};

function ChatPage() {
  const { state, actions } = useChatPage();
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
        <main className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-brand-border px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-brand-headline">Posts</h1>
                  <p className="text-xs text-brand-body">Community discussions and experiences </p>
                </div>
              </div>
              
              <Dialog open={state.isDialogOpen} onOpenChange={actions.setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-primary hover:bg-brand-hover-green text-white rounded-full gap-2 shadow-sm transition-colors">
                    <Send className="w-4 h-4" />
                    New post
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[500px] rounded-xl border-brand-border bg-white">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <DialogTitle className="text-xl text-brand-headline">New post</DialogTitle>
                    </div>
                    <DialogDescription className="text-brand-body">
                      Share your experiences with the hiking community.
                    </DialogDescription>
                  </DialogHeader>

                  {state.showSuccess && (
                    <div className="flex items-center gap-2 text-brand-primary bg-brand-accent-sage p-3 rounded-button border border-brand-primary/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Your post was successfully posted.</span>
                    </div>
                  )}

                  <div className="grid gap-5 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-brand-headline">Post title</label>
                      <input
                        value={state.title}
                        className="flex h-10 w-full rounded-button border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        placeholder="My experience on Triglav..."
                        onChange={(e) => actions.setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-brand-headline">Content</label>
                      <textarea
                        value={state.content}
                        className="flex min-h-[120px] w-full rounded-button border border-brand-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none transition-all"
                        placeholder="How was it? Share the details..."
                        maxLength={300}
                        onChange={(e) => actions.setContent(e.target.value)}
                      />
                      <p className="text-right text-xs text-brand-body">{state.content.length}/300</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-brand-headline flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-brand-hover-blue" />
                        Related mountain (Optional)
                      </label>
                      <div className="relative" ref={state.mountainRef}>
                        <Input
                          id="mountain-search"
                          placeholder="Search for a mountain..."
                          value={state.mountainQuery}
                          onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                          onFocus={() => actions.setmountainSuggestion(true)}
                          autoComplete="off"
                          className="border-brand-border focus:border-brand-primary focus:ring-brand-primary/20 rounded-button"
                        />

                        {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-button border border-brand-border bg-white shadow-lg">
                            {state.filteredMountains.map((gora: Gora) => (
                              <button
                                key={gora.id}
                                type="button"
                                onClick={() => actions.handleSelectMountain(gora)}
                                className="flex w-full justify-between items-center px-3 py-2 text-left hover:bg-brand-accent-sage transition-colors border-b border-brand-border/60 last:border-0 cursor-pointer"
                              >
                                <span className="font-medium text-brand-headline">{gora.name}</span>
                                <span className="text-xs text-brand-body">{gora.height} m</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {state.validationError && (
                        <div className="flex items-center gap-2 text-brand-danger bg-brand-danger/10 p-2 rounded-button border border-brand-danger/20">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-xs font-medium">{state.validationError}</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={actions.handlePostSubmit} 
                      className="mt-2 w-full bg-gradient-to-r from-brand-primary to-brand-hover-blue hover:from-brand-hover-green hover:to-brand-primary text-white py-3 rounded-button font-semibold transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                    >
                      Post now
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Success Message */}
          {state.showSuccess && (
            <div className="mx-4 mt-4 flex items-center gap-2 text-brand-primary bg-brand-accent-sage p-3 rounded-button border border-brand-primary/20">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Your post was successfully posted.</span>
            </div>
          )}

          {/* Posts Section */}
          <section className="flex-1 p-4 overflow-y-auto">
            {state.boardsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-brand-primary" />
                <span className="ml-3 text-brand-body">Loading posts...</span>
              </div>
            ) : (
              <>
                {state.boards.map((post) => (
                  <ChatDisplayNew key={post.id} data={post} />
                ))}
                {state.boards.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent-sage flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-brand-body" />
                    </div>
                    <p className="text-brand-body">No posts yet.</p>
                    <p className="text-sm text-brand-body mt-1"> Be the first to share your experience!</p>
                  </div>
                )}
              </>
            )}
            {state.boardsError && (
              <div className="flex items-center justify-center gap-2 text-brand-danger bg-brand-danger/10 p-3 rounded-button border border-brand-danger/20">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{state.boardsError}</p>
              </div>
            )}
          </section>

          {/* Pagination Footer */}
          <footer className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-brand-border px-4 py-3">
            <div className="flex justify-between items-center max-w-md mx-auto">
              <button
                onClick={actions.handlePrevious}
                disabled={state.offset === 0 || state.boardsLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all ${
                  state.offset === 0 
                    ? "text-brand-border cursor-not-allowed opacity-50" 
                    : "text-brand-primary hover:bg-brand-accent-sage cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-brand-body">
                Page {Math.floor(state.offset / LIMIT) + 1}
              </span>

              <button
                onClick={actions.handleNext}
                disabled={state.boards.length < LIMIT || state.boardsLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium transition-all ${
                  state.boards.length < LIMIT 
                    ? "text-brand-border cursor-not-allowed opacity-50" 
                    : "text-brand-primary hover:bg-brand-accent-sage cursor-pointer"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // Old Style (Original Design)
  return (
    <div className="flex flex-col items-center min-h-screen">
      <main className="w-full md:max-w-2xl flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
        <header className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Add a post</h1>
          
          {state.showSuccess && (
            <p className="text-red-400 text-center">Your post was successfully posted.</p>
          )}

          <Dialog open={state.isDialogOpen} onOpenChange={actions.setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
                Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 w-[95vw] rounded-xl">
              <DialogHeader className="border-gray-200 border-b-2 pb-2">
                <DialogTitle>New post</DialogTitle>
                <DialogDescription>Create new post. Please be respectful.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Post title</label>
                  <input
                    value={state.title}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="My amazing weekend..."
                    onChange={(e) => actions.setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    value={state.content}
                    className="flex min-h-30 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="How are you feeling?"
                    maxLength={300}
                    onChange={(e) => actions.setContent(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Mountain (Optional)</label>
                  <div className="relative" ref={state.mountainRef}>
                    <Input
                      id="mountain-search"
                      placeholder="Search for a mountain..."
                      value={state.mountainQuery}
                      onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                      onFocus={() => actions.setmountainSuggestion(true)}
                      autoComplete="off"
                    />

                    {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                        {state.filteredMountains.map((gora: Gora) => (
                          <button
                            key={gora.id}
                            type="button"
                            onClick={() => actions.handleSelectMountain(gora)}
                            className="flex w-full flex-col px-3 py-2 text-left hover:bg-slate-100 transition-colors border-b last:border-0"
                          >
                            <span className="font-medium text-gray-900">{gora.name}</span>
                            <span className="text-xs text-gray-500">{gora.height} m</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {state.validationError && (
                    <p className="text-red-500 text-[11px] font-bold mt-1">{state.validationError}</p>
                  )}
                </div>

                <button 
                  onClick={actions.handlePostSubmit} 
                  className="mt-5 w-full bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900 text-white p-3 rounded-lg font-bold hover:text-blue-200 transition-all active:scale-[0.98]"
                >
                  Post now
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <section className="flex-1 p-4 overflow-y-auto">
          {state.boardsLoading ? (
            <p className="text-white text-center py-10">Loading posts...</p>
          ) : (
            <>
              {state.boards.map((post) => (
                <ChatDisplay key={post.id} data={post} />
              ))}
              {state.boards.length === 0 && (
                <p className="text-gray-400 text-center py-10">No posts found.</p>
              )}
            </>
          )}
          {state.boardsError && <p className="text-red-400 text-center">{state.boardsError}</p>}
        </section>

        <footer className="p-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <button
              onClick={actions.handlePrevious}
              disabled={state.offset === 0 || state.boardsLoading}
              className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
                state.offset === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={actions.handleNext}
              disabled={state.boards.length < LIMIT || state.boardsLoading}
              className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
                state.boards.length < LIMIT ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

// New Style Chat Display Component
function ChatDisplayNew({ data }: { data: any }) {
  const { username, userId, mountainName, tagline, id, commentCount, startMsg, timeStamp } = data;
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-brand-border/60 shadow-sm hover:shadow-md transition-all mb-5 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate(`/profile/${userId}`)}
                className="font-semibold text-brand-headline text-sm hover:text-brand-primary hover:underline cursor-pointer"
              >
                @{username}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-brand-body">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(timeStamp)}</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {mountainName && (
            <span className="flex items-center gap-1 text-brand-primary text-[10px] uppercase tracking-wider bg-brand-accent-sage px-2 py-0.5 rounded-full font-semibold">
              <Mountain className="w-3 h-3" />
              {mountainName}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-brand-headline leading-tight mb-2">{tagline}</h2>
        <p className="text-brand-slate text-sm leading-relaxed">{startMsg}</p>

        <div className="flex justify-end mt-4 pt-3 border-t border-brand-border/40">
          <a 
            href={`chat/${id}`} 
            className="flex items-center gap-2 text-brand-hover-blue text-sm font-medium hover:text-brand-primary transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            View  {commentCount} comments
          </a>
        </div>
      </div>
    </div>
  );
}

// Old Style Chat Display Component
function ChatDisplay({ data }: { data: any }) {
  const { username, userId, mountainName, tagline, id, commentCount, startMsg, timeStamp } = data;
  const navigate = useNavigate();
  
  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-sm bg-white mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/profile/${userId}`)}
            className="font-bold text-gray-900 hover:underline"
          >
            @{username}
          </button>
        </span>
        <span className="text-sm text-gray-500">{formatDate(timeStamp)}</span>
      </div>

      <header className="mb-2 flex flex-col items-start gap-1">
        {mountainName && (
          <span className="text-blue-600 text-[10px] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full font-bold">
            {mountainName}
          </span>
        )}
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">{tagline}</h2>
      </header>

      <p className="text-gray-600 text-sm leading-relaxed">{startMsg}</p>

      <div className="flex justify-end mt-4">
        <a href={`chat/${id}`} className="text-blue-600 text-sm font-medium hover:underline">
          View {commentCount} Comments
        </a>
      </div>
    </div>
  );
}

export default ChatPage;