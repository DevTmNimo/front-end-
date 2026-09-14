import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useClickOutside } from '@/hooks/use-click-outside'
import { cn } from '@/lib/utils'
import { mockProducts, mockColumns, mockPolicies } from '@/lib/mock-data'
import type {
  ColumnType,
  ColumnValue,
  Product,
  ProductColumn,
  ShopPolicy,
} from '@/types/shop'

const EMPTY_PRODUCT_BASE = {
  name: '',
  price: '',
  description: '',
  image_emoji: '📦',
  images: [] as string[],
}

function emptyValues(columns: ProductColumn[]): Record<string, ColumnValue> {
  return Object.fromEntries(
    columns.map((c) => [c.id, c.type === 'multi_select' ? [] : c.type === 'boolean' ? false : ''])
  )
}

// ---------- Images (multi) field, used in the product form ----------

function ImagesField({
  images,
  onChange,
}: {
  images: string[]
  onChange: (images: string[]) => void
}) {
  const [urlInput, setUrlInput] = useState('')

  function addImage() {
    const trimmed = urlInput.trim()
    if (trimmed) onChange([...images, trimmed])
    setUrlInput('')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Images</Label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary"
            >
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste an image URL"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addImage()
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addImage}>
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload support is coming soon — paste image URLs for now.
      </p>
    </div>
  )
}

// ---------- Stacked field for a custom column, used inside the product form ----------

function ColumnValueField({
  column,
  value,
  onChange,
}: {
  column: ProductColumn
  value: ColumnValue
  onChange: (value: ColumnValue) => void
}) {
  if (column.type === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <Label>{column.label}</Label>
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    )
  }

  if (column.type === 'select' || column.type === 'multi_select') {
    const selected: string[] =
      column.type === 'multi_select'
        ? Array.isArray(value)
          ? value
          : []
        : value
          ? [value as string]
          : []

    function toggle(opt: string) {
      if (column.type === 'select') {
        onChange(selected.includes(opt) ? '' : opt)
      } else {
        onChange(
          selected.includes(opt)
            ? selected.filter((v) => v !== opt)
            : [...selected, opt]
        )
      }
    }

    return (
      <div className="flex flex-col gap-1.5">
        <Label>{column.label}</Label>
        <div className="flex flex-wrap gap-1.5">
          {(column.options ?? []).length === 0 && (
            <p className="text-xs text-muted-foreground">No options defined for this column yet.</p>
          )}
          {(column.options ?? []).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-colors',
                selected.includes(opt)
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`col-${column.id}`}>{column.label}</Label>
      <Input
        id={`col-${column.id}`}
        type={column.type === 'number' ? 'number' : 'text'}
        value={(value as string | number | undefined) ?? ''}
        onChange={(e) =>
          onChange(column.type === 'number' ? Number(e.target.value) : e.target.value)
        }
      />
    </div>
  )
}

// ---------- Inline, click-to-edit cell used in the product table ----------

