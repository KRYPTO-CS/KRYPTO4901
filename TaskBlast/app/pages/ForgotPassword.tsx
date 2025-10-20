import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import MainButton from "../components/MainButton";

interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

export default function ForgotPassword({
  onSubmit,
  onBack,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email.trim()) {
      console.log("Password reset requested for:", email);
      onSubmit(email);
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Forgot Password Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8 b">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          Forgot Your Password?
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          Enter your email address and we'll send you a code to reset your
          password.
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-8 text-base text-text-primary"
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <MainButton
          title="Submit"
          variant="primary"
          size="medium"
          customStyle={{ width: "60%", alignSelf: "flex-start", marginTop: 0 }}
          onPress={handleSubmit}
        />
      </View>

      {/* Back to Login Link */}
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
