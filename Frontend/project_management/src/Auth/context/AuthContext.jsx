import { createContext, useContext} from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    setisAuthenticated: () => { },
    loading: true,
    setLoading: () => { },
    authenticate: async () => { },
    user : {},
    setUser: () => { }
});

export const AuthProvider = AuthContext.Provider;

export default function useAuth() {
    return useContext(AuthContext);
}
