import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { firebaseAuth } from "../../FirebaseConfig";
import { RouterPropsInterface } from "../interfaces/RouterPropsInterface";
import { User } from "firebase/auth";
import NoteList from "./NoteList";
import NoteMap from "./NoteMap";
import { NoteInterface } from "../interfaces/NoteInterface";
import { fetchNotes } from "../api/Note";
import { NavigationProp } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ notes, navigation }: { notes: NoteInterface[], navigation: NavigationProp<any, any> }) => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarLabelStyle: { paddingBottom: 0, paddingTop: 0, margin: 0 }
        }}>
            <Tab.Screen name="Main" options={{tabBarIcon: () => null}}>
                {props => <NoteList {...props} notes={notes} navigation={navigation} />}
            </Tab.Screen>
            <Tab.Screen name="Map" options={{tabBarIcon: () => null}}>
                {props => <NoteMap {...props} notes={notes} navigation={navigation} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const Home = ({ navigation }: RouterPropsInterface) => {
    const [user, setUser] = useState<User | null>(firebaseAuth.currentUser);
    const [notes, setNotes] = useState<NoteInterface[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Main',
            headerRight: () => (
                <View style={styles.headerRight}>
                    <Text style={styles.welcomeText}>
                        Welcome {user && user.displayName ? user.displayName : 'Guest'}
                    </Text>
                    <Button title="Logout" onPress={() => firebaseAuth.signOut()} />
                </View>
            ),
        });
    }, [navigation, user]);

    useEffect(() => {
        const fetchData = async () => {
            const noteList: NoteInterface[] = await fetchNotes();
            setNotes(noteList);
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <HomeTabs notes={notes} navigation={navigation} />
            </View>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Note')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeText: {
        marginRight: 10,
    },
    tabContainer: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        width: 46,
        height: 46,
        borderRadius: 30,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        lineHeight: 24,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});