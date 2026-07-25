import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { resolveImageUrl, INDIAN_STATES } from '../services/productService';
import {
  Shield,
  Edit,
  Upload,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';

const MAX_IMAGES = 8;

const AdminEditProduct = () => {
  const { id } = useParams();
  const { user, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    state: 'karnataka',
    category: 'Handloom',
    craft: '',
    artisanName: '',
    material: '',
    giRegistryNumber: '',
    description: '',
    story: '',
    history: '',
    preparationProcess: '',
    craftingTime: '1-2 weeks',
    careInstructions: 'Dry clean recommended.',
    authenticityDetails: '',
    giCertificateInfo: '',
    rawMaterials: '',
    artisanCommunity: '',
    price: '',
    discount: '0',
    stock: '10',
    sizes: 'Free Size',
    isGITagged: false,
    isEcoFriendly: false,
    availability: 'In Stock',
  });

  // Multi-image state
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Load existing product details
  useEffect(() => {
    const loadProduct = async () => {
      setFetching(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success && data.data) {
          const item = data.data;
          setFormData({
            name: item.name || '',
            state: item.state || 'karnataka',
            category: item.category || 'Handloom',
            craft: item.craft || '',
            artisanName: item.artisanName || '',
            material: item.material || '',
            giRegistryNumber: item.giRegistryNumber || '',
            description: item.description || '',
            story: item.story || '',
            history: item.history || '',
            preparationProcess: item.preparationProcess || '',
            craftingTime: item.craftingTime || '1-2 weeks',
            careInstructions: item.careInstructions || 'Dry clean recommended.',
            authenticityDetails: item.authenticityDetails || '',
            giCertificateInfo: item.giCertificateInfo || '',
            rawMaterials: item.rawMaterials || '',
            artisanCommunity: item.artisanCommunity || '',
            price: item.price || '',
            discount: item.discount || 0,
            stock: item.stock || 10,
            sizes: item.sizes ? item.sizes.join(', ') : 'Free Size',
            isGITagged: item.isGITagged || false,
            isEcoFriendly: item.isEcoFriendly || false,
            availability: item.availability || 'In Stock',
          });
          // Build image previews from existing product data
          const existingImages = [];
          if (item.image) existingImages.push(item.image);
          if (item.images && item.images.length > 0) {
            item.images.forEach((img) => {
              if (img && !existingImages.includes(img)) {
                existingImages.push(img);
              }
            });
          }
          setImagePreviews(existingImages);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product for edit:', err);
        setError('Failed to fetch product details.');
      } finally {
        setFetching(false);
      }
    };

    if (isAdmin && id) {
      loadProduct();
    }
  }, [isAdmin, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - imagePreviews.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    const data = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      data.append('images', filesToUpload[i]);
    }

    setUploading(true);
    setError('');
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const result = res.data;

      if (result.success && result.data.length > 0) {
        const uploadedUrls = result.data;
        setImagePreviews((prev) => [...prev, ...uploadedUrls].slice(0, MAX_IMAGES));
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to upload image files. Please check connection.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const galleryImgArray = imagePreviews.length > 0
      ? imagePreviews
      : [formData.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60'];
    const primaryImg = galleryImgArray[0];

    const sizeArray = formData.sizes
      ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Free Size'];

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      stock: Number(formData.stock || 10),
      image: primaryImg,
      images: galleryImgArray,
      sizes: sizeArray,
    };

    setSubmitting(true);
    try {
      const { data } = await api.put(`/products/${id}`, payload);
      if (data.success) {
        navigate('/admin/products');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Error updating product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-myntra-pink animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8">
          <Link
            to="/admin/products"
            className="inline-flex items-center text-xs font-bold text-myntra-pink hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Inventory
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <Edit className="w-7 h-7 mr-2 text-myntra-pink" />
            Edit Heritage Product
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl mb-6 font-bold flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          {/* Basic Details */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-myntra-dark border-b border-gray-150 pb-2 mb-4">
              Basic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="auth-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State of Origin *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="auth-input text-xs capitalize bg-white"
                  required
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="auth-input text-xs bg-white"
                  required
                >
                  <option value="Handloom">Handloom</option>
                  <option value="Traditional Wear">Traditional Wear</option>
                  <option value="Jewellery">Jewellery</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Artifacts">Artifacts</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Textiles">Textiles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Craft Tradition *</label>
                <input
                  type="text"
                  name="craft"
                  value={formData.craft}
                  onChange={handleChange}
                  className="auth-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Artisan Name</label>
                <input
                  type="text"
                  name="artisanName"
                  value={formData.artisanName}
                  onChange={handleChange}
                  className="auth-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="auth-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount (% OFF)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="auth-input text-xs"
                />
              </div>
            </div>
          </div>

          {/* IMAGES UPLOAD & PREVIEW */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-myntra-dark border-b border-gray-150 pb-2 mb-4">
              Product Images
              <span className="text-myntra-pink ml-2 text-[11px] font-bold normal-case">
                ({imagePreviews.length}/{MAX_IMAGES} uploaded)
              </span>
            </h3>

            <div className="space-y-4">
              {/* Upload zone */}
              {imagePreviews.length < MAX_IMAGES && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-myntra-pink transition">
                  <Upload className="w-8 h-8 text-myntra-pink mx-auto mb-2" />
                  <span className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Additional Image(s)
                  </span>
                  <span className="block text-[11px] text-gray-400 mb-3">
                    Select up to {MAX_IMAGES - imagePreviews.length} more images (JPG, PNG, WEBP max 25MB each)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-edit"
                  />
                  <label
                    htmlFor="file-upload-edit"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer inline-flex items-center"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                    Browse Files
                  </label>
                </div>
              )}

              {/* Image preview grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-square bg-gray-50">
                      <img
                        src={resolveImageUrl(url)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-myntra-pink text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {idx + 1}/{imagePreviews.length}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Story & Narrative */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-myntra-dark border-b border-gray-150 pb-2 mb-4">
              Story & Narrative
            </h3>
            <textarea
              name="story"
              rows={3}
              value={formData.story}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-myntra-pink bg-white"
            />
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isGITagged"
                checked={formData.isGITagged}
                onChange={handleChange}
                className="w-4 h-4 text-myntra-pink rounded"
              />
              <span>GI Certified</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isEcoFriendly"
                checked={formData.isEcoFriendly}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span>Eco-Friendly</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-150 flex justify-end space-x-4">
            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-myntra-pink hover:bg-myntra-pinkHover text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center transition"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
