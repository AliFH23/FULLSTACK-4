import { createCategory } from "../models/categories.Model.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "please enter name" });
    }

    const newCategory = await createCategory({ name, description, status });
    return res
      .status(201)
      .json({ message: "category added successfully", category: newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};