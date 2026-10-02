const CART_KEY = 'bec-cart'

function normalizeCartType(value) {
  return value === 'bonded_pair' ? 'bonded_pair' : 'single'
}

function cartItemKey(item) {
  return `${normalizeCartType(item?.type)}:${String(item?.id)}`
}

function normalizeStoredItems(items) {
  return items.map((item) => {
    const type = normalizeCartType(item?.type)
    return {
      ...item,
      type,
      quantity: type === 'bonded_pair' ? 1 : item.quantity,
    }
  })
}

function loadFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? normalizeStoredItems(parsed) : []
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
      const type = normalizeCartType(product.type || product.itemType)
      const q = type === 'bonded_pair' ? 1 : Math.max(1, Number(quantity) || 1)
      const current = items.value.slice()
      const idx = current.findIndex((i) => cartItemKey(i) === cartItemKey({ id, type }))
      if (idx >= 0) {
        current[idx] = {
          ...current[idx],
          type,
          quantity: type === 'bonded_pair' ? 1 : (current[idx].quantity || 0) + q,
          name: product.name || current[idx].name,
          price_cents: product.price_cents,
          image_url: product.image_url || product.video_poster_url || current[idx].image_url || null,
        }
      } else {
        current.push({
          id,
          type,
          name: product.name,
          price_cents: product.price_cents,
          quantity: q,
          image_url: product.image_url || product.video_poster_url || null
        })
      }
      setItems(current)
    },
    updateQuantity(productId, quantity, type) {
      const itemType = normalizeCartType(type)
      const num = Math.max(0, Number(quantity) || 0)
      if (num === 0) {
        setItems(items.value.filter((i) => cartItemKey(i) !== cartItemKey({ id: productId, type: itemType })))
        return
      }
      const current = items.value.slice()
      const idx = current.findIndex((i) => cartItemKey(i) === cartItemKey({ id: productId, type: itemType }))
      if (idx >= 0) {
        current[idx] = {
          ...current[idx],
          quantity: current[idx].type === 'bonded_pair' ? 1 : num,
        }
        setItems(current)
      }
    },
    removeItem(productId, type) {
      const itemType = normalizeCartType(type)
      setItems(items.value.filter((i) => cartItemKey(i) !== cartItemKey({ id: productId, type: itemType })))
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
