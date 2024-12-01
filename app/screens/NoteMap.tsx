import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
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
                    latitude: 31.768,
                    longitude: 35.2137,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {noteList.map(note => {
                    const { latitude: lat, longitude: long } = note.coordinates;

                    return <Marker
                        key={note.id}
                        coordinate={{
                            latitude: parseFloat(lat.toString()),
                            longitude: parseFloat(long.toString())
                        }}
                        title={note.title}
                        description={note.content}
                    >
                        <Callout onPress={() => navigation.navigate('Note', { noteProp: note })} />
                    </Marker>
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