const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all products with optional filters (brand, size)
const getProducts = async (req, res) => {
    try {
        const { brand, size } = req.query;
        let whereClause = {};

        if (brand) {
            whereClause.brand = {
                contains: brand,
                mode: 'insensitive',
            };
        }

        if (size) {
            whereClause.variants = {
                some: {
                    size: parseInt(size),
                },
            };
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                variants: true,
            },
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST Create new product (Admin)
const createProduct = async (req, res) => {
    try {
        const { name, brand, description, price, baseImage, variants } = req.body;

        // variants should be an array of objects: { size, color, stockQuantity }

        const product = await prisma.product.create({
            data: {
                name,
                brand,
                description,
                price: parseFloat(price),
                baseImage,
                variants: {
                    create: variants.map((variant) => ({
                        size: parseInt(variant.size),
                        color: variant.color,
                        stockQuantity: parseInt(variant.stockQuantity),
                    })),
                },
            },
            include: {
                variants: true,
            },
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct };
