import React from "react";
import { View, Text } from "react-native";
import MainButton from "../components/MainButton";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background items-center justify-center p-5">
      <View className="w-full max-w-md items-center">
        <Text className="text-5xl font-madimi font-bold text-primary mb-4">
          Welcome to TaskBlast!
        </Text>
        <Text className="font-madimi text-lg text-text-secondary text-center">
          Your account has been successfully created
        </Text>
        <MainButton
          title="Play Game"
          variant="primary"
          size="medium"
          customStyle={{ width: "60%", alignSelf: "center", marginTop: 16 }}
          onPress={() => router.push("/pages/GamePage")}
        />
      </View>
    </View>
  );
}
