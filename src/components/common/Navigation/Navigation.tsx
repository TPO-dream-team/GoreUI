import { Menu, Palette, Mountain, Home, Scan, Map, MessageSquare, ShieldCheck, HelpCircle, LogOut, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { Outlet, Link } from "react-router-dom";
import { useNavigation } from "./useNavigation";
import { useState, useEffect } from "react";

export function Navigation() {
  const {
    username, role, id, navigate,
    loginLoading, loginDialogOpen, loginInfoText, setLoginUsername, setLoginPassword, handleLoginDialogOpen, handleLogin,
    signUpLoading, signUpDialogOpen, signupInfoText, setSignupUsername, setSignupPassword1, setSignupPassword2, handleSignupDialogOpen, handleSignUp,
    handleLogoutBtn
  } = useNavigation();

  const [useNewStyle, setUseNewStyle] = useState(() => {
    const saved = localStorage.getItem("useNewStyle");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("useNewStyle", String(useNewStyle));
    window.dispatchEvent(new CustomEvent("styleToggle", { detail: { useNewStyle } }));
  }, [useNewStyle]);

  const toggleStyle = () => {
    setUseNewStyle(!useNewStyle);
  };

  // New Style Navigation (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#f6f7f2] via-[#f6f7f2] to-white">
        {/* Mountain-themed Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#dce3d7] shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-[#f0f4ea] rounded-lg transition-colors">
                    <Menu className="h-5 w-5 text-[#344255]" />
                  </button>
                </SheetTrigger>

                <SheetContent side="left" className="w-80 bg-white border-r border-[#dce3d7]">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-[#dce3d7]">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                        <Mountain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17231b]">PeakProof</div>
                        <div className="text-xs text-[#647067]">Verified ascents</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link to="/" className="flex items-center gap-3 px-3 py-2 text-[#344255] hover:bg-[#f0f4ea] rounded-lg transition-colors">
                          <Home className="h-5 w-5" />
                          <span className="text-base font-medium">Home</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to={role ? "/scanner" : "#"} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${role ? "text-[#344255] hover:bg-[#f0f4ea]" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>
                          <Scan className="h-5 w-5" />
                          <span className="text-base font-medium">Scan</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to={role ? "/board" : "#"} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${role ? "text-[#344255] hover:bg-[#f0f4ea]" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>
                          <Map className="h-5 w-5" />
                          <span className="text-base font-medium">Tours</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to={role ? "/chat" : "#"} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${role ? "text-[#344255] hover:bg-[#f0f4ea]" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>
                          <MessageSquare className="h-5 w-5" />
                          <span className="text-base font-medium">Posts</span>
                        </Link>
                      </SheetClose>
                      {role === "admin" && (
                        <SheetClose asChild>
                          <Link to="/moderation" className="flex items-center gap-3 px-3 py-2 text-[#b2473e] hover:bg-[#fff4f2] rounded-lg transition-colors">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-base font-medium">Moderation</span>
                          </Link>
                        </SheetClose>
                      )}
                      <SheetClose asChild>
                        <Link to="/help" className="flex items-center gap-3 px-3 py-2 text-[#647067] hover:bg-[#f0f4ea] rounded-lg transition-colors">
                          <HelpCircle className="h-5 w-5" />
                          <span className="text-base font-medium">Help</span>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                  <SheetFooter className="absolute bottom-6 left-6 right-6">
                    {username && (
                      <Button onClick={handleLogoutBtn} variant="ghost" className="w-full justify-start gap-3 text-[#b2473e] hover:bg-[#fff4f2] hover:text-[#b2473e]">
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Button>
                    )}
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <div className="cursor-pointer select-none" onClick={() => navigate("/")}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center shadow-md">
                    <Mountain className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-xl text-[#17231b] hidden sm:inline">PeakProof</span>
                </div>
              </div>
            </div>

            {/* Right side - Auth buttons */}
            <div className="flex items-center gap-2">
              <Dialog open={loginDialogOpen} onOpenChange={handleLoginDialogOpen}>
                {username ? (
                  <Link to={`/profile/${id}`} className="flex items-center gap-3 hover:opacity-80">
                    <div className="w-8 h-8 rounded-full bg-[#dbe8d5] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#214b39]">{username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-[#17231b] hidden sm:inline hover:underline">
                      {username}
                    </span>
                  </Link>
                ) : (
                  <DialogTrigger asChild>
                    <Button className="bg-[#2f6b4f] hover:bg-[#214b39] text-white border-none rounded-lg px-4 py-2">
                      Login
                    </Button>
                  </DialogTrigger>
                )}

                <DialogContent className="w-[400px] rounded-xl border-[#dce3d7]">
                  <VisuallyHidden.Root>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>Enter your login details.</DialogDescription>
                  </VisuallyHidden.Root>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                        <Mountain className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-[#17231b]">Welcome back</h3>
                      <p className="text-sm text-[#647067] mt-1">Log in to access your features</p>
                    </div>
                    
                    <div className="grid gap-5 px-2">
                      <div className="grid gap-2">
                        <Label htmlFor="loginUsername" className="text-[#17231b] font-medium">Username</Label>
                        <Input 
                          id="loginUsername" 
                          placeholder="Enter your username" 
                          className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                          required 
                          onChange={(e) => setLoginUsername(e.target.value)} 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loginPassword" className="text-[#17231b] font-medium">Password</Label>
                        <Input 
                          id="loginPassword" 
                          type="password" 
                          placeholder="Enter your password"
                          className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                          required 
                          onChange={(e) => setLoginPassword(e.target.value)} 
                        />
                        <Button disabled={loginLoading} className="bg-[#2f6b4f] hover:bg-[#214b39] mt-2">
                          {loginLoading ? "Logging in..." : "Login"}
                        </Button>
                        {loginInfoText && <span className="text-red-500 text-sm text-center">{loginInfoText}</span>}
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            
              {!username && (
                <Dialog open={signUpDialogOpen} onOpenChange={handleSignupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-[#dce3d7] text-[#2f6b4f] hover:bg-[#f0f4ea] hover:border-[#2f6b4f] rounded-lg">
                      Registration
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="w-[450px] rounded-xl border-[#dce3d7]">
                    <VisuallyHidden.Root>
                      <DialogTitle>Registration</DialogTitle>
                      <DialogDescription>Create a new account.</DialogDescription>
                    </VisuallyHidden.Root>

                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="text-center mb-2">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#2f6b4f] to-[#316f8f] flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-[#17231b]">Create Account</h3>
                        <p className="text-sm text-[#647067] mt-1">Join the mountain community</p>
                      </div>
                      
                      <div className="grid gap-4 px-2">
                        <div className="grid gap-2">
                          <Label htmlFor="registerUsername" className="text-[#17231b] font-medium">Username</Label>
                          <Input 
                            id="registerUsername" 
                            placeholder="Choose a username"
                            className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                            required 
                            onChange={(e) => setSignupUsername(e.target.value)} 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="registerPassword" className="text-[#17231b] font-medium">Geslo</Label>
                          <Input 
                            id="registerPassword" 
                            type="password" 
                            placeholder="Enter your password"
                            className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                            required 
                            onChange={(e) => setSignupPassword1(e.target.value)} 
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="registerConfirm" className="text-[#17231b] font-medium">Potrdite geslo</Label>
                          <Input 
                            id="registerConfirm" 
                            type="password" 
                            placeholder="Repeat password"
                            className="border-[#dce3d7] focus:border-[#2f6b4f] focus:ring-[#2f6b4f]/20 rounded-lg"
                            required 
                            onChange={(e) => setSignupPassword2(e.target.value)} 
                          />
                          <Button disabled={signUpLoading} className="bg-[#2f6b4f] hover:bg-[#214b39] mt-2">
                            {signUpLoading ? "Signing up..." : "Registered"}
                          </Button>
                          {signupInfoText && <span className="text-red-500 text-sm text-center">{signupInfoText}</span>}
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </nav>

        {/* Style Toggle Button */}
        <button
          onClick={toggleStyle}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white border border-[#dce3d7] shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          title="Toggle style"
        >
          <Palette className="h-5 w-5 text-[#2f6b4f] group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Switch to classic style</span>
        </button>

        <Outlet context={{ useNewStyle }} />
      </div>
    );
  }

  // Old Style Navigation (Original Design)
  return (
    <div className="relative min-h-screen">
      <nav className="sticky top-0 z-50 w-full flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-md">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <div className="cursor-pointer font-bold text-xl ml-2 select-none" onClick={() => navigate("/")}>
              PeakProof
            </div>

            <SheetContent side="left" className="w-75">
              <div className="flex flex-col gap-4 mt-8 pl-5">
                <SheetClose asChild><Link to="/" className="text-lg font-medium hover:bg-secondary mr-3 pt-1 pb-1 pl-3 rounded-full">Home</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/scanner" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Scan</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/board" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Tours</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/chat" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Posts</Link></SheetClose>
                {role === "admin" && (
                  <SheetClose asChild><Link to="/moderation" className="text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full hover:bg-secondary">Moderation</Link></SheetClose>
                )}
              </div>
              <SheetFooter>
                {username && <Button onClick={handleLogoutBtn}>Logout</Button>}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-between">
          {/* Login Dialog */}
          <Dialog open={loginDialogOpen} onOpenChange={handleLoginDialogOpen}>
            {username ? (
              <Link to={`/profile/${id}`} className="text-lg font-semibold select-none mr-3 hover:underline">
                {username}
              </Link>
            ) : (
              <DialogTrigger asChild>
                <Button className="p-2 border-black hover:bg-accent rounded-md" variant="outline">Login</Button>
              </DialogTrigger>
            )}

            <DialogContent className="w-75" showCloseButton={false}>
              <VisuallyHidden.Root>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>Enter your credentials to log in.</DialogDescription>
              </VisuallyHidden.Root>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="loginUsername">Username</Label>
                    <Input id="loginUsername" placeholder="VelikiTiger123" required onChange={(e) => setLoginUsername(e.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="loginPassword">Password</Label>
                    <Input id="loginPassword" type="password" required onChange={(e) => setLoginPassword(e.target.value)} />
                    <Button disabled={loginLoading}>{loginLoading ? "Logging in..." : "Login"}</Button>
                    {loginInfoText && <span className="text-red-500 text-sm text-center">{loginInfoText}</span>}
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        
          {/* Sign Up Dialog */}
          {!username && (
            <Dialog open={signUpDialogOpen} onOpenChange={handleSignupDialogOpen}>
              <DialogTrigger asChild>
                <Button className="p-2 ml-2 hover:bg-gray-300 border-black bg-gray-200 rounded-md" variant="outline">Register</Button>
              </DialogTrigger>

              <DialogContent className="w-75" showCloseButton={false}>
                <VisuallyHidden.Root>
                  <DialogTitle>Register</DialogTitle>
                  <DialogDescription>Create a new account.</DialogDescription>
                </VisuallyHidden.Root>

                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                      <Label htmlFor="registerUsername">Username</Label>
                      <Input id="registerUsername" placeholder="VelikiTiger123" required onChange={(e) => setSignupUsername(e.target.value)} />
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input id="registerPassword" type="password" required onChange={(e) => setSignupPassword1(e.target.value)} />
                      <Label htmlFor="registerConfirm">Confirm password</Label>
                      <Input id="registerConfirm" type="password" required onChange={(e) => setSignupPassword2(e.target.value)} />
                      <Button disabled={signUpLoading}>{signUpLoading ? "Signing up..." : "Registered"}</Button>
                      {signupInfoText && <span className="text-red-500 text-sm text-center">{signupInfoText}</span>}
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </nav>

      {/* Style Toggle Button */}
      <button
        onClick={toggleStyle}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white border shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
        title="Switch to new style"
      >
        <Palette className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
        <span className="sr-only">Toggle style</span>
      </button>

      <Outlet context={{ useNewStyle }} />
    </div>
  );
}