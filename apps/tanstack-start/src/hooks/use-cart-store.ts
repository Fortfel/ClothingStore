import * as React from 'react'

import type { CartItem, CartStoreState } from '~/providers/cart-store-provider'
import { CartStoreContext } from '~/providers/cart-store-provider'

const useCartStore = () => {
  const store = React.useContext(CartStoreContext)
  if (!store) {
    throw new Error('useCartStore must be used within a CartStoreProvider')
  }

  return React.useMemo(
    () => ({
      store,
      addItem: (item: Omit<CartItem, 'quantity'>) =>
        store.setState((s) => {
          const existing = s.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              ...s,
              items: s.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { ...s, items: [...s.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (id: CartItem['id']) =>
        store.setState((s) => ({
          ...s,
          items: s.items.filter((i) => i.id !== id),
        })),
      incrementItem: (id: CartItem['id']) =>
        store.setState((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        })),
      decrementItem: (id: CartItem['id']) =>
        store.setState((s) => {
          const existing = s.items.find((i) => i.id === id)
          if (existing && existing.quantity <= 1) {
            return { ...s, items: s.items.filter((i) => i.id !== id) }
          }
          return {
            ...s,
            items: s.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)),
          }
        }),
      clearCart: () => store.setState((s) => ({ ...s, items: [] })),
    }),
    [store],
  )
}

const selectCartCount = (state: CartStoreState) => state.items.reduce((sum, item) => sum + item.quantity, 0)

const selectCartTotal = (state: CartStoreState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export { useCartStore, selectCartCount, selectCartTotal }
