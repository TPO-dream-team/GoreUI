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
        <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-brand-primary to-brand-hover-blue shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-brand-headline">Peak Scan</h1>
              <p className="text-brand-body mt-2 text-sm max-w-md mx-auto">
                Verify your location and scan the NFC tag to confirm your ascent
              </p>
            </div>
            
            {/* Three Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              
              {/* GPS Card */}
              <Card className="border border-brand-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-brand-hover-blue to-brand-primary" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-brand-headline">
                    <MapPin className="w-5 h-5 text-brand-hover-blue" />
                    GPS Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Button 
                    onClick={actions.scanGps} 
                    disabled={state.gpsLoading}
                    className="w-full bg-brand-hover-blue hover:bg-brand-primary text-white rounded-button transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.gpsLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    {state.gpsLoading ? "Getting location..." : "Check GPS"}
                  </Button>
                  <div className="min-h-[70px] pt-2">
                    {state.gpsData && (
                      <div className="text-sm bg-brand-nested-bg/30 rounded-button p-3 border border-brand-border/40">
                        <p className="text-brand-body text-xs mb-1">Current location:</p>
                        <p className="font-mono text-brand-headline">{state.gpsData.lat.toFixed(6)}</p>
                        <p className="font-mono text-brand-headline">{state.gpsData.lon.toFixed(6)}</p>
                        {state.gpsGoraText && (
                          <div className={`mt-2 pt-2 border-t border-brand-border/40 text-sm font-semibold ${state.gpsGoraText.includes('✓') ? 'text-brand-primary' : 'text-brand-warning'}`}>
                            {state.gpsGoraText}
                          </div>
                        )}
                      </div>
                    )}
                    {state.gpsError && (
                      <div className="text-sm text-brand-danger bg-brand-danger/10 rounded-button p-3 border border-brand-danger/20">
                        {state.gpsError}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* NFC Card */}
              <Card className="border border-brand-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-warning" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-brand-headline">
                    <Nfc className="w-5 h-5 text-brand-primary" />
                    NFC Tag
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Button 
                    onClick={actions.scanNfc} 
                    disabled={state.nfcLoading || state.nfcButtonDisable}
                    className="w-full bg-brand-primary hover:bg-brand-hover-green text-white rounded-button transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.nfcLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    {state.nfcLoading ? "Searching for tag..." : "Scan NFC"}
                  </Button>
                  <div className="min-h-[70px] pt-2">
                    {state.nfcText && (
                      <div className="bg-brand-accent-sage rounded-button p-3 border border-brand-primary/20">
                        <p className="text-sm font-semibold text-brand-primary">{state.nfcText}</p>
                      </div>
                    )}
                    {state.nfcError && (
                      <div className="text-sm text-brand-danger bg-brand-danger/10 rounded-button p-3 border border-brand-danger/20">
                        {state.nfcError}
                      </div>
                    )}
                    {!state.gpsData && !state.nfcText && !state.nfcError && (
                      <p className="text-brand-body text-xs italic bg-brand-nested-bg/30 rounded-button p-3 border border-brand-border/20">
                        Check your GPS location first
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save/Verify Card */}
              <Card className="border border-brand-border/60 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-brand-warning to-brand-primary" />
                <CardHeader className="pb-3">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-brand-headline">
                    <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                    Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-hover-blue hover:from-brand-hover-green hover:to-brand-primary text-white rounded-button transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={actions.saveScan} 
                    disabled={!state.nfcSerialNumber || state.scanLoading}
                  >
                    {state.scanLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    {state.scanLoading ? "Saving..." : "Save verification"}
                  </Button>
                  <div className="min-h-[70px] pt-2">
                    {state.scanText && (
                      <div className="bg-brand-accent-sage rounded-button p-3 border border-brand-primary/20">
                        <p className="text-sm font-semibold text-brand-primary">{state.scanText}</p>
                      </div>
                    )}
                    {state.scanError && (
                      <div className="text-sm text-brand-danger bg-brand-danger/10 rounded-button p-3 border border-brand-danger/20">
                        {state.scanError}
                      </div>
                    )}
                    {state.nfcSerialNumber && !state.scanText && !state.scanError && (
                      <p className="text-xs text-brand-body bg-brand-nested-bg/30 rounded-button p-2 border border-brand-border/20">
                        Ready to save
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Box */}
            <div className="max-w-3xl mx-auto mt-8 p-4 bg-brand-nested-bg rounded-xl border border-brand-border/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Mountain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-headline text-sm mb-1">How does it work?</h4>
                  <p className="text-brand-slate text-xs leading-relaxed">
                    1. Check your GPS location - the system will confirm whether you are near a known peak.<br />
                    2. Scan the NFC tag at the summit - this unique code confirms your visit.<br />
                    3. Save the verification - the peak will be added to your personal log.
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