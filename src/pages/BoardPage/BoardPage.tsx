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
import {Mountain, Plus,Calendar as CalendarIcon,Clock, TrendingUp, FileText,AlertCircle} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover";

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
      <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
        <div className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-4 border-b border-brand-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-headline">Tours</h1>
              </div>
              <p className="text-brand-body text-sm mt-1">
                Browse published hikes
              </p>
            </div>

            <Dialog open={state.open} onOpenChange={actions.handleDialogChange}>
              <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-hover-green text-white rounded-button gap-2">
                  <Plus className="w-4 h-4" />
                  New tour
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[550px] rounded-xl border-brand-border">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center">
                      <Mountain className="w-4 h-4 text-white" />
                    </div>
                    <DialogTitle className="text-xl text-brand-headline">Create a new tour</DialogTitle>
                  </div>
                  <p className="text-sm text-brand-body">Share your hiking experience with others</p>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Mountain Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="mountain-search" className="text-brand-headline font-medium flex items-center gap-2">
                      <Mountain className="w-4 h-4 text-brand-primary" />
                      Mountain selection
                    </Label>
                    <div className="relative">
                      <Input
                        id="mountain-search"
                        placeholder="Enter mountain name ..."
                        value={state.mountainQuery}
                        onChange={(e) => actions.handleMountainQueryChange(e.target.value)}
                        onFocus={() => actions.setmountainSuggestion(true)}
                        autoComplete="off"
                        className="border-brand-border focus:border-brand-primary focus:ring-brand-primary/20 rounded-button"
                      />

                      {state.mountainSuggestion && state.filteredMountains.length > 0 && (
                        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-white shadow-lg border border-brand-border">
                          {state.filteredMountains.map((gora: Gora) => (
                            <button
                              key={gora.id}
                              type="button"
                              onClick={() => actions.handleSelectMountain(gora)}
                              className="flex w-full justify-between items-center px-4 py-2 text-left hover:bg-brand-accent-sage transition-colors border-b border-brand-border/40 last:border-0"
                            >
                              <span className="font-medium text-brand-headline">{gora.name}</span>
                              <span className="text-sm text-brand-body">{gora.height} m</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Mountain Preview */}
                  {state.selectedMountain && (
                    <div className="rounded-lg bg-brand-accent-sage p-3 border border-brand-border">
                      <p className="text-sm">
                        <span className="font-medium text-brand-headline">Selected mountain:</span>{" "}
                        <span className="text-brand-primary font-semibold">{state.selectedMountain.name}</span>
                        {" · "}
                        <span className="text-brand-hover-blue">{state.selectedMountain.height} m</span>
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  <div className="space-y-2">
                    <Label className="text-brand-headline font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-brand-warning" />
                      Tour date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-brand-border hover:bg-brand-accent-sage rounded-button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {state.date ? (
                            format(new Date(state.date), "PPP")
                          ) : (
                            <span>Select a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          startMonth={new Date()}
                          endMonth={new Date(new Date().getFullYear() + 5, 11)}
                          selected={state.date ? new Date(state.date) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const offset = date.getTimezoneOffset();
                              const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                              actions.setDate(localDate.toISOString().split("T")[0]);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Duration and Difficulty */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-brand-headline font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-hover-blue" />
                        Duration (hours)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="e.g. 5"
                        value={state.duration}
                        onChange={(e) => actions.setDuration(e.target.value)}
                        className="border-brand-border focus:border-brand-primary focus:ring-brand-primary/20 rounded-button"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-brand-headline font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-brand-warning" />
                        Difficulty (1-5)
                      </Label>
                      <Input
                        id="difficulty"
                        type="number"
                        min="1"
                        max="5"
                        placeholder="e.g. 3"
                        value={state.difficulty}
                        onChange={(e) => actions.setDifficulty(e.target.value)}
                        className="border-brand-border focus:border-brand-primary focus:ring-brand-primary/20 rounded-button"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-brand-headline font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-body" />
                      Tour description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Share details about the route, conditions, and experience ..."
                      value={state.description}
                      onChange={(e) => actions.handleDescriptionChange(e.target.value)}
                      className="border-brand-border focus:border-brand-primary focus:ring-brand-primary/20 rounded-button min-h-[100px]"
                    />
                    <p className="text-right text-xs text-brand-body">
                      {state.description.length}/150
                    </p>
                  </div>

                  {/* Error Message */}
                  {state.formError && (
                    <div className="flex items-center gap-2 text-sm text-brand-error-text bg-brand-error-bg p-3 rounded-button border border-brand-error-border">
                      <AlertCircle className="w-4 h-4" />
                      {state.formError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end pt-2">
                    <Button 
                      onClick={actions.handleCreatePost} 
                      disabled={state.creatingBoard}
                      className="bg-brand-primary hover:bg-brand-hover-green text-white rounded-button gap-2"
                    >
                      {state.creatingBoard ? "Creating..." : "Publish tour"}
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                <span className="ml-3 text-brand-body">Loading tours...</span>
              </div>
            )}

            {/* Error State */}
            {state.boardsError && !state.boardsLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-brand-error-text bg-brand-error-bg px-4 py-2 rounded-button border border-brand-error-border">
                  <AlertCircle className="w-5 h-5" />
                  <span>Error: {state.boardsError}</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!state.boardsLoading && !state.boardsError && state.boards.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-accent-sage flex items-center justify-center">
                  <Mountain className="w-8 h-8 text-brand-body" />
                </div>
                <p className="text-brand-body">There are currently no published tours.</p>
                <p className="text-sm text-brand-body mt-1">Be the first to share your experience!</p>
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
                    mountainName={mountain?.name ?? "Unknown mountain"}
                    mountainHeight={mountain?.height ?? 0}
                    date={post.expiryDate}
                    duration={String(post.tourTime)}
                    organizer={post.username}
                    description={post.description}
                    difficulty={post.difficulty}
                    onOrganizerClick={() => navigate(`/profile/${post.userId}`)}
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
                    placeholder="Mountain name ..."
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
                <Label>Day of the tour</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {state.date ? (
                        format(new Date(state.date), "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      startMonth={new Date()}
                      endMonth={new Date(new Date().getFullYear() + 5, 11)}
                      selected={state.date ? new Date(state.date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          actions.setDate(date.toISOString().split("T")[0]);
                        }
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
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
                onOrganizerClick={() => navigate(`/profile/${post.userId}`)}
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