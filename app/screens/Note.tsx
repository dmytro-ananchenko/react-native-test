import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Image, TouchableOpacity, Text, PermissionsAndroid, Platform } from "react-native";
import { Timestamp } from "firebase/firestore";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { CoordinatesInterface, NoteInterface } from "../interfaces/NoteInterface";
import { addNote, updateNote, deleteNote } from "../api/Note";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const defaultNote: Partial<NoteInterface> = {
    title: '',
    content: '',
    coordinates: {
        latitude: 0,
        longitude: 0,
    },
    imageUrl: '',
    date: Timestamp.fromDate(new Date()),
};

type RootStackParamList = {
    Home: undefined;
    Note: undefined | { noteProp?: Partial<NoteInterface> };
};
  
type Props = NativeStackScreenProps<RootStackParamList, any>;

const Note: React.FC<Props> = ({ navigation, route }) => {
    const [note, setNote] = useState<Partial<NoteInterface>>(route.params?.noteProp ?? defaultNote);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validateNote = (note: Partial<NoteInterface>): boolean => {
        if (!note.title || note.title.trim() === '') {
            alert('Validation Error: Title is required.');
            return false;
        }
        if (!note.content || note.content.trim() === '') {
            alert('Validation Error: Content is required.');
            return false;
        }
        if (!note.coordinates || note.coordinates.latitude < -90 || note.coordinates.latitude > 90) {
            alert('Validation Error: Invalid latitude value.');
            return false;
        }
        if (!note.coordinates || note.coordinates.longitude < -180 || note.coordinates.longitude > 180) {
            alert('Validation Error: Invalid longitude value.');
            return false;
        }
        return true;
    };

    const saveNote = async () => {

        setNote({
            ...note,
            coordinates: {
                latitude: parseFloat(note.coordinates?.latitude?.toString() || '0'),
                longitude: parseFloat(note.coordinates?.longitude?.toString() || '0'),
            }
        });

        if (!validateNote(note)) {
            return;
        }
        try {
            const noteToSave: NoteInterface = {
                ...note,
                date: note.date instanceof Timestamp ? note.date : Timestamp.fromDate(new Date(note.date || new Date())),
            } as NoteInterface;
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

    const removeNote = async () => {
        if (!note.id) {
            return;
        }
        try {
            await deleteNote(note.id);
            alert('Note deleted successfully');
            navigation.navigate('Home');
        } catch (error) {
            console.log({error});
        }
    };

    const handleChange = (name: keyof NoteInterface, value: string | undefined | CoordinatesInterface | Date) => {
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

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || (note.date instanceof Timestamp ? note.date.toDate() : new Date(note.date || new Date()));
        setShowDatePicker(false);
        handleChange('date', currentDate);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TouchableOpacity style={[styles.button, styles.buttonRow]} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.buttonText}>Select Date</Text>
                    <Text style={styles.buttonText}>{(note.date instanceof Timestamp ? note.date.toDate() : new Date(note.date || new Date())).toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(note.date instanceof Timestamp ? note.date.toDate() : note.date || new Date())}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
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
                    keyboardType="number-pad"
                    onChangeText={(text) => handleCoordinatesChange('latitude', text)}
                />
                <TextInput
                    style={styles.input}
                    value={note.coordinates?.longitude?.toString() || ''}
                    placeholder="Longitude"
                    autoCapitalize="none"
                    keyboardType="number-pad"
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
                    <Text style={styles.buttonText}>Select Image from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCameraPick}>
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                <View style={note.id ? styles.buttonRow : styles.fullWidthButton}>
                    <TouchableOpacity style={[styles.button, note.id ? styles.nestedButton : null]} onPress={saveNote}>
                        <Text style={styles.buttonText}>Save Note</Text>
                    </TouchableOpacity>
                    {note.id ? (
                        <TouchableOpacity style={[styles.button, styles.deleteButton, styles.nestedButton]} onPress={removeNote}>
                            <Text style={styles.buttonText}>Delete Note</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Note;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fullWidthButton: {
        width: '100%'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#2196F3',
        padding: 10,
        marginVertical: 10,
    },
    nestedButton: {
        flex: 1,
        marginHorizontal: 10,
    },
    deleteButton: {
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
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