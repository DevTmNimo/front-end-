import { useState } from 'react'
import type { FormEvent } from 'react'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { mockCreditBalance, mockTransactions } from '@/lib/mock-data'
import type { Transaction } from '@/types/shop'

function AddFundsDialog({
  onAdd,
}: {
  onAdd: (amount: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('25')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (value > 0) {
      onAdd(value)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add funds</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add funds</DialogTitle>
          <DialogDescription>
            Top up your credit balance. This mock doesn't process real
            payments yet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add ${amount || 0}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.amount > 0
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div>
        <p className="text-sm">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{transaction.date}</p>
      </div>
      <span
        className={
          isCredit
            ? 'text-sm font-medium text-emerald-600 dark:text-emerald-400'
            : 'text-sm font-medium text-muted-foreground'
        }
      >
        {isCredit ? '+' : ''}
        {transaction.amount.toFixed(2)}
      </span>
    </div>
  )
}

export default function Billing() {
  const [balance, setBalance] = useState(mockCreditBalance)
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions)

  function addFunds(amount: number) {
    setBalance((b) => b + amount)
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        description: 'Credit top-up',
        amount,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="h-14 shrink-0 flex items-center px-6 border-b border-border">
        <h1 className="text-sm font-semibold">Billing</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 max-w-xl">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Wallet className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Credit balance</p>
              <p className="text-2xl font-brand font-medium">
                ${balance.toFixed(2)}
              </p>
            </div>
            <AddFundsDialog onAdd={addFunds} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage & transactions</CardTitle>
            <CardDescription>
              Deposits and message-handling usage are deducted from your
              balance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No transactions yet.
              </p>
            ) : (
              <div className="flex flex-col">
                {transactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
