import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { RiBrain2Fill, RiEyeLine, RiEyeOffLine } from '@remixicon/react'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()
    const authError = useSelector((state) => state.auth.error)

    const navigate = useNavigate()

    
    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        const data = await handleLogin(payload)
        if (data?.success) {
            // navigate("/")
            navigate("/", { replace: true });
        }
    }

    if(!loading && user){
        return <Navigate to="/" replace />
    }

    return (
        <section className="min-h-screen bg-[#050505] px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 shadow-2xl shadow-black/50">

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2.5 mb-8">
                        <RiBrain2Fill className="text-white" size={30} />
                        <span className="text-2xl font-light tracking-tight text-white">
                            Neural<span className="font-medium">Search</span>
                        </span>
                    </div>

                    <h1 className="text-2xl font-semibold text-white text-center">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 text-center">
                        Sign in with your email and password.
                    </p>

                    <form onSubmit={submitForm} className="mt-8 space-y-5">
                        {authError && (
                            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {authError}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-white/25"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 pr-11 text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-white/25"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <RiEyeOffLine size={19} /> : <RiEyeLine size={19} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-medium text-white hover:opacity-80 transition">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login;