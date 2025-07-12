// // app/_layout.tsx
// import { Slot } from "expo-router";
// import { Provider } from "react-redux";
// import { store } from "./redux/store";

// export default function Layout() {
//   return (
//     <Provider store={store}>
//         <Slot />
//     </Provider>
//   );
// } 
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Menu from  "../app/Menu";
import { View } from "react-native";

export default function Layout() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <Menu />
        <Slot />
      </View>
    </Provider>
  );
}
