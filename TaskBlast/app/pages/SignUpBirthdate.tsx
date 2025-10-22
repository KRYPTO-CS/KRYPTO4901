import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ImageBackground, Animated } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpBirthdateProps {
  onSubmit: (birthdate: string) => void;
  onBack: () => void;
}

export default function SignUpBirthdate({
  onSubmit,
  onBack,
}: SignUpBirthdateProps) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
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

    if (!month.trim() || !day.trim() || !year.trim()) {
      setError("Please fill in all fields");
      return;
    }

    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearNum = parseInt(year);

    // Validate date format
    if (
      isNaN(monthNum) ||
      isNaN(dayNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31 ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      setError("Please enter a valid date");
      return;
    }

    // Calculate age
    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // COPPA compliance - must be 13 or older
    if (age < 13) {
      setError("Please give the device to a parent or guardian");
      return;
    }

    const birthdate = `${month.padStart(2, "0")}/${day.padStart(
      2,
      "0"
    )}/${year}`;
    console.log("Birthdate submitted:", birthdate);
    onSubmit(birthdate);
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
          {/* Birthdate Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              What's Your Birthdate?
            </Text>

            <Text className="font-madimi text-sm text-white/90 mb-8 text-left">
              You must be at least 13 years old to register
            </Text>

            <View className="flex-row justify-between mb-4" style={{ gap: 10 }}>
              <View className="flex-1">
                <Text className="font-madimi text-xs text-white/80 mb-2">
                  Month
                </Text>
                <TextInput
                  className="font-madimi w-full h-12 bg-white/20 border-2 border-white/40 rounded-2xl px-4 text-base text-white shadow-lg"
                  placeholder="MM"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={month}
                  onChangeText={(text) => setMonth(text.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  maxLength={2}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              <View className="flex-1">
                <Text className="font-madimi text-xs text-white/80 mb-2">
                  Day
                </Text>
                <TextInput
                  className="font-madimi w-full h-12 bg-white/20 border-2 border-white/40 rounded-2xl px-4 text-base text-white shadow-lg"
                  placeholder="DD"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={day}
                  onChangeText={(text) => setDay(text.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  maxLength={2}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              <View className="flex-1">
                <Text className="font-madimi text-xs text-white/80 mb-2">
                  Year
                </Text>
                <TextInput
                  className="font-madimi w-full h-12 bg-white/20 border-2 border-white/40 rounded-2xl px-4 text-base text-white shadow-lg"
                  placeholder="YYYY"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={year}
                  onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  maxLength={4}
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
              customStyle={{ width: "60%", alignSelf: "flex-start", marginTop: 10 }}
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
