import { useNavigate } from "react-router-dom";
import BoardCard from "@/components/common/BoardCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBoardPage } from "./useBoardPage";
import type { Gora } from "@/utility/stores_slices/goreSlice";

function BoardPage() {
  const navigate = useNavigate();
  const { state, actions } = useBoardPage();

  return (
    <div className="px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tours</h1>

        <Dialog open={state.open} onOpenChange={actions.handleDialogChange}>
          <DialogTrigger asChild>
            <Button>Create new tour</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Create new tour</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mountain-search">Mountain</Label>
                <div className="relative">
                  <Input
                    id="mountain-search"
                    placeholder="Ime gore ..."
                    value={state.mountainQuery}
                    onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                    onFocus={() => actions.setmountainSuggestion(true)}
                    autoComplete="off"
                  />

                  {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-background shadow-md border">
                      {state.filteredMountains.map((gora: Gora) => (
                        <button
                          key={gora.id}
                          type="button"
                          onClick={() => actions.handleSelectMountain(gora)}
                          className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted"
                        >
                          <span className="font-medium">{gora.name}</span>
                          <span className="text-sm text-muted-foreground">{gora.height} m</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {state.selectedMountain && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p><span className="font-medium">Mountain:</span> {state.selectedMountain.name}</p>
                  <p><span className="font-medium">Height:</span> {state.selectedMountain.height} m</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Day of the tour</Label>
                <Input
                  id="date"
                  type="date"
                  value={state.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => actions.setDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Time (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={state.duration}
                    onChange={(e) => actions.setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="1"
                    max="5"
                    placeholder="e.g. 2"
                    value={state.difficulty}
                    onChange={(e) => actions.setDifficulty(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add the tour description ..."
                  value={state.description}
                  onChange={(e) => actions.handleDescriptionChange(e.target.value)}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {state.description.length}/150
                </p>
              </div>

              {state.formError && <p className="text-sm text-red-500">{state.formError}</p>}

              <div className="flex justify-end">
                <Button onClick={actions.handleCreatePost} disabled={state.creatingBoard}>
                  {state.creatingBoard ? "Creating..." : "Create a tour"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mx-auto mt-8 w-full max-w-6xl">
        {state.boardsError && !state.boardsLoading && (
          <p className="text-center text-red-500">Error: {state.boardsError}</p>
        )}

        {!state.boardsLoading && !state.boardsError && state.boards.length === 0 && (
          <p className="text-center text-muted-foreground">There are currently no tours.</p>
        )}

        <div className="flex flex-wrap justify-center gap-6">
          {state.boards.map((post) => {
            const mountain = state.gore?.find(
              (gora) => String(gora.id) === String(post.mountainId)
            );

            return (
              <BoardCard
                key={post.boardId}
                mountainName={mountain?.name ?? "Unknown mountain"}
                mountainHeight={mountain?.height ?? 0}
                date={post.expiryDate}
                duration={String(post.tourTime)}
                organizer={post.username}
                description={post.description}
                difficulty={post.difficulty}
                onChatClick={() =>
                  navigate(`/board/${post.boardId}`, {
                    state: { organizer: post.username },
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BoardPage;

