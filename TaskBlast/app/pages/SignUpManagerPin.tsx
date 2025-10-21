import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import MainButton from "../components/MainButton";

interface SignUpManagerPinProps {
  onSubmit: (pin: string | null) => void;
  onBack: () => void;
}

export default function SignUpManagerPin({ onSubmit, onBack }: SignUpManagerPinProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    if (pin.length !== 4 || confirmPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    console.log("Managerial PIN created:", pin.replace(/./g, "*"));
    onSubmit(pin);
  };

  return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View className="flex-1 bg-background items-center justify-center p-5">
      <View className="w-full max-w-md bg-transparent rounded-xl p-8">
        <Text className="text-4xl font-madimi font-semibold text-text-primary mb-4 text-left">
          Create a Manager PIN
        </Text>

        <Text className="font-madimi text-sm text-text-secondary mb-6 text-left">
          This 4-digit PIN lets a parent or guardian manage the account and create tasks for the learner. Keep it secret.
        </Text>

        <Text className="font-madimi text-xs text-text-secondary mb-2">PIN (4 digits)</Text>
        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="1234"
          placeholderTextColor="#999"
          value={pin}
          onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
            onSubmitEditing={() => Keyboard.dismiss()}
        />

        <Text className="font-madimi text-xs text-text-secondary mb-2">Confirm PIN</Text>
        <TextInput
          className="font-madimi w-full h-12 bg-gray-50 border border-gray-300 rounded-lg px-4 mb-4 text-base text-text-primary"
          placeholder="Confirm PIN"
          placeholderTextColor="#999"
          value={confirmPin}
          onChangeText={(t) => setConfirmPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
            onSubmitEditing={() => Keyboard.dismiss()}
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
      </TouchableWithoutFeedback>
  );
}
