import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  AppState,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import MainButton from "../components/MainButton";
import TaskListModal from "../components/TaskListModal";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [rocks, setRocks] = useState<number>(0);
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

  const loadScore = useCallback(async () => {
    try {
      const val = await AsyncStorage.getItem('game_score');
      const n = val ? Number(val) : 0;
      setRocks(isNaN(n) ? 0 : Math.max(0, Math.floor(n)));
    } catch (err) {
      console.warn('Failed to load game score', err);
      setRocks(0);
    }
  }, []);

  useEffect(() => {
    loadScore();

    const handleAppState = (nextState: string) => {
      if (nextState === 'active') {
        loadScore();
      }
    };

    const sub = AppState.addEventListener ? AppState.addEventListener('change', handleAppState) : undefined;

    return () => {
      if (sub && typeof sub.remove === 'function') sub.remove();
    };
  }, [loadScore]);

  useFocusEffect(
    useCallback(() => {
      loadScore();
    }, [loadScore])
  );

  return (
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
      {/* All UI elements above the background */}
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
            <Image
              source={require("../../assets/images/fuel.png")}
              className="w-7 h-7 mr-1"
              resizeMode="contain"
              style={{ transform: [{ scale: 2 }], marginBottom: 2 }}
            />
            <Text className="font-orbitron-bold text-white text-md ml-2">
              20/20
            </Text>
          </View>

          {/* Rocks */}
          <View className="flex-row items-center bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/40 border-2 border-pink-300/30">
            <Image
              source={require("../../assets/images/Rocks.png")}
              className="w-7 h-7 mr-1"
              resizeMode="contain"
              style={{ transform: [{ scale: 3 }] }}
            />
            <Text className="font-orbitron-bold text-white text-md ml-2">
              {String(rocks).padStart(4, '0')}
            </Text>
          </View>
        </View>

        {/* Task List Button - Aligned Right */}
        <View className="items-end mt-4 pr-0">
          <TouchableOpacity
            className="flex-row  items-center px-6 py-3.5 rounded-2xl shadow-lg"
            onPress={() => setIsTaskModalVisible(true)}
          >
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
        <View className="items-center mb-24">
          <MainButton
            title="Take Off"
            onPress={() => router.push("/pages/GamePage")}
          />
        </View>

        {/* Task List Modal */}
        <TaskListModal
          visible={isTaskModalVisible}
          onClose={() => setIsTaskModalVisible(false)}
        />
      </View>
    </View>
  );
}
