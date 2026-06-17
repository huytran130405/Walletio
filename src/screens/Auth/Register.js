import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { registerLocal } from "../../store/slices/authSlice";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";
import GoogleAuthButton from "./components/GoogleAuthButton";

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ tên, email và mật khẩu.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Mật khẩu ngắn", "Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    dispatch(registerLocal({ name: name.trim(), email: email.trim() }));
  };

  const handleGoogleRegister = () => {
    dispatch(registerLocal({ name: "Google User", email: "google.user@walletio.app" }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.heading}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Bắt đầu với dữ liệu mẫu trong app, backend sẽ nối sau.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tên của bạn"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
            <LinearGradient colors={gradients.forest} style={styles.primaryGradient}>
              <Text style={styles.primaryText}>Tạo tài khoản</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleAuthButton label="Tạo tài khoản bằng Google" onPress={handleGoogleRegister} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.md, justifyContent: "center" },
  backBtn: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.md,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  heading: { marginBottom: spacing.lg },
  title: { fontSize: typography.fontSize.xxl, fontFamily: typography.family.bold, color: colors.textPrimary },
  subtitle: { color: colors.textSecondary, fontSize: typography.fontSize.md, marginTop: spacing.xs, fontFamily: typography.family.medium },
  form: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  label: { fontSize: typography.fontSize.sm, fontFamily: typography.family.semiBold, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.lg, paddingHorizontal: spacing.base, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, paddingVertical: spacing.base, paddingLeft: spacing.sm, color: colors.textPrimary, fontSize: typography.fontSize.md, fontFamily: typography.family.medium },
  primaryBtn: { borderRadius: borderRadius.full, overflow: "hidden", marginTop: spacing.lg },
  primaryGradient: { paddingVertical: spacing.base, alignItems: "center" },
  primaryText: { color: colors.textInverse, fontSize: typography.fontSize.base, fontFamily: typography.family.bold },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginVertical: spacing.base },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { color: colors.textMuted, fontFamily: typography.family.semiBold, fontSize: typography.fontSize.sm },
});
