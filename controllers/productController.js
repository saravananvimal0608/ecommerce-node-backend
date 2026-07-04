import productModel from "../model/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.path);
    const {
      name,
      category,
      sub_category,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      product_type,
    } = req.body;

    if (
      !name ||
      !category[0] ||
      // !sub_category[0] ||
      !unit ||
      !price ||
      !description ||
      !images?.length ||
      !product_type
    ) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Check offer product limit
    if (product_type === "offer-product") {
      const offerProduct = await productModel.countDocuments({
        product_type: "offer-product",
      });

      if (offerProduct >= 3) {
        return res.status(400).json({
          message: "Only 3 offer products allowed",
          error: true,
          success: false,
        });
      }
    }

    const payload = {
      name,
      category,
      sub_category,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      images,
      product_type,
    };
    const product = new productModel(payload);
    const saveProduct = await product.save();
    return res.json({
      message: "Product Created Successfully",
      data: saveProduct,
      error: false,
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

export const getAllProduct = async (req, res) => {
  try {
    let { limit = 10, page = 1, search, minPrice, maxPrice } = req.query;

    const query = {};

    // Search
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const skip = (page - 1) * limit;

    const products = await productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate("category");

    const totalProducts = await productModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      error: false,
      data: products,
      totalProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id).populate("category");

    if (!product) {
      return res.status(400).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Product fetched successfully",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file?.path;
    const {
      name,
      category,
      sub_category,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const payload = {
      name: name || product.name,
      category: category || product.category,
      sub_category: sub_category || product.sub_category,
      unit: unit || product.unit,
      stock: stock || product.stock,
      price: price || product.price,
      discount: discount || product.discount,
      description: description || product.description,
      more_details: more_details || product.more_details,
      image: image || product.image,
    };

    const updateProduct = await productModel.findByIdAndUpdate(id, payload, {
      returnDocument: "after",
    });

    return res.status(200).json({
      message: "Product updated successfully",
      error: false,
      success: true,
      data: updateProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteProduct = await productModel.findByIdAndDelete({
      _id: id,
    });

    if (!deleteProduct) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 16, minPrice, maxPrice } = req.query;

    const query = {
      category: id,
    };

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const products = await productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category");

    const totalProducts = await productModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      error: false,
      totalProducts,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

// export const getProductByCategoryAndSubCategory  = async(request,response)=>{
//     try {
//         const { categoryId,subCategoryId,page,limit } = request.body

//         if(!categoryId || !subCategoryId){
//             return response.status(400).json({
//                 message : "Provide categoryId and subCategoryId",
//                 error : true,
//                 success : false
//             })
//         }

//         if(!page){
//             page = 1
//         }

//         if(!limit){
//             limit = 10
//         }

//         const query = {
//             category : { $in :categoryId  },
//             subCategory : { $in : subCategoryId }
//         }

//         const skip = (page - 1) * limit

//         const [data,dataCount] = await Promise.all([
//             ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
//             ProductModel.countDocuments(query)
//         ])

//         return response.json({
//             message : "Product list",
//             data : data,
//             totalCount : dataCount,
//             page : page,
//             limit : limit,
//             success : true,
//             error : false
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }

export const getAllOfferProduct = async (req, res) => {
  try {
    const products = await productModel.find({
      product_type: "offer-product",
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllTrendingProduct = async (req, res) => {
  try {
    const products = await productModel.find({
      product_type: "trending-product",
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllBestSellerProduct = async (req, res) => {
  try {
    const products = await productModel.find({
      product_type: "best-seller",
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAllTopProduct = async (req, res) => {
  try {
    const products = await productModel.find({
      product_type: "top-product",
    });

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    const relatedProducts = await productModel
      .find({
        _id: { $ne: id }, // current product exclude
        category: { $in: product.category },
        publish: true,
      })
      .limit(8);

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

export const rating = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;
  try {
    const { rating } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(400).json({
        message: "Invalid product",
        success: false,
        error: true,
      });
    }

    const alreadyRated = product.ratings.find(
      (item) => item.user === userId,
    );

    if (alreadyRated) {
      alreadyRated.rating = rating;
    } else {
      product.ratings.push({
        user: req.user._id,
        rating,
      });
    }

    const totalRating = product.ratings.reduce(
      (sum, item) => sum + item.rating,
      0,
    );

    product.rating = totalRating / product.ratings.length;

    await product.save();

    return res.status(200).json({
      message: "Rating added successfully",
      success: true,
      error: false,
      averageRating: product.rating,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      stack: error.stack,
    });
  }
};


export const allProductCount = async (req, res) => {
  try {
    const count = await productModel.countDocuments();

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