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
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mountain, Plus, Calendar, Clock, TrendingUp, FileText, AlertCircle } from "lucide-react";

function BoardPage() {
  const navigate = useNavigate();
  const { state, actions } = useBoardPage();
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
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-4 border-b border-[#dce3d7]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#17231b]">Ture</h1>
              </div>
              <p className="text-[#647067] text-sm mt-1">
                Pregled objavljenih planinskih tur in poti
              </p>
            </div>

            <Dialog open={state.open} onOpenChange={actions.handleDialogChange}>
              <DialogTrigger asChild>
                <Button className="bg-[#2f6b4f] hover:bg-[#214b39] text-white rounded-lg gap-2">
                  <Plus className="w-4 h-4" />
                  Nova tura
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[550px] rounded-xl border-[#dce3d7]">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                    <DialogTitle className="text-xl text-[#17231b]">Ustvari novo turo</DialogTitle>
                  </div>
                  <p className="text-sm text-[#647067]">Delite svojo planinsko izkušnjo z drugimi</p>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Mountain Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="mountain-search" className="text-[#17231b] font-medium flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-[#2f6b4f]" />
                      Izbira gore
                    </Label>
                    <div className="relative">
                      <Input
                        id="mountain-search"
                        placeholder="Vnesite ime gore ..."
                        value={state.mountainQuery}
                        onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                        onFocus={() => actions.setmountainSuggestion(true)}
                        autoComplete="off"
                        className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                      />

                      {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-white shadow-lg border border-[#dce3d7]">
                          {state.filteredMountains.map((gora: Gora) => (
                            <button
                              key={gora.id}
                              type="button"
                              onClick={() => actions.handleSelectMountain(gora)}
                              className="flex w-full justify-between items-center px-4 py-2 text-left hover:bg-[#f0f4ea] transition-colors border-b border-[#e5eadf] last:border-0"
                            >
                              <span className="font-medium text-[#17231b]">{gora.name}</span>
                              <span className="text-sm text-[#647067]">{gora.height} m</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Mountain Preview */}
                  {state.selectedMountain && (
                    <div className="rounded-lg bg-[#f0f4ea] p-3 border border-[#dce3d7]">
                      <p className="text-sm">
                        <span className="font-medium text-[#17231b]">Izbrana gora:</span>{" "}
                        <span className="text-[#2f6b4f] font-semibold">{state.selectedMountain.name}</span>
                        {" · "}
                        <span className="text-[#316f8f]">{state.selectedMountain.height} m</span>
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-[#17231b] font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#c7792b]" />
                      Datum ture
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={state.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => actions.setDate(e.target.value)}
                      className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                    />
                  </div>

                  {/* Duration and Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-[#17231b] font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#316f8f]" />
                        Trajanje (ure)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="npr. 5"
                        value={state.duration}
                        onChange={(e) => actions.setDuration(e.target.value)}
                        className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-[#17231b] font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#c7792b]" />
                        Zahtevnost (1-5)
                      </Label>
                      <Input
                        id="difficulty"
                        type="number"
                        min="1"
                        max="5"
                        placeholder="npr. 3"
                        value={state.difficulty}
                        onChange={(e) => actions.setDifficulty(e.target.value)}
                        className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#17231b] font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#647067]" />
                      Opis ture
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Delite podrobnosti o poti, razmerah in izkušnjah ..."
                      value={state.description}
                      onChange={(e) => actions.handleDescriptionChange(e.target.value)}
                      className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg min-h-[100px]"
                    />
                    <p className="text-right text-xs text-[#647067]">
                      {state.description.length}/150
                    </p>
                  </div>

                  {/* Error Message */}
                  {state.formError && (
                    <div className="flex items-center gap-2 text-sm text-[#b2473e] bg-[#fff4f2] p-3 rounded-lg border border-[#ecc1bb]">
                      <AlertCircle className="w-4 h-4" />
                      {state.formError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end pt-2">
                    <Button 
                      onClick={actions.handleCreatePost} 
                      disabled={state.creatingBoard}
                      className="bg-[#2f6b4f] hover:bg-[#214b39] text-white rounded-lg gap-2"
                    >
                      {state.creatingBoard ? "Ustvarjanje..." : "Objavi turo"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Content */}
          <div className="mt-6">
            {/* Loading State */}
            {state.boardsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f6b4f]"></div>
                <span className="ml-3 text-[#647067]">Nalaganje tur...</span>
              </div>
            )}

            {/* Error State */}
            {state.boardsError && !state.boardsLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-[#b2473e] bg-[#fff4f2] px-4 py-2 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>Napaka: {state.boardsError}</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!state.boardsLoading && !state.boardsError && state.boards.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f0f4ea] flex items-center justify-center">
                  <Mountain className="w-8 h-8 text-[#647067]" />
                </div>
                <p className="text-[#647067]">Trenutno ni objavljenih tur.</p>
                <p className="text-sm text-[#647067] mt-1">Bodite prvi, ki deli svojo izkušnjo!</p>
              </div>
            )}

            {/* Board Cards Grid */}
            <div className="flex flex-wrap justify-center gap-6">
              {state.boards.map((post) => {
                const mountain = state.gore?.find(
                  (gora) => String(gora.id) === String(post.mountainId)
                );

                return (
                  <BoardCard
                    key={post.boardId}
                    mountainName={mountain?.name ?? "Neznana gora"}
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
      </div>
    );
  }

  // Old Style (Original Design)
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