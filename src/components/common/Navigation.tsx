import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from "@/utility/store";
import { loginUser, signUpUser } from "@/utility/stores_slices/authSlice";
import { logout } from "@/utility/stores_slices/authSlice";
import { Outlet, Link, useNavigate } from "react-router-dom";


export function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { username, role } = useSelector((state: any) => state.auth);

  const [loginusernamefield, setLoginUsername] = useState("");
  const [loginpasswordfield, setLoginPassword] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);


  const [signupusernamefield, setSignupUsername] = useState("");
  const [signuppasswordfield1, setSignupPassword1] = useState("");
  const [signuppasswordfield2, setSignupPassword2] = useState("");
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const [loginInfoText, setLoginInfoText] = useState("");
  const [signupInfoText, setSignupInfoText] = useState("");

  const handleLoginDialogOpen = (x:boolean) => {
    setLoginDialogOpen(x)
    setLoginInfoText("")
  }

  const handleSignupDialogOpen = (x:boolean) => {
    setSignUpDialogOpen(x)
    setSignupInfoText("")
  }

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = await dispatch(loginUser({ Username: loginusernamefield, Password: loginpasswordfield }));
    if (loginUser.fulfilled.match(result)) {
      setLoginDialogOpen(false);
      setLoginInfoText("");
      navigate("/")
    }else if(loginUser.rejected.match(result)){
      const errorMessage = (result.payload as any)?.message || "An error occurred";
      setLoginInfoText(errorMessage);
    }
    setLoginLoading(false);
  };

   const handleSignUp = async (e: React.SubmitEvent) => { 
    e.preventDefault();
    setSignUpLoading(true);
    const result = await dispatch(signUpUser({ Username: signupusernamefield, Password: signuppasswordfield1, RepeatPassword: signuppasswordfield2}));
    if (signUpUser.fulfilled.match(result)) {
      setSignUpDialogOpen(false);
      setLoginDialogOpen(true);
      setLoginInfoText("Registration successfull");
    }else if (signUpUser.rejected.match(result)){
      const errorMessage = (result.payload as any)?.message || "An error occurred";
      setSignupInfoText(errorMessage);
    }
    setSignUpLoading(false);
  };
  const handleLogoutBtn = () => {
    dispatch(logout());
    navigate("/")
  };
  return (
    <div className="relative min-h-screen">
      <nav className="sticky top-0 z-50 w-full flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        {/* Hamburger Menu & Sidebar */}
        <div className="flex items-center justify-between">
          {/* Left side menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-md">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            {/* Title */}
            <div className="cursor-pointer font-bold text-xl ml-2 select-none" onClick={() => navigate("/")}>PeakProof</div>

            {/* Sidebar */}
            <SheetContent side="left" className="w-75"> {/* Make shawty lefty */}
              <div className="flex flex-col gap-4 mt-8 pl-5">
                <SheetClose asChild><Link to="/" className="text-lg font-medium hover:bg-secondary mr-3 pt-1 pb-1 pl-3 rounded-full">Home</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/scanner" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Scan</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/board" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Board</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/chat" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Chat</Link></SheetClose>
                {role === "admin" && (<SheetClose asChild><Link to="/moderation" className="text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full hover:bg-secondary">Moderation</Link></SheetClose>)}
              </div>
              <SheetFooter>
                {username ?
                  <div>
                    <Button onClick={handleLogoutBtn}>Logout</Button>
                  </div>
                  : ("")
                }
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Login menu */}
        <div className="flex items-center justify-between">
          <Dialog open={loginDialogOpen} onOpenChange={handleLoginDialogOpen}>
            {username ? (
              <span className="text-lg font-semibold select-none mr-3">
                {username}
              </span>
            ) : (
              <div>
                <DialogTrigger asChild>
                  {/* Logic: If username exists, show it. Otherwise show Login button. */}
                  <Button className="p-2 border-black hover:bg-accent rounded-md" variant="outline">
                    Login
                  </Button>
                </DialogTrigger>
              </div>
            )}

            {/* Sidebar */}

            <DialogContent className="w-75" showCloseButton={false}>
              <VisuallyHidden.Root>
                <DialogTitle>Sidebar</DialogTitle>
                <DialogDescription>This is a sidebar</DialogDescription>
              </VisuallyHidden.Root>

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="loginUsername">Username</Label>
                    <Input id="loginUsername" defaultValue="" placeholder="VelikiTiger123" required onChange={(e) => setLoginUsername(e.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input id="loginPassword" type="password" required onChange={(e) => setLoginPassword(e.target.value)} />
                    <Button disabled={loginLoading}>{loginLoading ? "Logging in..." : "Login"}</Button>
                    {(loginInfoText)! && <span className="text-red-500 text-sm text-center">{loginInfoText}</span>}
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        
        {/* Sign up menu */}
        <Dialog open={signUpDialogOpen} onOpenChange={handleSignupDialogOpen}>
            {username ? (<></>
            ) : (
              <div>
                <DialogTrigger asChild>
                  {/* Logic: If username exists, show it. Otherwise show Login button. */}
                  <Button className="p-2 ml-2 hover:bg-gray-300 border-black bg-gray-200 rounded-md" variant="outline">
                    Register
                  </Button>
                </DialogTrigger>
              </div>
            )}

            {/* Sidebar */}

            <DialogContent className="w-75" showCloseButton={false}>
              <VisuallyHidden.Root>
                <DialogTitle>Sidebar</DialogTitle>
                <DialogDescription>This is a sidebar</DialogDescription>
              </VisuallyHidden.Root>

              {/* Sign Up form */}
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="registerUsername">Username</Label>
                    <Input id="registerUsername" defaultValue="" placeholder="VelikiTiger123" required onChange={(e) => setSignupUsername(e.target.value)} />
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input id="registerPassword" type="password" required onChange={(e) => setSignupPassword1(e.target.value)} />
                    <Label htmlFor="registerConfirm">Confirm password </Label>
                    <Input id="registerConfirm" type="password" required onChange={(e) => setSignupPassword2(e.target.value)} />
                    <Button disabled={signUpLoading}>{signUpLoading ? "Signing up..." : "Sign in"}</Button>
                    {(signupInfoText)! && <span className="text-red-500 text-sm text-center">{signupInfoText}</span>}
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <Outlet /> {/* Rest of the app */}
    </div>
  );
}




