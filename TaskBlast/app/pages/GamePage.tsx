import React, { useState, useRef, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

let WebView: any = null;
try {
  WebView = require("react-native-webview").WebView;
} catch (e) {
  WebView = null;
}

const GAME_URL = "https://krypto-cs.github.io/SpaceShooter/";

export default function GamePage() {
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<any>(null);
  const router = useRouter();

  const handleMessage = useCallback((event: any) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);

      if (payload.type === "scoreUpdate") {
        console.log("Score from Godot:", payload);
      } else {
        console.log("Other message from game:", payload);
      }
    } catch (err) {
      console.warn("Invalid message from WebView:", event.nativeEvent.data);
    }
  }, []);

  if (!WebView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>WebView not installed</Text>
          <Text style={styles.message}>
            This screen requires the `react-native-webview` package. Install it
            with your package manager and rebuild the app:
          </Text>
          <Text style={styles.command}>npm install react-native-webview</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{"< Back"}</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator size="large" />
          </View>
        )}
        <WebView
          ref={webviewRef}
          source={{ uri: GAME_URL }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          onMessage={handleMessage}
          originWhitelist={["*"]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  message: {
    textAlign: "center",
    marginBottom: 12,
  },
  command: {
    fontFamily: "monospace",
    backgroundColor: "#111",
    color: "#fff",
    padding: 8,
    marginTop: 6,
    width: "100%",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#000",
    zIndex: 20,
  },
  backButton: {
    width: 80,
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
