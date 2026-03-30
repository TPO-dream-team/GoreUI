import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";

function ChatPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <main className="w-full md:max-w-2xl flex flex-col min-h-screen bg-white shadow-md">

        <header className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">Add a post</h1>

          {/* --- SHADCN DIALOG START --- */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Post
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 w-[95vw] rounded-xl">
              <DialogHeader className="border-gray-200 border-b-2 pb-2">
                <DialogTitle>New post</DialogTitle>
                <DialogDescription>
                  Create new post. Please be respectfull.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Post title</label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="My amazing weekend..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    className="flex min-h-30 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How are you feeling?"
                    maxLength={300}
                  />
                </div>
                <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Moutain</label>
                <Input
                  id="mountain-search"
                  placeholder="Moutain is optional"
                  autoComplete="off"
                  />
                </div>
                <button className="mt-5 w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-[0.98]">
                  Post now
                </button>
              </div>
            </DialogContent>
          </Dialog>
          {/* --- SHADCN DIALOG END --- */}

        </header>

        <section className="flex-1 p-4 overflow-y-auto">
          <ChatDisplay />
          <ChatDisplay />
          <ChatDisplay />
          <ChatDisplay />
          <ChatDisplay />
        </section>

        <footer className="p-4 border-t border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Previous posts
            </a>
            <a href="#" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
              Next posts
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
}

function ChatDisplay() {
  return (
    <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-sm bg-white mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className="flex items-center gap-3">
          <span className="font-bold text-gray-900">@username</span>
          <span className="text-gray-600 text-xs bg-gray-100 px-2 py-0.5 rounded-full">15 peaks overcome</span>
        </span>
        <span className="text-sm text-gray-500">Oct 24, 2023</span>
      </div>
      <header className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight">Starting question to get the audiance wondering</h2>
      </header>
      <p className="text-gray-600 text-sm leading-relaxed">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo error alias doloribus consectetur animi, harum architecto...
      </p>
      <div className="flex justify-end mt-4">
        <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
          View Comments
        </a>
      </div>
    </div>
  )
}

export default ChatPage;