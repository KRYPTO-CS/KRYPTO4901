import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpCreatePasswordProps {
  onSubmit: (password: string) => void;
  onBack: () => void;
}

export default function SignUpCreatePassword({
  onSubmit,
  onBack,
}: SignUpCreatePasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    console.log("Password created successfully");
    onSubmit(password);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Create Password Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          Create a Password
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          Choose a strong password to secure your account
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {error ? (
          <Text className="font-madimi text-sm text-red-500 mb-4 text-left">
            {error}
          </Text>
        ) : null}

        <MainButton
          title="Create Account"
          variant="primary"
          size="medium"
          customStyle={{
            width: "100%",
            alignSelf: "flex-start",
            marginTop: 10,
          }}
          onPress={handleSubmit}
        />
      </View>

      {/* Back Link */}
      <View className="mt-8 items-center">
        <Text
          className="font-madimi text-sm text-text-secondary cursor-pointer"
          onPress={onBack}
        >
          Back to{" "}
          <Text className="font-semibold text-primary">Previous Step</Text>
        </Text>
      </View>
    </View>
  );
}
