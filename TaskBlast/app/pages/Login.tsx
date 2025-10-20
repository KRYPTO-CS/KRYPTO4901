import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import MainButton from "../components/MainButton";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./ResetPassword";

type Screen = "login" | "forgotPassword" | "verifyCode" | "resetPassword";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login attempted with:", username, password);
  };

  const handleForgotPassword = () => {
    setCurrentScreen("forgotPassword");
  };

  const handleSignUp = () => {
    // Handle sign up navigation here
    console.log("Sign up clicked");
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
