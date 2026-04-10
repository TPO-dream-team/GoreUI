import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import api from "@/utility/axios";
import type { AppDispatch, RootState } from "@/utility/store";
import type { Gora } from "@/utility/stores_slices/goreSlice";
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LIMIT = 5;

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

function ChatPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const mountainRef = useRef<HTMLDivElement>(null);

  const [boards, setBoards] = useState<any[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState("");
  const [mountainQuery, setMountainQuery] = useState("")

  const [offset, setOffset] = useState(0);
  const [mountainSuggestion, setmountainSuggestion] = useState(false)
  const [selectedMountainId, setSelectedMountainId] = useState("")

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { gore, loading: mountainsLoading, error: mountainsError } = useSelector(
    (state: RootState) => state.mountain
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mountainRef.current && !mountainRef.current.contains(event.target as Node)) {
        setmountainSuggestion(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMountains = useMemo(() => {
    if (!gore) return []
    const query = mountainQuery.trim().toLowerCase()
    if (!query) return gore.slice(0, 5)
    const matches = gore.filter((gora) => gora.name.toLowerCase().includes(query))
    return matches.slice(0, 5)
  }, [gore, mountainQuery])

  useEffect(() => {
    loadBoards()
  }, [offset])

  const loadBoards = async () => {
    try {
      setBoardsLoading(true)
      setBoardsError("")
      const response = await api.get("/post", {
        params: { offset, limit: LIMIT }
      })
      setBoards(response.data ?? [])
    } catch (err: any) {
      setBoardsError(err.response?.data?.message || "Error while loading posts.")
    } finally {
      setBoardsLoading(false)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setOffset(prev => prev + LIMIT);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setOffset(prev => Math.max(0, prev - LIMIT));
  };

  const handleSelectMountain = (gora: Gora) => {
    setSelectedMountainId(String(gora.id))
    setMountainQuery(gora.name)
    setmountainSuggestion(false)
  }

  const handleMountainQueryChange = (value: string) => {
    setMountainQuery(value)
    setmountainSuggestion(true)
    setSelectedMountainId("")
  }

  const handlePostSubmit = async () => {
    setValidationError("");

    if (!title.trim() || !content.trim()) {
      setValidationError("Title and Content are required.");
      return;
    }

    let finalMountainId = selectedMountainId;
    if (mountainQuery.trim() !== "" && !finalMountainId) {
        const exactMatch = gore?.find(g => g.name.toLowerCase() === mountainQuery.toLowerCase().trim());
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

  return (
    <div className="flex flex-col items-center min-h-scree ">
      <main className="w-full md:max-w-2xl flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
        <header className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Add a post</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className=" text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
                Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 w-[95vw] rounded-xl">
              <DialogHeader className="border-gray-200 border-b-2 pb-2">
                <DialogTitle>New post</DialogTitle>
                <DialogDescription>
                  Create new post. Please be respectful.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Post title</label>
                  <input
                    value={title}
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="My amazing weekend..."
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    value={content}
                    className="flex min-h-30 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="How are you feeling?"
                    maxLength={300}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Mountain (Optional)</label>
                  <div className="relative" ref={mountainRef}>
                    <Input
                      id="mountain-search"
                      placeholder="Search for a mountain..."
                      value={mountainQuery}
                      onChange={(e) => handleMountainQueryChange(e.target.value)}
                      onFocus={() => setmountainSuggestion(true)}
                      autoComplete="off"
                    />

                    {mountainSuggestion && filteredMountains.length > 0 && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                        {filteredMountains.map((gora: Gora) => (
                          <button
                            key={gora.id}
                            type="button"
                            onClick={() => handleSelectMountain(gora)}
                            className="flex w-full flex-col px-3 py-2 text-left hover:bg-slate-100 transition-colors border-b last:border-0"
                          >
                            <span className="font-medium text-gray-900">{gora.name}</span>
                            <span className="text-xs text-gray-500">{gora.height} m</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {validationError && (
                    <p className="text-red-500 text-[11px] font-bold mt-1">
                      {validationError}
                    </p>
                  )}
                </div>

                <button 
                  onClick={handlePostSubmit} 
                  className="mt-5 w-full bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900 text-white p-3 rounded-lg font-bold hover:text-blue-200 transition-all active:scale-[0.98]"
                >
                  Post now
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <section className="flex-1 p-4 overflow-y-auto">
          {boardsLoading ? (
            <p className="text-white text-center py-10">Loading posts...</p>
          ) : (
            <>
              {boards.map((post) => (
                <ChatDisplay key={post.id} data={post} />
              ))}
              {boards.length === 0 && (
                <p className="text-gray-400 text-center py-10">No posts found.</p>
              )}
            </>
          )}
          {boardsError && <p className="text-red-400 text-center">{boardsError}</p>}
        </section>

        <footer className="p-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={offset === 0 || boardsLoading}
              className={`flex items-center gap-1 text-sm font-medium transition-opacity ${offset === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={boards.length < LIMIT || boardsLoading}
              className={`flex items-center gap-1 text-sm font-medium transition-opacity ${boards.length < LIMIT ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-blue-600"
                }`}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

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

      <p className="text-gray-600 text-sm leading-relaxed">
        {startMsg}
      </p>

      <div className="flex justify-end mt-4">
        <a href={`chat/${id}`} className="text-blue-600 text-sm font-medium hover:underline">
          View {commentCount} Comments
        </a>
      </div>
    </div>
  );
}

export default ChatPage;