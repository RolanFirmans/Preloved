const CART_KEY = 'prelovedCart';

export const getCart = () => {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(savedCart)
      ? savedCart.filter(item =>
          Number.isInteger(Number(item.id_produk)) &&
          Number(item.id_produk) > 0 &&
          Number.isInteger(Number(item.qty)) &&
          Number(item.qty) > 0
        ).map(item => ({ id_produk: Number(item.id_produk), qty: Number(item.qty) }))
      : [];
  } catch (error) {
    console.error('Gagal membaca keranjang:', error);
    return [];
  }
};

export const saveCart = items => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find(item => item.id_produk === Number(product.id));
  const currentQuantity = existing?.qty || 0;
  const stock = Number(product.stock);

  if (!Number.isInteger(stock) || stock < 1) {
    return { success: false, message: 'Stok produk sedang habis' };
  }
  if (currentQuantity + quantity > stock) {
    return { success: false, message: `Maksimal stok produk ini ${stock} pcs` };
  }

  if (existing) existing.qty += quantity;
  else cart.push({ id_produk: Number(product.id), qty: quantity });
  saveCart(cart);
  return { success: true };
};

export const getCartCount = () => getCart().reduce((sum, item) => sum + item.qty, 0);
