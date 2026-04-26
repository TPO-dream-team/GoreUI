import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/utility/store";
import type { Gora } from "@/utility/stores_slices/goreSlice";
import { enqueueScan } from "@/utility/stores_slices/scanSlice";
import api from '@/utility/axios';

export interface ScansMsg {
  nfc: string;
  lon: number;
  lat: number;
}

export const useScannerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { gore } = useSelector((state: RootState) => state.mountain);

  // GPS State
  const [gpsData, setGpsData] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsGoraText, setGpsGoraText] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // NFC State
  const [nfcError, setNfcError] = useState<string | null>(null);
  const [nfcLoading, setNfcLoading] = useState(false);
  const [nfcText, setNfcText] = useState<string | null>(null);
  const [nfcSerialNumber, setNfcSerialNumber] = useState('');

  // Global Scan/Save State
  const [scanText, setScanText] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const findNearestMountain = (userLat: number, userLon: number, mountains: Gora[] | null) => {
    if (!mountains || mountains.length === 0) return null;
    return mountains.reduce((prev, curr) => {
      const distPrev = Math.pow(prev.lat - userLat, 2) + Math.pow(prev.lon - userLon, 2);
      const distCurr = Math.pow(curr.lat - userLat, 2) + Math.pow(curr.lon - userLon, 2);
      return distCurr < distPrev ? curr : prev;
    });
  };

  const scanGps = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsData({ lat: latitude, lon: longitude });
        setGpsLoading(false);
        
        const nearGora = findNearestMountain(latitude, longitude, gore);
        setGpsGoraText(nearGora?.name || "Neznana lokacija");
      },
      (err) => {
        setGpsError(err.message);
        setGpsLoading(false);
      }
    );
  };

  const scanNfc = async () => {
    if (!('NDEFReader' in window)) {
      setNfcError("Web NFC is not supported on this browser/device.");
      return;
    }

    try {
      setNfcLoading(true);
      setNfcError(null);
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreadingerror = () => {
        setNfcError("Cannot read data from the NFC tag. Try another one.");
        setNfcLoading(false);
      };

      ndef.onreading = (event: any) => {
        const { serialNumber } = event;
        setNfcSerialNumber(serialNumber);
        if (serialNumber) {
          setNfcText("NFC tag scanned successfully");
          setNfcLoading(false);
        } else {
          setNfcError("NFC tag not scanned successfully");
          setNfcLoading(false);
        }
      };
    } catch (err: any) {
      setNfcError(`Scan failed: ${err.message}`);
      setNfcLoading(false);
    }
  };

  const saveScan = async () => {
    if (!gpsData) return;

    const msg: ScansMsg = {
      nfc: nfcSerialNumber,
      lon: gpsData.lon,
      lat: gpsData.lat
    };

    if (navigator.onLine) {
      setScanLoading(true);
      setScanError(null);
      try {
        const response = await api.post('/scans', msg);
        if (response.status === 201 || response.status === 200) {
          setScanText("Successfully saved!");
        }
      } catch (err: any) {
        setScanError(err.response?.data?.message || "Error occurred while scanning");
      } finally {
        setScanLoading(false);
      }
    } else {
      dispatch(enqueueScan(msg));
      setScanText("Saved locally. Will sync when online.");
    }
  };

  return {
    state: {
      gpsData, gpsLoading, gpsGoraText, gpsError,
      nfcError, nfcLoading, nfcText, nfcSerialNumber,
      scanText, scanLoading, scanError
    },
    actions: { scanGps, scanNfc, saveScan }
  };
};