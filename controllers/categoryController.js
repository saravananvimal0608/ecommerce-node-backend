import categoryModel from "../model/categoryModel.js";

export const addCategory = async (req, res) => {
  try {
    const image = req.file?.path;

    const { name } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "all field required",
        success: false,
        error: true,
      });
    }

    const category = new categoryModel({
      name,
      image,
    });

    const saveCategory = await category.save();

    if (!saveCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category created successfully",
      error: false,
      success: true,
      data: saveCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {

    const {search} = req.query;

    const query = search ? {
      name: {
        $regex: search,
        $options: "i"
      }
    } : {}

    const categories = await categoryModel.find(query);

    if (categories.length === 0) {
      return res.status(400).json({
        message: "Categories not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Categories fetched successfully",
      error: false,
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    const image = req.file?.path;

    const updateCat = await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...(name, { name: name }),
        ...(image, { image: image }),
      },
      { returnDocument: "after" },
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleteCat = await categoryModel.findByIdAndDelete({
      _id: categoryId,
    });

    if (!deleteCat) {
      return res.status(400).json({
        message: "Category not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      error: false,
      success: true,
      data: deleteCat,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const allCategoryCount = async (req, res) => {
  try {
    const count = await categoryModel.countDocuments();

    return res.status(200).json({
      message: "Data fetched successfully",
      data: count,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
