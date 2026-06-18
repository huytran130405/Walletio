import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing } from "../../theme/spacing";

/**
 * CategoryPicker – grid chọn hạng mục từ Redux local state.
 * Props:
 *   selected : string
 *   onSelect : (category) => void
 *   type     : "income" | "expense" | undefined
 */
export default function CategoryPicker({ selected, onSelect, type }) {
  const categories = useSelector((state) => state.categories.categories);
  const visibleCategories = type
    ? categories.filter((category) => category.type === type || category.type === "both")
    : categories;

  return (
    <View style={styles.grid}>
      {visibleCategories.map((cat) => {
        const isSelected = selected === cat.name || selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${cat.color}22` }]}>
              <Ionicons name={cat.icon || "apps-outline"} size={24} color={cat.color || colors.primary} />
            </View>
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={1}
            >
              {cat.name}
            </Text>
            {isSelected && <View style={styles.checkDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", paddingVertical: spacing.sm },
  item: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: spacing.base,
    borderRadius: borderRadius.lg,
  },
  itemSelected: { backgroundColor: colors.surfaceAlt },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontFamily: typography.family.medium,
    textAlign: "center",
  },
  labelSelected: {
    color: colors.primary,
    fontFamily: typography.family.semiBold,
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
