import { useEffect, useState } from "react"
import api from "@/utility/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BoardCard from "@/components/common/BoardCard"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/utility/store"
import { fetchGore } from "@/utility/stores_slices/goreSlice"
import { useParams, useNavigate, useLocation } from "react-router-dom"

type BoardDetails = {
  id: string
  expiryDate: string
  userId: string
  mountainId: string
  description: string
  tourTime: number
  difficulty: number
}

type ChatMessage = {
  id: number
  boardId: string
  userId: string
  username: string
  msg: string
  timestamp: string
}

function BoardChatPage() {
  const dispatch = useDispatch<AppDispatch>()
  
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()

  const organizerFromState = (location.state as { organizer?: string } | null)?.organizer
  const currentUser = useSelector((state: RootState) => state.auth.username)
  const { gore } = useSelector((state: RootState) => state.mountain)

  const [board, setBoard] = useState<BoardDetails | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")

  const [loadingBoard, setLoadingBoard] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [sending, setSending] = useState(false)
  //const [error, setError] = useState("")
  const [boardError, setBoardError] = useState("")
  const [commentError, setCommentError] = useState("")

  const mountain = gore?.find(
  (gora) => String(gora.id) === String(board?.mountainId)
  )

  useEffect(() => {
  dispatch(fetchGore())
}, [dispatch])

  

  const loadBoard = async () => {
    if (!id) return

    try {
      setLoadingBoard(true)
      const response = await api.get(`/boards/${id}`)
      setBoard(response.data)
    } catch (err: any) {
      setBoardError(err.response?.data?.message || "Error while loading board.")
    } finally {
      setLoadingBoard(false)
    }
  }

  const loadMessages = async () => {
    if (!id) return

    try {
      setLoadingMessages(true)
      const response = await api.get(`/boards/${id}/chats`)
      setMessages(response.data ?? [])
    } catch (err: any) {
      setCommentError(err.response?.data?.message || "Error while loading comments.")
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    loadBoard()
    loadMessages()
  }, [id])

  const handleSendMessage = async () => {
    if (!id) return

    const trimmed = message.trim()
    if (!trimmed) {
      setCommentError("Write the comment first.")
      return
    }
    
    try {
      setSending(true)
      setCommentError("")

      await api.post(`/boards/${id}/chats`, {
        Message: trimmed,
      })

      setMessage("")
      await loadMessages()
    } catch (err: any) {
      setCommentError(err.response?.data?.message || "Error while sending message.")
    } finally {
      setSending(false)
    }
  }


  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Board comments</h1>

            <Button variant="outline" onClick={() => navigate("/board")}>
                Back to boards
            </Button>
        </div>

        {boardError && <p className="text-red-500">{boardError}</p>}

        {board && (
    <div className="flex justify-center">
        <BoardCard
        mountainName={mountain?.name ?? "Unknown mountain"}
        mountainHeight={mountain?.height ?? 0}
        date={board.expiryDate}
        duration={String(board.tourTime)}
        organizer={organizerFromState ?? "Unknown organizer"}
        description={board.description}
        difficulty={board.difficulty}
        onChatClick={undefined}
        hideCommentButton
        />
    </div>
    )}

        <div className="rounded-lg border p-4 space-y-4">
          <h2 className="text-lg font-semibold">Comments</h2>

          {loadingMessages ? (
            <p>Loading comments...</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((chat) => (
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />

          {commentError && <p className="text-red-500">{commentError}</p>}

          <div className="flex justify-end">
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? "Sending..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardChatPage