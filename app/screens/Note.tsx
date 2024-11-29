import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, KeyboardAvoidingView, Image, TouchableOpacity, Text, PermissionsAndroid, Platform } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { CoordinatesInterface, NoteInterface } from "../interfaces/NoteInterface";
import { addNote, updateNote } from "../api/Note";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const defaultNote: Partial<NoteInterface> = {
    title: '',
    content: '',
    coordinates: {
        latitude: 0,
        longitude: 0,
    },
    imageUrl: '',
};

type RootStackParamList = {
    Home: undefined;
    Note: undefined | { noteProp?: Partial<NoteInterface> };
};
  
type Props = NativeStackScreenProps<RootStackParamList, any>;

const Note: React.FC<Props> = ({ navigation, route }) => {
    const [note, setNote] = useState<Partial<NoteInterface>>(route.params?.noteProp ?? defaultNote);

    const validateNote = (note: Partial<NoteInterface>): boolean => {
        if (!note.title || note.title.trim() === '') {
            alert('Validation Error: Title is required.');
            return false;
        }
        if (!note.content || note.content.trim() === '') {
            alert('Validation Error: Content is required.');
            return false;
        }
        if (!note.coordinates || note.coordinates.latitude === 0 || note.coordinates.longitude === 0) {
            alert('Validation Error: Valid coordinates are required.');
            return false;
        }
        return true;
    };

    const saveNote = async () => {
        if (!validateNote(note)) {
            return;
        }
        try {
            const noteToSave: NoteInterface = note as NoteInterface;
            if (note.id) {
                await updateNote(note.id, noteToSave);
            } else {
                await addNote(noteToSave);
            }
            alert('Note saved successfully');
            navigation.navigate('Home'); 
        } catch (error) {
            console.log({error});
        }
    };

    const handleChange = (name: keyof NoteInterface, value: string | undefined | CoordinatesInterface) => {
        setNote({
            ...note,
            [name]: value,
        });
    };

    const handleCoordinatesChange = (name: keyof CoordinatesInterface, value: string) => {
        setNote({
            ...note,
            coordinates: {
                ...note.coordinates,
                [name]: value || 0,
            } as CoordinatesInterface,
        });
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                if (
                    granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('You can use the camera and gallery');
                } else {
                    console.log('Camera and gallery permissions denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const handleImagePick = () => {
        try {       
            requestPermissions(); 
            console.log('image pick');
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    const uri = response.assets[0].uri;
                    handleChange('imageUrl', uri);
                }
            });
        } catch (error) {
            console.log({error});
            
        }
    };

    const handleCameraPick = () => {
        requestPermissions();
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera picker');
            } else if (response.errorCode) {
                console.log('CameraPicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                handleChange('imageUrl', uri);
            }
        });
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    style={styles.input}
                    value={note.title}
                    placeholder="Title"
                    autoCapitalize="none"
                    onChangeText={(text) => handleChange('title', text)}
                />
                <TextInput
                    style={styles.input}
                    value={note.content}
                    placeholder="Content"
                    autoCapitalize="none"
                    onChangeText={(text) => handleChange('content', text)}
                />
                <TextInput
                    style={styles.input}
                    value={note.coordinates?.latitude?.toString() || ''}
                    placeholder="Latitude"
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    onChangeText={(text) => handleCoordinatesChange('latitude', text)}
                />
                <TextInput
                    style={styles.input}
                    value={note.coordinates?.longitude?.toString() || ''}
                    placeholder="Longitude"
                    autoCapitalize="none"
                    keyboardType="decimal-pad"
                    onChangeText={(text) => handleCoordinatesChange('longitude', text)}
                />
                <View style={styles.imageContainer}>
                    {note.imageUrl ? (
                        <Image source={{ uri: note.imageUrl }} style={styles.image} />
                    ) : (
                        <Text>No image selected</Text>
                    )}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleImagePick}>
                    <Text>Select Image from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCameraPick}>
                    <Text>Take Photo</Text>
                </TouchableOpacity>
                <Button title={`${note.id ? 'Update' : 'Add'} Note`} onPress={saveNote} />
            </KeyboardAvoidingView>
        </View>
    );
};

export default Note;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginVertical: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: 200,
        height: 200,
    },
});