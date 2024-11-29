import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NoteInterface } from '../interfaces/NoteInterface';

const NoteMap = ({ notes, navigation }: { notes: NoteInterface[], navigation: any })  => {
    const [noteList, setNoteList] = useState<NoteInterface[]>(notes);

    useEffect(() => {
        setNoteList(notes);
    }, [notes]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 1,
                    longitude: 1,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {noteList.map(note => {
                    const { latitude, longitude } = note.coordinates;
                    if (latitude && longitude) {
                        <Marker
                            key={note.id}
                            coordinate={{ latitude, longitude }}
                            title={note.title}
                            description={note.content}
                        />
                    }
                    return null;
                })}
            </MapView>
        </View>
    );
};

export default NoteMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});