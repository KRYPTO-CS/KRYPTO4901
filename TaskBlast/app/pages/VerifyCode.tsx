import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ImageBackground, Animated } from "react-native";
import MainButton from "../components/MainButton";

interface VerifyCodeProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
}

export default function VerifyCode({
  email,
  onSubmit,
  onBack,
}: VerifyCodeProps) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
    const fullCode = code.join("");
    if (fullCode.length === 5) {
      console.log("Verification code submitted:", fullCode);
      onSubmit(fullCode);
    } else {
      console.log("Please enter a valid 5-digit code");
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");

    if (numericText.length > 0) {
      const newCode = [...code];
      newCode[index] = numericText[numericText.length - 1]; // Take only the last digit
      setCode(newCode);

      // Auto-focus next input
      if (index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      const newCode = [...code];

      if (code[index] === "" && index > 0) {
        // If current box is empty, go back and clear previous box
        inputRefs.current[index - 1]?.focus();
        newCode[index - 1] = "";
      } else {
        // Clear current box
        newCode[index] = "";
      }

      setCode(newCode);
    }
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
          {/* Verify Code Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              Verify Code
            </Text>

            <Text className="font-madimi text-sm text-white/90 mb-8 text-left">
              Enter the 5-digit code sent to {email}
            </Text>

            <View className="flex-row justify-between mb-8" style={{ gap: 10 }}>
              {[0, 1, 2, 3, 4].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="font-madimi flex-1 h-14 bg-white/20 border-2 border-white/40 rounded-2xl text-2xl text-white text-center shadow-lg"
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={code[index]}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  maxLength={1}
                />
              ))}
            </View>

            <Text className="font-madimi text-xs text-white/80 text-left mb-4">
              Didn't receive the code?{" "}
              <Text className="font-semibold text-yellow-300">Resend</Text>
            </Text>

            <MainButton
              title="Submit"
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
              Back to{" "}
              <Text className="font-semibold text-yellow-300">Previous Step</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
