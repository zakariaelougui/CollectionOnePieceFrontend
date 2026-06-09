import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { router } from "expo-router";
import { authApi } from "../../src/api/auth.api";
import { useAuthStore } from "../../src/store/auth.store";
import { useAppTheme } from "../../src/theme/useAppTheme";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((s) => s.login);
  const { colors } = useAppTheme();

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
      setError(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join the One Piece TCG community
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Username"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Password (8–16 characters)"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleRegister}
          returnKeyType="go"
        />

        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={handleRegister}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Create Account
        </Button>

        <Pressable onPress={() => router.back()} style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
            <Text style={[styles.link, { color: colors.accent }]}>Sign In</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
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
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    marginTop: 4,
    borderRadius: 10,
  },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontWeight: "700", fontSize: 16 },
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { fontSize: 14 },
  link: { fontWeight: "600" },
});