function EditableCell({
  column,
  value,
  onChange,
}: {
  column: ProductColumn
  value: ColumnValue
  onChange: (value: ColumnValue) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(String(value ?? ''))
  const cellRef = useRef<HTMLDivElement>(null)

  function commitText() {
    onChange(column.type === 'number' ? Number(draft) || 0 : draft)
  }

  useClickOutside(
    [cellRef],
    () => {
      if (column.type === 'text' || column.type === 'number') commitText()
      setOpen(false)
    },
    open
  )

  if (column.type === 'boolean') {
    return (
      <div className="flex items-center px-2">
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    )
  }

  if (column.type === 'select' || column.type === 'multi_select') {
    const selected: string[] =
      column.type === 'multi_select'
        ? Array.isArray(value)
          ? value
          : []
        : value
          ? [value as string]
          : []

    function toggle(opt: string) {
      if (column.type === 'select') {
        onChange(selected.includes(opt) ? '' : opt)
        setOpen(false)
      } else {
        onChange(
          selected.includes(opt)
            ? selected.filter((v) => v !== opt)
            : [...selected, opt]
        )
      }
    }

    return (
      <div ref={cellRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-8 w-full flex-wrap items-center gap-1 rounded-md px-2 py-1 text-left hover:bg-accent"
        >
          {selected.length === 0 ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : (
            selected.map((opt) => (
              <Badge key={opt} variant="secondary" className="text-[11px]">
                {opt}
              </Badge>
            ))
          )}
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-48 rounded-md border border-border bg-card p-1.5 shadow-lg">
            {(column.options ?? []).length === 0 ? (
              <p className="px-2 py-1 text-xs text-muted-foreground">No options defined</p>
            ) : (
              column.options!.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={cn(
                    'flex w-full items-center justify-between rounded px-2 py-1.5 text-xs hover:bg-accent',
                    selected.includes(opt) && 'text-primary font-medium'
                  )}
                >
                  {opt}
                  {selected.includes(opt) && <Check className="size-3.5" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  if (open) {
    return (
      <div ref={cellRef}>
        <Input
          autoFocus
          type={column.type === 'number' ? 'number' : 'text'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commitText()
              setOpen(false)
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          className="h-8"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(String(value ?? ''))
        setOpen(true)
      }}
      className="flex min-h-8 w-full items-center rounded-md px-2 py-1 text-left text-sm hover:bg-accent"
    >
      {value === undefined || value === '' ? (
        <span className="text-xs text-muted-foreground">—</span>
      ) : (
        String(value)
      )}
    </button>
  )
}

// ---------- Product add/edit form ----------

function ProductForm({
  initial,
  columns,
  onSubmit,
  submitLabel,
}: {
  initial?: Product
  columns: ProductColumn[]
  onSubmit: (values: Omit<Product, 'id'>) => void
  submitLabel: string
}) {
  const [values, setValues] = useState(
    initial
      ? {
          name: initial.name,
          price: String(initial.price),
          description: initial.description,
          image_emoji: initial.image_emoji,
          images: initial.images,
        }
      : EMPTY_PRODUCT_BASE
  )
  const [colValues, setColValues] = useState<Record<string, ColumnValue>>(
    initial ? { ...emptyValues(columns), ...initial.values } : emptyValues(columns)
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name: values.name,
      price: Number(values.price) || 0,
      description: values.description,
      image_emoji: values.image_emoji || '📦',
      images: values.images,
      values: colValues,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 w-20">
          <Label htmlFor="emoji">Icon</Label>
          <Input
            id="emoji"
            value={values.image_emoji}
            onChange={(e) =>
              setValues((v) => ({ ...v, image_emoji: e.target.value }))
            }
            className="text-center text-lg"
            maxLength={2}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Price (USD)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          required
          value={values.price}
          onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
        />
      </div>
      <ImagesField
        images={values.images}
        onChange={(images) => setValues((v) => ({ ...v, images }))}
      />
      {columns.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          {columns.map((col) => (
            <ColumnValueField
              key={col.id}
              column={col}
              value={colValues[col.id]}
              onChange={(val) => setColValues((v) => ({ ...v, [col.id]: val }))}
            />
          ))}
        </div>
      )}
      <DialogFooter>
        <Button type="submit">{submitLabel}</Button>
      </DialogFooter>
    </form>
  )
}

// ---------- Add / edit a custom column ----------

const EMPTY_COLUMN_DRAFT = { label: '', type: 'text' as ColumnType, options: [] as string[] }

function ColumnDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  onDelete,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: ProductColumn
  onSubmit: (values: { label: string; type: ColumnType; options: string[] }) => void
  onDelete?: () => void
}) {
  const [draft, setDraft] = useState(EMPTY_COLUMN_DRAFT)
  const [optionInput, setOptionInput] = useState('')

  useEffect(() => {
    if (open) {
      setDraft(
        initial
          ? { label: initial.label, type: initial.type, options: initial.options ?? [] }
          : EMPTY_COLUMN_DRAFT
      )
      setOptionInput('')
    }
  }, [open, initial])

  function addOption() {
    const trimmed = optionInput.trim()
    if (trimmed && !draft.options.includes(trimmed)) {
      setDraft((d) => ({ ...d, options: [...d.options, trimmed] }))
    }
    setOptionInput('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.label.trim()) return
    onSubmit({ label: draft.label.trim(), type: draft.type, options: draft.options })
  }

  const needsOptions = draft.type === 'select' || draft.type === 'multi_select'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit column' : 'Add column'}</DialogTitle>
          <DialogDescription>
            Custom columns apply to every product, so the bot can answer detailed questions
            consistently.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="col-label">Column name</Label>
            <Input
              id="col-label"
              required
              placeholder="e.g. Size, Warranty"
              value={draft.label}
              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="col-type">Type</Label>
            <select
              id="col-type"
              value={draft.type}
              onChange={(e) =>
                setDraft((d) => ({ ...d, type: e.target.value as ColumnType }))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Single choice</option>
              <option value="multi_select">Multiple choice</option>
              <option value="boolean">Yes / No</option>
            </select>
          </div>
          {needsOptions && (
            <div className="flex flex-col gap-1.5">
              <Label>Options</Label>
              {draft.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {draft.options.map((opt) => (
                    <Badge key={opt} variant="secondary" className="gap-1 pr-1">
                      {opt}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            options: d.options.filter((o) => o !== opt),
                          }))
                        }
                        className="rounded-full hover:bg-black/10"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  placeholder="Add an option and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addOption}>
                  Add
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className={onDelete ? 'justify-between' : undefined}>
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete column
              </Button>
            )}
            <Button type="submit">{initial ? 'Save changes' : 'Add column'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------- Page ----------

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [columns, setColumns] = useState<ProductColumn[]>(mockColumns)
  const [policies, setPolicies] = useState<ShopPolicy[]>(mockPolicies)

  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [columnDialogOpen, setColumnDialogOpen] = useState(false)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)

  const editingProduct = products.find((p) => p.id === editingId)
  const editingColumn = columns.find((c) => c.id === editingColumnId)

  function addProduct(values: Omit<Product, 'id'>) {
    setProducts((prev) => [...prev, { ...values, id: crypto.randomUUID() }])
    setAddOpen(false)
  }

  function updateProduct(values: Omit<Product, 'id'>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, ...values } : p))
    )
    setEditingId(null)
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  function setCellValue(productId: string, columnId: string, value: ColumnValue) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, values: { ...p.values, [columnId]: value } } : p
      )
    )
  }

  function saveColumn(values: { label: string; type: ColumnType; options: string[] }) {
    if (editingColumnId) {
      setColumns((prev) =>
        prev.map((c) => (c.id === editingColumnId ? { ...c, ...values } : c))
      )
    } else {
      const newColumn: ProductColumn = {
        id: crypto.randomUUID(),
        position: columns.length,
        ...values,
      }
      setColumns((prev) => [...prev, newColumn])
    }
    setColumnDialogOpen(false)
    setEditingColumnId(null)
  }

  function deleteColumn(id: string) {
    setColumns((prev) => prev.filter((c) => c.id !== id))
    setProducts((prev) =>
      prev.map((p) => {
        const nextValues = { ...p.values }
        delete nextValues[id]
        return { ...p, values: nextValues }
      })
    )
    setColumnDialogOpen(false)
    setEditingColumnId(null)
  }

  function updatePolicy(id: string, content: string) {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, content } : p))
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border">
        <h1 className="text-sm font-semibold">Products</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a product</DialogTitle>
              <DialogDescription>
                The bot uses this to answer customer questions.
              </DialogDescription>
            </DialogHeader>
            <ProductForm columns={columns} onSubmit={addProduct} submitLabel="Add product" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-6 flex flex-col gap-8">
        {/* Catalog */}
        <section className="flex flex-col gap-3">
          {products.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg py-10 flex flex-col items-center gap-1 text-center max-w-3xl">
              <p className="text-sm font-medium">No products yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first product so the bot can answer questions about it.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-max border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="w-14 px-3 py-2" />
                    <th className="min-w-48 px-3 py-2 text-left font-medium">Name</th>
                    <th className="w-24 px-3 py-2 text-left font-medium">Price</th>
                    {columns.map((col) => (
                      <th key={col.id} className="min-w-36 px-3 py-2 text-left font-medium">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingColumnId(col.id)
                            setColumnDialogOpen(true)
                          }}
                          className="flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-accent"
                        >
                          <span className="truncate">{col.label}</span>
                          <Pencil className="size-3 text-muted-foreground" />
                        </button>
                      </th>
                    ))}
                    <th className="w-10 px-2 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingColumnId(null)
                          setColumnDialogOpen(true)
                        }}
                        title="Add column"
                        className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Plus className="size-4" />
                      </button>
                    </th>
                    <th className="w-20 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-0 hover:bg-accent/20"
                    >
                      <td className="px-3 py-2">
                        <div className="size-9 shrink-0 overflow-hidden rounded-md bg-secondary flex items-center justify-center text-base">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            product.image_emoji
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium truncate max-w-56">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-56">
                            {product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </td>
                      {columns.map((col) => (
                        <td key={col.id} className="px-1 py-1 align-middle">
                          <EditableCell
                            column={col}
                            value={product.values[col.id]}
                            onChange={(val) => setCellValue(product.id, col.id, val)}
                          />
                        </td>
                      ))}
                      <td />
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingId(product.id)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Policies */}
        <section className="flex flex-col gap-3 max-w-3xl">
          <div>
            <h2 className="text-sm font-semibold">Shop policies</h2>
            <p className="text-sm text-muted-foreground">
              The bot references these when customers ask about returns,
              shipping, and more.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={3}
                    value={policy.content}
                    onChange={(e) => updatePolicy(policy.id, e.target.value)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Edit product dialog */}
      <Dialog
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initial={editingProduct}
              columns={columns}
              onSubmit={updateProduct}
              submitLabel="Save changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add / edit column dialog */}
      <ColumnDialog
        open={columnDialogOpen}
        onOpenChange={(open) => {
          setColumnDialogOpen(open)
          if (!open) setEditingColumnId(null)
        }}
        initial={editingColumn}
        onSubmit={saveColumn}
        onDelete={editingColumn ? () => deleteColumn(editingColumn.id) : undefined}
      />
    </div>
  )
}
