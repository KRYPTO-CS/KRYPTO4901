import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpNameProps {
  onSubmit: (firstName: string, lastName: string) => void;
  onBack: () => void;
}

export default function SignUpName({ onSubmit, onBack }: SignUpNameProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

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
    <View className="flex-1 bg-background items-center justify-center p-5">
      {/* Name Container */}
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          What's Your Name?
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-8 text-left">
          Let us know what to call you while using TaskBlast
        </Text>

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="First Name"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Last Name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

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
          Back to{" "}
          <Text className="font-semibold text-primary">Previous Step</Text>
        </Text>
      </View>
    </View>
  );
}
