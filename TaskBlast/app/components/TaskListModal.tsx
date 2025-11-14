import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  getDoc,
} from "firebase/firestore";

interface Task {
  id: string;
  name: string;
  reward: number;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface TaskListModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TaskListModal({
  visible,
  onClose,
}: TaskListModalProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<string>("");
  const [managerialPin, setManagerialPin] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) {
      setError("Please log in to view tasks");
      setLoading(false);
      return;
    }

    // Fetch user data to get accountType and managerialPin
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAccountType(userData.accountType || "");
          setManagerialPin(userData.managerialPin || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    try {
      const userTasksRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "tasks"
      );
      const unsubscribe = onSnapshot(
        userTasksRef,
        (snapshot: any) => {
          const taskList: Task[] = [];
          snapshot.forEach((doc: any) => {
            const data = doc.data();
            taskList.push({
              id: doc.id,
              name: data.name,
              reward: data.reward,
              completed: data.completed,
              createdAt: data.createdAt || Timestamp.now(),
              updatedAt: data.updatedAt || Timestamp.now(),
            });
          });
          // Sort tasks by creation date, newest first
          taskList.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
          setTasks(taskList);
          setLoading(false);
          setError(null);
        },
        (error: Error) => {
          console.error("Error fetching tasks:", error);
          setError("Failed to load tasks");
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up task listener:", error);
      setError("Failed to initialize task system");
      setLoading(false);
    }
  }, [auth.currentUser]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskReward, setNewTaskReward] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    if (!auth.currentUser) return;
    try {
      const taskRef = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await updateDoc(taskRef, {
          completed: !task.completed,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!auth.currentUser) return;
    try {
      const taskRef = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task");
    }
  };

  const handleAddTask = async () => {
    if (!auth.currentUser) return;
    if (newTaskName.trim() && newTaskReward.trim()) {
      try {
        const userTasksRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "tasks"
        );
        await addDoc(userTasksRef, {
          name: newTaskName,
          reward: parseInt(newTaskReward) || 0,
          completed: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setNewTaskName("");
        setNewTaskReward("");
        setIsAddingTask(false);
      } catch (error) {
        console.error("Error adding task:", error);
        Alert.alert("Error", "Failed to add task");
      }
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setNewTaskName(task.name);
      setNewTaskReward(task.reward.toString());
      setEditingTaskId(taskId);
      setIsAddingTask(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!auth.currentUser) return;
    if (editingTaskId && newTaskName.trim() && newTaskReward.trim()) {
      try {
        const taskRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "tasks",
          editingTaskId
        );
        await updateDoc(taskRef, {
          name: newTaskName,
          reward: parseInt(newTaskReward) || 0,
          updatedAt: serverTimestamp(),
        });
        setNewTaskName("");
        setNewTaskReward("");
        setIsAddingTask(false);
        setEditingTaskId(null);
      } catch (error) {
        console.error("Error updating task:", error);
        Alert.alert("Error", "Failed to update task");
      }
    }
  };

  const handleCancelAdd = () => {
    setNewTaskName("");
    setNewTaskReward("");
    setIsAddingTask(false);
    setEditingTaskId(null);
  };

  const handleEditModeToggle = () => {
    // If trying to switch to edit mode and account is managed, show PIN modal
    if (!isEditMode && accountType === "managed") {
      setShowPinModal(true);
      setPinInput("");
      setPinError("");
    } else {
      // Independent account or switching back to normal mode
      setIsEditMode(!isEditMode);
      setIsAddingTask(false);
      setEditingTaskId(null);
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === managerialPin) {
      setIsEditMode(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Please try again.");
    }
  };

  const handlePinCancel = () => {
    setShowPinModal(false);
    setPinInput("");
    setPinError("");
  };

  const handleShowInfo = (task: Task) => {
    setSelectedTask(task);
    setShowInfoModal(true);
  };

  const handleCloseInfo = () => {
    setShowInfoModal(false);
    setSelectedTask(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      testID="task-modal"
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-5">
        <View
          className={`w-full max-w-md rounded-3xl p-6 border-2 shadow-2xl ${
            isEditMode
              ? "bg-[#2a2416] border-yellow-500/50"
              : "bg-[#1a1f3a] border-purple-500/30"
          }`}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-orbitron-bold text-white text-2xl">
              Task List
            </Text>
            <TouchableOpacity
              testID="close-task-modal"
              onPress={onClose}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Mode Toggle */}
          <View
            className={`flex-row mb-6 rounded-2xl p-1 border-2 ${
              isEditMode
                ? "bg-yellow-900/40 border-yellow-400/30"
                : "bg-indigo-900/40 border-indigo-400/30"
            }`}
          >
            <TouchableOpacity
              onPress={() => {
                setIsEditMode(false);
                setIsAddingTask(false);
                setEditingTaskId(null);
              }}
              className={`flex-1 py-3 rounded-xl items-center ${
                !isEditMode ? "bg-purple-500" : "bg-transparent"
              }`}
            >
              <Text className="font-orbitron-bold text-white text-sm">
                Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEditModeToggle}
              className={`flex-1 py-3 rounded-xl items-center ${
                isEditMode ? "bg-yellow-600" : "bg-transparent"
              }`}
            >
              <Text className="font-orbitron-bold text-white text-sm">
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-500/20 border-2 border-red-400/30 p-4 rounded-2xl mb-4">
              <Text className="font-madimi text-white text-base">{error}</Text>
            </View>
          )}

          {/* Loading State */}
          {loading ? (
            <View className="items-center justify-center p-4">
              <Text className="font-madimi text-white text-base">
                Loading tasks...
              </Text>
            </View>
          ) : (
            /* Task List */
            <ScrollView className="max-h-96 mb-4">
              {tasks.length === 0 ? (
                <View className="items-center justify-center p-4">
                  <Text className="font-madimi text-white text-base">
                    No tasks yet. Add your first task!
                  </Text>
                </View>
              ) : (
                tasks.map((task) => (
                  <View
                    key={task.id}
                    className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl border-2 ${
                      task.completed
                        ? "bg-green-500/20 border-green-400/30"
                        : isEditMode
                        ? "bg-yellow-600/20 border-yellow-500/40"
                        : "bg-purple-500/10 border-purple-400/30"
                    }`}
                  >
                    <View className="flex-1">
                      <Text
                        className={`font-madimi text-white text-base ${
                          task.completed ? "line-through opacity-60" : ""
                        }`}
                      >
                        {task.name}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <Image
                          source={require("../../assets/images/sprites/rocks.png")}
                          className="w-7 h-7 mr-1"
                          resizeMode="contain"
                          style={{ transform: [{ scale: 1 }] }}
                        />
                        <Text
                          className={`font-orbitron-bold text-sm ml-1 ${
                            isEditMode ? "text-yellow-300" : "text-purple-300"
                          }`}
                        >
                          {task.reward}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                      {isEditMode ? (
                        <View className="flex-row">
                          <TouchableOpacity
                            onPress={() => handleCompleteTask(task.id)}
                            className={`w-10 h-10 rounded-full items-center justify-center mr-1 ${
                              task.completed
                                ? "bg-green-500"
                                : "bg-green-600/40 border-2 border-green-500/40"
                            }`}
                          >
                            <Ionicons
                              name={
                                task.completed
                                  ? "checkmark"
                                  : "checkmark-outline"
                              }
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleEditTask(task.id)}
                            className="w-10 h-10 rounded-full bg-orange-600/40 border-2 border-orange-500/40 items-center justify-center mr-1"
                          >
                            <Ionicons name="pencil" size={18} color="#fb923c" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleDeleteTask(task.id)}
                            className="w-10 h-10 rounded-full bg-red-600/40 border-2 border-red-500/40 items-center justify-center"
                          >
                            <Ionicons name="trash" size={18} color="#f87171" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="flex-row">
                          <TouchableOpacity
                            onPress={() => handleCompleteTask(task.id)}
                            className={`w-10 h-10 rounded-full items-center justify-center mr-1 ${
                              task.completed
                                ? "bg-green-500"
                                : "bg-green-500/30 border-2 border-green-400/30"
                            }`}
                          >
                            <Ionicons
                              name={
                                task.completed
                                  ? "checkmark"
                                  : "checkmark-outline"
                              }
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              /* Start task functionality to be implemented */
                            }}
                            className="w-10 h-10 rounded-full bg-blue-500/30 border-2 border-blue-400/30 items-center justify-center mr-1"
                          >
                            <Ionicons name="play" size={18} color="white" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleShowInfo(task)}
                            className="w-10 h-10 rounded-full bg-purple-500/30 border-2 border-purple-400/30 items-center justify-center"
                          >
                            <Ionicons
                              name="information-circle"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* Add/Edit Task Form */}
          {isEditMode && isAddingTask && (
            <View className="bg-yellow-900/40 p-4 rounded-2xl mb-4 border-2 border-yellow-400/30">
              <Text className="font-orbitron-bold text-yellow-200 text-lg mb-3">
                {editingTaskId ? "Edit Task" : "New Task"}
              </Text>
              <TextInput
                className="font-madimi w-full h-12 bg-white/10 border border-yellow-400/30 rounded-lg px-4 mb-3 text-base text-white"
                placeholder="Task name"
                placeholderTextColor="#999"
                value={newTaskName}
                onChangeText={setNewTaskName}
              />
              <TextInput
                className="font-madimi w-full h-12 bg-white/10 border border-yellow-400/30 rounded-lg px-4 mb-3 text-base text-white"
                placeholder="Reward (rocks)"
                placeholderTextColor="#999"
                value={newTaskReward}
                onChangeText={setNewTaskReward}
                keyboardType="numeric"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={editingTaskId ? handleSaveEdit : handleAddTask}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 py-3 rounded-xl items-center border-2 border-green-300/30"
                >
                  <Text className="font-orbitron-bold text-white text-base">
                    {editingTaskId ? "Save" : "Add"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelAdd}
                  className="flex-1 bg-gray-500/30 py-3 rounded-xl items-center border-2 border-gray-400/30"
                >
                  <Text className="font-orbitron-bold text-white text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Add Task Button */}
          {isEditMode && !isAddingTask && (
            <TouchableOpacity
              onPress={() => setIsAddingTask(true)}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 py-4 rounded-2xl items-center border-2 border-yellow-400/40 shadow-lg"
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="font-orbitron-bold text-white text-lg ml-2">
                  Add New Task
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* PIN Verification Modal */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handlePinCancel}
      >
        <View className="flex-1 bg-black/70 items-center justify-center p-5">
          <View className="bg-[#2a2416] w-full max-w-sm rounded-3xl p-6 border-2 border-yellow-500/50 shadow-2xl">
            <View className="items-center mb-4">
              <View className="bg-yellow-500/20 rounded-full p-3 mb-3">
                <Ionicons name="shield-checkmark" size={40} color="#fbbf24" />
              </View>
              <Text className="font-orbitron-bold text-yellow-300 text-2xl text-center">
                Manager Access
              </Text>
            </View>
            <Text className="font-madimi text-yellow-100/80 text-sm mb-6 text-center">
              Enter the 4-digit PIN to access edit mode with elevated
              permissions.
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center bg-yellow-900/30 border-2 border-yellow-500/40 rounded-xl px-4 h-14">
                <Ionicons
                  name="key-outline"
                  size={22}
                  color="#fbbf24"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="font-madimi flex-1 text-base text-yellow-100 text-center text-2xl tracking-widest"
                  placeholder="••••"
                  placeholderTextColor="rgba(251, 191, 36, 0.3)"
                  value={pinInput}
                  onChangeText={(t) =>
                    setPinInput(t.replace(/[^0-9]/g, "").slice(0, 4))
                  }
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  autoFocus
                  onSubmitEditing={handlePinSubmit}
                />
              </View>
            </View>

            {pinError && (
              <View className="bg-red-500/20 border-2 border-red-400/30 p-3 rounded-xl mb-4">
                <Text className="font-madimi text-red-200 text-sm text-center">
                  {pinError}
                </Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handlePinCancel}
                className="flex-1 bg-gray-500/30 py-3 rounded-xl items-center border-2 border-gray-400/30"
              >
                <Text className="font-orbitron-bold text-white text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePinSubmit}
                disabled={pinInput.length !== 4}
                className={`flex-1 py-3 rounded-xl items-center border-2 ${
                  pinInput.length === 4
                    ? "bg-gradient-to-r from-yellow-600 to-amber-600 border-yellow-400/50"
                    : "bg-gray-500/20 border-gray-400/20"
                }`}
              >
                <Text className="font-orbitron-bold text-white text-base">
                  Unlock
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Task Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseInfo}
      >
        <View className="flex-1 bg-black/70 items-center justify-center p-5">
          <View className="bg-[#1a1f3a] w-full max-w-sm rounded-3xl p-6 border-2 border-purple-500/30 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-orbitron-bold text-white text-2xl">
                Task Info
              </Text>
              <TouchableOpacity
                onPress={handleCloseInfo}
                className="w-10 h-10 items-center justify-center"
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {selectedTask && (
              <View>
                <View className="bg-purple-500/10 border-2 border-purple-400/30 rounded-2xl p-4 mb-4">
                  <Text className="font-madimi text-purple-300 text-sm mb-1">
                    Task Name
                  </Text>
                  <Text className="font-orbitron-bold text-white text-lg mb-4">
                    {selectedTask.name}
                  </Text>

                  <Text className="font-madimi text-purple-300 text-sm mb-1">
                    Reward
                  </Text>
                  <View className="flex-row items-center mb-4">
                    <Image
                      source={require("../../assets/images/sprites/rocks.png")}
                      className="w-8 h-8 mr-2"
                      resizeMode="contain"
                      style={{ transform: [{ scale: 1 }] }}
                    />
                    <Text className="font-orbitron-bold text-white text-xl">
                      {selectedTask.reward}
                    </Text>
                  </View>

                  <Text className="font-madimi text-purple-300 text-sm mb-1">
                    Status
                  </Text>
                  <View className="flex-row items-center mb-4">
                    <View
                      className={`px-3 py-1 rounded-full ${
                        selectedTask.completed
                          ? "bg-green-500/30 border border-green-400/50"
                          : "bg-gray-500/30 border border-gray-400/50"
                      }`}
                    >
                      <Text
                        className={`font-orbitron-bold text-sm ${
                          selectedTask.completed
                            ? "text-green-300"
                            : "text-gray-300"
                        }`}
                      >
                        {selectedTask.completed ? "Complete" : "Incomplete"}
                      </Text>
                    </View>
                  </View>

                  <Text className="font-madimi text-purple-300 text-sm mb-1">
                    Created
                  </Text>
                  <Text className="font-madimi text-white text-base mb-4">
                    {new Date(selectedTask.createdAt.seconds * 1000).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleCloseInfo}
                  className="bg-purple-500 py-3 rounded-xl items-center border-2 border-purple-400/30"
                >
                  <Text className="font-orbitron-bold text-white text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
