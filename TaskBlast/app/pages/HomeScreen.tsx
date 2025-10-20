import React from "react";
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <View className="w-full max-w-md items-center">
        <Text className="text-5xl font-madimi font-bold text-primary mb-4">
          Welcome to TaskBlast!
        </Text>
        <Text className="font-madimi text-lg text-text-secondary text-center">
          Your account has been successfully created
        </Text>
      </View>
    </View>
  );
}
