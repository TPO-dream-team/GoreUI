import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BoardCard from "@/components/common/BoardCard";
import { useBoardChatPage } from "./useBoardChatPage";

function BoardChatPage() {
  const navigate = useNavigate();
  const { state, actions } = useBoardChatPage();

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
                    <span className="font-medium">{chat.username}</span>
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