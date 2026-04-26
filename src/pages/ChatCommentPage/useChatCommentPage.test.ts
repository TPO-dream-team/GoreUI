import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChatCommentPage } from "./useChatCommentPage"; // adjust path
import api from "@/utility/axios";
import { useParams } from "react-router-dom";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("useChatCommentPage", () => {
  const mockPost = { id: "123", username: "hiker1", tagline: "Great view!", startMsg: "Hello", timeStamp: "2023-01-01" };
  const mockComments = [{ id: 1, createdBy: "user2", message: "Nice!", username: "user2", timeStamp: "2023-01-02" }];

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: "123" });

    // Default successful API responses
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/post/123") return Promise.resolve({ data: mockPost });
      if (url === "/post/123/comments") return Promise.resolve({ data: mockComments });
      return Promise.reject(new Error("Not Found"));
    });
  });

  it("should fetch post and comments on mount", async () => {
    const { result } = renderHook(() => useChatCommentPage());

    // Initially loading
    expect(result.current.state.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.post).toEqual(mockPost);
    expect(result.current.state.comments).toEqual(mockComments);
  });

  it("should update commentText and reflect in canSubmit", async () => {
    const { result } = renderHook(() => useChatCommentPage());

    act(() => {
      result.current.actions.setCommentText("Awesome post!");
    });

    expect(result.current.state.commentText).toBe("Awesome post!");
    expect(result.current.state.canSubmit).toBe(true);
  });

  it("should handle successful comment submission", async () => {
    const newComment = { id: 2, message: "New Comment" };

    let postHasOccurred = false;
    (api.post as any).mockImplementation(async () => {
      postHasOccurred = true;
      return {};
    });

    (api.get as any).mockImplementation((url: string) => {
      if (url === "/post/123/comments") {
        return Promise.resolve({
          data: postHasOccurred ? [...mockComments, newComment] : mockComments
        });
      }
      return Promise.resolve({ data: mockPost });
    });

    const { result } = renderHook(() => useChatCommentPage());

    await waitFor(() => expect(result.current.state.loading).toBe(false));
    expect(result.current.state.comments).toHaveLength(1);

    act(() => {
      result.current.actions.setCommentText("New Comment");
    });

    await act(async () => {
      await result.current.actions.handlePostComment();
    });

    expect(api.post).toHaveBeenCalledWith("/post/123/comments", { message: "New Comment" });
    expect(result.current.state.commentText).toBe("");
    expect(result.current.state.showSuccess).toBe(true);

    expect(result.current.state.comments).toHaveLength(2);
  });

  it("should not submit if commentText is empty", async () => {
    const { result } = renderHook(() => useChatCommentPage());

    await act(async () => {
      await result.current.actions.handlePostComment();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it("should handle errors during data fetching", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
    (api.get as any).mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useChatCommentPage());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith("Error fetching discussion:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});