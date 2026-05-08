import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter } from "react-router-dom"
import api from "@/utility/axios"
import UserProfilePage from "./UserProfilePage"

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom")

  return {
    ...actual,
    useParams: () => ({
      id: "user-123",
    }),
  }
})

describe("UserProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function renderPage() {
    return render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    )
  }

  it("shows loading state first", () => {
    ;(api.get as any).mockReturnValue(new Promise(() => {}))

    renderPage()

    expect(screen.getByText("Loading profile...")).toBeInTheDocument()
  })

  it("renders user profile data", async () => {
    ;(api.get as any).mockImplementation((url: string) => {
      if (url === "/user/user-123/profile") {
        return Promise.resolve({
          data: {
            user: {
              id: "user-123",
              username: "testuser",
            },
            scans: [
              {
                id: 1,
                userId: "user-123",
                mountainId: "mountain-1",
                timestamp: "2026-05-08T12:00:00Z",
                mountainName: "Triglav",
                mountainHeight: 2864,
              },
            ],
            boards: [],
          },
        })
      }

      if (url === "/user/user-123/boards") {
        return Promise.resolve({
          data: [
            {
              boardId: "board-1",
              expiryDate: "2026-06-01",
              username: "testuser",
              userId: "user-123",
              mountainId: "mountain-1",
              description: "Planirana tura na Triglav",
              tourTime: 6,
              difficulty: 4,
            },
          ],
        })
      }

      if (url === "/post") {
        return Promise.resolve({
          data: [
            {
              id: 10,
              tagline: "Moj prvi post",
              username: "testuser",
              mountainName: "Triglav",
              commentCount: 3,
              startMsg: "Danes je bil super vzpon.",
              timeStamp: "2026-05-08T10:00:00Z",
            },
          ],
        })
      }

      return Promise.reject(new Error("Unknown endpoint"))
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("@testuser")).toBeInTheDocument()
    })

    expect(screen.getByText("Verified achievements")).toBeInTheDocument()
    expect(screen.getByText("Triglav")).toBeInTheDocument()
    expect(screen.getByText("2864 m")).toBeInTheDocument()

    expect(screen.getByText("Board activity")).toBeInTheDocument()
    expect(screen.getByText("Planirana tura na Triglav")).toBeInTheDocument()
    expect(screen.getByText("Difficulty: 4")).toBeInTheDocument()

    expect(screen.getByText("Recent posts")).toBeInTheDocument()
    expect(screen.getByText("Moj prvi post")).toBeInTheDocument()
    expect(screen.getByText("Danes je bil super vzpon.")).toBeInTheDocument()
    expect(screen.getByText("3 comments")).toBeInTheDocument()
  })

  it("shows empty states when user has no scans, boards or posts", async () => {
    ;(api.get as any).mockImplementation((url: string) => {
      if (url === "/user/user-123/profile") {
        return Promise.resolve({
          data: {
            user: {
              id: "user-123",
              username: "emptyuser",
            },
            scans: [],
            boards: [],
          },
        })
      }

      if (url === "/user/user-123/boards") {
        return Promise.resolve({ data: [] })
      }

      if (url === "/post") {
        return Promise.resolve({ data: [] })
      }

      return Promise.reject(new Error("Unknown endpoint"))
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("@emptyuser")).toBeInTheDocument()
    })

    expect(screen.getByText("Uporabnik še nima verificiranih dosežkov.")).toBeInTheDocument()
    expect(screen.getByText("Uporabnik še nima objav.")).toBeInTheDocument()
    expect(screen.getByText("Beginner")).toBeInTheDocument()
    expect(screen.getByText("0.0")).toBeInTheDocument()
  })

  it("filters posts by username", async () => {
    ;(api.get as any).mockImplementation((url: string) => {
      if (url === "/user/user-123/profile") {
        return Promise.resolve({
          data: {
            user: {
              id: "user-123",
              username: "testuser",
            },
            scans: [],
            boards: [],
          },
        })
      }

      if (url === "/user/user-123/boards") {
        return Promise.resolve({ data: [] })
      }

      if (url === "/post") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              tagline: "Pravi post",
              username: "testuser",
              mountainName: "Triglav",
              commentCount: 1,
              startMsg: "To se mora prikazati.",
              timeStamp: "2026-05-08T10:00:00Z",
            },
            {
              id: 2,
              tagline: "Tuj post",
              username: "otheruser",
              mountainName: "Mangart",
              commentCount: 2,
              startMsg: "To se ne sme prikazati.",
              timeStamp: "2026-05-08T11:00:00Z",
            },
          ],
        })
      }

      return Promise.reject(new Error("Unknown endpoint"))
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Pravi post")).toBeInTheDocument()
    })

    expect(screen.queryByText("Tuj post")).not.toBeInTheDocument()
    expect(screen.queryByText("To se ne sme prikazati.")).not.toBeInTheDocument()
  })

  it("renders clickable board and post links", async () => {
    ;(api.get as any).mockImplementation((url: string) => {
      if (url === "/user/user-123/profile") {
        return Promise.resolve({
          data: {
            user: {
              id: "user-123",
              username: "testuser",
            },
            scans: [],
            boards: [],
          },
        })
      }

      if (url === "/user/user-123/boards") {
        return Promise.resolve({
          data: [
            {
              boardId: "board-123",
              expiryDate: "2026-06-01",
              username: "testuser",
              userId: "user-123",
              mountainId: "mountain-1",
              description: "Klikabilna tura",
              tourTime: 5,
              difficulty: 3,
            },
          ],
        })
      }

      if (url === "/post") {
        return Promise.resolve({
          data: [
            {
              id: 55,
              tagline: "Klikabilen post",
              username: "testuser",
              mountainName: "Triglav",
              commentCount: 0,
              startMsg: "Post content",
              timeStamp: "2026-05-08T10:00:00Z",
            },
          ],
        })
      }

      return Promise.reject(new Error("Unknown endpoint"))
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Klikabilna tura")).toBeInTheDocument()
    })

    const boardLink = screen.getByText("Klikabilna tura").closest("a")
    const postLink = screen.getByText("Klikabilen post").closest("a")

    expect(boardLink).toHaveAttribute("href", "/board/board-123")
    expect(postLink).toHaveAttribute("href", "/chat/55")
  })

  it("shows error when API fails", async () => {
    ;(api.get as any).mockRejectedValue({
      response: {
        data: {
          message: "Profile API error",
        },
      },
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText("Profile API error")).toBeInTheDocument()
    })
  })
})