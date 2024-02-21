import { createContext, useState, useMemo, useRef } from "react"
import PropTypes from "prop-types"

export const AuthContext = createContext()


export default function AuthProvider( {children} ) {
const {fetchUser, setLoggedInUser}  = useState("")
const loggedInUser = useMemo(()=> fetchUser, [fetchUser])
  return (
    <AuthContext.Provider value = {{ loggedInUser }}>
        {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
    children : PropTypes.node.isRequired
}