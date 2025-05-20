import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Obtener carrito del usuario
// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: '💥 Error al obtener carrito' });
  }
});

// @desc    Añadir producto al carrito
// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(item => item.product.equals(productId));

    if (itemIndex >= 0) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: '💥 Error al actualizar carrito' });
  }
});
router.get('/test', (req, res) => {
  res.json({ message: '✅ Ruta de prueba funciona' });
});
export default router;