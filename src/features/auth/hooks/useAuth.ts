import { useMutation } from '@tanstack/react-query'
import { login, register } from '../services/AuthService'

function useAuth() {
   const loginMutation = useMutation({ mutationFn: login })
   const registerMutation = useMutation({ mutationFn: register })

   return {
      loginMutation,
      registerMutation
   }
}

export default useAuth
