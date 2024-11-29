import { firebaseDB } from "../../FirebaseConfig";
import { collection, getDocs, QuerySnapshot, addDoc, updateDoc, deleteDoc, doc, DocumentSnapshot, getDoc, DocumentReference } from "firebase/firestore";
import { NoteInterface } from "../interfaces/NoteInterface";

export const fetchNotes = async (): Promise<NoteInterface[]> => {
    const querySnapshot: QuerySnapshot = await getDocs(collection(firebaseDB, 'notes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NoteInterface[];
};

export const getNote = async (id: string): Promise<NoteInterface | null> => {
    const noteDoc: DocumentReference = doc(firebaseDB, 'notes', id);
    const docSnap: DocumentSnapshot = await getDoc(noteDoc);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as NoteInterface;
    } else {
        return null;
    }
};

export const addNote = async (note: NoteInterface): Promise<void> => {
    await addDoc(collection(firebaseDB, 'notes'), note);
};

export const updateNote = async (id: string, note: Partial<NoteInterface>): Promise<void> => {
    const noteDoc = doc(firebaseDB, 'notes', id);
    await updateDoc(noteDoc, note);
};

export const deleteNote = async (id: string): Promise<void> => {
    const noteDoc = doc(firebaseDB, 'notes', id);
    await deleteDoc(noteDoc);
};