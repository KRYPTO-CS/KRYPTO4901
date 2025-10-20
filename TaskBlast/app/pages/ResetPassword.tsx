import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import MainButton from "../components/MainButton";

interface ResetPasswordProps {
  onSubmit: (newPassword: string) => void;
  onBack: () => void;
}

export default function ResetPassword({
  onSubmit,
  onBack,
}: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    console.log("Password reset successful");
    onSubmit(newPassword);
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Reset Password Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          Create New Password
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          Enter your new password below
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="New Password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={setNewPassword}
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
          <Text className="font-madimi text-sm text-red-500 mb-4 text-center">
            {error}
          </Text>
        ) : null}

        <MainButton
          title="Submit"
          variant="primary"
          size="medium"
          customStyle={{ width: "60%", alignSelf: "flex-start", marginTop: 0 }}
          onPress={handleSubmit}
        />
      </View>

      {/* Back Link */}
      <View className="mt-8 items-center">
        <Text
          className="font-madimi text-sm text-text-secondary cursor-pointer"
          onPress={onBack}
        >
          Back to <Text className="font-semibold text-primary">Login</Text>
        </Text>
      </View>
    </View>
  );
}
