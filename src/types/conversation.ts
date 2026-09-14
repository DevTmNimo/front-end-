export interface Conversation {
  id: string
  customer_name: string
  customer_avatar_url?: string | null
  last_message_preview: string
  last_message_at: string
  unread: boolean
}

export interface Message {
  id: string
  conversation_id: string
  sender: 'customer' | 'bot'
  content: string
  created_at: string
}
