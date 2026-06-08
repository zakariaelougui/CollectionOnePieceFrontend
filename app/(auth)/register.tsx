import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authApi } from "../../src/api/auth.api";
import { useAuthStore } from "../../src/store/auth.store";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      setError("Password must be 8–16 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await authApi.register(
        username.trim(),
        email.trim(),
        password,
      );
      await login(
        { email: data.user.email, username: data.user.username },
        data.accessToken,
        data.refreshToken,
      );
      router.replace("/(tabs)/cards");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        "Registration failed";
      console.log(e);
      console.log(msg);
      setError(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the One Piece TCG community</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (8–16 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleRegister}
          returnKeyType="go"
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.link}>Sign In</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f9fafb" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { backgroundColor: "#93c5fd" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { fontSize: 14, color: "#6b7280" },
  link: { color: "#3b82f6", fontWeight: "600" },
});
