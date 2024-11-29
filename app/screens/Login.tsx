import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import React from "react";
import { firebaseAuth } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RouterPropsInterface } from "../interfaces/RouterPropsInterface";

const Login = ({ navigation }: RouterPropsInterface) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = firebaseAuth;

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            alert(`Error logging in ${(e as any).message}`);
        }
        setLoading(false);
    };

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
                        <TouchableOpacity style={styles.button} onPress={signIn}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    );
}

export default Login;

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