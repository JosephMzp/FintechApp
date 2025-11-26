import {createContext, useContext, useEffect,useState} from 'react'
import {supabase} from "../supabase/supabase.config.jsx"

const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    useEffect(() =>{
        const {data:authListener} = supabase.auth.onAuthStateChange(
            async(event, session) => {
                console.log(event,session);
                if(session?.user==null){
                    setUser(null)
                }else{
                    setUser(session?.user)
                }
            }
        )
        return ()=> {
            authListener.subscription.unsubscribe();
        }
    },[])
    return(
        <AuthContext.Provider value={{user}}>
            {children}
        </AuthContext.Provider>
    )
}
export const UserAuth =()=>{
    return useContext(AuthContext)
}