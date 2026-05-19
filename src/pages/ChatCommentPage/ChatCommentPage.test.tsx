import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatCommentPage from "./ChatCommentPage";
import { useChatCommentPage } from "./useChatCommentPage";
import { useNavigate, MemoryRouter } from "react-router-dom";

// Mock the hook and navigation
vi.mock("./useChatCommentPage");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useOutletContext: () => ({ useNewStyle: true }), // Default to new style for tests
  };
});

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
      userId: "user_123",
      username: "mountain_guy",
      tagline: "Beautiful Day",
      startMsg: "The weather is perfect.",
      mountainName: "Everest",
      timeStamp: "2023-10-01T10:00:00Z",
    },
    comments: [
      { id: 101, createdBy: "user_456", username: "climber1", message: "Agree!", timeStamp: "2023-10-01T10:05:00Z" }
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
    localStorage.clear();
  });

  it("renders the loading spinner (New Style)", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, loading: true },
      actions: mockActions,
    });

    render(
      <MemoryRouter>
        <ChatCommentPage />
      </MemoryRouter>
    );
    
    // Check for the specific "Loading..." text in New Style
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the post content correctly", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: defaultState,
      actions: mockActions,
    });

    render(
      <MemoryRouter>
        <ChatCommentPage />
      </MemoryRouter>
    );

    // Using regex to handle the @ symbol and potential formatting
    expect(screen.getByText(/@mountain_guy/i)).toBeInTheDocument();
    expect(screen.getByText("Everest")).toBeInTheDocument();
    expect(screen.getByText("Beautiful Day")).toBeInTheDocument();
    expect(screen.getByText("Agree!")).toBeInTheDocument();
  });

  it("navigates to user profile when clicking username", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: defaultState,
      actions: mockActions,
    });

    render(
      <MemoryRouter>
        <ChatCommentPage />
      </MemoryRouter>
    );

    const userLink = screen.getByText(/@mountain_guy/i);
    fireEvent.click(userLink);
    
    expect(mockNavigate).toHaveBeenCalledWith("/profile/user_123");
  });

  it("shows the empty state message when there are no comments", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, comments: [] },
      actions: mockActions,
    });

    render(
      <MemoryRouter>
        <ChatCommentPage />
      </MemoryRouter>
    );
    
    // Match the New Style empty message
    expect(screen.getByText("There are no comments yet.")).toBeInTheDocument();
  });

  it("shows success notification on successful post", () => {
    (useChatCommentPage as any).mockReturnValue({
      state: { ...defaultState, showSuccess: true },
      actions: mockActions,
    });

    render(
      <MemoryRouter>
        <ChatCommentPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/successfully posted/i)).toBeInTheDocument();
  });
});