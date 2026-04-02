import { Scan, Map, MessageSquare, HelpCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AppPage() {
  const navigate = useNavigate();
  const { username, role } = useSelector((state: any) => state.auth);

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
                onClick={() => navigate("/admin/moderate")}
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
                  Authentication Required. Please log in to your account to enable all the features. You can find the login button above. If you don't already have an account you can also register top right.
                </p>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default AppPage



