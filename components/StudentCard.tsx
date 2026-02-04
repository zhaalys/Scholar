import { ThemedText } from "@/components/themed-text";
import { Student } from "@/constants/studentStorage";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// [TypeScript] Interface mendefinisikan tipe data untuk props (parameter) komponen ini
interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Initials generator
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.contentContainer}>
        {/* Avatar Circle */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.avatarText}>
            {getInitials(student.name)}
          </ThemedText>
        </View>

        <View style={styles.infoContainer}>
          <ThemedText
            type="subtitle"
            style={[styles.name, { color: colors.primary }]}
          >
            {student.name}
          </ThemedText>
          <ThemedText style={styles.detail}>Kelas: {student.class}</ThemedText>
          <ThemedText style={styles.detail}>
            Jurusan: {student.major}
          </ThemedText>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => onEdit(student)}
            style={styles.iconButton}
          >
            {/* [Expo Vector Icons] Menggunakan icon set Ionicons */}
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(student.id)}
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden", // For the accent strip
    shadowColor: "#0054A3", // Blue shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E6F0FF",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
});
