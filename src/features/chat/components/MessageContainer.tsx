import { ScrollArea } from '@/components/ui/scroll-area'
import useMessage from '../hooks/useMessage'
import MessageBubble from './MessageBubble'
import { ChatMessage } from '../types/Chat'
import { format, isToday, isYesterday } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'


interface MessageContainerProps {
   chatId: number | null
}

interface MessageGroup {
   senderId: number
   messages: ChatMessage[]
}

interface DateGroup {
   date: string
   messageGroups: MessageGroup[]
}

function MessageContainer({ chatId }: MessageContainerProps) {
   const { 
      messages,
      isLoading, 
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      currentUser
   } = useMessage(chatId)

   const scrollRef = useRef<HTMLDivElement>(null)
   const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
   const [isFirstLoad, setIsFirstLoad] = useState(true)
   const prevMessagesLengthRef = useRef(messages?.length || 0)

   // Handle initial load
   useEffect(() => {
      if (isLoading) {
         setIsFirstLoad(true)
      } else if (isFirstLoad && messages?.length) {
         setIsFirstLoad(false)
         scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
      }
   }, [isLoading, messages, isFirstLoad])

   // Handle new messages
   useEffect(() => {
      const messagesLength = messages?.length || 0
      
      if (scrollRef.current && messagesLength > prevMessagesLengthRef.current) {
         // If we're already near bottom or it's a new message, scroll to bottom
         const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
         const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

         if (shouldScrollToBottom || isNearBottom) {
            scrollRef.current.scrollTo({
               top: scrollRef.current.scrollHeight,
               behavior: 'smooth'
            })
         }
      }
      
      prevMessagesLengthRef.current = messagesLength
   }, [messages, shouldScrollToBottom])

   // Handle scroll events for pagination
   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      
      // If scrolled near top, load more messages
      if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
         const previousHeight = scrollHeight
         fetchNextPage().then(() => {
            // After loading more messages, maintain scroll position
            if (scrollRef.current) {
               const newHeight = scrollRef.current.scrollHeight
               scrollRef.current.scrollTop = newHeight - previousHeight + scrollTop
            }
         })
      }

      // Enable auto-scroll when scrolled to bottom
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 100
      setShouldScrollToBottom(isAtBottom)
   }

   if (isLoading && isFirstLoad) {
      return (
         <div className="flex items-center justify-center h-full">
            <span className="loading loading-dots loading-lg"></span>
         </div>
      )
   }

   if (error) {
      console.error('Error in MessageContainer:', error)
      return (
         <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error loading messages</p>
         </div>
      )
   }

   if (!chatId || !messages?.length) {
      return (
         <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet</p>
         </div>
      )
   }

   // Group messages by date and sender
   const groupedMessages = messages.reduce((groups: ChatMessage[][], message) => {
      const lastGroup = groups[groups.length - 1]
      
      if (!lastGroup) {
         return [[message]]
      }

      const lastMessage = lastGroup[lastGroup.length - 1]
      const timeDiff = new Date(message.createdAt).getTime() - new Date(lastMessage.createdAt).getTime()
      const sameUser = lastMessage.senderId === message.senderId
      
      // Group messages if they're from the same user and within 5 minutes
      if (sameUser && timeDiff < 5 * 60 * 1000) {
         lastGroup.push(message)
         return groups
      } else {
         return [...groups, [message]]
      }
   }, [])

   return (
      <div 
         ref={scrollRef}
         className="flex-1 overflow-y-auto px-4 py-4 h-full"
         onScroll={handleScroll}
      >
         {isFetchingNextPage && (
            <div className="flex justify-center py-2">
               <span className="loading loading-dots loading-md"></span>
            </div>
         )}
         
         {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
               {group.map((message, messageIndex) => (
                  <MessageBubble
                     key={message.messageId}
                     message={message}
                     isFirstInGroup={messageIndex === 0}
                     isLastInGroup={messageIndex === group.length - 1}
                     currentUser={currentUser}
                  />
               ))}
            </div>
         ))}
      </div>
   )
}

export default MessageContainer;
