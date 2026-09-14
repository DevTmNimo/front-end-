import type { Conversation, Message } from '@/types/conversation'
import type { Product, ProductColumn, ShopPolicy, Transaction } from '@/types/shop'

export const mockConversations: Conversation[] = [
  {
    id: '1',
    customer_name: 'Amina K.',
    last_message_preview: 'Does this come in size medium?',
    last_message_at: '2026-09-14T09:12:00Z',
    unread: true,
  },
  {
    id: '2',
    customer_name: 'Yacine B.',
    last_message_preview: 'Thanks, order confirmed!',
    last_message_at: '2026-09-14T08:47:00Z',
    unread: false,
  },
  {
    id: '3',
    customer_name: 'Sara M.',
    last_message_preview: 'Can I get a refund on order #4471?',
    last_message_at: '2026-09-13T21:03:00Z',
    unread: true,
  },
]

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversation_id: '1',
      sender: 'customer',
      content: 'Hi! Does this come in size medium?',
      created_at: '2026-09-14T09:10:00Z',
    },
    {
      id: 'm2',
      conversation_id: '1',
      sender: 'bot',
      content:
        'Yes, this item is available in medium. Would you like me to check current stock for you?',
      created_at: '2026-09-14T09:11:00Z',
    },
    {
      id: 'm3',
      conversation_id: '1',
      sender: 'customer',
      content: 'Does this come in size medium?',
      created_at: '2026-09-14T09:12:00Z',
    },
  ],
  '2': [
    {
      id: 'm4',
      conversation_id: '2',
      sender: 'bot',
      content: 'Your order #4488 has been confirmed and will ship tomorrow.',
      created_at: '2026-09-14T08:46:00Z',
    },
    {
      id: 'm5',
      conversation_id: '2',
      sender: 'customer',
      content: 'Thanks, order confirmed!',
      created_at: '2026-09-14T08:47:00Z',
    },
  ],
  '3': [
    {
      id: 'm6',
      conversation_id: '3',
      sender: 'customer',
      content: 'Can I get a refund on order #4471?',
      created_at: '2026-09-13T21:03:00Z',
    },
  ],
}

export const mockColumns: ProductColumn[] = [
  {
    id: 'c_color',
    label: 'Color',
    type: 'multi_select',
    options: ['Beige', 'Black', 'Grey', 'Maroon'],
    position: 0,
  },
  {
    id: 'c_material',
    label: 'Material',
    type: 'text',
    position: 1,
  },
  {
    id: 'c_instock',
    label: 'In stock',
    type: 'boolean',
    position: 2,
  },
]

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Classic Tote Bag',
    price: 24.99,
    description: 'Canvas tote bag, holds up to 15kg.',
    image_emoji: '👜',
    images: [],
    values: {
      c_color: ['Beige', 'Black'],
      c_material: 'Canvas',
      c_instock: true,
    },
  },
  {
    id: 'p2',
    name: 'Wool Scarf',
    price: 18.5,
    description: 'Soft wool scarf, one size fits all.',
    image_emoji: '🧣',
    images: [],
    values: {
      c_color: ['Grey', 'Maroon'],
      c_instock: true,
    },
  },
  {
    id: 'p3',
    name: 'Leather Wallet',
    price: 32.0,
    description: 'Slim bifold wallet with 6 card slots.',
    image_emoji: '👛',
    images: [],
    values: {
      c_material: 'Genuine leather',
      c_instock: false,
    },
  },
]

export const mockPolicies: ShopPolicy[] = [
  {
    id: 'returns',
    title: 'Returns',
    content:
      'Items can be returned within 14 days of delivery if unused and in original packaging.',
  },
  {
    id: 'shipping',
    title: 'Shipping',
    content:
      'Orders ship within 2 business days. Delivery takes 3-5 days nationwide.',
  },
]

export const mockTransactions: Transaction[] = [
  { id: 't1', description: 'Credit top-up', amount: 50, date: '2026-09-01' },
  { id: 't2', description: 'Usage — Sep 1-7', amount: -6.4, date: '2026-09-08' },
  { id: 't3', description: 'Usage — Sep 8-14', amount: -5.1, date: '2026-09-14' },
]

export const mockCreditBalance = 38.5
