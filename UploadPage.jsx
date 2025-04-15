import React, { useState } from "react";
import { View, Text, Button, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ImageUpload = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch("http://localhost:7137/api/Files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.FilePath) {
        setUploadedImageUrl(data.FilePath);
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View>
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && (
        <View>
          <Text>Selected Image:</Text>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
      <Button title="Upload Image" onPress={uploadImage} />
      {uploadedImageUrl && (
        <View>
          <Text>Uploaded Image:</Text>
          <Image
            source={{ uri: uploadedImageUrl }}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </View>
  );
};

export default ImageUpload;
