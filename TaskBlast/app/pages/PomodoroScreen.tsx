import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  Image,
  AppState,
  Dimensions,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import MainButton from "../components/MainButton";
import { useAudioPlayer } from "expo-audio";

export default function PomodoroScreen() {
  const router = useRouter();

  // Timer state
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1 minute in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const totalTime = 1 * 60; // Total duration in seconds

  const starBackground = require("../../assets/backgrounds/starsAnimated.gif");

  // Scrolling background animation
  const windowHeight = Dimensions.get("window").height;
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // duration controls scroll speed (ms). Increase for slower scroll.
    const duration = 20000;
    const loop = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [scrollAnim]);

  // Interpolate translateY from 0 -> windowHeight
  const translateY = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, windowHeight],
  });

  // Music state
  const player = useAudioPlayer(require("../../assets/music/pomodoroLoop.mp3"));

  // Player floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Interpolated float value for smooth oscillation between -15 and 15
  const translateFloat = floatAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-15, 0, 15],
  });

  // Player floating animation effect
  useEffect(() => {
    const duration = 2000; // half-cycle duration
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [floatAnim]);

  // Play music on mount
  useEffect(() => {
    player.play();
    return () => {
      // Cleanup is handled by expo-audio automatically
      // Don't manually pause/seek in cleanup to avoid stale reference issues
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            try {
              player.pause();
            } catch (e) {
              console.warn("Audio player error on timer finish:", e);
            }
            router.push("/pages/GamePage");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, router]);

  // Handle app state changes (pause when app goes to background)
  useEffect(() => {
    const handleAppState = (nextState: string) => {
      if (nextState === "background" || nextState === "inactive") {
        setIsPaused(true);
      }
    };

    const sub = AppState.addEventListener
      ? AppState.addEventListener("change", handleAppState)
      : undefined;

    return () => {
      if (sub && typeof sub.remove === "function") sub.remove();
    };
  }, []);

  // Toggle pause
  const handlePauseLand = async () => {
    if (!isPaused) {
      setIsPaused(true);
      try {
        player.pause();
      } catch (e) {
        console.warn("Audio player pause error:", e);
      }
    } else {
      // Land - go back to home
      try {
        player.pause();
      } catch (e) {
        console.warn("Audio player error on land:", e);
      }
      router.back();
    }
  };

  // Calculate progress percentage (starts at 100% and decreases to 0%)
  const progressPercentage = (timeLeft / totalTime) * 100;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
  <View className="flex-1" style={{ backgroundColor: "#0d1b2a" }}>
      {/* Animated stars background - two stacked images that translate down and loop */}
      <View className="absolute inset-0 w-full h-full" style={{ overflow: "hidden" }}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
            <Image
              source={starBackground}
              style={{
                width: "100%",
                height: windowHeight,
                position: "absolute",
                top: -windowHeight,
              }}
              resizeMode="cover"
            />
            <Image
              source={starBackground}
              style={{
                width: "100%",
                height: windowHeight,
                position: "absolute",
                top: 0,
              }}
              resizeMode="cover"
            />
        </Animated.View>
      </View>

      {/* Content */}
      <View className="flex-1 p-5 pt-20">
        {/* Progress Bar - Top Center */}
        <View className="items-center mt-8">
          <View
            className="w-11/12 h-8 rounded-full border-2 overflow-hidden"
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.7)",
              borderColor: "rgba(192, 132, 252, 0.5)",
            }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: "#a855f7", // purple-500
              }}
            />
          </View>
        </View>

        {/* Time Left Display */}
        <View className="items-center mt-6">
          <View className="bg-gradient-to-br from-purple-600/80 to-pink-500/80 px-8 py-4 rounded-3xl shadow-lg shadow-purple-500/50 border-2 border-pink-300/30">
            <Text className="font-orbitron-bold text-white text-4xl">
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text className="font-orbitron text-white/80 text-lg mt-2">
            Time Remaining
          </Text>
        </View>

        {/* Player Image - Centered */}
        <View className="flex-1 items-center justify-center">
          <Animated.Image
            source={require("../../assets/images/sprites/shipAnimated.gif")}
            className="w-72 h-72"
            resizeMode="contain"
            style={{
              transform: [{ scale: 0.5 }, { translateY: translateFloat }],
            }}
          />
        </View>

        {/* Pause/Land Button */}
        <View className="items-center mb-24">
          <MainButton
            title={isPaused ? "Land" : "Pause"}
            onPress={handlePauseLand}
          />
        </View>
      </View>
    </View>
  );
}
