import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const docRef = doc(db, "notes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNote({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Note not found");
          router.back();
        }
      } catch (err) {
        console.error("Error loading note:", err);
      }
    };

    fetchNote();
  }, [id, router]);

  if (!note) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: note.subject }} />

      <Text style={styles.text}>📘 Topic: {note.topic}</Text>
      <Text style={styles.text}>📅 Date: {note.date}</Text>

      {/* Show uploaded images from files array */}
      {Array.isArray(note.files) && note.files.length > 0 ? (
        <ScrollView style={styles.imageScroll}>
          {note.files.map((file, index) => (
            <Image
              key={index}
              source={{ uri: file.fileUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noImageText}>No images uploaded.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  noImageText: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#999",
  },
  imageScroll: {
    marginTop: 15,
  },
  image: {
    width: 350,
    height: 350,
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 15,
    alignSelf: "center",
  },
});
