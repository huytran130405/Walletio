import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { colors, gradients, shadows } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const MENU_ITEMS = [
  { emoji:"👤", label:"Thông tin tài khoản" },
  { emoji:"👛", label:"Cài đặt ví"          },
  { emoji:"💱", label:"Tiền tệ",  value:"VNĐ" },
  { emoji:"🔔", label:"Thông báo"            },
  { emoji:"🌐", label:"Ngôn ngữ", value:"Tiếng Việt" },
  { emoji:"❓", label:"Trợ giúp & hỗ trợ"  },
];

export default function AccountSettings() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((s) => s.auth);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: () => dispatch(logoutUser()) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(420)} style={styles.header}>
          <Text style={styles.title}>Cá nhân</Text>
          <TouchableOpacity style={styles.settingsBtn}><Text>⚙️</Text></TouchableOpacity>
        </Animated.View>

        {/* Profile card */}
        <Animated.View entering={FadeInUp.duration(520).springify()} style={styles.profileCard}>
          <LinearGradient colors={gradients.sky} style={styles.profileGradient}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || "Người dùng"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "nguyidung@thinhvuong.com"}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Nhật ký</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Tài ví</Text>
            </View>
          </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <View key={i}>
              <TouchableOpacity style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                  <Text style={styles.menuArrow}>›</Text>
                </View>
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, status==="pending" && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={status === "pending"}
        >
          <Text style={styles.logoutText}>
            {status === "pending" ? "Đang xử lý..." : "🚪 Đăng xuất"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>Phiên bản 1.0.0</Text>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: typography.fontSize.xl, fontFamily: typography.family.bold, color: colors.textPrimary },
  settingsBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", ...shadows.soft },
  profileCard: { marginHorizontal: spacing.md, borderRadius: borderRadius.xxl, overflow: "hidden", marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  profileGradient: { padding: spacing.lg, alignItems: "center" },
  avatarWrap:   { marginBottom:spacing.base },
  avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: colors.primaryLight },
  avatarText:   { fontSize:32 },
  profileName: { fontSize: typography.fontSize.lg, fontFamily: typography.family.bold, color: colors.textPrimary },
  profileEmail: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.base, fontFamily: typography.family.medium },
  statsRow:     { flexDirection:"row", width:"100%", justifyContent:"center" },
  statItem:     { alignItems:"center", paddingHorizontal:24 },
  statValue: { fontSize: typography.fontSize.xl, fontFamily: typography.family.bold, color: colors.textPrimary },
  statLabel:    { fontSize:typography.fontSize.xs, color:colors.textSecondary, marginTop:2 },
  statDivider:  { width:1, backgroundColor:colors.border },
  menuCard: { marginHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingHorizontal: spacing.base, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  menuRow:      { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:spacing.base },
  menuLeft:     { flexDirection:"row", alignItems:"center" },
  menuEmoji:    { fontSize:18, marginRight:spacing.base },
  menuLabel: { fontSize: typography.fontSize.md, color: colors.textPrimary, fontFamily: typography.family.medium },
  menuRight:    { flexDirection:"row", alignItems:"center", gap:spacing.sm },
  menuValue:    { fontSize:typography.fontSize.sm, color:colors.textSecondary },
  menuArrow:    { fontSize:20, color:colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.divider },
  logoutBtn: { marginHorizontal: spacing.md, marginBottom: spacing.lg, backgroundColor: "#FBEDE8", borderRadius: borderRadius.full, paddingVertical: spacing.base, paddingHorizontal: spacing.md, alignItems: "center", borderWidth: 1, borderColor: "rgba(216,92,74,0.18)" },
  logoutText: { color: colors.error, fontSize: typography.fontSize.base, fontFamily: typography.family.semiBold },
  version:      { textAlign:"center", color:colors.textSecondary, fontSize:typography.fontSize.xs, marginTop:spacing.base },
});
