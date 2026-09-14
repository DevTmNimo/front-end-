export type ColumnType = 'text' | 'number' | 'select' | 'multi_select' | 'boolean'

export interface ProductColumn {
  id: string
  label: string
  type: ColumnType
  /** Only used when type is 'select' or 'multi_select'. */
  options?: string[]
  position: number
}

export type ColumnValue = string | number | boolean | string[] | undefined

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image_emoji: string
  images: string[]
  /** column id -> value, keyed against the shop's ProductColumn list */
  values: Record<string, ColumnValue>
}

export interface ShopPolicy {
  id: string
  title: string
  content: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
}
