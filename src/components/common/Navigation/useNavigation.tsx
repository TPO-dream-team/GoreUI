import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/utility/store";
import { loginUser, signUpUser, logout } from "@/utility/stores_slices/authSlice";

export const useNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { username, role } = useSelector((state: any) => state.auth);

  // Login State
  const [loginusernamefield, setLoginUsername] = useState("");
  const [loginpasswordfield, setLoginPassword] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginInfoText, setLoginInfoText] = useState("");

  // Signup State
  const [signupusernamefield, setSignupUsername] = useState("");
  const [signuppasswordfield1, setSignupPassword1] = useState("");
  const [signuppasswordfield2, setSignupPassword2] = useState("");
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signupInfoText, setSignupInfoText] = useState("");

  const handleLoginDialogOpen = (open: boolean) => {
    setLoginDialogOpen(open);
    setLoginInfoText("");
  };

  const handleSignupDialogOpen = (open: boolean) => {
    setSignUpDialogOpen(open);
    setSignupInfoText("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = await dispatch(loginUser({ Username: loginusernamefield, Password: loginpasswordfield }));
    
    if (loginUser.fulfilled.match(result)) {
      setLoginDialogOpen(false);
      setLoginInfoText("");
      navigate("/");
    } else if (loginUser.rejected.match(result)) {
      const errorMessage = (result.payload as any)?.message || "An error occurred";
      setLoginInfoText(errorMessage);
    }
    setLoginLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpLoading(true);
    const result = await dispatch(signUpUser({ 
      Username: signupusernamefield, 
      Password: signuppasswordfield1, 
      RepeatPassword: signuppasswordfield2 
    }));

    if (signUpUser.fulfilled.match(result)) {
      setSignUpDialogOpen(false);
      setLoginDialogOpen(true);
      setLoginInfoText("Registration successful");
    } else if (signUpUser.rejected.match(result)) {
      const errorMessage = (result.payload as any)?.message || "An error occurred";
      setSignupInfoText(errorMessage);
    }
    setSignUpLoading(false);
  };

  const handleLogoutBtn = () => {
    dispatch(logout());
    navigate("/");
  };

  return {
    // Auth Data
    username,
    role,
    navigate,
    // Login
    loginLoading,
    loginDialogOpen,
    loginInfoText,
    setLoginUsername,
    setLoginPassword,
    handleLoginDialogOpen,
    handleLogin,
    // Signup
    signUpLoading,
    signUpDialogOpen,
    signupInfoText,
    setSignupUsername,
    setSignupPassword1,
    setSignupPassword2,
    handleSignupDialogOpen,
    handleSignUp,
    // Actions
    handleLogoutBtn,
  };
};