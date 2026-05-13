import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserProfile } from "./useUserProfile";
import { useParams, useOutletContext } from "react-router-dom";
import api from "@/utility/axios";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useOutletContext: vi.fn(),
}));

vi.mock("@/utility/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("useUserProfile", () => {
  const mockUserId = "user-123";
  const mockProfileData = {
    user: { id: "user-123", username: "MountainGoat" },
    scans: [
      { id: 1, mountainId: "m1", mountainName: "Everest", mountainHeight: 8848, timestamp: "2023-01-01" },
      { id: 2, mountainId: "m2", mountainName: "K2", mountainHeight: 8611, timestamp: "2023-02-01" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as any).mockReturnValue({ id: mockUserId });
    (useOutletContext as any).mockReturnValue({});
  });

  it("successfully fetches profile data and calculates statistics", async () => {
    // Mock API responses
    (api.get as any).mockImplementation((url: string) => {
      if (url.includes("/profile")) return Promise.resolve({ data: mockProfileData });
      if (url.includes("/boards")) return Promise.resolve({ data: [] });
      if (url.includes("/post")) return Promise.resolve({ data: [] });
      return Promise.reject(new Error("Not Found"));
    });

    const { result } = renderHook(() => useUserProfile());

    // Check loading state
    expect(result.current.state.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    // Verify derived state
    expect(result.current.state.profile?.user.username).toBe("MountainGoat");
    expect(result.current.state.totalSummits).toBe(2); 
    expect(result.current.state.uniqueSummits).toBe(2);
    expect(result.current.state.highestPeak?.mountainName).toBe("Everest");
    expect(result.current.state.derivedLevel).toBe("Beginner"); 
  });

  it("sets correct experience level based on summit count", async () => {
    // Create 12 fake scans to trigger "Advanced" level (>= 10)
    const manyScans = Array.from({ length: 12 }, (_, i) => ({
      id: i, mountainId: `m${i}`, timestamp: "2023-01-01", mountainHeight: 1000
    }));

    (api.get as any).mockImplementation((url: string) => {
      if (url.includes("/profile")) return Promise.resolve({ data: { ...mockProfileData, scans: manyScans } });
      return Promise.resolve({ data: [] });
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.totalSummits).toBe(12);
    expect(result.current.state.derivedLevel).toBe("Advanced");
  });

  it("handles API errors and displays a message", async () => {
    (api.get as any).mockRejectedValue({
      response: { data: { message: "User profile not found" } }
    });

    const { result } = renderHook(() => useUserProfile());

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });

    expect(result.current.state.error).toBe("User profile not found");
    expect(result.current.state.profile).toBeNull();
  });
});