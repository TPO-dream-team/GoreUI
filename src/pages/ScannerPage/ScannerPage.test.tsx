import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ScannerPage from "./ScannerPage";
import { useScannerPage } from "./useScannerPage";

vi.mock("./useScannerPage", () => ({
  useScannerPage: vi.fn(),
}));

describe("ScannerPage Component", () => {
  const mockActions = {
    scanGps: vi.fn(),
    scanNfc: vi.fn(),
    saveScan: vi.fn(),
  };

  const defaultState = {
    gpsData: null,
    gpsLoading: false,
    gpsGoraText: null,
    gpsError: null,
    nfcError: null,
    nfcLoading: false,
    nfcText: null,
    nfcSerialNumber: "",
    scanText: null,
    scanLoading: false,
    scanError: null,
    nfcButtonDisable: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows GPS coordinates when gpsData is present", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { 
        ...defaultState, 
        gpsData: { lat: 46.1234, lon: 13.5678 },
        gpsGoraText: "Triglav"
      }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    expect(screen.getByText(/46.1234/i)).toBeDefined();
    expect(screen.getByText(/13.5678/i)).toBeDefined();
    expect(screen.getByText("Triglav")).toBeDefined();
  });

  it("displays error messages when present", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { 
        ...defaultState, 
        gpsError: "Location access denied",
        nfcError: "NFC not supported",
        scanError: "Save failed"
      }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    expect(screen.getByText("Location access denied")).toBeDefined();
    expect(screen.getByText("NFC not supported")).toBeDefined();
    expect(screen.getByText("Save failed")).toBeDefined();
  });

  it("calls scanGps when GPS button is clicked", () => {
    (useScannerPage as any).mockReturnValue({ state: defaultState, actions: mockActions });
    render(<ScannerPage />);

    const gpsButton = screen.getByText(/Check GPS/i);
    fireEvent.click(gpsButton);
    expect(mockActions.scanGps).toHaveBeenCalledTimes(1);
  });

  it("calls scanNfc when NFC button is clicked and enabled", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { ...defaultState, nfcButtonDisable: false }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    const nfcButton = screen.getByText(/Scan NFC/i);
    fireEvent.click(nfcButton);
    expect(mockActions.scanNfc).toHaveBeenCalledTimes(1);
  });

  it("calls saveScan when Save verification button is clicked and enabled", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { ...defaultState, nfcSerialNumber: "NFC-12345" }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    // Fixed: Label changed from "Send Data" to "Save verification"
    const sendButton = screen.getByText(/Save verification/i);
    fireEvent.click(sendButton);
    expect(mockActions.saveScan).toHaveBeenCalledTimes(1);
  });

  it("shows success message when scanText is present", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { ...defaultState, scanText: "Successfully saved!" }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    expect(screen.getByText("Successfully saved!")).toBeDefined();
  });

  it("shows 'Check your GPS location first' hint when no GPS data and NFC is not scanned", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { ...defaultState, gpsData: null }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    expect(screen.getByText(/Check your GPS location first/i)).toBeDefined();
  });

  it("shows loading state on save button when scanLoading is true", () => {
    (useScannerPage as any).mockReturnValue({ 
      state: { ...defaultState, scanLoading: true, nfcSerialNumber: "NFC-12345" }, 
      actions: mockActions 
    });
    render(<ScannerPage />);

    expect(screen.getByText("Saving...")).toBeDefined();
  });
});