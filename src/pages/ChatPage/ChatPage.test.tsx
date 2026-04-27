import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatPage from "./ChatPage";
import { useChatPage } from "./useChatPage";

vi.mock("./useChatPage", () => ({
  useChatPage: vi.fn(),
  LIMIT: 10,
}));

describe("ChatPage Component", () => {
  const mockActions = {
    setIsDialogOpen: vi.fn(),
    setTitle: vi.fn(),
    setContent: vi.fn(),
    handleMountainQueryChange: vi.fn(),
    setmountainSuggestion: vi.fn(),
    handleSelectMountain: vi.fn(),
    handlePostSubmit: vi.fn(),
    handleNext: vi.fn(),
    handlePrevious: vi.fn(),
  };

  const defaultState = {
    boards: [
      { id: "1", username: "tester", tagline: "Great Hike", startMsg: "Content here", mountainName: "Triglav", timeStamp: "2023-01-01", commentCount: 5 }
    ],
    boardsLoading: false,
    boardsError: null,
    isDialogOpen: false,
    title: "",
    content: "",
    mountainQuery: "",
    mountainSuggestion: false,
    filteredMountains: [],
    validationError: null,
    showSuccess: false,
    offset: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the list of posts correctly", () => {
    (useChatPage as any).mockReturnValue({ state: defaultState, actions: mockActions });
    render(<ChatPage />);

    expect(screen.getByText(/@tester/i)).toBeDefined();
    expect(screen.getByText(/Great Hike/i)).toBeDefined();
    expect(screen.getByText(/View 5 Comments/i)).toBeDefined();
  });

  it("shows the loading state in the board section", () => {
    (useChatPage as any).mockReturnValue({ 
      state: { ...defaultState, boardsLoading: true, boards: [] }, 
      actions: mockActions 
    });
    render(<ChatPage />);
    expect(screen.getByText(/Loading posts.../i)).toBeDefined();
  });

  it("opens the dialog and handles input changes", () => {
    // Simulate dialog being open
    (useChatPage as any).mockReturnValue({ 
      state: { ...defaultState, isDialogOpen: true, title: "Initial Title" }, 
      actions: mockActions 
    });
    
    render(<ChatPage />);

    // Check if Dialog title is visible
    expect(screen.getByText("New post")).toBeDefined();

    // Check title input
    const titleInput = screen.getByPlaceholderText(/My amazing weekend/i);
    expect((titleInput as HTMLInputElement).value).toBe("Initial Title");

    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(mockActions.setTitle).toHaveBeenCalledWith("New Title");
  });

  it("shows mountain suggestions when typing", () => {
    (useChatPage as any).mockReturnValue({ 
      state: { 
        ...defaultState, 
        isDialogOpen: true, 
        mountainSuggestion: true,
        filteredMountains: [{ id: "m1", name: "Mount Everest", height: 8848 }]
      }, 
      actions: mockActions 
    });

    render(<ChatPage />);

    expect(screen.getByText("Mount Everest")).toBeDefined();
    expect(screen.getByText("8848 m")).toBeDefined();

    fireEvent.click(screen.getByText("Mount Everest"));
    expect(mockActions.handleSelectMountain).toHaveBeenCalled();
  });

  it("disables the previous button when offset is 0", () => {
    (useChatPage as any).mockReturnValue({ 
      state: { ...defaultState, offset: 0 }, 
      actions: mockActions 
    });

    render(<ChatPage />);
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton).toBeDisabled();
  });

  it("calls handleNext when Next button is clicked", () => {
    const fullBoards = Array(10).fill(defaultState.boards[0]);
    (useChatPage as any).mockReturnValue({ 
      state: { ...defaultState, boards: fullBoards }, 
      actions: mockActions 
    });

    render(<ChatPage />);
    const nextButton = screen.getByText(/Next/i);
    
    fireEvent.click(nextButton);
    expect(mockActions.handleNext).toHaveBeenCalled();
  });

  it("displays validation errors inside the dialog", () => {
    (useChatPage as any).mockReturnValue({ 
      state: { ...defaultState, isDialogOpen: true, validationError: "Title is required" }, 
      actions: mockActions 
    });

    render(<ChatPage />);
    expect(screen.getByText("Title is required")).toBeDefined();
  });
});