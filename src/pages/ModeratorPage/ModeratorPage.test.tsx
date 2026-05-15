import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ModeratorPage from "./ModeratorPage";
import { useModerator } from "./useModeratorPage";

// Mock the custom hook
vi.mock("./useModeratorPage", () => ({
  useModerator: vi.fn(),
}));

describe("ModeratorPage", () => {
  const mockHandleTrain = vi.fn();

  const defaultState = {
    useNewStyle: true,
    loading: false,
    error: null,
    actionLoading: false,
    isEmpty: false,
    itemId: "123",
    category: "Spam",
    timestamp: "2023-10-27T10:00:00Z",
    confidence: "95",
    reason: "suspicious links",
    content: "Buy cheap watches now!",
    f1: "0.88",
    precision: "0.90",
    recall: "0.86",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state correctly", () => {
    (useModerator as any).mockReturnValue({
      state: { ...defaultState, loading: true },
      actions: { handleTrain: mockHandleTrain },
    });

    render(<ModeratorPage />);
    expect(screen.getByText(/Loading moderation.../i)).toBeInTheDocument();
  });

  it("renders content and handles Approve/Reject actions", () => {
    (useModerator as any).mockReturnValue({
      state: defaultState,
      actions: { handleTrain: mockHandleTrain },
    });

    render(<ModeratorPage />);

    expect(screen.getByText(new RegExp(defaultState.content, "i"))).toBeInTheDocument();
    expect(screen.getByText(`${defaultState.confidence}%`)).toBeInTheDocument();

    const rejectBtn = screen.getByRole("button", { name: /REJECT/i });
    fireEvent.click(rejectBtn);
    expect(mockHandleTrain).toHaveBeenCalledWith(true);

    const approveBtn = screen.getByRole("button", { name: /APPROVE/i });
    fireEvent.click(approveBtn);
    expect(mockHandleTrain).toHaveBeenCalledWith(false);
  });

  it("displays empty state and disables buttons when no content is available", () => {
    (useModerator as any).mockReturnValue({
      state: { ...defaultState, isEmpty: true, content: "" },
      actions: { handleTrain: mockHandleTrain },
    });

    render(<ModeratorPage />);

    expect(screen.getByText(/No new content to moderate/i)).toBeInTheDocument();

    const rejectBtn = screen.getByRole("button", { name: /REJECT/i });
    const approveBtn = screen.getByRole("button", { name: /APPROVE/i });

    expect(rejectBtn).toBeDisabled();
    expect(approveBtn).toBeDisabled();
  });
});