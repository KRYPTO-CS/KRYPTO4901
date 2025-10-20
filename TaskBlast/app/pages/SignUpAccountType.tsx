import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpAccountTypeProps {
  onSubmit: (accountType: "managed" | "independent") => void;
  onBack: () => void;
}

export default function SignUpAccountType({ onSubmit, onBack }: SignUpAccountTypeProps) {
  const [selected, setSelected] = useState<"managed" | "independent" | null>(null);
  const [error, setError] = useState("");

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
        className={`w-full p-4 rounded-lg border ${
          active ? "border-primary bg-primary/10" : "border-gray-300 bg-white"
        }`}
        style={{ marginBottom: 12 }}
      >
        <Text className="font-madimi text-base font-semibold text-text-primary mb-1">
          {title}
        </Text>
        <Text className="font-madimi text-sm text-text-secondary">{description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          Who will be using TaskBlast?
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-6 text-left">
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
          <Text className="font-madimi text-sm text-red-500 mb-4 text-left">{error}</Text>
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
            className="font-madimi text-sm text-text-secondary cursor-pointer"
            onPress={onBack}
          >
            Back to <Text className="font-semibold text-primary">Previous Step</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
