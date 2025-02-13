"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import ProductForm from "./productform";

export default function SingleSelect() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Track selected image file
  const [imageUrl, setImageUrl] = useState(""); // Track image URL if provided
  const [imageMethod, setImageMethod] = useState("file"); // Track whether the user is using URL or file input

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((json) => setCategories(json))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);
    fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [selectedCategory]);

  const handleUpdate = (item) => {
    setEditingItem(item);
    setImageFile(null); // Reset the image file when editing a new item
    setImageUrl(item.image); // Set the current image URL as default
    setImageMethod("file"); // Set default input method to file
    setOpenDialog(true); // Open the update dialog
  };

  const handleAddProduct = () => {
    setEditingItem(null); // Clear the editing state for new product
    setImageFile(null); // Reset the image file
    setImageUrl(""); // Reset the image URL
    setImageMethod("file"); // Default to file upload
    setOpenDialog(true); // Open the dialog to add a new product
  };

  const handleInputChange = (e, field) => {
    setEditingItem({ ...editingItem, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Save the selected image file
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value); // Save the image URL if user provides one
  };

  const handleSaveUpdate = () => {
    const updatedItem = {
      ...editingItem,
      image: imageMethod === "file" ? imageFile : imageUrl, // Use file if file method is selected, otherwise use URL
    };

    // If adding a new product, we should add the product to the data list
    if (editingItem?.id) {
      // Update the existing product
      setData(
        data.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } else {
      // Add the new product
      const newProduct = {
        ...updatedItem,
        id: data.length + 1, // New product ID (or any other logic to generate IDs)
      };
      setData([...data, newProduct]);
    }

    setOpenDialog(false); // Close the dialog
    setEditingItem(null); // Clear the editing state
    setImageFile(null); // Clear the selected image file
    setImageUrl(""); // Clear the image URL
  };

  const handleCancelUpdate = () => {
    setOpenDialog(false); // Close the dialog without saving changes
    setEditingItem(null); // Clear the editing state
    setImageFile(null); // Clear the selected image file
    setImageUrl(""); // Clear the image URL
  };

  const handleOpenDeleteDialog = (item) => {
    setDeleteItem(item);
    setOpenDialog(true); // Open the delete confirmation dialog
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setDeleteItem(null);
  };

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== deleteItem.id));
    handleCloseDeleteDialog();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ mb: 2 }}
      >
        Add Product
      </Button>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory}
          onChange={handleChange}
          input={<OutlinedInput label="Category" />}
        >
          {categories.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="mt-6 w-full max-w-2xl">
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.length > 0 ? (
              data.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-lg shadow-md mb-5"
                >
                  <div className="flex justify-between">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(item)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog(item)}
                    >
                      Delete
                    </Button>
                  </div>
                  <h3 className="font-semibold mt-3">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 mx-auto"
                  />
                  <Typography>{item.description}</Typography>
                </div>
              ))
            ) : (
              <p className="text-center">Select a category to see products</p>
            )}
          </Box>
        )}
      </div>

      {/* Add/Update Product Dialog */}
      <Dialog open={openDialog} onClose={handleCancelUpdate}>
        <DialogTitle>{editingItem ? "Update Product" : "Add Product"}</DialogTitle>
        <ProductForm
          product={editingItem || {}}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onImageUrlChange={handleImageUrlChange}
          imageMethod={imageMethod}
          setImageMethod={setImageMethod}
          onSave={handleSaveUpdate}
        />
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteItem} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          Are you sure you want to delete "<strong>{deleteItem?.title}</strong>"?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
