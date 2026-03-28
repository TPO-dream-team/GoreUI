import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Nfc, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from '@/utility/axios';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/utility/store";
import type { Gora } from "@/utility/stores_slices/goreSlice";
import { enqueueScan } from "@/utility/stores_slices/scanSlice";

export interface scansMsg{
  "nfc": string,
  "lon": number,
  "lat": number
}

export default function ScannerPage() {
  const { gore } = useSelector((state: RootState) => state.mountain);

  const [gpsData, setGpsData] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsGoraText, setGpsGoraText] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [nfcError, setNfcError] = useState<string | null>(null);
  const [nfcLoading, setNfcLoading] = useState(false);
  const [nfcText, setNfcText] = useState<string | null>(null);
  const [nfcSerialNumber, setNfcSerialNumber] = useState('');

  const [scanText, setScanText] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

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
        setGpsData({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setGpsLoading(false);
        let nearGora = findNearestMountain(position.coords.latitude, position.coords.longitude, gore);
        let nearGoraName = nearGora?.name || "Neznana lokacija";
        setGpsGoraText(nearGoraName);
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
      };

      ndef.onreading = (event: NDEFReadingEvent) => {
        const { message, serialNumber } = event;
        setNfcSerialNumber(serialNumber);
        console.log("NFC scanned")
        console.log(serialNumber)
        if (serialNumber != "") {
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

    let msg: scansMsg = {
        "nfc": nfcSerialNumber,
        "lon": gpsData!.lon,
        "lat": gpsData!.lat
    } 

    if (navigator.onLine) {
      setScanLoading(true)

      const response = await api.post('/scans',  msg);

      try {
        if (response.status === 201 || response.status === 200) {
          setScanText("Successfully saved!");
          setScanLoading(false)
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Error occured while scanning";
        setScanError(errorMessage);
      } finally {
        setScanLoading(false)
      }
    } else { 
        dispatch(enqueueScan(msg));
        setScanText("Save will happen when internet gets connected");
    }
  };

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Gps card */}
        <Card className="min-w-3xs h-50">
          <CardHeader>
            <CardTitle className="text-center">GPS <MapPin className="inline" /></CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="" onClick={scanGps} disabled={gpsLoading}>
              {gpsLoading ? "Scanning..." : "Scan"}
            </Button>
            <br></br>
            {gpsLoading ? (
              <p>Iščem..</p>
            ) : gpsData ? (
              <>
                <p>Lat: {gpsData.lat.toFixed(4)}</p>
                <p>Lon: {gpsData.lon.toFixed(4)}</p>
                <b>{gpsGoraText}</b>
              </>
            ) : null}
            <p className="text-red-500 pt-1">{gpsError}</p>
          </CardContent>
        </Card>

        {/* NFC card */}
        <Card className="min-w-3xs h-50 w-full lg:w-1/5">
          <CardHeader>
            <CardTitle className="text-center">NFC<Nfc className="inline" /></CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="mb-1" onClick={scanNfc} disabled={(nfcLoading || gpsData === null)}>
              {nfcLoading ? "Scanning..." : "Scan"}
            </Button>
            <div className="flex flex-col gap-2">
              {nfcLoading ? (
                <p>Searching...</p>
              ) : nfcText ? (
                <p className="font-bold">{nfcText}</p>
              ) : null}

              {nfcError && (
                <p className="text-red-500 pt-1">{nfcError}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Send card */}
        <Card className="min-w-3xs h-50">
          <CardHeader>
            <CardTitle className="text-center"> <CheckCircle2 className="mx-auto" /> </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="mb-10" onClick={saveScan} disabled={nfcSerialNumber === ""}>Send</Button>
            <div className="flex flex-col gap-2">
              {scanLoading ? (
                <p>Saving...</p>
              ) : scanText ? (
                <p className="font-bold">{scanText}</p>
              ) : null}
              {scanError && (
                <p className="text-red-500 pt-1">{scanError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

const findNearestMountain = (userLat: number, userLon: number, gore: Gora[] | null) => {
  if (!gore || gore.length === 0) return null;

  return gore.reduce((prev, curr) => {
    const distPrev = Math.pow(prev.lat - userLat, 2) + Math.pow(prev.lon - userLon, 2);
    const distCurr = Math.pow(curr.lat - userLat, 2) + Math.pow(curr.lon - userLon, 2);

    return distCurr < distPrev ? curr : prev;
  });
};