import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import { auth, db, firestore } from "../../server/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

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
  const [signUpLoading, setSignUpLoading] = useState(false);

  const handleLogin = () => {
    // Bypass login for testing
    if (username === "admin" && password === "taskblaster") {
      console.log("Bypass login successful");
      setCurrentScreen("homeScreen");
      return;
    }

    // Handle normal login logic here
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Login successful:", user.email);
        setCurrentScreen("homeScreen");
      })
      .catch((error) => {
        // display error to user here
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Login error:", errorCode, errorMessage);
      });
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

  const handleSignUpPasswordSubmit = async (password: string) => {
    const payload = { ...signUpData, password };

    if (!payload.email) {
      console.error("Sign up error: email is required");
      return;
    }

    if (!password || password.length < 6) {
      console.error("Sign up error: password must be at least 6 characters");
      return;
    }

    setSignUpLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        password
      );
      const user = userCredential.user;
      console.log("Sign up successful:", user.email);

      await updateProfile(user, {
        displayName: `${payload.firstName} ${payload.lastName}`,
      });

      console.log(
        "auth.currentUser uid:",
        auth.currentUser?.uid,
        "created user uid:",
        user.uid
      );

      const userDocRef = doc(firestore, "users", user.uid);
      try {
        await setDoc(userDocRef, {
          birthdate: payload.birthdate,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          accountType: payload.accountType,
          managerialPin: payload.managerialPin,
          createdAt: serverTimestamp(),
        });
      } catch (writeErr) {
        console.error("Failed to write user document:", writeErr);
        try {
          await user.delete();
          console.log("Deleted auth user due to Firestore write failure");
        } catch (deleteErr) {
          console.error(
            "Failed to delete auth user after write failure:",
            deleteErr
          );
        }
        throw writeErr;
      }

      // Clear sensitive data from state
      setSignUpData({ ...payload, password: "" });

      console.log("Sign up complete with data:", {
        ...payload,
        password: "***",
      });
      // Navigate to home screen
      setCurrentScreen("homeScreen");
    } catch (error: any) {
      console.error("Sign up error:", error?.code ?? error?.message ?? error);
      return;
    } finally {
      setSignUpLoading(false);
    }
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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <TextInput
            className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-8 text-base text-text-primary margin-bottom-xxl"
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={() => Keyboard.dismiss()}
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
    </TouchableWithoutFeedback>
  );
}
