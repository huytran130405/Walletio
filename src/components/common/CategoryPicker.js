import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const CATEGORY_LIST = [
  { name: "Ăn uống",   emoji: "🍜", bg: "#FEF3C7" },
  { name: "Di chuyển", emoji: "🚗", bg: "#E0E7FF" },
  { name: "Mua sắm",   emoji: "🛍️", bg: "#F3E8FF" },
  { name: "Giải trí",  emoji: "🎮", bg: "#FCE7F3" },
  { name: "Sức khoẻ",  emoji: "💊", bg: "#DCFCE7" },
  { name: "Giáo dục",  emoji: "📚", bg: "#E0F2FE" },
  { name: "Nhà cửa",   emoji: "🏠", bg: "#DBEAFE" },
  { name: "Lương",     emoji: "💼", bg: "#DCFCE7" },
  { name: "Cà phê",    emoji: "☕", bg: "#FEF3C7" },
  { name: "Thưởng",    emoji: "🎁", bg: "#DCFCE7" },
  { name: "Khác",      emoji: "📦", bg: "#F1F5F9" },
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
  grid:          { flexDirection: "row", flexWrap: "wrap", paddingVertical: spacing.sm },
  item:          { width: "33.33%", alignItems: "center", paddingVertical: spacing.md, borderRadius: 12 },
  itemSelected:  { backgroundColor: "#EEF9F3" },
  iconWrap:      { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  emoji:         { fontSize: 24 },
  label:         { fontSize: typography.fontSize.xs, color: colors.textSecondary, fontWeight: typography.fontWeight.medium, textAlign: "center" },
  labelSelected: { color: colors.primary, fontWeight: typography.fontWeight.semiBold },
  checkDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
});
