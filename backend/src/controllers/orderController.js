const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new order
const createOrder = async (req, res) => {
    try {
        const { items } = req.body; // items: [{ productVariantId, quantity }]
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Calculate total and verify stock
        let total = 0;

        // Start transaction
        const order = await prisma.$transaction(async (prisma) => {
            // 1. Verify availability and calculate total
            for (const item of items) {
                const variant = await prisma.productVariant.findUnique({
                    where: { id: item.productVariantId },
                    include: { product: true },
                });

                if (!variant) {
                    throw new Error(`Product variant not found: ${item.productVariantId}`);
                }

                if (variant.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${variant.product.name} (Size: ${variant.size})`);
                }

                total += variant.product.price * item.quantity;
            }

            // 2. Create Order
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    total,
                    status: 'PENDING',
                },
            });

            // 3. Create OrderItems and Update Stock
            for (const item of items) {
                await prisma.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                    },
                });

                await prisma.productVariant.update({
                    where: { id: item.productVariantId },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        productVariant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createOrder, getUserOrders };
