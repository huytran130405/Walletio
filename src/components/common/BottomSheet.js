import React, { useCallback, useRef, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  Animated, Dimensions, TouchableWithoutFeedback, ScrollView,
} from "react-native";
import { colors }     from "../../theme/colors";
import { typography } from "../../theme/typography";
import { spacing }    from "../../theme/spacing";

const { height: SCREEN_H } = Dimensions.get("window");

/**
 * BottomSheet – reusable animated bottom sheet
 * Props:
 *   visible   : bool
 *   onClose   : () => void
 *   title     : string
 *   snapHeight: number (default 0.5 * screen height)
 *   children  : ReactNode
 */
export default function BottomSheet({ visible, onClose, title, snapHeight, children }) {
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const sheetH = snapHeight ?? SCREEN_H * 0.5;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true, bounciness: 4,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_H, duration: 250, useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, { height: sheetH, transform: [{ translateY }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        {!!title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet:    { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
  handle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginTop: spacing.sm, marginBottom: spacing.sm },
  header:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  title:    { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  closeIcon:{ fontSize: 13, color: colors.textPrimary, fontWeight: "600" },
});
