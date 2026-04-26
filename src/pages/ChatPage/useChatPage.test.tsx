import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChatPage, LIMIT } from "./useChatPage";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utility/axios";

// Mock dependencies
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("useChatPage", () => {
  const mockDispatch = vi.fn();
  const mockGore = [
    { id: 1, name: "Triglav", height: 2864 },
    { id: 2, name: "Everest", height: 8848 },
    { id: 3, name: "K2", height: 8611 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as any).mockReturnValue(mockDispatch);
    (useSelector as any).mockImplementation((selector: any) =>
      selector({
        mountain: { gore: mockGore, loading: false, error: null },
      })
    );
    
    // Default GET mock
    (api.get as any).mockResolvedValue({ data: [{ id: "p1", tagline: "Hello" }] });
  });

  it("should fetch boards on mount", async () => {
    const { result } = renderHook(() => useChatPage());

    expect(result.current.state.boardsLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.state.boardsLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith("/post", expect.objectContaining({
      params: { offset: 0, limit: LIMIT }
    }));
    expect(result.current.state.boards).toHaveLength(1);
  });

  it("should filter mountains based on mountainQuery", () => {
    const { result } = renderHook(() => useChatPage());

    act(() => {
      result.current.actions.handleMountainQueryChange("Ever");
    });

    expect(result.current.state.filteredMountains).toHaveLength(1);
    expect(result.current.state.filteredMountains[0].name).toBe("Everest");
    expect(result.current.state.mountainSuggestion).toBe(true);
  });

  it("should handle selecting a mountain", () => {
    const { result } = renderHook(() => useChatPage());

    act(() => {
      result.current.actions.handleSelectMountain(mockGore[0]); // Triglav
    });

    expect(result.current.state.selectedMountainId).toBe("1");
    expect(result.current.state.mountainQuery).toBe("Triglav");
    expect(result.current.state.mountainSuggestion).toBe(false);
  });

  it("should show validation error if title or content is missing on submit", async () => {
    const { result } = renderHook(() => useChatPage());

    await act(async () => {
      await result.current.actions.handlePostSubmit();
    });

    expect(result.current.state.validationError).toBe("Post title and Content are required.");
    expect(api.post).not.toHaveBeenCalled();
  });

  it("should handle successful post submission", async () => {
    vi.useFakeTimers();
    (api.post as any).mockResolvedValueOnce({});
    const { result } = renderHook(() => useChatPage());

    act(() => {
      result.current.actions.setTitle("Weekend hike");
      result.current.actions.setContent("It was great!");
    });

    await act(async () => {
      await result.current.actions.handlePostSubmit();
    });

    expect(api.post).toHaveBeenCalledWith("/post/new", {
      tagline: "Weekend hike",
      startMsg: "It was great!",
      mountainId: null,
    });

    expect(result.current.state.showSuccess).toBe(true);
    expect(result.current.state.isDialogOpen).toBe(false);
    
    // Check if fields cleared
    expect(result.current.state.title).toBe("");
    
    act(() => { vi.runAllTimers(); });
    expect(result.current.state.showSuccess).toBe(false);
    vi.useRealTimers();
  });

  it("should handle pagination (Next/Previous)", async () => {
    const { result } = renderHook(() => useChatPage());

    const mockEvent = { preventDefault: vi.fn() } as any;

    act(() => {
      result.current.actions.handleNext(mockEvent);
    });

    expect(result.current.state.offset).toBe(LIMIT);
    
    act(() => {
      result.current.actions.handlePrevious(mockEvent);
    });

    expect(result.current.state.offset).toBe(0);
  });
});