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
  X,
  CheckCircle2
} from "lucide-react";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffDays === 0) return "Danes";
  if (diffDays === 1) return "Včeraj";
  if (diffDays < 7) return `Pred ${diffDays} dnevi`;
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
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <main className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-[#dce3d7] px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#17231b]">Objave</h1>
                  <p className="text-xs text-[#647067]">Razmere, dogovori in novice</p>
                </div>
              </div>
              
              <Dialog open={state.isDialogOpen} onOpenChange={actions.setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2f6b4f] hover:bg-[#214b39] text-white rounded-full gap-2 shadow-sm">
                    <Send className="w-4 h-4" />
                    Nova objava
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[500px] rounded-xl border-[#dce3d7]">
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <DialogTitle className="text-xl text-[#17231b]">Nova objava</DialogTitle>
                    </div>
                    <DialogDescription className="text-[#647067]">
                      Delite svojo izkušnjo ali obvestilo s planinsko skupnostjo.
                    </DialogDescription>
                  </DialogHeader>

                  {state.showSuccess && (
                    <div className="flex items-center gap-2 text-[#2f6b4f] bg-[#edf8ee] p-3 rounded-lg border border-[#bcd8c2]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Vaša objava je bila uspešno objavljena.</span>
                    </div>
                  )}

                  <div className="grid gap-5 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#17231b]">Naslov objave</label>
                      <input
                        value={state.title}
                        className="flex h-10 w-full rounded-lg border border-[#dce3d7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b4f]/20 focus:border-[#2f6b4f]"
                        placeholder="Moja izkušnja na Triglavu..."
                        onChange={(e) => actions.setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#17231b]">Vsebina</label>
                      <textarea
                        value={state.content}
                        className="flex min-h-[120px] w-full rounded-lg border border-[#dce3d7] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b4f]/20 focus:border-[#2f6b4f] resize-none"
                        placeholder="Kako je bilo? Delite podrobnosti..."
                        maxLength={300}
                        onChange={(e) => actions.setContent(e.target.value)}
                      />
                      <p className="text-right text-xs text-[#647067]">{state.content.length}/300</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#17231b] flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-[#316f8f]" />
                        Povezana gora (Izbirno)
                      </label>
                      <div className="relative" ref={state.mountainRef}>
                        <Input
                          id="mountain-search"
                          placeholder="Išči goro..."
                          value={state.mountainQuery}
                          onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                          onFocus={() => actions.setmountainSuggestion(true)}
                          autoComplete="off"
                          className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                        />

                        {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#dce3d7] bg-white shadow-lg">
                            {state.filteredMountains.map((gora: Gora) => (
                              <button
                                key={gora.id}
                                type="button"
                                onClick={() => actions.handleSelectMountain(gora)}
                                className="flex w-full justify-between items-center px-3 py-2 text-left hover:bg-[#f0f4ea] transition-colors border-b border-[#e5eadf] last:border-0"
                              >
                                <span className="font-medium text-[#17231b]">{gora.name}</span>
                                <span className="text-xs text-[#647067]">{gora.height} m</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {state.validationError && (
                        <div className="flex items-center gap-2 text-[#b2473e] bg-[#fff4f2] p-2 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-xs font-medium">{state.validationError}</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={actions.handlePostSubmit} 
                      className="mt-2 w-full bg-gradient-to-r from-[#2f6b4f] to-[#316f8f] hover:from-[#214b39] hover:to-[#225c76] text-white py-3 rounded-lg font-semibold transition-all active:scale-[0.98] shadow-sm"
                    >
                      Objavi zdaj
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Success Message */}
          {state.showSuccess && (
            <div className="mx-4 mt-4 flex items-center gap-2 text-[#2f6b4f] bg-[#edf8ee] p-3 rounded-lg border border-[#bcd8c2]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Vaša objava je bila uspešno objavljena.</span>
            </div>
          )}

          {/* Posts Section */}
          <section className="flex-1 p-4 overflow-y-auto">
            {state.boardsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#2f6b4f]" />
                <span className="ml-3 text-[#647067]">Nalaganje objav...</span>
              </div>
            ) : (
              <>
                {state.boards.map((post) => (
                  <ChatDisplayNew key={post.id} data={post} />
                ))}
                {state.boards.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f0f4ea] flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[#647067]" />
                    </div>
                    <p className="text-[#647067]">Ni še nobene objave.</p>
                    <p className="text-sm text-[#647067] mt-1">Bodite prvi, ki deli svojo izkušnjo!</p>
                  </div>
                )}
              </>
            )}
            {state.boardsError && (
              <div className="flex items-center justify-center gap-2 text-[#b2473e] bg-[#fff4f2] p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{state.boardsError}</p>
              </div>
            )}
          </section>

          {/* Pagination Footer */}
          <footer className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-[#dce3d7] px-4 py-3">
            <div className="flex justify-between items-center max-w-md mx-auto">
              <button
                onClick={actions.handlePrevious}
                disabled={state.offset === 0 || state.boardsLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  state.offset === 0 
                    ? "text-[#c9d4c5] cursor-not-allowed" 
                    : "text-[#2f6b4f] hover:bg-[#f0f4ea]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Prejšnje
              </button>

              <span className="text-sm text-[#647067]">
                Stran {Math.floor(state.offset / LIMIT) + 1}
              </span>

              <button
                onClick={actions.handleNext}
                disabled={state.boards.length < LIMIT || state.boardsLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  state.boards.length < LIMIT 
                    ? "text-[#c9d4c5] cursor-not-allowed" 
                    : "text-[#2f6b4f] hover:bg-[#f0f4ea]"
                }`}
              >
                Naslednje
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
  const { username, mountainName, tagline, id, commentCount, startMsg, timeStamp } = data;
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#dce3d7] shadow-sm hover:shadow-md transition-all mb-5 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#17231b] text-sm">@{username}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#647067]">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(timeStamp)}</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {mountainName && (
            <span className="flex items-center gap-1 text-[#2f6b4f] text-[10px] uppercase tracking-wider bg-[#edf8ee] px-2 py-0.5 rounded-full font-semibold">
              <Mountain className="w-3 h-3" />
              {mountainName}
            </span>
          )}
        </div>

        <h2 className="text-lg font-semibold text-[#17231b] leading-tight mb-2">{tagline}</h2>
        <p className="text-[#344255] text-sm leading-relaxed">{startMsg}</p>

        <div className="flex justify-end mt-4 pt-3 border-t border-[#e5eadf]">
          <a 
            href={`chat/${id}`} 
            className="flex items-center gap-2 text-[#316f8f] text-sm font-medium hover:text-[#225c76] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Ogled {commentCount} komentarjev
          </a>
        </div>
      </div>
    </div>
  );
}

// Old Style Chat Display Component
function ChatDisplay({ data }: { data: any }) {
  const { username, mountainName, tagline, id, commentCount, startMsg, timeStamp } = data;
  
  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-sm bg-white mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className="flex items-center gap-3">
          <span className="font-bold text-gray-900">@{username}</span>
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