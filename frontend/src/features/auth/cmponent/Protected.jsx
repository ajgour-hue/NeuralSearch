import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const Protected = ({ children }) => {

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
          <span
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>

        <p className="mt-4 text-gray-500 text-sm">
          Loading pls wait for a sec...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default Protected