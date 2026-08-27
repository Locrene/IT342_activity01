import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRequest, updateRequest } from '../api/requestsApi';

const initialForm = { title: '', description: '', category: '' };

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const { ok, data } = await getRequest(id);
      if (ok) {
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
        });
      } else {
        setStatus({ type: 'error', message: data?.message || 'Failed to load request.' });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required.';
    if (!form.category.trim()) errors.category = 'Category is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!validate()) return;

    setSubmitting(true);
    const { ok, data } = await updateRequest(id, form);
    setSubmitting(false);

    if (ok) {
      setStatus({ type: 'success', message: 'Service request updated.' });
      setTimeout(() => navigate('/requests'), 800);
    } else {
      setStatus({ type: 'error', message: data?.message || 'Failed to update request.' });
    }
  }

  if (loading) return <div className="requests-page"><p>Loading…</p></div>;

  return (
    <div className="requests-page">
      <div className="requests-header">
        <h1>Edit Service Request</h1>
        <Link to="/requests" className="btn-secondary">Back</Link>
      </div>

      {status.type && (
        <div className={`alert alert-${status.type}`} role="alert">
          {status.message}
        </div>
      )}

      <div className="requests-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input id="category" name="category" type="text" value={form.category} onChange={handleChange} />
            {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}