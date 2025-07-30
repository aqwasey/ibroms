import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import notificationService from '@/services/notificationService'

/**
 * Auth guard composable that checks authentication on dashboard routes
 * and handles token refresh if needed
 */
export function useAuthGuard() {
  const router = useRouter()
  // Use the notification service directly
  const notification = notificationService

  const checkAuth = async () => {
    try {
      // Check if token exists and is valid
      if (!authService.isLoggedIn()) {
        // Try to refresh token if available but expired
        if (await authService.refreshToken()) {
          notification.success('Your session has been refreshed')
          return true
        }
        
        // If no token or refresh failed, redirect to login
        notification.warning('Your session has expired. Please login again.')
        router.push('/login')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Auth check error:', error)
      notification.error('Authentication error. Please login again.')
      router.push('/login')
      return false
    }
  }

  // Check auth when component mounts
  onMounted(async () => {
    await checkAuth()
  })

  return {
    checkAuth
  }
}

export default useAuthGuard
