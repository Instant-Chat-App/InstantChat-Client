import { UserInfo } from '@/features/user/types/User'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'

interface Props {
   onSearchResult: (result: UserInfo[]) => void
}

function SearchInput({ onSearchResult }: Props) {
   const [searchQuery, setSearchQuery] = useState<string>('')
   const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

   // Debounce effect
   useEffect(() => {
      if (!searchQuery.trim()) {
         onSearchResult([])
         return
      }
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
      debounceTimeout.current = setTimeout(() => {
         handleSearch(searchQuery)
      }, 1500)

      return () => {
         if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
      }
   }, [searchQuery])

   const handleSearch = async (keyword: string) => {}

   return (
      <div className='flex space-x-2'>
         <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
               placeholder='Search phone number...'
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className='pl-10'
            />
         </div>
      </div>
   )
}

export default SearchInput
