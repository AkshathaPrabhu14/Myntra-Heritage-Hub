import api from './api';

export const getBackendBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${getBackendBaseUrl()}${path}`;
};

export const calculateDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  return Math.round(price - (price * discount) / 100);
};

export const getProducts = (params = {}) => {
  return api.get('/products', { params });
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const getProductStats = () => {
  return api.get('/products/stats');
};

export const createProduct = (payload) => {
  return api.post('/products', payload);
};

export const updateProduct = (id, payload) => {
  return api.put(`/products/${id}`, payload);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const addReview = (id, review) => {
  return api.post(`/products/${id}/reviews`, review);
};

export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!res.ok) throw new Error('Upload failed');
  const payload = await res.json();
  return { data: payload };
};

export const PRODUCT_CATEGORIES = [
  'Handloom',
  'Traditional Wear',
  'Jewellery',
  'Handicrafts',
  'Artifacts',
  'Accessories',
  'Textiles',
];

export const INDIAN_STATES = [
  { label: 'Andhra Pradesh', value: 'andhra pradesh' },
  { label: 'Arunachal Pradesh', value: 'arunachal pradesh' },
  { label: 'Assam', value: 'assam' },
  { label: 'Bihar', value: 'bihar' },
  { label: 'Chandigarh', value: 'chandigarh' },
  { label: 'Chhattisgarh', value: 'chhattisgarh' },
  { label: 'Delhi', value: 'delhi' },
  { label: 'Goa', value: 'goa' },
  { label: 'Gujarat', value: 'gujarat' },
  { label: 'Haryana', value: 'haryana' },
  { label: 'Himachal Pradesh', value: 'himachal pradesh' },
  { label: 'Jammu & Kashmir', value: 'jammu & kashmir' },
  { label: 'Jharkhand', value: 'jharkhand' },
  { label: 'Karnataka', value: 'karnataka' },
  { label: 'Kerala', value: 'kerala' },
  { label: 'Ladakh', value: 'ladakh' },
  { label: 'Madhya Pradesh', value: 'madhya pradesh' },
  { label: 'Maharashtra', value: 'maharashtra' },
  { label: 'Manipur', value: 'manipur' },
  { label: 'Meghalaya', value: 'meghalaya' },
  { label: 'Mizoram', value: 'mizoram' },
  { label: 'Nagaland', value: 'nagaland' },
  { label: 'Odisha', value: 'odisha' },
  { label: 'Punjab', value: 'punjab' },
  { label: 'Rajasthan', value: 'rajasthan' },
  { label: 'Sikkim', value: 'sikkim' },
  { label: 'Tamil Nadu', value: 'tamil nadu' },
  { label: 'Telangana', value: 'telangana' },
  { label: 'Tripura', value: 'tripura' },
  { label: 'Uttar Pradesh', value: 'uttar pradesh' },
  { label: 'Uttarakhand', value: 'uttarakhand' },
  { label: 'West Bengal', value: 'west bengal' },
  { label: 'Andaman & Nicobar', value: 'andaman & nicobar' },
  { label: 'Dadra & Nagar Haveli', value: 'dadra & nagar haveli' },
  { label: 'Lakshadweep', value: 'lakshadweep' },
  { label: 'Puducherry', value: 'puducherry' },
];
