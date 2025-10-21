import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainButton from "../components/MainButton";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/homeBackground.png")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 p-5">
        {/* Top Left Section - Profile & Settings */}
        <View className="absolute top-20 left-5 z-10">
          <TouchableOpacity className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full items-center justify-center mb-3 shadow-lg shadow-purple-500/50">
            <Ionicons name="person" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full items-center justify-center shadow-lg shadow-blue-500/50">
            <Ionicons name="settings" size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Top Row - Fuel Badge & Rocks */}
        <View className="flex-row justify-end items-center gap-4 mt-11">
          {/* Fuel Badge */}
          <View className="flex-row items-center bg-gradient-to-r from-orange-500 to-yellow-400 px-5 py-2.5 rounded-full shadow-lg shadow-orange-400/40 border-2 border-yellow-300/30">
            <Ionicons name="flame" size={26} color="white" />
            <Text className="font-orbitron-bold text-white text-md ml-2">
              20/20
            </Text>
          </View>

          {/* Rocks */}
          <View className="flex-row items-center bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/40 border-2 border-pink-300/30">
            <Ionicons name="diamond" size={26} color="white" />
            <Text className="font-orbitron-bold text-white text-md ml-2">
              0000
            </Text>
          </View>
        </View>

        {/* Task List Button - Aligned Right */}
        <View className="items-end mt-4 pr-0">
          <TouchableOpacity className="flex-row  items-center px-6 py-3.5 rounded-2xl shadow-lg">
            <Ionicons name="receipt-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Center - Planet Image */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../../assets/images/planet.png")}
            className="w-64 h-64"
            resizeMode="contain"
          />
        </View>

        {/* Take Off Button - Bottom Center */}
        <View className="items-center mb-20">
          <MainButton title="Take Off" onPress={() => {}} />
        </View>
      </View>
    </ImageBackground>
  );
}
