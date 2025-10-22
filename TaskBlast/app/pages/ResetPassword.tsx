import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ImageBackground, Animated, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  // Background animation
  const backgrounds = [
    require("../../assets/images/homeBackground.png"),
    require("../../assets/images/homeBackground2.png"),
    require("../../assets/images/homeBackground3.png"),
  ];
  const [bgIndex, setBgIndex] = useState(0);
  const [nextBgIndex, setNextBgIndex] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNext(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        setBgIndex(nextBgIndex);
        setNextBgIndex((nextBgIndex + 1) % backgrounds.length);
        setShowNext(false);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [nextBgIndex, fadeAnim]);

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
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1">
        {/* Current background always visible */}
        <ImageBackground
          source={backgrounds[bgIndex]}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        {/* Next background fades in over current */}
        {showNext && (
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: fadeAnim,
            }}
            pointerEvents="none"
          >
            <ImageBackground
              source={backgrounds[nextBgIndex]}
              className="flex-1"
              resizeMode="cover"
            />
          </Animated.View>
        )}

        {/* Content overlay */}
        <View className="flex-1 items-center justify-center p-5">
          {/* Reset Password Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              Create New Password
            </Text>

            <Text className="font-madimi text-sm text-white/90 mb-8 text-left">
              Enter your new password below
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center bg-white/20 border-2 border-white/40 rounded-2xl px-4 h-14 shadow-lg">
                <Ionicons name="lock-closed-outline" size={22} color="white" style={{ marginRight: 10 }} />
                <TextInput
                  className="font-madimi flex-1 text-base text-white"
                  placeholder="New Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center bg-white/20 border-2 border-white/40 rounded-2xl px-4 h-14 shadow-lg">
                <Ionicons name="lock-closed-outline" size={22} color="white" style={{ marginRight: 10 }} />
                <TextInput
                  className="font-madimi flex-1 text-base text-white"
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {error ? (
              <Text className="font-madimi text-sm text-red-300 mb-4 text-center drop-shadow-md">
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
              className="font-madimi text-sm text-white drop-shadow-md cursor-pointer"
              onPress={onBack}
            >
              Back to <Text className="font-semibold text-yellow-300">Login</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
