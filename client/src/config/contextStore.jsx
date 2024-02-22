import { createContext, useState, useMemo, useRef, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { userService } from "@services"

export const AuthContext = createContext()


export default function AuthProvider( {children} ) {
const [fetchUser, setLoggedInUser]  = useState("")
const loggedInUser = useMemo(()=> fetchUser, [fetchUser])
// const getUserRef = useRef()


//making use of the token
const token = JSON.parse(localStorage.getItem("userToken"))

const getUser = useCallback(async()=> {
  if(!token) return
  try {
    const {data} = await userService.authUser(token)
    console.log(data);
    setLoggedInUser(data)
  } catch (error) {
    console.log(error)
  }
}, [token])

useEffect(() => {
getUser()
},[getUser])

console.log("user", loggedInUser)

  return (
    <AuthContext.Provider value = {{ loggedInUser }}>
        {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
    children : PropTypes.node.isRequired
}