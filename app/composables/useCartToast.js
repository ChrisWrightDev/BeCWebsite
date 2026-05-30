const TOAST_GLOBAL_KEY = '__BEC_CART_TOAST__'

function createCartToast() {
  const message = ref('')
  const visible = ref(false)
  let timer = null

  function show(productName) {
    message.value = `${productName} added to cart`
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, 3500)
  }

  function dismiss() {
    visible.value = false
    if (timer) clearTimeout(timer)
  }

  return { message, visible, show, dismiss }
}

function getStub() {
  return {
    message: ref(''),
    visible: ref(false),
    show() {},
    dismiss() {},
  }
}

export function useCartToast() {
  if (import.meta.server) {
    return getStub()
  }
  if (typeof window !== 'undefined' && !window[TOAST_GLOBAL_KEY]) {
    window[TOAST_GLOBAL_KEY] = createCartToast()
  }
  return window[TOAST_GLOBAL_KEY] || getStub()
}
