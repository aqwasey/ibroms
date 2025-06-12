import api from "@/utils/api"

export const signup = async (payload) => {
  try {
    console.log({server:payload})
    const response = await api('business').post('/company/', payload)
    return response
  } catch (error) {
    console.error('[Signup Error]', error)
    throw error
  }
}



export const login = async ({ email, password }) => {
  try {
    const response = await api('business').post('/auth/login', {
      email,
      password,
    })

    const token = response?.token || response?.accessToken
    if (!token) {
      throw new Error('No token returned from server')
    }

    localStorage.setItem('accessToken', token)

    return { success: true, token }
  } catch (error) {
    const message =
      error?.response?.data?.message || 'Login failed. Please try again.'
    return { success: false, message }
  }
}
