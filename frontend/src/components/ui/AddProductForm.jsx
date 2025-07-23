import React, { useState } from 'react';

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    rating: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(form);
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Get admin token from cookies or localStorage
      let adminToken = '';
      if (typeof window !== 'undefined') {
        adminToken = localStorage.getItem('admin_token') || (window.Cookies && window.Cookies.get && window.Cookies.get('auth_token')) || '';
      }
      console.log(adminToken);
      
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add product');
      setSuccess('Product added!');
      setForm({ name: '', price: '', description: '', image: '', rating: '', category: '' });
    } catch (err) {
      alert(err)
      console.log(err);
      setError('Could not add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Add Product</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="form-input" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="form-input" type="number" min="0" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="form-input" />
      <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" className="form-input" type="number" min="0" max="5" step="0.1" />
      <select name="category" value={form.category} onChange={handleChange} required className="form-input">
        <option value="">Select Category</option>
        <option value="Cakes">Cake</option>
        <option value="Cupcakes">Cupcake</option>
        <option value="Brownies">Brownie</option>
      </select>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-input" />
      <button type="submit" className="submit-button" style={{ marginTop: 12 }} disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default AddProductForm; 