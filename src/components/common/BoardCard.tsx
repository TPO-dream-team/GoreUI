import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock3} from "lucide-react"

type BoardCardProps = {
  mountainName: string
  mountainHeight: number
  date: string
  duration: string
  organizer: string
  description: string
  difficulty: number
  onChatClick?: () => void
  hideCommentButton?: boolean
}

function BoardCard({
  mountainName,
  mountainHeight,
  date,
  duration,
  organizer,
  description,
  difficulty,
  onChatClick,
  hideCommentButton
}: BoardCardProps) {
  return (
    <Card className="w-[350px] bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
      <CardContent className="px-6 pb-3 pt-3">
        <div className="flex min-h-[350px] flex-col justify-between rounded-2xl bg-white p-6">
          <div>
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="text-base font-semibold text-black">
                <p>Organizator:</p>
                <p>
                  {organizer} <span className="text-sm text-zinc-500">• 12 peaks</span>
                </p>
              </div>

              {!hideCommentButton && onChatClick && (
                <Button onClick={onChatClick}>Comment</Button>
              )}
            </div>

            <p className="break-words text-base italic font-bold text-zinc-700">
              "{description}"
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-black">⛰️ {mountainName}</p>
            <p className="mt-3 text-2xl font-medium text-zinc-700">
              {mountainHeight} m
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start justify-center gap-23">
  
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2 font-medium">
            <Calendar className="h-5 w-5" />
            <span>{date}</span>
          </div>

          <div className="rounded-full bg-zinc-300 px-3 py-2 text-base font-medium">
            Difficulty: {difficulty}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2 text-base font-medium">
          <Clock3 className="h-5 w-5" />
          <span>{duration}h</span>
        </div>
      </div>
        
      </CardContent>
    </Card>
  )
}

export default BoardCard