import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatCommentPage from "./ChatCommentPage";
import { useChatCommentPage } from "./useChatCommentPage";
import { useNavigate } from "react-router-dom";

// Mock the hook and navigation
vi.mock("./useChatCommentPage");
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("ChatCommentPage Component", () => {
  const mockNavigate = vi.fn();
  const mockActions = {
    setCommentText: vi.fn(),
    handlePostComment: vi.fn(),
    refreshData: vi.fn(),
  };

  const defaultState = {
    post: {
      id: "1",
      username: "mountain_guy",
      tagline: "Beautiful Day",
      startMsg: "The weather is perfect.",
      mountainName: "Everest",
      timeStamp: "2023-10-01T10:00:00Z",
    },
    comments: [
      { id: 101, username: "climber1", message: "Agree!", timeStamp: "2023-10-01T10:05:00Z" }
    ],
    loading: false,
    commentText: "",
    isSubmitting: false,
    showSuccess: false,
    canSubmit: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it("renders the loading spinner when state.loading is true", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, loading: true },
      actions: mockActions,
    });

    render(<ChatCommentPage />);
    
    const loader = document.querySelector(".animate-spin");
    expect(loader).toBeTruthy();
    
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("renders the post and comments correctly", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: defaultState,
      actions: mockActions,
    });

    render(<ChatCommentPage />);

    expect(screen.getByText("@mountain_guy")).toBeDefined();
    expect(screen.getByText(/everest/i)).toBeDefined();
    expect(screen.getByText("Beautiful Day")).toBeDefined();
    expect(screen.getByText("@climber1")).toBeDefined();
    expect(screen.getByText("Agree!")).toBeDefined();
  });

  it("calls setCommentText when typing in the input", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: defaultState,
      actions: mockActions,
    });

    render(<ChatCommentPage />);
    const input = screen.getByPlaceholderText("Write a comment...");
    
    fireEvent.change(input, { target: { value: "New view!" } });
    expect(mockActions.setCommentText).toHaveBeenCalledWith("New view!");
  });

  it("navigates back when clicking the back button", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: defaultState,
      actions: mockActions,
    });

    render(<ChatCommentPage />);
    const backButton = screen.getAllByRole("button")[0]; // First button in header
    
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("shows success message when showSuccess is true", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, showSuccess: true },
      actions: mockActions,
    });

    render(<ChatCommentPage />);
    expect(screen.getByText("Your comment was successfully posted.")).toBeDefined();
  });

  it("shows 'No comments yet' when comments array is empty", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, comments: [] },
      actions: mockActions,
    });

    render(<ChatCommentPage />);
    expect(screen.getByText("No comments yet.")).toBeDefined();
  });
});