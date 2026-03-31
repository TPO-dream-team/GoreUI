import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";

function ChatCommentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center min-h-screen">
            <main className="w-full md:max-w-2xl flex flex-col min-h-screen bg-cyan-900 shadow-md">

                {/* Header with Back Button */}
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
                    {/* The Original Post */}
                    <div className="p-4 border rounded-lg shadow-sm bg-white border-blue-200 ring-1 ring-blue-50/50">
                        <div className="flex justify-between items-center mb-3">
                            <span className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">@username</span>
                                <span className="text-gray-600 text-xs bg-gray-100 px-2 py-0.5 rounded-full">15 peaks overcome</span>
                            </span>
                            <span className="text-sm text-gray-500">Oct 24, 2023</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Starting question to get the audience wondering
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            This is the full content of the post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    <div className="pt-4 pb-2">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Comments</h3>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-3">
                        <CommentItem username="mountaineer_1" text="Great question! I think it depends on the weather." time="2h ago" />
                        <CommentItem username="hiking_pro" text="I've been there last week, the trail is quite muddy." time="1h ago" />
                        <CommentItem username="nature_lover" text="Don't forget to pack extra water!" time="45m ago" />
                    </div>
                </section>

                {/* Comment Input Footer */}
                <footer className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                    <div className="flex gap-2 items-center">
                        <Input
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-50 border-gray-200 focus:ring-blue-500"
                        />
                        <Button size="icon" className="rounded-full shrink-0">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </footer>

            </main>
        </div>
    );
}

function CommentItem({ username, text, time }: { username: string, text: string, time: string }) {
    return (
        <div className="p-3 bg-white/95 rounded-lg shadow-sm ml-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-3">
                    <span className="font-bold text-blue-500">@username</span>
                    <span className="text-gray-600 text-xs bg-gray-100 px-2 py-0.5 rounded-full">15 peaks overcome</span>
                </span>
                     <span className="text-[10px] text-gray-500">Oct 24, 2023</span>
            </div>
            <p className="text-gray-700 text-sm">{text}</p>
        </div>
    );
}

export default ChatCommentPage;



