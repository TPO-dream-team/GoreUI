import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Nfc, Loader2, CheckCircle2 } from "lucide-react";
import { useScannerPage } from "./useScannerPage";

export default function ScannerPage() {
  const { state, actions } = useScannerPage();

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-10 gap-6">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl justify-center">
        
        {/* GPS Card */}
        <Card className="flex-1 min-w-[280px] h-60">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              GPS <MapPin className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Button onClick={actions.scanGps} disabled={state.gpsLoading}>
              {state.gpsLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {state.gpsLoading ? "Scanning..." : "Scan Location"}
            </Button>
            <div className="min-h-[60px] pt-2">
              {state.gpsData && (
                <div className="text-sm">
                  <p>Lat: {state.gpsData.lat.toFixed(4)}</p>
                  <p>Lon: {state.gpsData.lon.toFixed(4)}</p>
                  <p className="font-bold text-blue-600">{state.gpsGoraText}</p>
                </div>
              )}
              {state.gpsError && <p className="text-red-500 text-xs">{state.gpsError}</p>}
            </div>
          </CardContent>
        </Card>

        {/* NFC Card */}
        <Card className="flex-1 min-w-[280px] h-60">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              NFC <Nfc className="w-5 h-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Button 
              onClick={actions.scanNfc} 
              disabled={state.nfcLoading || state.nfcButtonDisable}
            >
              {state.nfcLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {state.nfcLoading ? "Searching..." : "Scan Tag"}
            </Button>
            <div className="min-h-[60px] pt-2">
              {state.nfcText && <p className="font-bold text-green-600">{state.nfcText}</p>}
              {state.nfcError && <p className="text-red-500 text-xs">{state.nfcError}</p>}
              {!state.gpsData && <p className="text-muted-foreground text-xs italic">Get GPS first</p>}
            </div>
          </CardContent>
        </Card>

        {/* Save Card */}
        <Card className="flex-1 min-w-[280px] h-60">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              Verify <CheckCircle2 className="w-5 h-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <Button 
              className="w-full"
              onClick={actions.saveScan} 
              disabled={!state.nfcSerialNumber || state.scanLoading}
            >
              {state.scanLoading ? "Saving..." : "Send Data"}
            </Button>
            <div className="min-h-[60px] pt-2">
              {state.scanText && <p className="font-bold text-green-700">{state.scanText}</p>}
              {state.scanError && <p className="text-red-500 text-xs">{state.scanError}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}