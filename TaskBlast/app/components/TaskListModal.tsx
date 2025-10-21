import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Task {
  id: string;
  name: string;
  reward: number;
  completed: boolean;
}

interface TaskListModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TaskListModal({
  visible,
  onClose,
}: TaskListModalProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Clean your room", reward: 50, completed: false },
    { id: "2", name: "Do homework", reward: 75, completed: false },
    { id: "3", name: "Help with dishes", reward: 30, completed: false },
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskReward, setNewTaskReward] = useState("");

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = () => {
    if (newTaskName.trim() && newTaskReward.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName,
        reward: parseInt(newTaskReward) || 0,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskName("");
      setNewTaskReward("");
      setIsAddingTask(false);
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

  const handleSaveEdit = () => {
    if (editingTaskId && newTaskName.trim() && newTaskReward.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: newTaskName,
                reward: parseInt(newTaskReward) || 0,
              }
            : task
        )
      );
      setNewTaskName("");
      setNewTaskReward("");
      setIsAddingTask(false);
      setEditingTaskId(null);
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
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-5">
        <View className="bg-[#1a1f3a] w-full max-w-md rounded-3xl p-6 border-2 border-purple-500/30 shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-orbitron-bold text-white text-2xl">
              Task List
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Task List */}
          <ScrollView className="max-h-96 mb-4">
            {tasks.map((task) => (
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
                    <Ionicons name="diamond" size={16} color="#a78bfa" />
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
                      name={task.completed ? "checkmark" : "checkmark-outline"}
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
            ))}
          </ScrollView>

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
