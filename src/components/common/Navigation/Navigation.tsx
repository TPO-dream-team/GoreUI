import { Menu } from "lucide-react";
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

export function Navigation() {
  const {
    username, role, navigate,
    loginLoading, loginDialogOpen, loginInfoText, setLoginUsername, setLoginPassword, handleLoginDialogOpen, handleLogin,
    signUpLoading, signUpDialogOpen, signupInfoText, setSignupUsername, setSignupPassword1, setSignupPassword2, handleSignupDialogOpen, handleSignUp,
    handleLogoutBtn
  } = useNavigation();

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
                <SheetClose asChild><Link to={role ? "/board" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Board</Link></SheetClose>
                <SheetClose asChild><Link to={role ? "/chat" : "#"} className={`text-lg font-medium mr-3 pt-1 pb-1 pl-3 rounded-full ${role ? "hover:bg-secondary" : "text-gray-400 cursor-not-allowed pointer-events-none"}`}>Chat</Link></SheetClose>
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
              <span className="text-lg font-semibold select-none mr-3">{username}</span>
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
                      <Button disabled={signUpLoading}>{signUpLoading ? "Signing up..." : "Sign in"}</Button>
                      {signupInfoText && <span className="text-red-500 text-sm text-center">{signupInfoText}</span>}
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}