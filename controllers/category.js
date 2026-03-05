import Category from '../models/category.js';



//? Create category 

const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ status: false, message: "Name is required" })
        }
        const isCategoryPresent = await Category.findOne({ name });
        if (isCategoryPresent) {
            return res.status(400).json({ status: false, message: "Category already existing" })
        }
        const category = await Category.create({
            name,
            author: req?.userAuth?._id
        })
        return res.json({
            status: true,
            message: "Category created successfully",
            category
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error?.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const category = await Category.find({});
        return res.status(200).json({
            status: true,
            message: "Get all categories",
            category
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error" })
    }
}

const deletCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const deletCat = await Category.findByIdAndDelete(id);
        if (!deletCat) {
            return res.status(404).json({ status: false, message: "already deleted" })
        }
        return res.status(200).json({
            status: true,
            message: "Category deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const id = req.params.id;
        const author = req.userAuth.id

        const checkAuthor = await Category.findById(id);



        if (checkAuthor.author.toString() !== author.toString()) {
            return res.status(401).json({ status: false, message: "You are not author of this category" })
        }

        const updateCategory = await Category.findByIdAndUpdate(
            checkAuthor._id,
            { name: name },
            { new: true }
        )
        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updateCategory
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal Server error ${error?.message}` })
    }
}



export { createCategory, getAllCategories, deletCategory, updateCategory }