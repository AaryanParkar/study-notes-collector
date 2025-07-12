import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { closeMenu } from "./redux/menuSlice";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Menu() {
  const isOpen = useSelector((state) => state.menu.isOpen);
  const dispatch = useDispatch();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(closeMenu());
    router.replace("/login");
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        <Text style={styles.title}>☰ Menu</Text>

        <TouchableOpacity style={styles.item} onPress={() => router.push("/screens/HomeScreen")}>
          <Text>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push("/screens/AddNoteScreen")}>
          <Text>📝 Add Note</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Text>🚪 Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.close} onPress={() => dispatch(closeMenu())}>
          <Text>✕ Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 99,
  },
  menu: {
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  close: {
    marginTop: 40,
    paddingVertical: 10,
  },
});
