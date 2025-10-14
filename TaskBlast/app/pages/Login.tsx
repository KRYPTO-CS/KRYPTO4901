import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login attempted with:", username, password);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
  };

  const handleSignUp = () => {
    // Handle sign up navigation here
    console.log("Sign up clicked");
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Logo Section */}
      <View className="mb-12 items-center">
        <Text className="text-5xl font-bold text-primary tracking-widest">
          TaskBlast
        </Text>
      </View>

      {/* Login Container */}
      <View className="w-full max-w-md bg-surface rounded-xl p-8 shadow-lg">
        <Text className="text-2xl font-semibold text-text-primary mb-8 text-center">
          Login
        </Text>

        <TextInput
          className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          className="w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="w-full h-12 bg-primary rounded-lg items-center justify-center mt-2 shadow-md active:opacity-80"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Links */}
      <View className="mt-8 items-center">
        <TouchableOpacity onPress={handleSignUp} className="my-2">
          <Text className="text-sm text-text-secondary">
            Don't have an account?{" "}
            <Text className="font-semibold text-primary">Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} className="my-2">
          <Text className="text-sm text-text-secondary">
            Forgot Your Password?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
