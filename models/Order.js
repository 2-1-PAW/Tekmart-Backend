// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // orderId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Terhubung ke User.js
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Terhubung ke Product.js
      amount: { type: Number, required: true },
      price: { type: Number, required: true } // Bisa diambil dari skema Product
    }
  ],
  totalPrice: { type: Number, required: true }, // Jumlah total harga pesanan
  statusOrder: {
    type: String,
    enum: ['Pending', 'Diproses', 'Siap diambil', 'Selesai', 'Dibatalkan'],
    default: 'Pending'
  },
  uniqueCode: { type: String, required: true }, // Misal kode unik untuk verifikasi
  orderTimestamp: { type: Date, default: Date.now }
});

// Fungsi tambahan untuk menghitung total harga dan mengurangi stok
OrderSchema.pre('save', async function (next) {
  let total = 0;
  for (let item of this.items) {
    const product = await mongoose.model('Product').findById(item.productId);
    if (product.stock < item.amount) {
      const error = new Error(`Stock not enough for product: ${product.name}`);
      error.statusCode400 = 400;
      throw error;
    }
    product.stock -= item.amount; // Kurangi stok produk
    await product.save();
    item.price = product.price; // Ambil harga produk dari Product.js
    total += item.price * item.amount;
  }
  this.totalPrice = total;
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
