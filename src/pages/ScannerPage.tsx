import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Nfc, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from '@/utility/axios';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/utility/store";
import type { Gora } from "@/utility/stores_slices/goreSlice";

export default function ScannerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { gore } = useSelector((state: RootState) => state.mountain);
  
  const [gpsData, setGpsData] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsGoraText, setGpsGoraText] = useState<string|null>(null);
  const [gpsError, setGpsError] = useState<string|null>(null);

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
    //Testiranje če axios login dela
    const response = await api.post('/scans', {
      "nfc": "4539123412345678",
      "lon": 1.0,
      "lat": 1.0
    });
    console.log(response)
  };

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <div className="flex flex-col md:flex-row gap-6"> 
        {/* Gps card */}
        <Card className="min-w-3xs h-50">
          <CardHeader>
            <CardTitle className="text-center">GPS <MapPin className="inline"/></CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="" onClick={scanGps}>
              {gpsLoading ? "Skeniram..." : "Skeniraj"}
            </Button>
            <br></br>
              {gpsLoading ? (
                <p>Iščem..</p>
              ) : gpsData ? (
                <>
                  <p>Lat: {gpsData.lat.toFixed(4)}</p>
                  <p>Lon: {gpsData.lon.toFixed(4)}</p>
                  <b>{ gpsGoraText }</b>
                </>
              ) : null}
              <p className="text-red-500 pt-1">{gpsError}</p>
          </CardContent>
        </Card>

        {/* NFC card */}
        <Card className="min-w-3xs h-50">
          <CardHeader>
            <CardTitle className="text-center">NFC<Nfc className="inline"/></CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="mb-10">Skeniraj</Button>
            <p>Skenirano</p>
          </CardContent>
        </Card>

        {/* Send card */}
        <Card className="min-w-3xs h-50">
          <CardHeader>
            <CardTitle className="text-center"> <CheckCircle2 className="mx-auto"/> </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="mb-10">Pošlji</Button>

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