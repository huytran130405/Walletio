import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProfileLocal } from "../../store/slices/authSlice";
import { colors, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const LANGUAGES = [
  { key: "vi", label: "Tiếng Việt" },
  { key: "en", label: "English" },
];

export default function EditProfile({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [language, setLanguage] = useState(user?.language || "vi");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Thiếu tên", "Vui lòng nhập tên hiển thị.");
      return;
    }
    dispatch(updateProfileLocal({ name: name.trim(), avatar: avatar.trim() || null, language }));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity style={styles.saveMiniBtn} onPress={handleSave}>
          <Ionicons name="checkmark" size={22} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.avatarPreview}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={34} color={colors.primary} />
          </View>
          <Text style={styles.avatarHint}>Ảnh đại diện sẽ dùng URL khi nối backend</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Tên của bạn"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Avatar URL</Text>
          <TextInput
            style={styles.input}
            value={avatar}
            onChangeText={setAvatar}
            placeholder="https://..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Ngôn ngữ</Text>
          <View style={styles.segmentRow}>
            {LANGUAGES.map((item) => {
              const active = language === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => setLanguage(item.key)}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  saveMiniBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", ...shadows.soft },
  title: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  avatarPreview: { alignItems: "center", marginBottom: spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 28, backgroundColor: colors.surfaceAlt, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  avatarHint: { marginTop: spacing.sm, color: colors.textSecondary, fontSize: typography.fontSize.sm, fontFamily: typography.family.medium },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  label: { fontSize: typography.fontSize.sm, color: colors.textSecondary, fontFamily: typography.family.semiBold, marginTop: spacing.base, marginBottom: spacing.xs },
  input: { backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.base, fontSize: typography.fontSize.md, color: colors.textPrimary, fontFamily: typography.family.medium },
  disabledInput: { color: colors.textMuted },
  segmentRow: { flexDirection: "row", gap: spacing.sm },
  segmentBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, alignItems: "center", backgroundColor: colors.surfaceAlt },
  segmentBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontFamily: typography.family.semiBold },
  segmentTextActive: { color: colors.textInverse },
});
