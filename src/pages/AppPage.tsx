import { Scan, Map, MessageSquare, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

function AppPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="grid w-full max-w-md gap-6">
        <h1 className="mb-4 text-center text-2xl font-bold tracking-tight">Welcome</h1>
        
        {/* Scan Button */}
          <Button 
            onClick={() => navigate("/scanner")}
            variant="default" 
            className="h-24 text-xl font-semibold shadow-lg transition-transform active:scale-95"
          >
            <Scan className="mr-3 h-6 w-6" />
            Scan
          </Button>

        {/* Tours Button */}
          <Button 
            onClick={() => navigate("/board")}
            variant="secondary" 
            className="h-24 text-xl font-semibold shadow-lg transition-transform active:scale-95"
          >
            <Map className="mr-3 h-6 w-6" />
            Tours
          </Button>

        {/* Posts Button */}
          <Button 
            onClick={() => navigate("/chat")}
            variant="outline" 
            className="h-24 text-xl font-semibold shadow-lg transition-transform active:scale-95"
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            Posts
          </Button>

        {/* Help / New Here Button */}
          <Button 
            onClick={() => navigate("/help")}
            variant="ghost" 
            className="mt-2 h-16 text-lg font-medium text-muted-foreground hover:text-foreground transition-transform active:scale-95"
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            New here? Get help
          </Button>
      </div>
    </div>
  )
}

export default AppPage