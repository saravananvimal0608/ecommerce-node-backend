import subCategoryModel from "../model/subCategoryModel.js";

export const addSubCategory = async (req, res) => {
  try {
    const image = req.file?.path;
    const { name, category, product } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "name and category are required",
        error: true,
        success: false,
      });
    }

    const subCategory = new subCategoryModel({
      name,
      image,
      category,
      product,
    });

    const saveSubCategory = await subCategory.save();

    return res.status(200).json({
      message: "SubCategory created successfully",
      error: false,
      success: true,
      data: saveSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllSubCategory = async (req, res) => {
  try {
    const subCategories = await subCategoryModel
      .find()
      .populate("category")
      .populate("product");

    return res.status(200).json({
      message: "SubCategories fetched successfully",
      error: false,
      success: true,
      data: subCategories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, product } = req.body;
    const image = req.file?.path;

    const updated = await subCategoryModel.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(image && { image }),
        ...(category && { category }),
        ...(product && { product }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({
        message: "SubCategory not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "SubCategory updated successfully",
      error: false,
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await subCategoryModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(400).json({
        message: "SubCategory not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "SubCategory deleted successfully",
      error: false,
      success: true,
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
