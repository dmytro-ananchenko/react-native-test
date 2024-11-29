import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import React from "react";
import { firebaseAuth } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { RouterPropsInterface } from "../interfaces/RouterPropsInterface";

const Signup = ({ navigation }: RouterPropsInterface) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = firebaseAuth;

    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User created');
        } catch (e) {
            alert(`Signin error ${(e as any).message}`);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={styles.kav}>
                <TextInput style={styles.input}
                    value={email}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}>
                </TextInput>
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}>
                </TextInput>
                {
                    loading ? 
                    <ActivityIndicator size="large" color="#0000ff" /> :
                    <>
                        <TouchableOpacity style={styles.button} onPress={signUp}>
                            <Text>Sign Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    );
}

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    kav: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        backgroundColor: '#f8f8f8',
    },
    linkContainer: {
        alignItems: 'center',
    },
    link: {
        color: 'blue',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        marginVertical: 12,
        padding: 10,
    },
});