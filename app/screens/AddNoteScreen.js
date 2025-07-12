import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { auth, db } from "../../firebase";
import { uploadMultipleFiles } from "../utils/uploadToUploadThing";

export default function AddNoteScreen() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  const pickFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets) {
      setFiles(result.assets.map((file) => file.uri));
    }
  };

  const handleAdd = async () => {
    if (subject && topic && date) {
      const user = auth.currentUser;
      if (!user) return alert("Please login");

      let uploaded = [];

      if (files.length > 0) {
        setUploading(true);
        uploaded = await uploadMultipleFiles(files);
        console.log("📦 Uploaded files:", uploaded);
        setUploading(false);
      }

      await addDoc(collection(db, "notes"), {
        uid: user.uid,
        subject,
        topic,
        date: date.toLocaleDateString(),
        createdAt: new Date(),
        files: uploaded, // ✅ array of uploaded files
      });

      router.replace("/screens/HomeScreen"); // trigger refresh
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Note</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Topic"
        value={topic}
        onChangeText={setTopic}
      />

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>📅 {date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowPicker(false);
            setDate(currentDate);
          }}
        />
      )}

      <TouchableOpacity onPress={pickFiles} style={styles.dateButton}>
        <Text style={styles.dateText}>
          {files.length > 0
            ? `📎 ${files.length} file${files.length > 1 ? "s" : ""} selected`
            : "📎 Attach Files"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAdd} style={styles.saveButton} disabled={uploading}>
        <Text style={styles.saveText}>
          {uploading ? "Uploading..." : "💾 Save Note"}
        </Text>
      </TouchableOpacity>

      {uploading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
    fontSize: 16,
  },
  dateButton: {
    padding: 14,
    backgroundColor: "#e8ecf0",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#444",
  },
  saveButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});