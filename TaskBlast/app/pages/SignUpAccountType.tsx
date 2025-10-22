import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Animated } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpAccountTypeProps {
  onSubmit: (accountType: "managed" | "independent") => void;
  onBack: () => void;
}

export default function SignUpAccountType({ onSubmit, onBack }: SignUpAccountTypeProps) {
  const [selected, setSelected] = useState<"managed" | "independent" | null>(null);
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

  const handleContinue = () => {
    setError("");
    if (!selected) {
      setError("Please choose an account type to continue");
      return;
    }
    console.log("Account type submitted:", selected);
    onSubmit(selected);
  };

  const Option = ({
    value,
    title,
    description,
  }: {
    value: "managed" | "independent";
    title: string;
    description: string;
  }) => {
    const active = selected === value;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelected(value)}
        className={`w-full p-4 rounded-2xl border-2 ${
          active ? "border-yellow-300 bg-yellow-300/20" : "border-white/40 bg-white/10"
        }`}
        style={{ marginBottom: 12 }}
      >
        <Text className="font-madimi text-base font-semibold text-white mb-1 drop-shadow-md">
          {title}
        </Text>
        <Text className="font-madimi text-sm text-white/80">{description}</Text>
      </TouchableOpacity>
    );
  };

  return (
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
        <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
          <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
            Who will be using TaskBlast?
          </Text>

          <Text className="font-madimi text-sm text-white/90 mb-6 text-left">
            Choose the account type that best describes the primary user of TaskBlask.
          </Text>

          <Option
            value="managed"
            title="Managed Account"
            description="For dependents. Some features are restricted and controlled by a parent/guardian PIN."
          />

          <Option
            value="independent"
            title="Independent Account"
            description="For individual learners. Full access without restrictions."
          />

          {error ? (
            <Text className="font-madimi text-sm text-red-300 mb-4 text-left drop-shadow-md">{error}</Text>
          ) : null}

          <MainButton
            title="Continue"
            variant="primary"
            size="medium"
            customStyle={{ width: "60%", alignSelf: "flex-start", marginTop: 10 }}
            onPress={handleContinue}
          />

          <View className="mt-6">
            <Text
              className="font-madimi text-sm text-white drop-shadow-md cursor-pointer"
              onPress={onBack}
            >
              Back to <Text className="font-semibold text-yellow-300">Previous Step</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
