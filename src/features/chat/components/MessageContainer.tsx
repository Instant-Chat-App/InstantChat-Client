import { ScrollArea } from '@/components/ui/scroll-area'
import useMessage from '../hooks/useMessage'
import MessageBubble from './MessageBubble'
import { ChatMessage } from '../types/Chat'
import { format, isToday, isYesterday } from 'date-fns'
import { useEffect, useRef } from 'react'

interface MessageContainerProps {
   chatId: number | null
}

interface MessageGroup {
   senderId: number
   messages: ChatMessage[]
}

function MessageContainer({ chatId }: MessageContainerProps) {
   const { messages, isLoading, error } = useMessage(chatId)
   const scrollRef = useRef<HTMLDivElement>(null)

   // Scroll to bottom when messages change or on load
   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollIntoView({ behavior: 'smooth' })
      }
   }, [messages])

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-full">
            <p>Loading messages...</p>
         </div>
      )
   }

   if (error) {
      return (
         <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
         </div>
      )
   }

   if (!chatId) {
      return (
         <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a chat to start messaging</p>
         </div>
      )
   }

   // Group messages by date and sender
   const groupedMessages = messages?.reduce((groups: { date: string; messageGroups: MessageGroup[] }[], message) => {
      const messageDate = new Date(message.createdAt)
      let dateStr: string

      if (isToday(messageDate)) {
         dateStr = 'Today'
      } else if (isYesterday(messageDate)) {
         dateStr = 'Yesterday'
      } else {
         dateStr = format(messageDate, 'MMMM d, yyyy')
      }

      // Find or create date group
      let dateGroup = groups.find(g => g.date === dateStr)
      if (!dateGroup) {
         dateGroup = { date: dateStr, messageGroups: [] }
         groups.push(dateGroup)
      }

      // Find or create message group within date group
      let messageGroup = dateGroup.messageGroups.find(g => g.senderId === message.sender.userId)
      if (!messageGroup) {
         messageGroup = { senderId: message.sender.userId, messages: [] }
         dateGroup.messageGroups.push(messageGroup)
      }

      // Add message to group if less than 2 minutes from last message
      const lastMessage = messageGroup.messages[messageGroup.messages.length - 1]
      if (!lastMessage || 
          new Date(message.createdAt).getTime() - new Date(lastMessage.createdAt).getTime() <= 120000) {
         messageGroup.messages.push(message)
      } else {
         // Create new group if more than 2 minutes gap
         dateGroup.messageGroups.push({
            senderId: message.sender.userId,
            messages: [message]
         })
      }

      return groups
   }, []) || []

   return (
      <ScrollArea className="h-[calc(100vh-8.5rem)]">
         <div className="flex flex-col p-4">
            {groupedMessages.length > 0 ? (
               groupedMessages.map((dateGroup) => (
                  <div key={dateGroup.date}>
                     <div className="flex justify-center my-4">
                        <span className="px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
                           {dateGroup.date}
                        </span>
                     </div>
                     {dateGroup.messageGroups.map((group, groupIndex) => (
                        <div key={`${group.senderId}-${groupIndex}`} className="mb-2">
                           {group.messages.map((message, messageIndex) => (
                              <MessageBubble
                                 key={message.messageId}
                                 message={message}
                                 isFirstInGroup={messageIndex === 0}
                                 isLastInGroup={messageIndex === group.messages.length - 1}
                              />
                           ))}
                        </div>
                     ))}
                  </div>
               ))
            ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No messages yet</p>
               </div>
            )}
            {/* Scroll anchor */}
            <div ref={scrollRef} />
         </div>
      </ScrollArea>
   )
}

export default MessageContainer;
