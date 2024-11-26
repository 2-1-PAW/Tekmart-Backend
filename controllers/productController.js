const Product = require('../models/Product');

/**
 * Mengambil produk dengan categori tertentu dari database dan mengembalikannya dalam format JSON, diurutkan dari A-Z.
 * @route POST
 * @param {String} req.body.name Nama produk
 * @param {String} req.body.description Deskripsi produk
 * @param {Number} req.body.price Harga produk
 * @param {Number} req.body.stock Stok produk
 * @param {String} req.body.imageUrl URl gambar produk
 * @param {String} req.body.category Kategori produk
 * @param {Object} res.json Status code, pesan, dan data
 * @returns {void} JSON yang berisi informasi produk yang baru ditambahkan
 */
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, imageUrl, category } = req.body;
        const newProduct = new Product({ name, description, price, stock, imageUrl, category });
        await newProduct
            .save()
            .then(() => {
                res.status(201).json({
                    statusCode: 201,
                    message: 'Product added successfully',
                    data: newProduct    
                })
            });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Failed to add new product',
            error: error.message
            });
    }
};

/**
 * Mengambil produk dengan categori tertentu dari database dan mengembalikannya dalam format JSON, diurutkan dari A-Z.
 * @route POST
 * @param {Object} req.body JSON berisi atribut yang ingin diubah nilainya
 * @param {Object} res.json Status code, pesan, dan data
 * @returns {void} JSON yang berisi informasi produk yang diubah
 */
exports.updateProduct = async (req, res) => {
    try {
        const _id = req.params.id;
        const updatedData = req.body;
        await Product.findByIdAndUpdate(_id, updatedData, { new: true })
            .exec()
            .then((updatedProduct) => {
                if (!updatedProduct) {
                    return res.status(404).json({
                        statusCode: 404,
                        message: `Product with id: ${_id} not found`
                    });
                }
                else {
                    res.status(200).json({
                        statusCode: 200,
                        message: `Product with id: ${_id} updated successfully`,
                        data: updatedProduct
                    });
                }
            })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Failed to update product',
            error: error.message
            });
    }
};

/**
 * Mengambil semua produk dari database dan mengembalikannya dalam format JSON, diurutkan dari A-Z.
 * @route GET
 * @param {Object} res.json Status code, pesan, dan data
 * @return {void} JSON berisi daftar produk
 */
exports.getAllProduct = async (req, res) => {
    try {
        await Product.find()
            .sort({ name: 1 })
            .exec()
            .then((products) => {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Success get all products',
                    data: products
                })
            })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Failed to get all products',
            error: error.message
            });
    }
}

/**
 * Mengambil produk dengan id tertentu dari database dan mengembalikannya dalam format JSON
 * @route GET
 * @param {Object} req.params Id produk
 * @param {Object} res.json Status code, pesan, dan data
 * @returns {void} JSON berisi informasi produk yang dicari
 */
exports.getProductById = async (req, res) => {
    try {
        const _id = req.params.id
        await Product.findById(_id)
            .exec()
            .then((product) => {
                if (!product) {
                    res.status(404).json({
                        statusCode: 404,
                        message: `Product with id ${_id} not found`,
                        data: []
                    })
                }
                else{
                    res.status(200).json({
                        statusCode: 200,
                        message: `Success get product with id ${_id}`,
                        data: product
                    })
                }
            })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: `Failed to get product with id ${_id}`,
            error: error.message
            });
    }
}

/**
 * Mengambil produk dengan categori tertentu dari database dan mengembalikannya dalam format JSON, diurutkan dari A-Z.
 * @route GET
 * @param {Object} req.params Kategori produk
 * @param {Object} res.json Status code, pesan, dan data
 * @returns {void} JSON berisi produk-produk yang dicari
 */
exports.getProductByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        // find products by category and sort by name
        const products = await Product.find({ category }).sort({ name: 1 }).exec();

        // Check if there are no products
        if (products.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: `No products found for category ${category}`,
                data: []
            });
        }

        // if products found
        res.status(200).json({
            statusCode: 200,
            message: `Success get product with category ${category}`,
            data: products
        });
    } catch (error) {
        // Handle error
        res.status(500).json({
            statusCode: 500,
            message: `Failed to get product with category ${category}`,
            error: error.message
        });
    }
};
