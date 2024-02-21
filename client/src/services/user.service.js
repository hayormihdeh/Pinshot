import { connect } from "@config"

const login = async(userName, password) => {
    return await connect.post("/auth/login", {userName, password})
}

export default {
    login,
} 