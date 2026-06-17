import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Thiếu email", "Vui lòng nhập email để mô phỏng gửi hướng dẫn.");
      return;
    }
    Alert.alert("Đã ghi nhận", "Luồng khôi phục mật khẩu sẽ được nối backend sau.");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Khôi phục mật khẩu</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name="key-outline" size={30} color={colors.primary} />
        </View>
        <Text style={styles.cardTitle}>Nhập email tài khoản</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.actionBtn} onPress={handleSubmit}>
          <Text style={styles.actionText}>Gửi hướng dẫn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  backBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  title: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  card: { margin: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  iconWrap: { width: 62, height: 62, borderRadius: 22, backgroundColor: colors.surfaceAlt, justifyContent: "center", alignItems: "center", marginBottom: spacing.base },
  cardTitle: { fontSize: typography.fontSize.xl, fontFamily: typography.family.bold, color: colors.textPrimary, marginBottom: spacing.base },
  input: { backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.base, color: colors.textPrimary, fontSize: typography.fontSize.md, fontFamily: typography.family.medium },
  actionBtn: { marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: spacing.base, alignItems: "center" },
  actionText: { color: colors.textInverse, fontSize: typography.fontSize.base, fontFamily: typography.family.bold },
});
