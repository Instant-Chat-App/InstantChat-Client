import { useQuery } from '@tanstack/react-query'
import { getUserProfile } from '../services/UserService'

function useUser() {
   const { data: userProfile } = useQuery({
      queryKey: ['user-profile'],
      queryFn: getUserProfile,
      select: (res) => res.data,
   })

   return {
      userProfile
   }
}

export default useUser
