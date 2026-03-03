import * as React from 'react'
import { Store } from '@tanstack/react-store'

export interface CartItem {
  readonly id: number
  readonly name: string
  readonly imageUrl: string
  readonly price: number
  readonly quantity: number
}

export interface CartStoreState {
  readonly items: ReadonlyArray<CartItem>
}

const CART_STORAGE_KEY = 'fortfel-cart-clothing-store'

const getInitialState = (): CartStoreState => {
  if (typeof window === 'undefined') return { items: [] }

  // clear cart if on checkout/success route to prevent cart flicker
  if (window.location.pathname.endsWith('/checkout/success')) {
    localStorage.removeItem(CART_STORAGE_KEY)
    return { items: [] }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as CartStoreState
      return { items: parsed.items }
    }
  } catch {
    console.error('Failed to parse cart data from localStorage')
  }

  return { items: [] }
}

const CartStoreContext = React.createContext<Store<CartStoreState> | null>(null)

const CartStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(() => {
    const cartStore = new Store<CartStoreState>(getInitialState())

    if (typeof window !== 'undefined') {
      cartStore.subscribe(() => {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartStore.state))
        } catch {
          // Ignore localStorage write failures (e.g. quota exceeded)
        }
      })
    }

    return cartStore
  })

  return <CartStoreContext.Provider value={store}>{children}</CartStoreContext.Provider>
}

export { CartStoreProvider, CartStoreContext }
