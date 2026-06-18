import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateProfile } from "../../store/slices/authSlice";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const FIELDS = [
  { key: "name",    icon: "person-outline",      label: "Họ và tên",      placeholder: "Nhập họ và tên" },
  { key: "email",   icon: "mail-outline",         label: "Email",           placeholder: "Nhập email", keyboardType: "email-address" },
  { key: "phone",   icon: "call-outline",         label: "Số điện thoại",  placeholder: "Nhập số điện thoại", keyboardType: "phone-pad" },
  { key: "dob",     icon: "calendar-outline",     label: "Ngày sinh",      placeholder: "DD/MM/YYYY" },
  { key: "gender",  icon: "transgender-outline",  label: "Giới tính",      placeholder: "Nam / Nữ / Khác" },
  { key: "address", icon: "location-outline",     label: "Địa chỉ",        placeholder: "Nhập địa chỉ" },
];

/* ─── Main Screen ───────────────────────────────────────────── */
export default function AccountSettings() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((s) => s.auth);
  const wallets      = useSelector((s) => s.wallets?.wallets ?? []);
  const transactions = useSelector((s) => s.transactions?.transactions ?? []);

  const [editing, setEditing]   = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.avatar || null);
  const [form, setForm] = useState({
    name:    user?.name    || "",
    email:   user?.email   || "",
    phone:   user?.phone   || "",
    dob:     user?.dob     || "",
    gender:  user?.gender  || "",
    address: user?.address || "",
  });

  useEffect(() => {
    setAvatarUri(user?.avatar || null);
    setForm({
      name:    user?.name    || "",
      email:   user?.email   || "",
      phone:   user?.phone   || "",
      dob:     user?.dob     || "",
      gender:  user?.gender  || "",
      address: user?.address || "",
    });
  }, [user]);

  /* ── Handlers ── */
  const handlePickAvatar = async () => {
    const { status: perm } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm !== "granted") {
      Alert.alert("Quyền bị từ chối", "Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Lỗi", "Họ và tên không được để trống.");
      return;
    }
    try {
      await dispatch(
        updateProfile({
          name: form.name.trim(),
          avatar_url: avatarUri,
        }),
      ).unwrap();
      setEditing(false);
      Alert.alert("Thành công", "Thông tin tài khoản đã được cập nhật.");
    } catch (error) {
      Alert.alert("Không lưu được hồ sơ", error || "Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setForm({
      name:    user?.name    || "",
      email:   user?.email   || "",
      phone:   user?.phone   || "",
      dob:     user?.dob     || "",
      gender:  user?.gender  || "",
      address: user?.address || "",
    });
    setAvatarUri(user?.avatar || null);
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: () => dispatch(logoutUser()) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Header ── */}
          <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
            <Text style={styles.title}>Cá nhân</Text>
          </Animated.View>

          {/* ── Profile card with avatar ── */}
          <Animated.View entering={FadeInUp.duration(520).springify()} style={styles.profileCard}>
            <LinearGradient colors={gradients.sky} style={styles.profileGradient}>

              {/* Avatar */}
              <TouchableOpacity
                style={styles.avatarWrap}
                onPress={handlePickAvatar}
                activeOpacity={0.8}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={13} color="#fff" />
                </View>
              </TouchableOpacity>

              <Text style={styles.profileName}>{form.name || "Người dùng"}</Text>
              <Text style={styles.profileEmail}>{form.email || "nguyidung@thinhvuong.com"}</Text>

              {/* Change photo shortcut (edit mode only) */}
              {editing && (
                <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickAvatar}>
                  <Ionicons name="image-outline" size={14} color={colors.primary} />
                  <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
                </TouchableOpacity>
              )}

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{transactions.length}</Text>
                  <Text style={styles.statLabel}>Giao dịch</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{wallets.length}</Text>
                  <Text style={styles.statLabel}>Tài ví</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Account Info Section header ── */}
          <Animated.View entering={FadeInUp.delay(60).duration(480)} style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            {editing ? (
              <TouchableOpacity style={styles.editBtn} onPress={handleSave}>
                <Text style={styles.editBtnText}>Lưu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={styles.editBtnText}>Sửa</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* ── Info fields ── */}
          <Animated.View entering={FadeInUp.delay(120).duration(480)} style={styles.infoCard}>
            {FIELDS.map((field, i) => (
              <View key={field.key}>
                <View style={styles.fieldRow}>
                  <View style={styles.fieldIcon}>
                    <Ionicons name={field.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    {editing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={form[field.key]}
                        onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.textMuted}
                        keyboardType={field.keyboardType || "default"}
                        autoCapitalize="none"
                      />
                    ) : (
                      <Text style={[styles.fieldValue, !form[field.key] && styles.fieldEmpty]}>
                        {form[field.key] || "Chưa cập nhật"}
                      </Text>
                    )}
                  </View>
                  {editing && (
                    <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                  )}
                </View>
                {i < FIELDS.length - 1 && (
                  <View style={[styles.divider, { marginLeft: 34 + spacing.sm }]} />
                )}
              </View>
            ))}
          </Animated.View>

          {/* ── Cancel button (only in edit mode) ── */}
          {editing && (
            <Animated.View entering={FadeInUp.duration(300)} style={{ marginHorizontal: spacing.md, marginBottom: spacing.base }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Huỷ thay đổi</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ── Đăng xuất ── */}
          <TouchableOpacity
            style={[styles.logoutBtn, status === "pending" && { opacity: 0.6 }]}
            onPress={handleLogout}
            disabled={status === "pending"}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>
              {status === "pending" ? "Đang xử lý..." : "Đăng xuất"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.version}>Phiên bản 1.0.0</Text>
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
  },

  // Profile card
  profileCard: {
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xxl,
    overflow: "hidden",
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  profileGradient: { padding: spacing.lg, alignItems: "center" },

  // Avatar
  avatarWrap: {
    position: "relative",
    marginBottom: spacing.base,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primaryLight,
    ...shadows.soft,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  avatarText: { fontSize: 36 },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changePhotoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.medium,
    color: colors.primary,
  },

  profileName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontFamily: typography.family.medium,
    marginBottom: spacing.base,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  statItem: { alignItems: "center", paddingHorizontal: spacing.xl },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontFamily: typography.family.medium,
    marginTop: 2,
  },
  statDivider: { width: 1, backgroundColor: colors.border },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.family.semiBold,
    color: colors.primary,
  },

  // Info card
  infoCard: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.base,
    ...shadows.soft,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.base,
    gap: spacing.sm,
  },
  fieldIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  fieldContent: { flex: 1 },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontFamily: typography.family.medium,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    fontFamily: typography.family.semiBold,
  },
  fieldEmpty: {
    color: colors.textMuted,
    fontFamily: typography.family.regular,
    fontStyle: "italic",
  },
  fieldInput: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    fontFamily: typography.family.semiBold,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },

  // Cancel
  cancelBtn: {
    paddingVertical: spacing.base,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.family.medium,
    color: colors.textSecondary,
  },

  // Logout
  logoutBtn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.base,
    backgroundColor: "#FBEDE8",
    borderRadius: borderRadius.full,
    paddingVertical: spacing.base,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(216,92,74,0.18)",
  },
  logoutText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    fontFamily: typography.family.semiBold,
  },

  version: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.family.regular,
  },
});
