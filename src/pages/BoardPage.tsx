import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/utility/store"
import { fetchGore, type Gora } from "@/utility/stores_slices/goreSlice"
import api from "@/utility/axios"

import BoardCard from "@/components/common/BoardCard"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type BackendBoard = {
  boardId: string
  expiryDate: string
  username: string
  userId: string
  mountainId: string
  description: string
  tourTime: number
  difficulty: number
}


function BoardPage() {
  const dispatch = useDispatch<AppDispatch>()

  const { gore, loading: mountainsLoading, error: mountainsError } = useSelector(
    (state: RootState) => state.mountain
  )
  const currentUser = useSelector((state: RootState) => state.auth.username)

  const [open, setOpen] = useState(false)

  const [selectedMountainId, setSelectedMountainId] = useState("")
  const [mountainQuery, setMountainQuery] = useState("")
  const [mountainSuggestion, setmountainSuggestion] = useState(false)

  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [duration, setDuration] = useState("")
  const [difficulty, setDifficulty] = useState("")

  const [formError, setFormError] = useState("")
  const [boards, setBoards] = useState<BackendBoard[]>([])
  const [boardsLoading, setBoardsLoading] = useState(false)
  const [boardsError, setBoardsError] = useState("")
  const [creatingBoard, setCreatingBoard] = useState(false)

  useEffect(() => {
    dispatch(fetchGore())
  }, [dispatch])

  useEffect(() => {
    loadBoards()
  }, [])

  const loadBoards = async () => {
    try {
      setBoardsLoading(true)
      setBoardsError("")

      const response = await api.get("/boards")
      setBoards(response.data ?? [])
    } catch (err: any) {
      setBoardsError(
        err.response?.data?.message || "Error while loading tours."
      )
    } finally {
      setBoardsLoading(false)
    }
  }

  const selectedMountain = useMemo(
    () => gore?.find((gora) => String(gora.id) === String(selectedMountainId)) ?? null,
    [gore, selectedMountainId]
  )

  const filteredMountains = useMemo(() => {
    if (!gore) return []
    const query = mountainQuery.trim().toLowerCase()
    const matches = query
      ? gore.filter((gora) => gora.name.toLowerCase().includes(query))
      : gore
    return matches.slice(0, 5)
  }, [gore, mountainQuery])

  const resetForm = () => {
    setSelectedMountainId("")
    setMountainQuery("")
    setmountainSuggestion(false)
    setDescription("")
    setDate("")
    setDuration("")
    setDifficulty("")
    setFormError("")
  }

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  const handleMountainQueryChange = (value: string) => {
    setMountainQuery(value)
    setmountainSuggestion(true)

    if (!value.trim()) {
      setSelectedMountainId("")
    }
  }

  const handleSelectMountain = (gora: Gora) => {
    setSelectedMountainId(String(gora.id))
    setMountainQuery(gora.name)
    setmountainSuggestion(false)
    setFormError("")
  }

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 150) {
      setDescription(value)
    }
  }

  const validateForm = () => {
    if (!selectedMountainId) {
      return "Select moutain from the list."
    }

    if(Number(difficulty) > 5 || Number(difficulty) < 1) {
      return "Select appropriate difficulty."
    }

    if (!description.trim() || !date || !duration.trim() || !difficulty.trim()) {
      return "Please fill the whole form."
    }
    return null
  }

  const handleCreatePost = async () => {
    const validationError = validateForm()

    if (validationError) {
      setFormError(validationError)
      return
    }

    try {
      setCreatingBoard(true)
      setFormError("")

      await api.post("/boards", {
        description: description.trim(),
        difficulty: Number(difficulty),
        expiryDate: date,
        mountainId: selectedMountainId,
        tourTime: Number(duration),
      })

      await loadBoards()
      resetForm()
      setOpen(false)
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || "Error while saving the board."
      )
    } finally {
      setCreatingBoard(false)
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tours</h1>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>Create new tour</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Create new tour</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mountain-search">Moutain</Label>

                <div className="relative">
                  <Input
                    id="mountain-search"
                    placeholder="Ime gore ..."
                    value={mountainQuery}
                    onChange={(e) => handleMountainQueryChange(e.target.value)}
                    onFocus={() => setmountainSuggestion(true)}
                    autoComplete="off"
                  />

                  {mountainSuggestion && filteredMountains.length > 0 && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-background shadow-md">
                      {filteredMountains.map((gora: Gora) => (
                        <button
                          key={gora.id}
                          type="button"
                          onClick={() => handleSelectMountain(gora)}
                          className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted"
                        >
                          <span className="font-medium">{gora.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {gora.height} m
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedMountain && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p>
                    <span className="font-medium">Name of the moutain:</span> {selectedMountain.name}
                  </p>
                  <p>
                    <span className="font-medium">Height:</span> {selectedMountain.height}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Day of the tour</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Expected tour time in hours</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="npr. 5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty (1 - easy tour; 5 - hard tour)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max ="5"
                  placeholder="npr. 2"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                />
              </div>

            
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add the tour description ..."
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {description.length}/{150}
                  </span>
                </div>
              </div>
              

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex justify-end">
                <Button onClick={handleCreatePost} disabled={creatingBoard}>
                  {creatingBoard ? "Creating..." : "Create a tour"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mx-auto mt-8 w-full max-w-6xl">
        {boardsError && !boardsLoading && (
          <p className="text-center text-red-500">Tour error: {boardsError}</p>
        )}

        {!boardsLoading && !boardsError && boards.length === 0 && (
          <p className="text-center text-muted-foreground">
            There are currently no tours.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {boards.map((post) => {
            const mountain = gore?.find(
              (gora) => String(gora.id) === String(post.mountainId)
            )

            return (
              <BoardCard
                key={post.boardId}
                mountainName={mountain?.name ?? "Unknown moutain"}
                mountainHeight={mountain?.height ?? 0}
                date={post.expiryDate}
                duration={String(post.tourTime)}
                organizer={post.username}
                description={post.description} 
                difficulty={post.difficulty}
                onChatClick={() => console.log("Chat for tour:", post.boardId)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BoardPage