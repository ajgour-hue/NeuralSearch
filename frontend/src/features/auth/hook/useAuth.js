import { useDispatch } from "react-redux";

import { login, register, getMe } from "../services/auth.api";

import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            const data = await login({ email, password })
            if (data?.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            
            const data = await getMe()
            if (data?.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }
}
