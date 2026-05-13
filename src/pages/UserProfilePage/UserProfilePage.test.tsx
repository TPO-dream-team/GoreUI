import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UserProfilePage from "./UserProfilePage";
import { useUserProfile } from "./useUserProfile";

vi.mock("./useUserProfile", () => ({
  useUserProfile: vi.fn(),
}));

describe("UserProfilePage", () => {
  const mockProfile = {
    user: { username: "mountain_climber" },
  };

  const mockScans = [
    {
      scanId: "1",
      mountainName: "Triglav",
      mountainHeight: 2864,
      verifiedAt: "2023-08-15T10:00:00Z",
    },
  ];

  const mockBoards = [
    {
      boardId: "b1",
      mountainName: "Grintovec",
      difficulty: "3",
      description: "Beautiful route",
      expiryDate: "2024-12-31",
      tourTime: "5",
    },
  ];

  const defaultState = {
    useNewStyle: true,
    profile: mockProfile,
    loading: false,
    error: null,
    userScans: mockScans,
    userBoards: mockBoards,
    userPosts: [],
    totalSummits: 1,
    uniqueSummits: 1,
    lastAchievement: mockScans[0],
    mostClimbed: { name: "Triglav" },
    averageDifficulty: "2.5",
    derivedLevel: "Intermediate",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <UserProfilePage />
      </MemoryRouter>
    );

  it("renders loading state", () => {
    (useUserProfile as any).mockReturnValue({
      state: { ...defaultState, loading: true },
    });
    renderComponent();
    expect(screen.getByText(/loading profile.../i)).toBeDefined();
  });

  it("renders error state when profile is missing or error exists", () => {
    (useUserProfile as any).mockReturnValue({
      state: { ...defaultState, error: "Failed to fetch" },
    });
    renderComponent();
    expect(screen.getByText(/failed to fetch/i)).toBeDefined();
  });

  describe("New Style Theme (Mountain Theme)", () => {
    beforeEach(() => {
      (useUserProfile as any).mockReturnValue({
        state: { ...defaultState, useNewStyle: true },
      });
    });

    it("renders the username with the @ prefix", () => {
      renderComponent();
      expect(screen.getByText("@mountain_climber")).toBeDefined();
    });

    it("displays the derived level and achievement count badge", () => {
      renderComponent();
      expect(screen.getByText("Intermediate")).toBeDefined();
      expect(screen.getByText(/1 achievements/i)).toBeDefined();
    });

    it("renders the Stats Cards with correct labels", () => {
      renderComponent();
      expect(screen.getByText(/All ascents/i)).toBeDefined();
      expect(screen.getByText(/Unique peaks/i)).toBeDefined();
      expect(screen.getByText("2.5")).toBeDefined(); // averageDifficulty
    });

    it("lists achievements correctly", () => {
      renderComponent();
      expect(screen.getByText("Triglav")).toBeDefined();
      expect(screen.getByText(/2864 m/i)).toBeDefined();
    });

    it("shows empty state message for scans", () => {
      (useUserProfile as any).mockReturnValue({
        state: { ...defaultState, userScans: [] },
      });
      renderComponent();
      expect(screen.getByText(/no verified ascents yet/i)).toBeDefined();
    });
  });

  describe("Old Style Theme (Classic)", () => {
    beforeEach(() => {
      (useUserProfile as any).mockReturnValue({
        state: { ...defaultState, useNewStyle: false },
      });
    });

    it("renders board activity links", () => {
      renderComponent();
      const boardLink = screen.getByRole("link", { name: /Grintovec/i });
      expect(boardLink.getAttribute("href")).toBe("/board/b1");
    });

    it("displays the correct number of comments in post badges", () => {
      (useUserProfile as any).mockReturnValue({
        state: { 
          ...defaultState, 
          useNewStyle: false,
          userPosts: [{ id: "p1", tagline: "Great Day", commentCount: 5, mountainName: "Krn", timeStamp: "2023-01-01" }]
        },
      });
      renderComponent();
      expect(screen.getByText(/5 comments/i)).toBeDefined();
    });
  });

  it("formats dates using Slovenian locale (sl-SI)", () => {
    (useUserProfile as any).mockReturnValue({
      state: { ...defaultState, useNewStyle: true },
    });
    renderComponent();
    // 2023-08-15 in sl-SI usually results in "15. avg. 2023" or similar depending on environment
    expect(screen.getByText(/15\./)).toBeDefined();
    expect(screen.getByText(/2023/)).toBeDefined();
  });
});