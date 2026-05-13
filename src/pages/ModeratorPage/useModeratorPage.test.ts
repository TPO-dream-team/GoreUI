import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useModerator } from "./useModeratorPage";
import { useOutletContext } from "react-router-dom";
import api from "@/utility/axios";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useOutletContext: vi.fn(),
}));

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("useModerator", () => {
  const mockMetrics = {
    f1Score: 0.856,
    precision: 0.9,
    recall: 0.8,
  };

  const mockItem = {
    id: "msg-123",
    username: "mountain_climber",
    type: "Spam",
    msg: "Buy cheap gear here!",
    timestamp: "2023-10-27T10:00:00Z",
    confidence: 85,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useOutletContext as any).mockReturnValue({ useNewStyle: true });
    
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") return Promise.resolve({ data: mockItem });
      if (url === "/moderator/metrics") return Promise.resolve({ data: mockMetrics });
      return Promise.reject(new Error("Not Found"));
    });
  });

  it("successfully fetches and maps complex API data on mount", async () => {
    const { result } = renderHook(() => useModerator());

    expect(result.current.state.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.content).toBe("Buy cheap gear here!");
    expect(result.current.state.category).toBe("Spam");
    expect(result.current.state.itemId).toBe("msg-123");
    
    expect(result.current.state.f1).toBe("0.86");
    expect(result.current.state.precision).toBe("0.90");
  });

  it("handles the training action and reloads data", async () => {
    (api.post as any).mockResolvedValue({ data: { success: true } });
    
    const { result } = renderHook(() => useModerator());

    await waitFor(() => expect(result.current.state.loading).toBe(false));

    // Perform action
    await act(async () => {
      await result.current.actions.handleTrain(true);
    });

    // Verify POST was called with correct params
    expect(api.post).toHaveBeenCalledWith("/moderator/train", null, {
      params: { messageId: "msg-123", isSpam: true },
    });

    expect(api.get).toHaveBeenCalledTimes(4); // (ambiguous + metrics) * 2
  });

  it("handles 404 error from ambiguous endpoint as an empty state", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") {
        return Promise.reject({ response: { status: 404 } });
      }
      return Promise.resolve({ data: mockMetrics });
    });

    const { result } = renderHook(() => useModerator());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    // Should not have an error, but should be empty
    expect(result.current.state.error).toBe("");
    expect(result.current.state.isEmpty).toBe(true);
    expect(result.current.state.itemId).toBe("-");
    // Metrics should still be loaded
    expect(result.current.state.f1).toBe("0.86");
  });
});