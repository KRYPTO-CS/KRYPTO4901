import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainButton from "../components/MainButton";

interface SignUpNameProps {
  onSubmit: (firstName: string, lastName: string) => void;
  onBack: () => void;
}

export default function SignUpName({ onSubmit, onBack }: SignUpNameProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter both first and last name");
      return;
    }

    console.log("Name submitted:", firstName, lastName);
    onSubmit(firstName, lastName);
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
          {/* Name Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              What's Your Name?
            </Text>

            <Text className="font-madimi text-sm text-white/90 mb-8 text-left">
              Let us know what to call you while using TaskBlast
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center bg-white/20 border-2 border-white/40 rounded-2xl px-4 h-14 shadow-lg">
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="font-madimi flex-1 text-base text-white"
                  placeholder="First Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center bg-white/20 border-2 border-white/40 rounded-2xl px-4 h-14 shadow-lg">
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="font-madimi flex-1 text-base text-white"
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>
            </View>

            {error ? (
              <Text className="font-madimi text-sm text-red-300 mb-4 text-left drop-shadow-md">
                {error}
              </Text>
            ) : null}

            <MainButton
              title="Continue"
              variant="primary"
              size="medium"
              customStyle={{
                width: "60%",
                alignSelf: "flex-start",
                marginTop: 10,
              }}
              onPress={handleSubmit}
            />
          </View>

          {/* Back Link */}
          <View className="mt-8 items-center">
            <Text
              className="font-madimi text-sm text-white drop-shadow-md cursor-pointer"
              onPress={onBack}
            >
              Back to{" "}
              <Text className="font-semibold text-yellow-300">
                Previous Step
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
