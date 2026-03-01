const CART_KEY = 'bec-cart'

function loadFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (e) {
    console.warn('[cart] load failed', e)
  }
  return []
}

function saveToStorage(items) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('[cart] save failed', e)
  }
}

const CART_GLOBAL_KEY = '__BEC_CART__'

function createCart() {
  const items = ref(loadFromStorage())

  function setItems(next) {
    items.value = next
    saveToStorage(next)
  }

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + (i.quantity || 0), 0)
  )
  const totalCents = computed(() =>
    items.value.reduce(
      (sum, i) => sum + (i.price_cents || 0) * (i.quantity || 0),
      0
    )
  )
  const isEmpty = computed(() => items.value.length === 0)

  return {
    items,
    itemCount,
    totalCents,
    isEmpty,
    addItem(product, quantity = 1) {
      const id = product.id
      const q = Math.max(1, Number(quantity) || 1)
      const current = items.value.slice()
      const idx = current.findIndex((i) => String(i.id) === String(id))
      if (idx >= 0) {
        current[idx] = {
          ...current[idx],
          quantity: (current[idx].quantity || 0) + q
        }
      } else {
        current.push({
          id,
          name: product.name,
          price_cents: product.price_cents,
          quantity: q,
          image_url: product.image_url || null
        })
      }
      setItems(current)
    },
    updateQuantity(productId, quantity) {
      const num = Math.max(0, Number(quantity) || 0)
      if (num === 0) {
        setItems(items.value.filter((i) => String(i.id) !== String(productId)))
        return
      }
      const current = items.value.slice()
      const idx = current.findIndex((i) => String(i.id) === String(productId))
      if (idx >= 0) {
        current[idx] = { ...current[idx], quantity: num }
        setItems(current)
      }
    },
    removeItem(productId) {
      setItems(items.value.filter((i) => String(i.id) !== String(productId)))
    },
    clearCart() {
      setItems([])
    }
  }
}

function getStub() {
  const items = ref([])
  return {
    items,
    itemCount: computed(() => 0),
    totalCents: computed(() => 0),
    isEmpty: computed(() => true),
    addItem() {},
    updateQuantity() {},
    removeItem() {},
    clearCart() {}
  }
}

export function useCart() {
  if (import.meta.server) {
    return getStub()
  }
  if (typeof window !== 'undefined' && !window[CART_GLOBAL_KEY]) {
    window[CART_GLOBAL_KEY] = createCart()
  }
  return window[CART_GLOBAL_KEY] || getStub()
}
