import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useOutletContext } from "react-router-dom";
import api from "@/utility/axios";
import ModeratorPage from "./ModeratorPage";

vi.mock("react-router-dom", () => ({
  useOutletContext: vi.fn(),
}));

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("ModeratorPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    (useOutletContext as any).mockReturnValue({
      useNewStyle: true,
    });
  });

  it("shows loading state first", () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));

    render(<ModeratorPage />);

    expect(screen.getByText("Nalaganje moderacije...")).toBeInTheDocument();
  });

  it("renders moderation item from API", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") {
        return Promise.resolve({
          data: {
            id: 1,
            username: "testuser",
            category: "Komentar",
            message: "To je testna vsebina",
            timestamp: "2026-05-08T12:00:00Z",
            confidencePercentage: 75,
            reason: "možno spam vsebino",
          },
        });
      }

      if (url === "/moderator/metrics") {
        return Promise.resolve({
          data: {
            f1Score: 0.91,
            precision: 0.88,
            recall: 0.93,
          },
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(<ModeratorPage />);

    await waitFor(() => {
      expect(screen.getByText("Moderacija vsebin")).toBeInTheDocument();
    });

    expect(screen.getByText("@testuser")).toBeInTheDocument();
    expect(screen.getByText("Kategorija: Komentar")).toBeInTheDocument();
    expect(screen.getByText('"To je testna vsebina"')).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("0.91")).toBeInTheDocument();
    expect(screen.getByText("0.88")).toBeInTheDocument();
    expect(screen.getByText("0.93")).toBeInTheDocument();
  });

  it("renders empty state when there is no item to moderate", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") {
        return Promise.resolve({ data: null });
      }

      if (url === "/moderator/metrics") {
        return Promise.resolve({
          data: {
            f1Score: 0.8,
            precision: 0.7,
            recall: 0.6,
          },
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    render(<ModeratorPage />);

    await waitFor(() => {
      expect(screen.getByText("Ni novih vsebin za moderacijo")).toBeInTheDocument();
    });

    expect(screen.getByText("ZAVRNI")).toBeDisabled();
    expect(screen.getByText("ODOBRI")).toBeDisabled();
  });

  it("sends train request when rejecting content", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") {
        return Promise.resolve({
          data: {
            id: 5,
            username: "spamuser",
            message: "Spam message",
            confidencePercentage: 80,
          },
        });
      }

      if (url === "/moderator/metrics") {
        return Promise.resolve({
          data: {
            f1Score: 1,
            precision: 1,
            recall: 1,
          },
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    (api.post as any).mockResolvedValue({ status: 200 });

    render(<ModeratorPage />);

    await waitFor(() => {
      expect(screen.getByText('"Spam message"')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("ZAVRNI"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/moderator/train", null, {
        params: {
          messageId: 5,
          isSpam: true,
        },
      });
    });
  });

  it("sends train request when approving content", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url === "/moderator/ambiguous") {
        return Promise.resolve({
          data: {
            id: 7,
            username: "normaluser",
            message: "Normal message",
            confidencePercentage: 40,
          },
        });
      }

      if (url === "/moderator/metrics") {
        return Promise.resolve({
          data: {
            f1Score: 1,
            precision: 1,
            recall: 1,
          },
        });
      }

      return Promise.reject(new Error("Unknown endpoint"));
    });

    (api.post as any).mockResolvedValue({ status: 200 });

    render(<ModeratorPage />);

    await waitFor(() => {
      expect(screen.getByText('"Normal message"')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("ODOBRI"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/moderator/train", null, {
        params: {
          messageId: 7,
          isSpam: false,
        },
      });
    });
  });

  it("shows error when API fails", async () => {
    (api.get as any).mockRejectedValue({
      response: {
        data: {
          message: "Napaka iz API-ja",
        },
      },
    });

    render(<ModeratorPage />);

    await waitFor(() => {
      expect(screen.getByText("Napaka iz API-ja")).toBeInTheDocument();
    });
  });
});