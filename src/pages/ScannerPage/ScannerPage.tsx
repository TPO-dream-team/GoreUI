import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Nfc, Loader2, CheckCircle2, Mountain, Wifi, WifiOff, Save, Zap } from "lucide-react";
import { useScannerPage } from "./useScannerPage";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ScannerPage() {
  const { state, actions } = useScannerPage();
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("useNewStyle");
    setUseNewStyle(saved !== null ? saved === "true" : true);

    const handleStyleToggle = (event: CustomEvent) => {
      setUseNewStyle(event.detail.useNewStyle);
    };

    window.addEventListener("styleToggle", handleStyleToggle as EventListener);
    return () => {
      window.removeEventListener("styleToggle", handleStyleToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    if (outletContext?.useNewStyle !== undefined) {
      setUseNewStyle(outletContext.useNewStyle);
    }
  }, [outletContext]);

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#17231b]">Skeniranje vrha</h1>
            <p className="text-[#647067] mt-2 text-sm max-w-md mx-auto">
              Preverite svojo lokacijo in preberite NFC oznako za potrditev vzpona
            </p>
          </div>
          
          {/* Three Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            
            {/* GPS Card */}
            <Card className="border border-[#dce3d7] rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#316f8f] to-[#2f6b4f]" />
              <CardHeader className="pb-3">
                <CardTitle className="text-center flex items-center justify-center gap-2 text-[#17231b]">
                  <MapPin className="w-5 h-5 text-[#316f8f]" />
                  GPS lokacija
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  onClick={actions.scanGps} 
                  disabled={state.gpsLoading}
                  className="w-full bg-[#316f8f] hover:bg-[#225c76] text-white rounded-lg transition-all"
                >
                  {state.gpsLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  {state.gpsLoading ? "Pridobivanje lokacije..." : "Preveri GPS"}
                </Button>
                <div className="min-h-[70px] pt-2">
                  {state.gpsData && (
                    <div className="text-sm bg-[#fbfcf8] rounded-lg p-3 border border-[#e5eadf]">
                      <p className="text-[#647067] text-xs mb-1">Trenutna lokacija:</p>
                      <p className="font-mono text-[#17231b]">{state.gpsData.lat.toFixed(6)}</p>
                      <p className="font-mono text-[#17231b]">{state.gpsData.lon.toFixed(6)}</p>
                      {state.gpsGoraText && (
                        <div className={`mt-2 pt-2 border-t border-[#e5eadf] text-sm font-semibold ${state.gpsGoraText.includes('✓') ? 'text-[#2f6b4f]' : 'text-[#c7792b]'}`}>
                          {state.gpsGoraText}
                        </div>
                      )}
                    </div>
                  )}
                  {state.gpsError && (
                    <div className="text-sm text-[#b2473e] bg-[#fff4f2] rounded-lg p-3 border border-[#ecc1bb]">
                      {state.gpsError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NFC Card */}
            <Card className="border border-[#dce3d7] rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#2f6b4f] to-[#c7792b]" />
              <CardHeader className="pb-3">
                <CardTitle className="text-center flex items-center justify-center gap-2 text-[#17231b]">
                  <Nfc className="w-5 h-5 text-[#2f6b4f]" />
                  NFC oznaka
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  onClick={actions.scanNfc} 
                  disabled={state.nfcLoading || state.nfcButtonDisable}
                  className="w-full bg-[#2f6b4f] hover:bg-[#214b39] text-white rounded-lg transition-all"
                >
                  {state.nfcLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  {state.nfcLoading ? "Iskanje oznake..." : "Skeniraj NFC"}
                </Button>
                <div className="min-h-[70px] pt-2">
                  {state.nfcText && (
                    <div className="bg-[#edf8ee] rounded-lg p-3 border border-[#bcd8c2]">
                      <p className="text-sm font-semibold text-[#275b35]">{state.nfcText}</p>
                    </div>
                  )}
                  {state.nfcError && (
                    <div className="text-sm text-[#b2473e] bg-[#fff4f2] rounded-lg p-3 border border-[#ecc1bb]">
                      {state.nfcError}
                    </div>
                  )}
                  {!state.gpsData && !state.nfcText && !state.nfcError && (
                    <p className="text-[#647067] text-xs italic bg-[#fbfcf8] rounded-lg p-3">
                      Najprej preverite GPS lokacijo
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save/Verify Card */}
            <Card className="border border-[#dce3d7] rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#c7792b] to-[#2f6b4f]" />
              <CardHeader className="pb-3">
                <CardTitle className="text-center flex items-center justify-center gap-2 text-[#17231b]">
                  <CheckCircle2 className="w-5 h-5 text-[#2f6b4f]" />
                  Potrditev
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-[#2f6b4f] to-[#316f8f] hover:from-[#214b39] hover:to-[#225c76] text-white rounded-lg transition-all disabled:opacity-50"
                  onClick={actions.saveScan} 
                  disabled={!state.nfcSerialNumber || state.scanLoading}
                >
                  {state.scanLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  {state.scanLoading ? "Shranjevanje..." : "Shrani verifikacijo"}
                </Button>
                <div className="min-h-[70px] pt-2">
                  {state.scanText && (
                    <div className="bg-[#edf8ee] rounded-lg p-3 border border-[#bcd8c2]">
                      <p className="text-sm font-semibold text-[#275b35]">{state.scanText}</p>
                    </div>
                  )}
                  {state.scanError && (
                    <div className="text-sm text-[#b2473e] bg-[#fff4f2] rounded-lg p-3 border border-[#ecc1bb]">
                      {state.scanError}
                    </div>
                  )}
                  {state.nfcSerialNumber && !state.scanText && !state.scanError && (
                    <p className="text-xs text-[#647067] bg-[#fbfcf8] rounded-lg p-2">
                      Pripravljeno za shranjevanje
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <div className="max-w-3xl mx-auto mt-8 p-4 bg-[#f0f4ea] rounded-xl border border-[#dce3d7]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2f6b4f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-[#17231b] text-sm mb-1">Kako deluje?</h4>
                <p className="text-[#647067] text-xs leading-relaxed">
                  1. Preverite GPS lokacijo - sistem bo potrdil, če ste v bližini znanega vrha.<br />
                  2. Skenirajte NFC oznako na vrhu - ta edinstvena koda potrdi vaš obisk.<br />
                  3. Shranite verifikacijo - vrh bo dodan v vaš osebni dnevnik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Old Style (Original Design)
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