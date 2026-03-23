import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock3, } from "lucide-react"

type BoardCardProps = {
  mountainName: string
  mountainHeight: number
  date: string
  duration: string
  organizer: string
  description: string
  onChatClick?: () => void
}

function BoardCard({
  mountainName,
  mountainHeight,
  date,
  duration,
  organizer,
  description,
  onChatClick,
}: BoardCardProps) {
  return (
    <Card className="w-[350px] bg-cyan-900">
      <CardContent className="pt-3 px-6 pb-3">
        <div className="flex min-h-[350px] flex-col justify-between rounded-2xl 0 bg-white p-6">
          <div>
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-base font-semibold text-black">
                <p>Organizator:</p>
                  <p>
                    {organizer} <span className="text-zinc-500 text-sm">• 12 vrhov</span>
                  </p>
              </p>

              <Button onClick={onChatClick}>Komentiraj</Button>
            </div>

            <p className="text-base italic bold text-zinc-700 break-words">
              "{description}"
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-black">
               ⛰️{mountainName}
            </p>
            <p className="mt-3 text-2xl font-medium text-zinc-700">
              {mountainHeight} m
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5">
          <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2  font-medium">
            <Calendar className="h-5 w-5" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-zinc-300 px-3 py-2 text-base font-medium">
            <Clock3 className="h-5 w-5" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BoardCard