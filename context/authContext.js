import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                setIsAuthenticated(true);
                setUser(user)
                updateUserData(user.uid)
            }else {
                setIsAuthenticated(false)
                setUser(null)
            }
        })
        return unsub
    } , []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            let data = docSnap.data();
            setUser({...user, username: data.username, profileUrl: data.profileUrl, userId : data.uid})
        }
        console.log("user", user)
    }

    const login = async (email, password) => {
        console.log(email, password)
        try{
            const response = await signInWithEmailAndPassword(auth , email, password);
            return { succces: true }
        }   
        catch(e){
            let msg = e.message
            if(msg.includes('(auth/invalid-email)')) msg = "Invalid Email"
            if(msg.includes('(auth/invalid-credentials)')) msg = "Invalid Credentials"
            return {success : false, msg}
        }
    }

    const logout = async () => {
        try{
            await signOut(auth);
            return { success : true }
        }
        catch(e){
            return {success : false, msg: e.message, error: e}
        }
    }

    const register = async (email, password, username, profileUrl) => {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response, 'response user');
            await setDoc(doc(db, "users", response.user.uid), {
                username,
                profileUrl,
                userId : response.user.uid
            })
        }
        catch(e){
            let msg = e.message
            if(msg.includes('(auth/invalid-email')) msg = "Invalid Email"
            if(msg.includes('(auth/email-already-in-use')) msg = "This email is already used"
            return {success : true, msg}
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, register}}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if(!value) {
        throw new Error('use Auth must be wrapped inside the AuthContext')
    }
    return value;
}