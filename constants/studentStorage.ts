// [AsyncStorage] Library untuk menyimpan data secara permanen di HP pengguna
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Student {
  id: string;
  name: string;
  class: string;
  major: string;
}

// [AsyncStorage] Key unik untuk menyimpan data siswa
const STORAGE_KEY = "@students_data";

export const getStudents = async (): Promise<Student[]> => {
  try {
    // [AsyncStorage] Mengambil data dari penyimpanan lokal
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading student data", e);
    return [];
  }
};

export const addStudent = async (
  student: Omit<Student, "id">,
): Promise<Student> => {
  try {
    const students = await getStudents();
    const newStudent: Student = { ...student, id: Date.now().toString() };
    const updatedStudents = [...students, newStudent];
    // [AsyncStorage] Menyimpan kembali array data yang sudah diperbarui (ditambah)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
    return newStudent;
  } catch (e) {
    console.error("Error adding student", e);
    throw e;
  }
};

export const updateStudent = async (student: Student): Promise<void> => {
  try {
    const students = await getStudents();
    const updatedStudents = students.map((s) =>
      s.id === student.id ? student : s,
    );
    // [AsyncStorage] Menyimpan data yang sudah diedit
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
  } catch (e) {
    console.error("Error updating student", e);
    throw e;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const students = await getStudents();
    const updatedStudents = students.filter((s) => s.id !== id);
    // [AsyncStorage] Menyimpan data terbaru setelah ada yang dihapus
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
  } catch (e) {
    console.error("Error deleting student", e);
    throw e;
  }
};
