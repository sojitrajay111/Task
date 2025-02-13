import React from "react";
import { TextField, Button, Box } from "@mui/material";

const ProductForm = ({
  product,
  onInputChange,
  onImageUrlChange,
  onSave,
}) => {
  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        label="Title"
        value={product.title || ""}
        onChange={(e) => onInputChange(e, "title")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        value={product.price || ""}
        onChange={(e) => onInputChange(e, "price")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={product.description || ""}
        onChange={(e) => onInputChange(e, "description")}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      {/* Image URL Input */}
      <TextField
        label="Image URL"
        value={product.imageUrl || ""}
        onChange={onImageUrlChange}
        fullWidth
        margin="normal"
      />

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
