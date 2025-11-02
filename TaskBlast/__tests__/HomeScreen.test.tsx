/**
 * Test Suite: HomeScreen
 *
 * This test suite covers the HomeScreen functionality including:
 * - UI rendering (profile, settings, fuel, rocks, task list)
 * - Navigation to different screens
 * - Background music playback
 * - Score persistence
 * - Task management
 * - Settings modal
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../app/pages/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { router } from "expo-router";

// Use global audio mocks from jest.setup.js
const mockPlay = (global as any).mockAudioPlayer.play;
const mockPause = (global as any).mockAudioPlayer.pause;

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlay.mockReset().mockImplementation(() => {});
    mockPause.mockReset().mockImplementation(() => {});
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1000");
  });

  describe("UI Rendering", () => {
    it("should render all main UI elements", async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        // Check for buttons
        expect(getByText("Take Off")).toBeTruthy();
      });
    });

    it("should display fuel indicator", async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("20/20")).toBeTruthy();
      });
    });

    it("should display rocks count", async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("1000")).toBeTruthy();
      });
    });

    it("should display rocks in 4-digit format with leading zeros", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("5");

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("0005")).toBeTruthy();
      });
    });

    it("should render profile button", () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId("profile-button")).toBeTruthy();
    });

    it("should render settings button", () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId("settings-button")).toBeTruthy();
    });

    it("should render task list button", () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId("task-button")).toBeTruthy();
    });

    it("should render planet image", () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId("planet-image")).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("should navigate to Pomodoro Screen when Take Off is pressed", () => {
      const { getByText } = render(<HomeScreen />);

      const takeOffButton = getByText("Take Off");
      fireEvent.press(takeOffButton);

      expect(router.push).toHaveBeenCalledWith("/pages/PomodoroScreen");
    });

    it("should navigate to Profile Screen when profile button is pressed", () => {
      const { getByTestId } = render(<HomeScreen />);

      const profileButton = getByTestId("profile-button");
      fireEvent.press(profileButton);

      expect(router.push).toHaveBeenCalledWith("/pages/ProfileScreen");
    });

    it("should open settings modal when settings button is pressed", () => {
      const { getByTestId } = render(<HomeScreen />);

      const settingsButton = getByTestId("settings-button");
      fireEvent.press(settingsButton);

      // Settings modal should be visible
      expect(getByTestId("settings-modal")).toBeTruthy();
    });

    it("should open task list modal when task button is pressed", () => {
      const { getByTestId } = render(<HomeScreen />);

      const taskButton = getByTestId("task-button");
      fireEvent.press(taskButton);

      // Task modal should be visible
      expect(getByTestId("task-modal")).toBeTruthy();
    });
  });

  describe("Background Music", () => {
    it("should play background music on mount", async () => {
      render(<HomeScreen />);

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalled();
      });
    });

    it("should set music to loop", () => {
      const mockAudioPlayer = {
        play: mockPlay,
        pause: mockPause,
        loop: false,
      };

      const mockUseAudioPlayer = jest.requireMock("expo-audio").useAudioPlayer;
      mockUseAudioPlayer.mockReturnValueOnce(mockAudioPlayer);

      render(<HomeScreen />);

      expect(mockAudioPlayer.loop).toBe(true);
    });

    it("should pause music when app goes to background", async () => {
      render(<HomeScreen />);

      mockPause.mockClear();

      // Simulate app state change to background using global helper
      (global as any).mockAppState.triggerAppStateChange("background");

      await waitFor(() => {
        expect(mockPause).toHaveBeenCalled();
      });
    });

    it("should resume music when app becomes active", async () => {
      render(<HomeScreen />);

      mockPlay.mockClear();

      // Simulate app state change to active using global helper
      (global as any).mockAppState.triggerAppStateChange("active");

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalled();
      });
    });

    it("should pause music when screen loses focus", () => {
      const { unmount } = render(<HomeScreen />);

      unmount();

      expect(mockPause).toHaveBeenCalled();
    });
  });

  describe("Score Persistence", () => {
    it("should load score from AsyncStorage on mount", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("2500");

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("game_score");
        expect(getByText("2500")).toBeTruthy();
      });
    });

    it("should default to 0 if no score exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("0000")).toBeTruthy();
      });
    });

    it("should handle invalid score gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("invalid");

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("0000")).toBeTruthy();
      });
    });

    it("should reload score when screen comes into focus", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1500");

      const { rerender } = render(<HomeScreen />);

      const initialCalls = (AsyncStorage.getItem as jest.Mock).mock.calls
        .length;

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalled();
      });

      // Simulate focus effect
      const useFocusEffect = jest.requireMock(
        "@react-navigation/native"
      ).useFocusEffect;
      const focusCallback = useFocusEffect.mock.calls[0][0];
      focusCallback();

      await waitFor(() => {
        // Should have been called at least once more after focus
        expect(
          (AsyncStorage.getItem as jest.Mock).mock.calls.length
        ).toBeGreaterThan(initialCalls);
      });
    });

    it("should floor score to integer", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1234.56");

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("1234")).toBeTruthy();
      });
    });

    it("should handle negative scores as zero", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("-100");

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("0000")).toBeTruthy();
      });
    });
  });

  describe("Task List Modal", () => {
    it("should open task list modal", () => {
      const { getByTestId } = render(<HomeScreen />);

      const taskButton = getByTestId("task-button");
      fireEvent.press(taskButton);

      expect(getByTestId("task-modal")).toBeTruthy();
    });

    it("should close task list modal", () => {
      const { getByTestId, queryByTestId } = render(<HomeScreen />);

      const taskButton = getByTestId("task-button");
      fireEvent.press(taskButton);

      const closeButton = getByTestId("close-task-modal");
      fireEvent.press(closeButton);

      expect(queryByTestId("task-modal")).toBeFalsy();
    });

    it("should display task list in modal", () => {
      const { getByTestId } = render(<HomeScreen />);

      const taskButton = getByTestId("task-button");
      fireEvent.press(taskButton);

      // Check that the task modal is displayed
      expect(getByTestId("task-modal")).toBeTruthy();
    });
  });

  describe("Settings Modal", () => {
    it("should open settings modal", () => {
      const { getByTestId } = render(<HomeScreen />);

      const settingsButton = getByTestId("settings-button");
      fireEvent.press(settingsButton);

      expect(getByTestId("settings-modal")).toBeTruthy();
    });

    it("should close settings modal", () => {
      const { getByTestId, queryByTestId } = render(<HomeScreen />);

      const settingsButton = getByTestId("settings-button");
      fireEvent.press(settingsButton);

      const closeButton = getByTestId("close-settings-modal");
      fireEvent.press(closeButton);

      expect(queryByTestId("settings-modal")).toBeFalsy();
    });

    it("should display settings options in modal", () => {
      const { getByTestId } = render(<HomeScreen />);

      const settingsButton = getByTestId("settings-button");
      fireEvent.press(settingsButton);

      // Check that the settings modal is displayed
      expect(getByTestId("settings-modal")).toBeTruthy();
    });
  });

  describe("Fuel System", () => {
    it("should display current fuel level", () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText("20/20")).toBeTruthy();
    });

    it("should display fuel icon", () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId("fuel-icon")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle AsyncStorage errors gracefully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText("0000")).toBeTruthy();
      });
    });

    it("should handle audio player errors gracefully", () => {
      mockPlay.mockImplementation(() => {
        throw new Error("Audio error");
      });

      // Should not crash
      expect(() => render(<HomeScreen />)).not.toThrow();
    });
  });

  describe("App State Management", () => {
    it("should reload score when app becomes active", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("1000");

      render(<HomeScreen />);

      const initialCalls = (AsyncStorage.getItem as jest.Mock).mock.calls
        .length;

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalled();
      });

      // Simulate app becoming active using global helper
      (global as any).mockAppState.triggerAppStateChange("active");

      await waitFor(() => {
        // Should have been called at least once more after becoming active
        expect(
          (AsyncStorage.getItem as jest.Mock).mock.calls.length
        ).toBeGreaterThan(initialCalls);
      });
    });
  });
});
