import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Доступ до камери',
        message:
          'Застосунку потрібен доступ до камери, щоб зробити фотографію.',
        buttonPositive: 'Дозволити',
        buttonNegative: 'Відхилити',
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const result = await PermissionsAndroid.request(
      permission,
      {
        title: 'Доступ до галереї',
        message:
          'Застосунку потрібен доступ до фотографій.',
        buttonPositive: 'Дозволити',
        buttonNegative: 'Відхилити',
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      Alert.alert('Доступ до камери не надано');
      return;
    }

    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: false,
    });

    if (
      !result.didCancel &&
      result.assets &&
      result.assets.length > 0
    ) {
      setImageUri(result.assets[0].uri ?? null);
    }
  };

  const openGallery = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      Alert.alert('Доступ до галереї не надано');
      return;
    }

    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    });

    if (
      !result.didCancel &&
      result.assets &&
      result.assets.length > 0
    ) {
      setImageUri(result.assets[0].uri ?? null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Камера та галерея
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={openCamera}
      >
        <Text style={styles.buttonText}>
          Відкрити камеру
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={openGallery}
      >
        <Text style={styles.buttonText}>
          Відкрити галерею
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 40,
  },

  button: {
    width: '85%',
    backgroundColor: '#222222',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },

  image: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderRadius: 12,
  },
});