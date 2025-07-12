import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../firebase";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.replace("/login");
    }
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: user.photoURL || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.displayName || "User Name"}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.userId}>User ID: {user.uid}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          auth.signOut().then(() => {
            router.replace("/login");
          });
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
