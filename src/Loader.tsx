import React, { ReactChild, useLayoutEffect, useRef, useState } from "react";
import { Easing, View, StyleSheet, Text, Animated, Image } from "react-native";

type Props = {
  children: ReactChild;
};

export function Loader({ children }: Props) {
  const [loaded, setLoaded] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;

  const preloadImages = async () => {
    const images = [
      require("../assets/appleMusic.png"),
      require("../assets/logo.png"),
      require("../assets/poster_full.png"),
      require("../assets/spotify.png"),
      require("../assets/appleMusic.png"),
      require("../assets/youtube.png"),
      require("../assets/title.png"),
    ];

    const promises = images.map(Image.prefetch);

    Promise.all(promises).then(() => setLoaded(true));
  };

  useLayoutEffect(() => {
    preloadImages();

    const loop = Animated.timing(spin, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const runLoop = (cb) => Animated.loop(loop).start(cb);

    runLoop(Animated.loop(loop).start());
  }, []);

  return loaded ? (
    children
  ) : (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              rotateY: spin.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <Text style={styles.text}>🎧</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 48 },
});
