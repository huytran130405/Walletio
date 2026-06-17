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
import { loginLocal } from "../../store/slices/authSlice";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("minhnhat@walletio.app");
  const [password, setPassword] = useState("123456");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Mật khẩu ngắn", "Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    dispatch(loginLocal({ email: email.trim() }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Ionicons name="wallet-outline" size={34} color={colors.primary} />
          </View>
          <Text style={styles.title}>Walletio</Text>
          <Text style={styles.subtitle}>Quản lý ví, giao dịch và ngân sách cá nhân</Text>
        </View>

        <View style={styles.form}>
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

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.textAction}>
            <Text style={styles.textActionLabel}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <LinearGradient colors={gradients.forest} style={styles.primaryGradient}>
              <Text style={styles.primaryText}>Đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.md, justifyContent: "center" },
  brandBlock: { alignItems: "center", marginBottom: spacing.xl },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  title: { fontSize: typography.fontSize.huge, fontFamily: typography.family.bold, color: colors.textPrimary },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    lineHeight: 21,
    fontFamily: typography.family.medium,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.base,
    paddingLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.family.medium,
  },
  textAction: { alignSelf: "flex-end", paddingVertical: spacing.base },
  textActionLabel: { color: colors.primary, fontFamily: typography.family.semiBold, fontSize: typography.fontSize.sm },
  primaryBtn: { borderRadius: borderRadius.full, overflow: "hidden", marginTop: spacing.xs },
  primaryGradient: { paddingVertical: spacing.base, alignItems: "center" },
  primaryText: { color: colors.textInverse, fontSize: typography.fontSize.base, fontFamily: typography.family.bold },
  footer: { flexDirection: "row", justifyContent: "center", gap: spacing.xs, marginTop: spacing.lg },
  footerText: { color: colors.textSecondary, fontFamily: typography.family.medium },
  footerLink: { color: colors.primary, fontFamily: typography.family.bold },
});
