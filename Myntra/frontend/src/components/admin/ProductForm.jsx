import React, { useState } from 'react';
import { Loader2, Upload, X, ImagePlus } from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  INDIAN_STATES,
  uploadImages,
  resolveImageUrl,
} from '../../services/productService';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  discount: 0,
  state: '',
  craft: '',
  category: '',
  material: '',
  isGITagged: false,
  isEcoFriendly: false,
  availability: 'In Stock',
  artisanName: '',
  giRegistryNumber: '',
  story: '',
  history: '',
  preparationProcess: '',
  craftingTime: '',
  careInstructions: '',
  authenticityDetails: '',
  giCertificateInfo: '',
  rawMaterials: '',
  artisanCommunity: '',
  sizes: 'Free Size',
  stock: 10,
};

const ProductForm = ({ initialData, onSubmit, submitLabel = 'Save Product' }) => {
  const [form, setForm] = useState(() => {
    if (!initialData) return defaultForm;
    return {
      name: initialData.name || '',
      description: initialData.description || '',
      price: initialData.price ?? '',
      discount: initialData.discount ?? 0,
      state: initialData.state || '',
      craft: initialData.craft || '',
      category: initialData.category || '',
      material: initialData.material || '',
      isGITagged: initialData.isGITagged ?? false,
      isEcoFriendly: initialData.isEcoFriendly ?? false,
      availability: initialData.availability || 'In Stock',
      artisanName: initialData.artisanName || '',
      giRegistryNumber: initialData.giRegistryNumber || '',
      story: initialData.story || '',
      history: initialData.history || '',
      preparationProcess: initialData.preparationProcess || '',
      craftingTime: initialData.craftingTime || '',
      careInstructions: initialData.careInstructions || '',
      authenticityDetails: initialData.authenticityDetails || '',
      giCertificateInfo: initialData.giCertificateInfo || '',
      rawMaterials: initialData.rawMaterials || '',
      artisanCommunity: initialData.artisanCommunity || '',
      sizes: (initialData.sizes || ['Free Size']).join(', '),
      stock: initialData.stock ?? 10,
    };
  });

  const [existingImages, setExistingImages] = useState(() => {
    if (!initialData) return [];
    const gallery = [initialData.image, ...(initialData.images || [])].filter(Boolean);
    return [...new Set(gallery)];
  });

  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + newFiles.length + files.length;
    if (totalCount > 5) {
      setError('Maximum 5 images allowed per product.');
      return;
    }
    setError('');
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let allImageUrls = [...existingImages];

      if (newFiles.length > 0) {
        const { data: uploadData } = await uploadImages(newFiles);
        if (!uploadData.success) {
          throw new Error(uploadData.message || 'Image upload failed');
        }
        allImageUrls = [...allImageUrls, ...uploadData.data];
      }

      if (allImageUrls.length === 0) {
        throw new Error('Please add at least one product image.');
      }

      const payload = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 0,
        sizes: form.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        image: allImageUrls[0],
        images: allImageUrls.slice(1),
        availability: Number(form.stock) > 0 ? 'In Stock' : 'Out of Stock',
      };

      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-myntra-pink focus:ring-1 focus:ring-myntra-pink transition bg-white';
  const labelClass = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg font-semibold">
          {error}
        </div>
      )}

      {/* Images */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center">
          <ImagePlus className="w-4 h-4 mr-2 text-myntra-pink" />
          Product Images (max 5)
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {existingImages.map((url, idx) => (
            <div key={`existing-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={resolveImageUrl(url)} alt="" className="w-full h-full object-cover" />
              {idx === 0 && existingImages.length > 0 && newFiles.length === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-myntra-pink text-white text-[8px] font-bold text-center py-0.5">
                  PRIMARY
                </span>
              )}
              <button
                type="button"
                onClick={() => removeExistingImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {previews.map((url, idx) => (
            <div key={`new-${idx}`} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {existingImages.length + newFiles.length < 5 && (
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-myntra-pink hover:bg-pink-50/30 transition">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-[9px] font-bold text-gray-400 mt-1">UPLOAD</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
            </label>
          )}
        </div>
      </section>

      {/* Basic Info */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Discount (%)</label>
            <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>State of Origin *</label>
            <select name="state" value={form.state} onChange={handleChange} required className={inputClass}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Craft Tradition *</label>
            <input name="craft" value={form.craft} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Material</label>
            <input name="material" value={form.material} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sizes (comma-separated)</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, Free Size" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stock *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="flex items-center space-x-6 md:col-span-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isGITagged" checked={form.isGITagged} onChange={handleChange} className="accent-myntra-pink w-4 h-4" />
              <span className="text-sm font-semibold text-slate-700">GI Certified</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isEcoFriendly" checked={form.isEcoFriendly} onChange={handleChange} className="accent-myntra-pink w-4 h-4" />
              <span className="text-sm font-semibold text-slate-700">Eco-Friendly</span>
            </label>
          </div>
        </div>
      </section>

      {/* Artisan Info */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-4">Artisan & Authenticity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Artisan Name</label>
            <input name="artisanName" value={form.artisanName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GI Registry Number</label>
            <input name="giRegistryNumber" value={form.giRegistryNumber} onChange={handleChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Artisan Community</label>
            <input name="artisanCommunity" value={form.artisanCommunity} onChange={handleChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Story Behind the Craft</label>
            <textarea name="story" value={form.story} onChange={handleChange} rows={4} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>History</label>
            <textarea name="history" value={form.history} onChange={handleChange} rows={3} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Preparation Process</label>
            <textarea name="preparationProcess" value={form.preparationProcess} onChange={handleChange} rows={3} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Crafting Time</label>
            <input name="craftingTime" value={form.craftingTime} onChange={handleChange} placeholder="e.g. 2-3 weeks" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Raw Materials</label>
            <input name="rawMaterials" value={form.rawMaterials} onChange={handleChange} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Care Instructions</label>
            <textarea name="careInstructions" value={form.careInstructions} onChange={handleChange} rows={2} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Authenticity Details</label>
            <textarea name="authenticityDetails" value={form.authenticityDetails} onChange={handleChange} rows={2} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>GI Certificate Info</label>
            <textarea name="giCertificateInfo" value={form.giCertificateInfo} onChange={handleChange} rows={2} className={inputClass} />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-myntra-pink hover:bg-myntra-pinkHover text-white px-8 py-3 rounded-lg text-sm font-extrabold tracking-wider uppercase flex items-center justify-center transition disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default ProductForm;
