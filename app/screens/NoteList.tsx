import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NoteInterface } from "../interfaces/NoteInterface";

const NoteList = ({ notes, navigation }: { notes: NoteInterface[], navigation: any }) => {
    const [noteList, setNoteList] = useState<NoteInterface[]>(notes);

    useEffect(() => {
        notes.forEach(note => {
        console.log(note.date);
        });
        setNoteList(notes);
    }, [notes]);

    const editNote = (note: NoteInterface) => {
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
                        <TouchableOpacity style={[styles.noteContainer, styles.contentRow]} onPress={() => editNote(item)}>
                            <View>
                                <Text style={styles.noteTitle}>{item.title}</Text>
                                <Text>{item.content}</Text>
                            </View>
                            <Text>{item.date ? new Date(item.date.seconds * 1000).toDateString() : null }</Text>
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
    contentRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});