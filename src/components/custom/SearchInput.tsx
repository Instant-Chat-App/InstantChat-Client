import { findUserByPhone } from '@/features/user/services/UserService'
import { UserInfo } from '@/features/user/types/User'
import { Search } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Input } from '../ui/input'

interface Props {
   onSetSearchResult: (result: UserInfo | null) => void
   onSetSearchQuery: (query: string) => void
   searchQuery: string
}

function SearchInput({ onSetSearchResult, onSetSearchQuery, searchQuery }: Props) {
   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

   // Debounce effect
   useEffect(() => {
      if (!searchQuery.trim()) {
         onSetSearchResult(null)
         return
      }
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
      debounceTimeout.current = setTimeout(() => {
         handleSearch(searchQuery)
      }, 1000)

      return () => {
         if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
      }
   }, [searchQuery])

   const handleSearch = async (keyword: string) => {
      const response = await findUserByPhone(keyword)
      response.data ? onSetSearchResult(response.data) : onSetSearchResult(null)
   }

   return (
      <div className='flex space-x-2'>
         <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
               placeholder='Search phone number...'
               value={searchQuery}
               onChange={(e) => onSetSearchQuery(e.target.value)}
               className='pl-10'
            />
         </div>
      </div>
   )
}

export default SearchInput
