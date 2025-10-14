import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { colors, shadows, borderRadius, spacing } from "../styles/global";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login attempted with:", username, password);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
  };

  const handleSignUp = () => {
    // Handle sign up navigation here
    console.log("Sign up clicked");
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>TaskBlast</Text>
      </View>

      {/* Login Container */}
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Links */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.linkText}>
            Don't have an account?{" "}
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkText}>Forgot Your Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: "center",
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: 2,
  },
  loginContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: colors.text.primary,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    ...shadows.button,
  },
  loginButtonText: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "600",
  },
  bottomContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginVertical: 8,
  },
  linkTextBold: {
    fontWeight: "600",
    color: colors.primary,
  },
});
