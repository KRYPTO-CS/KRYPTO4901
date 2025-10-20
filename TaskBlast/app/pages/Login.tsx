import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MainButton from "../components/MainButton";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./ResetPassword";
import SignUpBirthdate from "./SignUpBirthdate";
import SignUpAccountType from "./SignUpAccountType";
import SignUpManagerPin from "./SignUpManagerPin";
import SignUpName from "./SignUpName";
import SignUpEmail from "./SignUpEmail";
import SignUpVerifyEmail from "./SignUpVerifyEmail";
import SignUpCreatePassword from "./SignUpCreatePassword";
import HomeScreen from "./HomeScreen";

type Screen =
  | "login"
  | "forgotPassword"
  | "verifyCode"
  | "resetPassword"
  | "signUpBirthdate"
  | "signUpAccountType"
  | "signUpManagerPin"
  | "signUpName"
  | "signUpEmail"
  | "signUpVerifyEmail"
  | "signUpCreatePassword"
  | "homeScreen";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Sign up state
  const [signUpData, setSignUpData] = useState({
    birthdate: "",
    firstName: "",
    lastName: "",
    email: "",
    verificationCode: "",
    password: "",
    accountType: "",
    managerialPin: null as string | null,
  });

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login attempted with:", username, password);
  };

  const handleForgotPassword = () => {
    setCurrentScreen("forgotPassword");
  };

  const handleSignUp = () => {
    // Navigate to sign up flow
    setCurrentScreen("signUpBirthdate");
  };

  const handleEmailSubmit = (email: string) => {
    setResetEmail(email);
    setCurrentScreen("verifyCode");
  };

  const handleCodeSubmit = (code: string) => {
    setVerificationCode(code);
    setCurrentScreen("resetPassword");
  };

  const handlePasswordReset = (newPassword: string) => {
    console.log("Password reset successful for:", resetEmail);
    // Reset state and return to login
    setResetEmail("");
    setVerificationCode("");
    setCurrentScreen("login");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
    setResetEmail("");
    setVerificationCode("");
  };

  // Sign Up Flow Handlers
  const handleBirthdateSubmit = (birthdate: string) => {
    setSignUpData({ ...signUpData, birthdate });
    setCurrentScreen("signUpAccountType");
  };

  const handleAccountTypeSubmit = (accountType: "managed" | "independent") => {
    setSignUpData({ ...signUpData, accountType });
    // If managed, prompt for managerial PIN; if independent, set PIN to null and continue
    if (accountType === "managed") {
      setCurrentScreen("signUpManagerPin");
    } else {
      setSignUpData({ ...signUpData, accountType, managerialPin: null });
      setCurrentScreen("signUpName");
    }
  };

  const handleManagerPinSubmit = (pin: string | null) => {
    setSignUpData({ ...signUpData, managerialPin: pin });
    setCurrentScreen("signUpName");
  };

  const handleNameSubmit = (firstName: string, lastName: string) => {
    setSignUpData({ ...signUpData, firstName, lastName });
    setCurrentScreen("signUpEmail");
  };

  const handleSignUpEmailSubmit = (email: string) => {
    setSignUpData({ ...signUpData, email });
    setCurrentScreen("signUpVerifyEmail");
  };

  const handleSignUpVerifyEmailSubmit = (code: string) => {
    setSignUpData({ ...signUpData, verificationCode: code });
    setCurrentScreen("signUpCreatePassword");
  };

  const handleSignUpPasswordSubmit = (password: string) => {
    setSignUpData({ ...signUpData, password });
    console.log("Sign up complete with data:", { ...signUpData, password });
    // Navigate to home screen
    setCurrentScreen("homeScreen");
  };

  const handleBackToLoginFromSignUp = () => {
    setCurrentScreen("login");
    setSignUpData({
      birthdate: "",
      firstName: "",
      lastName: "",
      email: "",
      verificationCode: "",
      password: "",
      accountType: "",
      managerialPin: null,
    });
  };

  // Render forgot password flow screens
  if (currentScreen === "forgotPassword") {
    return (
      <ForgotPassword onSubmit={handleEmailSubmit} onBack={handleBackToLogin} />
    );
  }

  if (currentScreen === "verifyCode") {
    return (
      <VerifyCode
        email={resetEmail}
        onSubmit={handleCodeSubmit}
        onBack={() => setCurrentScreen("forgotPassword")}
      />
    );
  }

  if (currentScreen === "resetPassword") {
    return (
      <ResetPassword
        onSubmit={handlePasswordReset}
        onBack={handleBackToLogin}
      />
    );
  }

  // Render sign up flow screens
  if (currentScreen === "signUpBirthdate") {
    return (
      <SignUpBirthdate
        onSubmit={handleBirthdateSubmit}
        onBack={handleBackToLoginFromSignUp}
      />
    );
  }

  if (currentScreen === "signUpAccountType") {
    return (
      <SignUpAccountType
        onSubmit={handleAccountTypeSubmit}
        onBack={() => setCurrentScreen("signUpBirthdate")}
      />
    );
  }

  if (currentScreen === "signUpManagerPin") {
    return (
      <SignUpManagerPin
        onSubmit={handleManagerPinSubmit}
        onBack={() => setCurrentScreen("signUpAccountType")}
      />
    );
  }

  if (currentScreen === "signUpName") {
    return (
      <SignUpName
        onSubmit={handleNameSubmit}
        onBack={() => setCurrentScreen("signUpAccountType")}
      />
    );
  }

  if (currentScreen === "signUpEmail") {
    return (
      <SignUpEmail
        onSubmit={handleSignUpEmailSubmit}
        onBack={() => setCurrentScreen("signUpName")}
      />
    );
  }

  if (currentScreen === "signUpVerifyEmail") {
    return (
      <SignUpVerifyEmail
        email={signUpData.email}
        onSubmit={handleSignUpVerifyEmailSubmit}
        onBack={() => setCurrentScreen("signUpEmail")}
      />
    );
  }

  if (currentScreen === "signUpCreatePassword") {
    return (
      <SignUpCreatePassword
        onSubmit={handleSignUpPasswordSubmit}
        onBack={() => setCurrentScreen("signUpVerifyEmail")}
      />
    );
  }

  if (currentScreen === "homeScreen") {
    return <HomeScreen />;
  }

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Logo Section */}
      <View className="mb-12 items-center">
        <Text className="text-6xl font-madimi text-primary">TaskBlast</Text>
      </View>

      {/* Login Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8 border-2 border-gray-300 border-dashed">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-8 text-center">
          Login
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-8 text-base text-text-primary margin-bottom-xxl"
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <MainButton
        title="Submit"
        variant="primary"
        size="medium"
        customStyle={{ width: "60%", alignSelf: "center", marginTop: -15 }}
        onPress={handleLogin}
      />

      {/* Bottom Links */}
      <View className="mt-8 items-center">
        <TouchableOpacity onPress={handleSignUp} className="my-2">
          <Text className="font-madimi text-sm text-text-secondary">
            Don't have an account?{" "}
            <Text className="font-semibold text-primary">Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} className="my-2">
          <Text className="font-madimi text-sm text-text-secondary">
            Forgot Your Password?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
