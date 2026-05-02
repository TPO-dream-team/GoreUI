import { renderHook, act } from "@testing-library/react";
import { useNavigation } from "./useNavigation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signUpUser, logout } from "@/utility/stores_slices/authSlice";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/utility/stores_slices/authSlice", () => {
  const mockThunk = () => {
    const thunk: any = vi.fn();
    thunk.fulfilled = { match: vi.fn() };
    thunk.rejected = { match: vi.fn() };
    thunk.pending = { match: vi.fn() };
    return thunk;
  };

  return {
    loginUser: mockThunk(),
    signUpUser: mockThunk(),
    logout: vi.fn(),
  };
});

describe("useNavigation hook", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as any).mockReturnValue(mockDispatch);
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useSelector as any).mockReturnValue({ username: "testuser", role: "user" });
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current.username).toBe("testuser");
    expect(result.current.loginDialogOpen).toBe(false);
    expect(result.current.signUpDialogOpen).toBe(false);
    expect(result.current.loginLoading).toBe(false);
  });

  it("should update dialog state and clear info text", () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.handleLoginDialogOpen(true);
    });
    expect(result.current.loginDialogOpen).toBe(true);
    expect(result.current.loginInfoText).toBe("");
  });

  describe("handleLogin", () => {
    const mockEvent = { preventDefault: vi.fn() } as any;

    it("should handle successful login", async () => {
      const mockResult = { type: "auth/login/fulfilled", payload: {} };
      mockDispatch.mockResolvedValue(mockResult);
      
      (loginUser.fulfilled.match as any).mockReturnValue(true);

      const { result } = renderHook(() => useNavigation());

      await act(async () => {
        await result.current.handleLogin(mockEvent);
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(result.current.loginDialogOpen).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should handle failed login and show error message", async () => {
      const mockResult = { 
        type: "auth/login/rejected", 
        payload: { message: "Wrong password" } 
      };
      mockDispatch.mockResolvedValue(mockResult);
      
      (loginUser.fulfilled.match as any).mockReturnValue(false);
      (loginUser.rejected.match as any).mockReturnValue(true);

      const { result } = renderHook(() => useNavigation());

      await act(async () => {
        await result.current.handleLogin(mockEvent);
      });

      expect(result.current.loginInfoText).toBe("Wrong password");
      expect(result.current.loginLoading).toBe(false);
    });
  });

  describe("handleSignUp", () => {
    const mockEvent = { preventDefault: vi.fn() } as any;

    it("should handle successful signup", async () => {
      const mockResult = { type: "auth/register/fulfilled" };
      mockDispatch.mockResolvedValue(mockResult);
      
      (signUpUser.fulfilled.match as any).mockReturnValue(true);

      const { result } = renderHook(() => useNavigation());

      await act(async () => {
        await result.current.handleSignUp(mockEvent);
      });

      expect(result.current.signUpDialogOpen).toBe(false);
      expect(result.current.loginDialogOpen).toBe(true);
      expect(result.current.loginInfoText).toBe("Registration successful");
    });

    it("should handle failed signup and show error message", async () => {
      const mockResult = { 
        type: "auth/register/rejected", 
        payload: { message: "User already exists" } 
      };
      mockDispatch.mockResolvedValue(mockResult);
      
      (signUpUser.fulfilled.match as any).mockReturnValue(false);
      (signUpUser.rejected.match as any).mockReturnValue(true);

      const { result } = renderHook(() => useNavigation());

      await act(async () => {
        await result.current.handleSignUp(mockEvent);
      });

      expect(result.current.signupInfoText).toBe("User already exists");
      expect(result.current.signUpLoading).toBe(false);
    });
  });

  it("should handle logout and navigate home", () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.handleLogoutBtn();
    });

    expect(logout).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});