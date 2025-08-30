import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Heading>This screen does not exist.</Heading>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
