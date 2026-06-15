import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing } from "../../theme/spacing";

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
        <View style={styles.header}>
          <Text style={styles.title}>Cá nhân</Text>
          <TouchableOpacity style={styles.settingsBtn}><Text>⚙️</Text></TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
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
        </View>

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
  safe:         { flex:1, backgroundColor:"#F4F6F9" },
  header:       { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:spacing.base, paddingTop:spacing.lg, paddingBottom:spacing.sm },
  title:        { fontSize:typography.fontSize.xl, fontWeight:typography.fontWeight.bold, color:colors.textPrimary },
  settingsBtn:  { width:36, height:36, borderRadius:18, backgroundColor:"#F0F0F0", justifyContent:"center", alignItems:"center" },
  profileCard:  { marginHorizontal:spacing.base, backgroundColor:"#fff", borderRadius:20, padding:spacing.xl, alignItems:"center", marginBottom:spacing.md },
  avatarWrap:   { marginBottom:spacing.md },
  avatar:       { width:72, height:72, borderRadius:36, backgroundColor:"#E8F5F0", justifyContent:"center", alignItems:"center", borderWidth:3, borderColor:colors.primary },
  avatarText:   { fontSize:32 },
  profileName:  { fontSize:typography.fontSize.lg, fontWeight:typography.fontWeight.bold, color:colors.textPrimary },
  profileEmail: { fontSize:typography.fontSize.sm, color:colors.textSecondary, marginTop:4, marginBottom:spacing.md },
  statsRow:     { flexDirection:"row", width:"100%", justifyContent:"center" },
  statItem:     { alignItems:"center", paddingHorizontal:spacing.xl },
  statValue:    { fontSize:typography.fontSize.xl, fontWeight:typography.fontWeight.bold, color:colors.textPrimary },
  statLabel:    { fontSize:typography.fontSize.xs, color:colors.textSecondary, marginTop:2 },
  statDivider:  { width:1, backgroundColor:colors.border },
  menuCard:     { marginHorizontal:spacing.base, backgroundColor:"#fff", borderRadius:16, paddingHorizontal:spacing.md, marginBottom:spacing.md },
  menuRow:      { flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingVertical:spacing.md },
  menuLeft:     { flexDirection:"row", alignItems:"center" },
  menuEmoji:    { fontSize:18, marginRight:spacing.md },
  menuLabel:    { fontSize:typography.fontSize.md, color:colors.textPrimary },
  menuRight:    { flexDirection:"row", alignItems:"center", gap:spacing.sm },
  menuValue:    { fontSize:typography.fontSize.sm, color:colors.textSecondary },
  menuArrow:    { fontSize:20, color:colors.textSecondary },
  divider:      { height:1, backgroundColor:"#F3F4F6" },
  logoutBtn:    { marginHorizontal:spacing.base, backgroundColor:"#FEE2E2", borderRadius:14, padding:spacing.lg, alignItems:"center" },
  logoutText:   { color:"#DC2626", fontSize:typography.fontSize.base, fontWeight:typography.fontWeight.semiBold },
  version:      { textAlign:"center", color:colors.textSecondary, fontSize:typography.fontSize.xs, marginTop:spacing.md },
});
