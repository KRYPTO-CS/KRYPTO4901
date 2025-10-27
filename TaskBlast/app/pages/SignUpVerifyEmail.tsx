import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import MainButton from "../components/MainButton";

interface SignUpVerifyEmailProps {
  email: string;
  onSubmit: (code: string) => void;
  onBack: () => void;
}

export default function SignUpVerifyEmail({
  email,
  onSubmit,
  onBack,
}: SignUpVerifyEmailProps) {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const starBackground = require("../../assets/backgrounds/starsAnimated.gif");

  const handleSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 5) {
      console.log("Email verification code submitted:", fullCode);
      onSubmit(fullCode);
    } else {
      console.log("Please enter a valid 5-digit code");
    }
  };

  const handleResend = () => {
    console.log("Resending verification code to:", email);
    // Add resend logic here
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
        {/* Animated stars background */}
        <ImageBackground
          source={starBackground}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        {/* Content overlay */}
        <View className="flex-1 items-center justify-center p-5">
          {/* Verify Email Container */}
          <View className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
            <Text className="text-4xl font-madimi font-semibold text-white mb-4 text-left drop-shadow-md">
              Verify Your Email
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
              <Text
                className="font-semibold text-yellow-300"
                onPress={handleResend}
              >
                Resend
              </Text>
            </Text>

            <MainButton
              title="Verify"
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
