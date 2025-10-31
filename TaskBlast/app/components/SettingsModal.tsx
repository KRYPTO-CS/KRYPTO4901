import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({
  visible,
  onClose,
}: SettingsModalProps) {
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View
          className="w-11/12 max-w-md rounded-3xl p-6"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderWidth: 2,
            borderColor: "rgba(139, 92, 246, 0.5)",
            shadowColor: "#a855f7",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="font-orbitron-semibold text-white text-2xl"
              style={{
                textShadowColor: "rgba(139, 92, 246, 0.8)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 15,
              }}
            >
              Settings
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.3)",
                borderWidth: 1,
                borderColor: "rgba(167, 139, 250, 0.5)",
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
            {/* Sound Effects */}
            <View
              className="flex-row justify-between items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name="volume-high"
                  size={24}
                  color="#60a5fa"
                  style={{ marginRight: 12 }}
                />
                <Text className="font-orbitron-semibold text-white text-base">
                  Sound Effects
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#334155", true: "#8b5cf6" }}
                thumbColor={soundEnabled ? "#a855f7" : "#64748b"}
              />
            </View>

            {/* Music */}
            <View
              className="flex-row justify-between items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name="musical-notes"
                  size={24}
                  color="#60a5fa"
                  style={{ marginRight: 12 }}
                />
                <Text className="font-orbitron-medium text-white text-base">
                  Music
                </Text>
              </View>
              <Switch
                value={musicEnabled}
                onValueChange={setMusicEnabled}
                trackColor={{ false: "#334155", true: "#8b5cf6" }}
                thumbColor={musicEnabled ? "#a855f7" : "#64748b"}
              />
            </View>

            {/* Notifications */}
            <View
              className="flex-row justify-between items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name="notifications"
                  size={24}
                  color="#60a5fa"
                  style={{ marginRight: 12 }}
                />
                <Text className="font-orbitron-medium text-white text-base">
                  Notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#334155", true: "#8b5cf6" }}
                thumbColor={notificationsEnabled ? "#a855f7" : "#64748b"}
              />
            </View>

            {/* Dark Mode */}
            <View
              className="flex-row justify-between items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.3)",
              }}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons
                  name="moon"
                  size={24}
                  color="#60a5fa"
                  style={{ marginRight: 12 }}
                />
                <Text className="font-orbitron-semibold text-white text-base">
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#334155", true: "#8b5cf6" }}
                thumbColor={darkModeEnabled ? "#a855f7" : "#64748b"}
              />
            </View>

            {/* Divider */}
            <View
              className="h-px my-4"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.3)" }}
            />

            {/* Additional Options */}
            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(236, 72, 153, 0.3)",
              }}
              onPress={() => {
                // Add account settings navigation
                console.log("Account Settings pressed");
              }}
            >
              <Ionicons
                name="person-circle"
                size={24}
                color="#ec4899"
                style={{ marginRight: 12 }}
              />
              <Text className="font-orbitron-medium text-white text-base flex-1">
                Account Settings
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ec4899" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(236, 72, 153, 0.3)",
              }}
              onPress={() => {
                // Add privacy settings navigation
                console.log("Privacy pressed");
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={24}
                color="#ec4899"
                style={{ marginRight: 12 }}
              />
              <Text className="font-orbitron-semibold text-white text-base flex-1">
                Privacy
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ec4899" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl mb-3"
              style={{
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(236, 72, 153, 0.3)",
              }}
              onPress={() => {
                // Add help & support navigation
                console.log("Help & Support pressed");
              }}
            >
              <Ionicons
                name="help-circle"
                size={24}
                color="#ec4899"
                style={{ marginRight: 12 }}
              />
              <Text className="font-orbitron-medium text-white text-base flex-1">
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ec4899" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(236, 72, 153, 0.3)",
              }}
              onPress={() => {
                // Add about navigation
                console.log("About pressed");
              }}
            >
              <Ionicons
                name="information-circle"
                size={24}
                color="#ec4899"
                style={{ marginRight: 12 }}
              />
              <Text className="font-orbitron-semibold text-white text-base flex-1">
                About
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#ec4899" />
            </TouchableOpacity>
          </ScrollView>

          {/* App Version */}
          <View className="items-center mt-6 pt-4 border-t border-purple-500/30">
            <Text className="font-orbitron text-gray-400 text-xs">
              TaskBlast v1.0.0
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
