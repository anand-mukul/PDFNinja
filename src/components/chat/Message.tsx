// Import necessary modules and components
import { cn } from '@/lib/utils'
import { ExtendedMessage } from '@/types/message'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { forwardRef } from 'react'

// Define the MessageProps interface specifying the expected properties
interface MessageProps {
  message: ExtendedMessage // Message object containing message details
  isNextMessageSamePerson: boolean // Boolean indicating if the next message is from the same person
}

// Define the Message component using forwardRef to access the DOM element reference
const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      // Container for the message, with dynamic classes based on the message sender
      <div
        ref={ref} // Reference to the DOM element
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage, // Align message to the right if sent by the user
        })}>
        {/* Avatar or icon representing the message sender */}
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center', // Styling for the avatar container
            {
              'order-2 bg-violet-600 rounded-sm': message.isUserMessage, // User's avatar styling
              'order-1 bg-zinc-800 rounded-sm': !message.isUserMessage, // Other person's avatar styling
              invisible: isNextMessageSamePerson, // Hide avatar if next message is from the same person
            }
          )}>
          {message.isUserMessage ? (
            // User's avatar icon
            <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
          ) : (
            // Other person's avatar icon
            <Icons.logo className='fill-zinc-300 h-3/4 w-3/4' />
          )}
        </div>

        {/* Message content container */}
        <div
          className={cn(
            'flex flex-col space-y-2 text-base max-w-md mx-2', // Styling for the message content container
            {
              'order-1 items-end': message.isUserMessage, // Align message content to the right if sent by the user
              'order-2 items-start': !message.isUserMessage, // Align message content to the left if sent by the other person
            }
          )}>
          {/* Actual message content */}
          <div
            className={cn(
              'px-4 py-2 rounded-lg inline-block', // Styling for the message bubble
              {
                'bg-violet-600 text-white': message.isUserMessage, // User's message bubble styling
                'bg-gray-200 text-gray-900': !message.isUserMessage, // Other person's message bubble styling
                'rounded-br-none': !isNextMessageSamePerson && message.isUserMessage, // Right-bottom corner radius for user's last message
                'rounded-bl-none': !isNextMessageSamePerson && !message.isUserMessage, // Left-bottom corner radius for other person's last message
              }
            )}>
            {/* Render message text using ReactMarkdown if message text is a string */}
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose', {
                  'text-zinc-50': message.isUserMessage, // Styling for user's message text
                })}>
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text // Render message text as it is if it's not a string (assumes it's a React component)
            )}
            {/* Render message timestamp if the message is not a loading message */}
            {message.id !== 'loading-message' ? (
              <div
                className={cn(
                  'text-xs select-none mt-2 w-full text-right', // Styling for the message timestamp
                  {
                    'text-zinc-500': !message.isUserMessage, // Styling for other person's message timestamp
                    'text-violet-300': message.isUserMessage, // Styling for user's message timestamp
                  }
                )}>
                {/* Format and display message timestamp */}
                {format(
                  new Date(message.createdAt),
                  'HH:mm'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

// Set display name for the Message component
Message.displayName = 'Message'

// Export the Message component as the default export
export default Message
