import { useQuery } from '@tanstack/react-query'
import { findUserByPhone } from '../services/UserService'

function useUserByPhone(phone: string) {
   const { data: usersSearch } = useQuery({
      queryKey: ['usersSearch', phone],
      queryFn: () => findUserByPhone(phone),
      select: (data) => data.data || []
   })

   return {
      usersSearch
   }
}

export default useUserByPhone
