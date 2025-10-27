import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  const starBackground = require("../../assets/backgrounds/starsAnimated.gif");

  const handleSubmit = () => {
    if (email.trim()) {
      console.log("Password reset requested for:", email);
      onSubmit(email);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1">
        {/* Animated stars background */}
        <ImageBackground
          source={starBackground}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        {/* Content overlay */}
        <View className="flex-1 items-center justify-center p-5">
          {/* Forgot Password Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              Forgot Your Password?
            </Text>

            <Text className="font-madimi text-sm text-white/90 mb-8 text-left">
              Enter your email address and we'll send you a code to reset your
              password.
            </Text>

            <View className="mb-8">
              <View className="flex-row items-center bg-white/20 border-2 border-white/40 rounded-2xl px-4 h-14 shadow-lg">
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="font-madimi flex-1 text-base text-white"
                  placeholder="Email Address"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <MainButton
              title="Submit"
              variant="primary"
              size="medium"
              customStyle={{
                width: "60%",
                alignSelf: "flex-start",
                marginTop: 0,
              }}
              onPress={handleSubmit}
            />
          </View>

          {/* Back to Login Link */}
          <View className="mt-8 items-center">
            <Text
              className="font-madimi text-sm text-white drop-shadow-md cursor-pointer"
              onPress={onBack}
            >
              Back to{" "}
              <Text className="font-semibold text-yellow-300">Login</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
