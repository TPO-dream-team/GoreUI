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
  const [nfcButtonDisable, setNfcButtonDisable] = useState(true)

  // Global Scan/Save State
  const [scanText, setScanText] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const findNearestMountain = (userLat: number, userLon: number, mountains: Gora[] | null) => {
    if (!mountains || mountains.length === 0) return null;

    const distanceLimit = parseFloat(import.meta.env.VITE_DISTANCE_LIMIT || '1');

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearest = mountains.reduce((prev, curr) => {
      const distPrev = getDistance(userLat, userLon, prev.lat, prev.lon);
      const distCurr = getDistance(userLat, userLon, curr.lat, curr.lon);
      return distCurr < distPrev ? curr : prev;
    });

    const finalDist = getDistance(userLat, userLon, nearest.lat, nearest.lon);
    
    return finalDist <= distanceLimit ? nearest : null;
  };

  const scanGps = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setGpsLoading(false);
      setNfcButtonDisable(true)
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsData({ lat: latitude, lon: longitude });
        setGpsLoading(false);
        
        const nearGora = findNearestMountain(latitude, longitude, gore);
        if(nearGora?.name){
          setGpsGoraText(nearGora?.name);
          setNfcButtonDisable(false)
        }else{
          setGpsGoraText("You are not on a known mountain.")
          setNfcButtonDisable(true)
        }
      },
      (err) => {
        setGpsError(err.message);
        setGpsLoading(false);
        setNfcButtonDisable(true)
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
        setNfcError("NFC tag not recognised.");
        setNfcLoading(false);
      };

      ndef.onreading = (event: any) => {
        const { serialNumber } = event;
        setNfcSerialNumber(serialNumber);
        if (serialNumber) {
          setNfcText("NFC tag was scanned successfully");
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
        setScanError(err.response?.data?.message || err.response?.data || "Error occurred while scanning");
      } finally {
        setScanLoading(false);
      }
    } else {
      dispatch(enqueueScan(msg));
      setScanText("You are currently offline. We will verify your achievement when you are online.");
    }
  };

  return {
    state: {
      gpsData, gpsLoading, gpsGoraText, gpsError,
      nfcError, nfcLoading, nfcText, nfcSerialNumber,
      scanText, scanLoading, scanError, nfcButtonDisable
    },
    actions: { scanGps, scanNfc, saveScan }
  };
};