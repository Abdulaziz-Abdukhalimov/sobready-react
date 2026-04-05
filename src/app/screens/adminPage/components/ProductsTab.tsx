import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminService from "../../../services/AdminService";
import ProductService from "../../../services/ProductService";
import { Product } from "../../../../lib/types/product";
import { serverApi } from "../../../../lib/config";
import Swal from "sweetalert2";

const PRODUCT_TYPES = ["EAU_DE_PARFUM", "EAU_DE_TOILETTE", "PARFUM", "BODY_SPRAY"];
const FRAGRANCES = ["FLORAL", "WOODY", "CITRUS", "ORIENTAL", "AROMATIC", "FRESH"];
const GENDERS = ["MEN", "WOMEN", "UNISEX"];
const VOLUMES = ["THIRTY", "FIFTY", "HUNDRED"];

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
    productPrice: "",
    productStock: "",
    productType: "EAU_DE_PARFUM",
    productFragrance: "FLORAL",
    productGender: "UNISEX",
    productVolume: "FIFTY",
    productDesc: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchProducts = () => {
    const productService = new ProductService();
    productService
      .getProducts({ order: "createdAt", page: 1, limit: 100 })
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      productBrand: "",
      productPrice: "",
      productStock: "",
      productType: "EAU_DE_PARFUM",
      productFragrance: "FLORAL",
      productGender: "UNISEX",
      productVolume: "FIFTY",
      productDesc: "",
    });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productBrand: product.productBrand,
      productPrice: String(product.productPrice),
      productStock: String(product.productStock),
      productType: product.productType,
      productFragrance: product.productFragrance,
      productGender: product.productGender,
      productVolume: product.productVolume?.toString() || "FIFTY",
      productDesc: product.productDesc || "",
    });
    setImageFiles([]);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const admin = new AdminService();
    const fd = new FormData();

    fd.append("productName", formData.productName);
    fd.append("productBrand", formData.productBrand);
    fd.append("productPrice", formData.productPrice);
    fd.append("productStock", formData.productStock);
    fd.append("productType", formData.productType);
    fd.append("productFragrance", formData.productFragrance);
    fd.append("productGender", formData.productGender);
    fd.append("productVolume", formData.productVolume);
    fd.append("productDesc", formData.productDesc);

    imageFiles.forEach((file) => fd.append("productImages", file));

    try {
      if (editingProduct) {
        fd.append("productId", String(editingProduct._id));
        await admin.updateProduct(fd);
        await Swal.fire({ icon: "success", title: "Product updated!", timer: 1200, showConfirmButton: false });
      } else {
        await admin.createProduct(fd);
        await Swal.fire({ icon: "success", title: "Product created!", timer: 1200, showConfirmButton: false });
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.log(err);
      Swal.fire({ icon: "error", title: "Failed", text: "Something went wrong" });
    }
  };

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: "Delete this product?",
      text: "It will be set to inactive",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        const admin = new AdminService();
        await admin.deleteProduct(productId);
        await Swal.fire({ icon: "success", title: "Deleted!", timer: 1000, showConfirmButton: false });
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#122717" }}>
          Products ({products.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            bgcolor: "#304835",
            "&:hover": { bgcolor: "#1e3022" },
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Add Product
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Brand</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} hover>
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={product.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : ""}
                    sx={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productBrand}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>${product.productPrice}</TableCell>
                <TableCell>
                  <Chip
                    label={product.productStock}
                    size="small"
                    sx={{
                      bgcolor: product.productStock > 10 ? "#e8f5e9" : "#ffebee",
                      color: product.productStock > 10 ? "#2e7d32" : "#c62828",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={product.productType} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.productStatus}
                    size="small"
                    sx={{
                      bgcolor: product.productStatus === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                      color: product.productStatus === "ACTIVE" ? "#2e7d32" : "#c62828",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenEdit(product)} sx={{ color: "#1565c0" }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(String(product._id))} sx={{ color: "#c62828" }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingProduct ? "Edit Product" : "Create Product"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Product Name"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Brand"
              value={formData.productBrand}
              onChange={(e) => setFormData({ ...formData, productBrand: e.target.value })}
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Price"
                type="number"
                value={formData.productPrice}
                onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.productStock}
                onChange={(e) => setFormData({ ...formData, productStock: e.target.value })}
                fullWidth
                size="small"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Type"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                fullWidth
                size="small"
              >
                {PRODUCT_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t.replace(/_/g, " ")}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Fragrance"
                value={formData.productFragrance}
                onChange={(e) => setFormData({ ...formData, productFragrance: e.target.value })}
                fullWidth
                size="small"
              >
                {FRAGRANCES.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Gender"
                value={formData.productGender}
                onChange={(e) => setFormData({ ...formData, productGender: e.target.value })}
                fullWidth
                size="small"
              >
                {GENDERS.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Volume"
                value={formData.productVolume}
                onChange={(e) => setFormData({ ...formData, productVolume: e.target.value })}
                fullWidth
                size="small"
              >
                {VOLUMES.map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Description"
              value={formData.productDesc}
              onChange={(e) => setFormData({ ...formData, productDesc: e.target.value })}
              fullWidth
              multiline
              rows={3}
              size="small"
            />
            <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
              {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : "Upload Images"}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: "#304835", "&:hover": { bgcolor: "#1e3022" }, textTransform: "none" }}
          >
            {editingProduct ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
