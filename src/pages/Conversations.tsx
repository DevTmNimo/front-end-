import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { mockConversations, mockMessages } from '@/lib/mock-data'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Conversations() {
  const [selectedId, setSelectedId] = useState(mockConversations[0]?.id)

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedId
  )
  const messages = selectedId ? mockMessages[selectedId] ?? [] : []

  return (
    <div className="flex h-full bg-background text-foreground">
      <aside className="w-80 shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h1 className="text-sm font-semibold">Conversations</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                'w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border transition-colors hover:bg-accent',
                selectedId === conv.id && 'bg-accent'
              )}
            >
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {initials(conv.customer_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">
                    {conv.customer_name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(conv.last_message_at)}
                  </span>
                </div>
                <p
                  className={cn(
                    'text-xs truncate mt-0.5',
                    conv.unread
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {conv.last_message_preview}
                </p>
              </div>
              {conv.unread && (
                <span className="mt-1 size-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Message thread */}
      <main className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            <div className="px-6 py-3 border-b border-border flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {initials(selectedConversation.customer_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-semibold">
                  {selectedConversation.customer_name}
                </h2>
                <p className="text-xs text-muted-foreground">Read-only</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-md rounded-lg px-3 py-2 text-sm',
                    msg.sender === 'bot'
                      ? 'self-end bg-primary text-primary-foreground'
                      : 'self-start bg-secondary text-secondary-foreground'
                  )}
                >
                  <p>{msg.content}</p>
                  <p
                    className={cn(
                      'mt-1 text-[10px] opacity-70',
                      msg.sender === 'bot' ? 'text-right' : 'text-left'
                    )}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a conversation
          </div>
        )}
      </main>
    </div>
  )
}
