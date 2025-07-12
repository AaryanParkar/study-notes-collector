// import { useRouter } from "expo-router";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { useEffect } from "react";
// import { FlatList, Text, TouchableOpacity, View } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { db, auth } from "../../firebase";
// import { addNote, deleteNote  } from "../redux/notesSlice";
// import { signOut } from "firebase/auth";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { toggleMenu } from "../redux/menuSlice";

// export default function HomeScreen() {
//   const notes = useSelector((state) => state.notes);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace("/login");
//     } catch (error) {
//       console.error("Error during logout:", error.message);
//     }
//   };
//   const handleDelete = async (note, index) => {
//     try {
//       await deleteDoc(doc(db, "notes", note.id));
//       dispatch(deleteNote(note.id));
//     } catch (error) {
//       console.error("Error deleting note:", error.message);
//     }
//   };

//   useEffect(() => {
//     const loadNotes = async () => {
//       const snapshot = await getDocs(collection(db, "notes"));
//       snapshot.forEach((docSnap) => {
//         const noteData = docSnap.data();
//         dispatch(addNote({ ...noteData, id: docSnap.id }));
//       });
//     };

//     if (notes.length === 0) {
//       loadNotes();
//     }
//   }, []);
//   const renderNote = ({ item, index }) => (
//     <View style={styles.noteCard}>
//       <Text style={styles.subject}>{item.subject}</Text>
//       <Text style={styles.topic}>{item.topic}</Text>
//       <Text style={styles.date}>{item.date}</Text>
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => handleDelete(item, index)}
//       >
//         <Icon name="delete" size={22} color="#ff3b30" />
//       </TouchableOpacity>
//     </View>
//   );

//   return (

//     <View style={styles.container}>
//       <Text style={styles.title}>📚 Study Notes</Text>
//       {notes.length === 0 ? (
//         <Text style={styles.emptyText}>No notes yet. Tap ➕ to add one!</Text>
//       ) : (
//         <FlatList
//           data={notes}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderNote}
//           contentContainerStyle={styles.list}
//         />
//       )}

//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push("/screens/AddNoteScreen")}
//       >
//         <Text style={styles.fabText}>＋</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//         <Icon name="logout" size={20} color="#fff" /><Text style={styles.logoutText}> Logout </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = {
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//     marginTop: 30,
//     textAlign: "left",
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#888",
//     marginTop: 20,
//   },
//   list: {
//     paddingBottom: 100,
//   },
//   noteCard: {
//     backgroundColor: "#e0e0e0", // light greyish
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     width: "100%",
//   },
//   subject: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   topic: {
//     fontSize: 16,
//     color: "#555",
//   },
//   date: {
//     fontSize: 14,
//     color: "#999",
//     marginTop: 2,
//   },
//   fab: {
//     position: "absolute",
//     bottom: 30,
//     right: 30,
//     width: 60,
//     height: 60,
//     backgroundColor: "#007bff",
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//   },
//   fabText: {
//     color: "#fff",
//     fontSize: 30,
//     lineHeight: 30,
//   },
//   logoutButton: {
//     position: "absolute",
//     top: 55,
//     right: 10,
//     padding: 8,
//     backgroundColor: "#ff4d4f",
//     borderRadius: 6,
//     zIndex: 10,
//     flexDirection: "row",
//   },
//   logoutText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",

//     marginLeft: 5,
//   },
//   deleteButton: {
//     backgroundColor: "#e5e5e5",
//     padding: 6,
//     borderRadius: 6,
//     bottom: 5,
//     alignSelf: "flex-end",
//   }
// };
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase";
import { deleteFromUploadThing } from "../utils/deleteFromUploadThing";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, "notes"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);

        const userNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotes(userNotes);
      } catch (error) {
        console.error("❌ Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/screens/NoteDetailScreen",
          params: { id: item.id },
        })
      }
      style={styles.noteCard}
    >
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.topic}>📘 {item.topic}</Text>
      <Text style={styles.date}>📅 {item.date}</Text>

      <View>
        {/* Show first image if available */}
        {item.files?.[0]?.fileUrl && (
          <Image
            source={{ uri: item.files?.[0]?.fileUrl }}
            style={{
              height: "100%",
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        )}
      </View>

      {/* Minimal delete icon */}
      <TouchableOpacity
        onPress={async () => {
          try {
            const docRef = doc(db, "notes", item.id);
            const noteSnap = await getDoc(docRef);
            const note = noteSnap.exists() ? noteSnap.data() : null;

            // 🔁 Collect all fileKeys from multiple possible fields
            const keys = [];

            if (Array.isArray(note?.files)) {
              note.files.forEach((file) => {
                if (file?.fileKey) keys.push(file.fileKey);
              });
            }

            // 🚮 Delete all files from UploadThing
            if (keys.length > 0) {
              try {
                await deleteFromUploadThing(keys);
              } catch (err) {
                console.warn("Failed to delete UploadThing files:", err);
              }
            }

            // 🗑️ Delete the Firestore document
            await deleteDoc(docRef);

            // 🧹 Update local state
            setNotes((prev) => prev.filter((n) => n.id !== item.id));
          } catch (err) {
            console.error("Delete failed", err);
          }
        }}
        style={styles.deleteIcon}
      >
        <Text style={styles.deleteIconText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Study Notes</Text>
      {notes.length === 0 ? (
        <Text style={styles.empty}>No notes found. Tap ➕ to add one!</Text>
      ) : null}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No notes found.</Text>}
      />

      <TouchableOpacity
        onPress={() => router.push("/screens/AddNoteScreen")}
        style={styles.addButton}
      >
        <Text style={styles.addText}>➕ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafc",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  noteCard: {
    backgroundColor: "#fff",
    // borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    position: "relative", // ADD THIS
  },

  subject: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  topic: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 30,
    fontSize: 16,
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },

  deleteIconText: {
    fontSize: 16,
  },
});
