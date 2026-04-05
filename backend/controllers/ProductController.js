const product = require('../models/Product.js');

// Controller untuk mengelola produk
exports.getAllProducts = async (req, res) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};

exports.addproduct = async (req, res) => {
    try {
        const { name, price, description, category, image, stock } = req.body;
        const newProduct = new product({ name, price, description, category, image, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body
, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.id); 
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const prod = await product.findById(req.params.id); 
        res.json(prod);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }

};

