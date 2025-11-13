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
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!auth.currentUser) {
      setError("Please log in to view tasks");
      setLoading(false);
      return;
    }

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

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskReward, setNewTaskReward] = useState("");

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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      testID="task-modal"
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-5">
        <View className="bg-[#1a1f3a] w-full max-w-md rounded-3xl p-6 border-2 border-purple-500/30 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
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
                        <Text className="font-orbitron-bold text-purple-300 text-sm ml-1">
                          {task.reward}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleCompleteTask(task.id)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          task.completed
                            ? "bg-green-500"
                            : "bg-gray-500/30 border-2 border-gray-400/30"
                        }`}
                      >
                        <Ionicons
                          name={
                            task.completed ? "checkmark" : "checkmark-outline"
                          }
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleEditTask(task.id)}
                        className="w-10 h-10 rounded-full bg-blue-500/30 border-2 border-blue-400/30 items-center justify-center"
                      >
                        <Ionicons name="pencil" size={18} color="white" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteTask(task.id)}
                        className="w-10 h-10 rounded-full bg-red-500/30 border-2 border-red-400/30 items-center justify-center"
                      >
                        <Ionicons name="trash" size={18} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {/* Add/Edit Task Form */}
          {isAddingTask && (
            <View className="bg-indigo-900/40 p-4 rounded-2xl mb-4 border-2 border-indigo-400/30">
              <Text className="font-orbitron-bold text-white text-lg mb-3">
                {editingTaskId ? "Edit Task" : "New Task"}
              </Text>
              <TextInput
                className="font-madimi w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 mb-3 text-base text-white"
                placeholder="Task name"
                placeholderTextColor="#999"
                value={newTaskName}
                onChangeText={setNewTaskName}
              />
              <TextInput
                className="font-madimi w-full h-12 bg-white/10 border border-white/20 rounded-lg px-4 mb-3 text-base text-white"
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
          {!isAddingTask && (
            <TouchableOpacity
              onPress={() => setIsAddingTask(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl items-center border-2 border-cyan-300/30 shadow-lg"
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
    </Modal>
  );
}
