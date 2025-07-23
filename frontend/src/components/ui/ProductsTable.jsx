import React, { useEffect, useState } from 'react';
import { Trash2, Edit, X, CheckCircle } from 'lucide-react';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load products.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Edit Handlers
  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({ ...product });
  };
  const closeEdit = () => {
    setEditProduct(null);
    setEditForm({});
  };
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      let adminToken = '';
      if (typeof window !== 'undefined') {
        adminToken = localStorage.getItem('admin_token') || (window.Cookies && window.Cookies.get && window.Cookies.get('auth_token')) || '';
      }
      const res = await fetch(`http://localhost:5000/api/products/${editProduct.id}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Failed to update product');
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        closeEdit();
        fetchProducts();
      }, 1200);
    } catch (err) {
      alert('Could not update product.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Handlers
  const confirmDelete = (id) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      let adminToken = '';
      if (typeof window !== 'undefined') {
        adminToken = localStorage.getItem('admin_token') || (window.Cookies && window.Cookies.get && window.Cookies.get('auth_token')) || '';
      }
      const res = await fetch(`http://localhost:5000/api/products/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert('Could not delete product.');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-card)' }}>
          <thead>
            <tr>
              <th className="products-table-header">Image</th>
              <th className="products-table-header">Name</th>
              <th className="products-table-header">Category</th>
              <th className="products-table-header">Price</th>
              <th className="products-table-header">Rating</th>
              <th className="products-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="products-table-row">
                <td className="products-table-cell"><img src={product.image} alt={product.name} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td className="products-table-cell">{product.name}</td>
                <td className="products-table-cell">{product.category}</td>
                <td className="products-table-cell">{product.price}</td>
                <td className="products-table-cell">{product.rating}</td>
                <td className="products-table-cell">
                  <button className="products-table-action-btn" title="Edit" onClick={() => openEdit(product)}>
                    <Edit size={18} color="#9333ea" />
                  </button>
                  <button className="products-table-action-btn" title="Delete" onClick={() => confirmDelete(product.id)}>
                    <Trash2 size={18} color="#ec4899" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,16,40,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, transition: 'background 0.3s' }}>
          <form onSubmit={handleEditSubmit} style={{ background: 'white', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 8px 40px rgba(236,72,153,0.18)', position: 'relative', animation: 'fadeInScale 0.3s' }}>
            <button type="button" onClick={closeEdit} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            <h2 style={{ margin: '0 0 18px 0', color: '#c026d3', textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}>Edit Product</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input name="name" value={editForm.name || ''} onChange={handleEditChange} placeholder="Name" required className="form-input" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
              <input name="price" value={editForm.price || ''} onChange={handleEditChange} placeholder="Price" required className="form-input" type="number" min="0" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
              <input name="image" value={editForm.image || ''} onChange={handleEditChange} placeholder="Image URL" className="form-input" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
              <input name="rating" value={editForm.rating || ''} onChange={handleEditChange} placeholder="Rating" className="form-input" type="number" min="0" max="5" step="0.1" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
              <select name="category" value={editForm.category || ''} onChange={handleEditChange} required className="form-input" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }}>
                <option value="">Select Category</option>
                <option value="Cakes">Cake</option>
                <option value="Cupcakes">Cupcake</option>
                <option value="Brownies">Brownie</option>
              </select>
              <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} placeholder="Description" className="form-input" style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', minHeight: 60 }} />
              <button type="submit" className="submit-button" style={{ marginTop: 8, width: '100%', background: '#c026d3', color: 'white', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '10px 0', transition: 'background 0.2s' }} disabled={editLoading || editSuccess}>{editLoading ? 'Saving...' : editSuccess ? 'Saved!' : 'Save Changes'}</button>
              {editSuccess && <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}><CheckCircle size={18} /> Saved!</div>}
            </div>
          </form>
          <style>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.12)', position: 'relative' }}>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete this product?</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={handleDelete} className="submit-button" style={{ background: '#ec4899', color: 'white' }} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</button>
              <button onClick={cancelDelete} style={{ background: '#ede9fe', color: '#9333ea', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .products-table-header {
          padding: 10px;
          background: #f3e8ff;
          color: #c026d3;
          font-weight: 700;
          font-size: 16px;
          text-align: left;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #ede9fe;
        }
        .products-table-row:hover {
          background: #fdf2f8;
          transition: background 0.2s;
        }
        .products-table-cell {
          padding: 10px;
          border-bottom: 1px solid #f3e8ff;
          vertical-align: middle;
          color: #111;
        }
        .products-table-action-btn {
          background: #ede9fe;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          margin-right: 6px;
          transition: background 0.2s;
        }
        .products-table-action-btn:last-child {
          margin-right: 0;
        }
        .products-table-action-btn:hover {
          background: #f3e8ff;
        }
        @media (max-width: 700px) {
          .products-table-header,
          .products-table-cell {
            font-size: 14px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductsTable; 