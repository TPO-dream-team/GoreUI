import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Nfc, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from '@/utility/axios';

export default function ScannerPage() {
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number } | null>(null);
  const [nfcData, setNfcData] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ gps: boolean; nfc: boolean }>({ gps: false, nfc: false });
  const [error, setError] = useState<string | null>(null);

  const scanGps = () => {
    setLoading((prev) => ({ ...prev, gps: true }));
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading((prev) => ({ ...prev, gps: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading((prev) => ({ ...prev, gps: false }));
      },
      (err) => {
        setError(err.message);
        setLoading((prev) => ({ ...prev, gps: false }));
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Scanner Hub</h1>
          <p className="text-muted-foreground">Access device hardware sensors via Web APIs.</p>
        </div>

        {error && (
          <div className="p-3 text-sm border border-destructive/50 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {/* GPS Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" /> Geolocation
              </CardTitle>
              <CardDescription>Fetch current latitude and longitude.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gpsData ? (
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <p>Lat: {gpsData.lat.toFixed(4)}</p>
                  <p>Lng: {gpsData.lng.toFixed(4)}</p>
                </div>
              ) : (
                <div className="h-[60px] flex items-center justify-center border-2 border-dashed rounded-md text-muted-foreground text-sm">
                  No GPS data acquired
                </div>
              )}
              <Button onClick={scanGps} disabled={loading.gps} className="w-full">
                {loading.gps ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Scan Location"}
              </Button>
            </CardContent>
          </Card>

          {/* NFC Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Nfc className="h-5 w-5 text-emerald-500" /> NFC Reader
              </CardTitle>
              <CardDescription>Scan physical NFC tags or cards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={nfcData ? "default" : "secondary"}>
                  {nfcData ? "Tag Detected" : "Waiting..."}
                </Badge>
                {nfcData && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              </div>
              
              {nfcData && (
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md font-mono text-sm break-all">
                  {nfcData}
                </div>
              )}

              <Button 
                onClick={scanNfc} 
                variant="outline" 
                disabled={loading.nfc} 
                className="w-full border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                {loading.nfc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Start NFC Scan"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
