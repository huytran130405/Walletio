import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

const CATEGORY_LIST = [
  { name: "Ăn uống", emoji: "🍜", bg: "#F7E4BC" },
  { name: "Di chuyển", emoji: "🚗", bg: "#DDEFF5" },
  { name: "Mua sắm", emoji: "🛍️", bg: "#F4E8D8" },
  { name: "Giải trí", emoji: "🎮", bg: "#FBE7E0" },
  { name: "Sức khoẻ", emoji: "💊", bg: "#DFF4E8" },
  { name: "Giáo dục", emoji: "📚", bg: "#E1F2F1" },
  { name: "Nhà cửa", emoji: "🏠", bg: "#E8F4DC" },
  { name: "Lương", emoji: "💼", bg: "#DFF4E8" },
  { name: "Cà phê", emoji: "☕", bg: "#F1DDC7" },
  { name: "Thưởng", emoji: "🎁", bg: "#E8F4DC" },
  { name: "Khác", emoji: "📦", bg: "#EEF5EA" },
];

/**
 * CategoryPicker – grid chọn hạng mục
 * Props:
 *   selected  : string (tên category đang chọn)
 *   onSelect  : (name) => void
 */
export default function CategoryPicker({ selected, onSelect }) {
  return (
    <View style={styles.grid}>
      {CATEGORY_LIST.map((cat) => {
        const isSelected = selected === cat.name;
        return (
          <TouchableOpacity
            key={cat.name}
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => onSelect(cat.name)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: cat.bg }]}>
              <Text style={styles.emoji}>{cat.emoji}</Text>
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
              {cat.name}
            </Text>
            {isSelected && <View style={styles.checkDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export { CATEGORY_LIST };

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", paddingVertical: spacing.sm },
  item: { width: "33.33%", alignItems: "center", paddingVertical: spacing.base, borderRadius: borderRadius.lg },
  itemSelected: { backgroundColor: colors.surfaceAlt },
  iconWrap: { width: 52, height: 52, borderRadius: borderRadius.lg, justifyContent: "center", alignItems: "center", marginBottom: spacing.xs },
  emoji:         { fontSize: 24 },
  label: { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontFamily: typography.family.medium, textAlign: "center" },
  labelSelected: { color: colors.primary, fontFamily: typography.family.semiBold },
  checkDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
});
