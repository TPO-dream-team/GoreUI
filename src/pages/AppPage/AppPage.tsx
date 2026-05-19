import { Scan, Map, MessageSquare, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function AppPage() {
  const navigate = useNavigate();
  const { username, role } = useSelector((state: any) => state.auth);
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  useEffect(() => {
    // Get initial value from localStorage
    const saved = localStorage.getItem("useNewStyle");
    setUseNewStyle(saved !== null ? saved === "true" : true);

    // Listen for style toggle events
    const handleStyleToggle = (event: CustomEvent) => {
      setUseNewStyle(event.detail.useNewStyle);
    };

    window.addEventListener("styleToggle", handleStyleToggle as EventListener);
    return () => {
      window.removeEventListener("styleToggle", handleStyleToggle as EventListener);
    };
  }, []);

  // Also sync with outlet context if available
  useEffect(() => {
    if (outletContext?.useNewStyle !== undefined) {
      setUseNewStyle(outletContext.useNewStyle);
    }
  }, [outletContext]);

  // New Style (Mountain App Theme)
  if (useNewStyle) {
    return (
    <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-gradient-to-br from-brand-primary to-brand-hover-blue shadow-lg">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 20h18L14 5l-4 8-2-3-5 10z" />
                <path d="M14 5l-2 7 3-2" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-headline">
              PeakProof
            </h1>
            <p className="text-brand-body text-body-copy leading-body-copy mt-2 max-w-md mx-auto">
              {username
                ? `Welcome back, ${username}`
                : "Verified ascents and tours"}
            </p>
          </div>

          {role ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Scan Button */}
              <Button
                onClick={() => navigate("/scanner")}
                className="h-auto py-6 px-4 bg-white border border-brand-border text-brand-slate hover:border-brand-primary hover:text-brand-hover-green shadow-sm hover:shadow transition-all rounded-button group"
                variant="ghost"
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <Scan className="h-8 w-8 text-brand-primary group-hover:scale-105 transition-transform" />
                  <span className="text-lg font-semibold">Scan</span>
                  <span className="text-xs text-brand-body">Verify peak with GPS and NFC</span>
                </div>
              </Button>

              {/* Tours Button */}
              <Button
                onClick={() => navigate("/board")}
                className="h-auto py-6 px-4 bg-white border border-brand-border text-brand-slate hover:border-brand-primary hover:text-brand-hover-green shadow-sm hover:shadow transition-all rounded-button group"
                variant="ghost"
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <Map className="h-8 w-8 text-brand-hover-blue group-hover:scale-105 transition-transform" />
                  <span className="text-lg font-semibold">Tours</span>
                  <span className="text-xs text-brand-body">Find a hike</span>
                </div>
              </Button>

              {/* Posts Button */}
              <Button
                onClick={() => navigate("/chat")}
                className="h-auto py-6 px-4 bg-white border border-brand-border text-brand-slate hover:border-brand-primary hover:text-brand-hover-green shadow-sm hover:shadow transition-all rounded-button group"
                variant="ghost"
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <MessageSquare className="h-8 w-8 text-brand-warning group-hover:scale-105 transition-transform" />
                  <span className="text-lg font-semibold">Posts</span>
                  <span className="text-xs text-brand-body">Community discussions</span>
                </div>
              </Button>

              {/* Moderation Button - Admin Only */}
              {role === "admin" && (
                <Button
                  onClick={() => navigate("/moderation")}
                  className="h-auto py-6 px-4 bg-white border border-brand-border text-brand-slate hover:border-brand-error-text hover:text-brand-error-text shadow-sm hover:shadow transition-all rounded-button group"
                  variant="ghost"
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <ShieldCheck className="h-8 w-8 text-brand-error-text group-hover:scale-105 transition-transform" />
                    <span className="text-lg font-semibold">Moderation</span>
                    <span className="text-xs text-brand-body">Content overview</span>
                  </div>
                </Button>
              )}

              {/* Help Button - Full width on row below */}
              <div className={role === "admin" ? "md:col-span-2 mt-2" : "col-span-1 md:col-span-2 mt-2"}>
                <Button
                  onClick={() => navigate("/help")}
                  className="w-full h-auto py-5 px-4 bg-transparent border border-dashed border-brand-muted-sage text-brand-body hover:border-brand-primary hover:text-brand-hover-green hover:bg-brand-accent-sage transition-all rounded-button group"
                  variant="ghost"
                >
                  <div className="flex items-center justify-center gap-3">
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-base font-medium">New here?</span>
                    <span className="text-sm">Get help</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto mt-8">
              <div className="border border-dashed border-brand-muted-sage rounded-xl bg-brand-nested-bg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-success-bg flex items-center justify-center">
                  <HelpCircle className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-headline mb-2">
                  Sign in to access features
                </h3>
                <p className="text-sm text-brand-body max-w-sm mx-auto">
                  Sign in using the button in the top-right corner to access scanning, tours, posts, and your profile.
                  Don't have an account? Register via the Register button.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Old Style (Your original design)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="grid w-full max-w-md gap-6">
        <h1 className="mb-4 text-center text-2xl font-bold tracking-tight">
          Welcome {username}
        </h1>

        {role ? (
          <>
            {/* Standard User Buttons */}
            <Button
              onClick={() => navigate("/scanner")}
              variant="default"
              className="h-24 w-full text-xl font-semibold shadow-lg transition-transform active:scale-95"
            >
              <Scan className="mr-3 h-6 w-6" />
              Scan
            </Button>

            <Button
              onClick={() => navigate("/board")}
              variant="secondary"
              className="h-24 w-full text-xl font-semibold shadow-lg transition-transform active:scale-95"
            >
              <Map className="mr-3 h-6 w-6" />
              Tours
            </Button>

            <Button
              onClick={() => navigate("/chat")}
              variant="outline"
              className="h-24 w-full text-xl font-semibold shadow-lg transition-transform active:scale-95"
            >
              <MessageSquare className="mr-3 h-6 w-6" />
              Posts
            </Button>

            {/* Admin Only Button */}
            {role === "admin" && (
              <Button
                onClick={() => navigate("/moderation")}
                variant="destructive"
                className="h-24 w-full text-xl font-semibold shadow-lg transition-transform active:scale-95"
              >
                <ShieldCheck className="mr-3 h-6 w-6" />
                Moderate
              </Button>
            )}

            {/* Help Button */}
            <Button
              onClick={() => navigate("/help")}
              variant="ghost"
              className="mt-2 h-16 w-full text-lg font-medium text-muted-foreground hover:text-foreground transition-transform active:scale-95"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              New here? Get help
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center border-2 border-dashed rounded-xl bg-muted/30">
            <div className="bg-background p-3 rounded-full shadow-sm">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                Authentication Required. Please log in to your account to enable all the features. You can find the login button above. If you don't already have an account you can also register using the button in the top-right corner.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppPage;