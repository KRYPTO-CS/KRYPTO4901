import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
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
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Birthdate Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          What's Your Birthdate?
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          You must be at least 13 years old to register
        </Text>

        <View className="flex-row justify-between mb-4" style={{ gap: 10 }}>
          <View className="flex-1">
            <Text className="font-madimi text-xs text-text-secondary mb-2">
              Month
            </Text>
            <TextInput
              className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 text-base text-text-primary"
              placeholder="MM"
              placeholderTextColor="#999"
              value={month}
              onChangeText={(text) => setMonth(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View className="flex-1">
            <Text className="font-madimi text-xs text-text-secondary mb-2">
              Day
            </Text>
            <TextInput
              className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 text-base text-text-primary"
              placeholder="DD"
              placeholderTextColor="#999"
              value={day}
              onChangeText={(text) => setDay(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          <View className="flex-1">
            <Text className="font-madimi text-xs text-text-secondary mb-2">
              Year
            </Text>
            <TextInput
              className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 text-base text-text-primary"
              placeholder="YYYY"
              placeholderTextColor="#999"
              value={year}
              onChangeText={(text) => setYear(text.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>

        {error ? (
          <Text className="font-madimi text-sm text-red-500 mb-4 text-left">
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
          className="font-madimi text-sm text-text-secondary cursor-pointer"
          onPress={onBack}
        >
          Back to <Text className="font-semibold text-primary">Login</Text>
        </Text>
      </View>
    </View>
  );
}
