import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpEmailProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

export default function SignUpEmail({ onSubmit, onBack }: SignUpEmailProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    console.log("Email submitted:", email);
    onSubmit(email);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Email Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          What's Your Email?
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          We'll send you a verification code to confirm your email address
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Email Address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        {error ? (
          <Text className="font-madimi text-sm text-red-500 mb-4 text-left">
            {error}
          </Text>
        ) : null}

        <MainButton
          title="Send Code"
          variant="primary"
          size="medium"
          customStyle={{ width: "60%", alignSelf: "flex-start", marginTop: 10 }}
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
    </TouchableWithoutFeedback>
  );
}
