import { connect, authHeader } from "@config"

const login = async(userName, password) => {
    return await connect.post("/auth/login", {userName, password})
}

const authUser = async()=>{
    return connect.get("/auth", {headers: authHeader()})
}

// **
const logout = async () => {
    localStorage.removeItem("userToken")
    window.location.reload()
}

export default {
    login,
    authUser,
    logout
} 