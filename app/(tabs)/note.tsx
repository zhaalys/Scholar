import { StudentCard } from "@/components/StudentCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Student,
  addStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "@/constants/studentStorage";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NoteScreen() {
  // [React Hooks] useState untuk menyimpan data siswa yang sedang ditampilkan
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [major, setMajor] = useState("");

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const loadStudents = async () => {
    setLoading(true);
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  // [Expo Router] useFocusEffect dijalankan setiap kali layar ini dibuka/difokuskan
  // Berguna agar data selalu fresh kalau kita balik dari tab lain
  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, []),
  );

  const handleSave = async () => {
    if (!name.trim() || !studentClass.trim() || !major.trim()) {
      // [React Native UI] Alert untuk menampilkan pesan popup sederhana
      Alert.alert("Error", "Mohon isi semua data (Nama, Kelas, Jurusan)");
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent({
          ...editingStudent,
          name,
          class: studentClass,
          major,
        });
      } else {
        await addStudent({ name, class: studentClass, major });
      }
      setModalVisible(false);
      resetForm();
      loadStudents();
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan data");
    }
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      const confirm = window.confirm(
        "Apakah Anda yakin ingin menghapus data ini?",
      );
      if (confirm) {
        deleteStudent(id).then(() => loadStudents());
      }
    } else {
      Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus data ini?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deleteStudent(id);
            loadStudents();
          },
        },
      ]);
    }
  };

  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setName(student.name);
      setStudentClass(student.class);
      setMajor(student.major);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setName("");
    setStudentClass("");
    setMajor("");
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        colors={["#0054A3", "#007CC2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image
          source={require("@/assets/images/Logo TB Teks Putih.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.headerTitle}>
          Data Siswa
        </ThemedText>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        // [React Native UI] FlatList untuk menampilkan daftar data yang bisa di-scroll
        // Lebih efisien daripada ScrollView biasa untuk data yang banyak
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <ThemedText>Belum ada data siswa.</ThemedText>
            </View>
          }
        />
      )}

      <TouchableOpacity onPress={() => openModal()} style={styles.fabContainer}>
        <LinearGradient
          colors={["#0054A3", "#007CC2"]}
          style={styles.fab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* [React Native UI] Modal: Komponen popup yang muncul di atas konten lain */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {editingStudent ? "Edit Siswa" : "Tambah Siswa"}
            </ThemedText>

            {/* [React Native UI] TextInput: Komponen untuk menerima input teks dari keyboard */}
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.icon,
                  backgroundColor: colors.cardBackground,
                },
              ]}
              placeholder="Nama Lengkap"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.icon,
                  backgroundColor: colors.cardBackground,
                },
              ]}
              placeholder="Kelas (contoh: XI)"
              placeholderTextColor={colors.icon}
              value={studentClass}
              onChangeText={setStudentClass}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.icon,
                  backgroundColor: colors.cardBackground,
                },
              ]}
              placeholder="Jurusan (contoh: PPLG)"
              placeholderTextColor={colors.icon}
              value={major}
              onChangeText={setMajor}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={{ color: "#FF3B30" }}>Batal</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={handleSave}
              >
                <ThemedText style={{ color: "#FFF", fontWeight: "bold" }}>
                  Simpan
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30, // More rounded like modern apps
    borderBottomRightRadius: 30,
    marginBottom: 15,
    flexDirection: "row", // Align logo and text horizontally
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  headerLogo: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // space for FAB
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#0054A3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
});
