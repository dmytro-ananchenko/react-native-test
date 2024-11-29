import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NoteInterface } from "../interfaces/NoteInterface";

const NoteList = ({ notes, navigation }: { notes: NoteInterface[], navigation: any }) => {
    const [noteList, setNoteList] = useState<NoteInterface[]>(notes);

    useEffect(() => {
        setNoteList(notes);
    }, [notes]);

    const editNote = (note: NoteInterface) => {
        console.log('Edit note', note);
        navigation.navigate('Note', { noteProp: note });
    }

    return (
        <View style={styles.container}>
            {noteList.length === 0 ? (
                <Text>No notes</Text>
            ) : (
                <FlatList
                    data={noteList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.noteContainer} onPress={() => editNote(item)}>
                            <Text style={styles.noteTitle}>{item.title}</Text>
                            <Text>{item.content}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

export default NoteList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    noteContainer: {
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginHorizontal: 15,

    },
    noteTitle: {
        fontWeight: 'bold',
    },
});