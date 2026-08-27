import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRequests, createRequest, deleteRequest } from '../api/requestsApi';
import { getSession, clearSession } from '../api/session';

const initialForm = { title: '', description: '', category: '' };

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = getSession();

  async function loadRequests() {
    setLoading(true);
    const { ok, data } = await getMyRequests();
    if (ok) {
      setRequests(data);
    } else {
      setStatus({ type: 'error', message: data?.message || 'Failed to load requests.' });
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

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
    const { ok, data } = await createRequest(form);
    setSubmitting(false);

    if (ok) {
      setStatus({ type: 'success', message: 'Service request created.' });
      setForm(initialForm);
      loadRequests();
    } else {
      setStatus({ type: 'error', message: data?.message || 'Failed to create request.' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this service request?')) return;

    const { ok, data } = await deleteRequest(id);
    if (ok) {
      setStatus({ type: 'success', message: 'Service request deleted.' });
      loadRequests();
    } else {
      setStatus({ type: 'error', message: data?.message || 'Failed to delete request.' });
    }
  }

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="requests-page">
      <div className="requests-header">
        <h1>My Service Requests</h1>
        <div className="requests-header-right">
          <span>{user?.username}</span>
          <button className="btn-secondary" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      {status.type && (
        <div className={`alert alert-${status.type}`} role="alert">
          {status.message}
        </div>
      )}

      <div className="requests-card">
        <h2>New Service Request</h2>
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
            {submitting ? 'Creating…' : 'Create Request'}
          </button>
        </form>
      </div>

      <div className="requests-list">
        <h2>Your Requests</h2>
        {loading && <p>Loading…</p>}
        {!loading && requests.length === 0 && <p>No service requests yet.</p>}
        {!loading && requests.map((r) => (
          <div className="request-item" key={r.id}>
            <div className="request-item-main">
              <h3>{r.title}</h3>
              <span className="request-category">{r.category}</span>
              <p>{r.description}</p>
              <span className="request-date">
                {new Date(r.dateCreated).toLocaleString()}
              </span>
            </div>
            <div className="request-item-actions">
              <Link to={`/requests/${r.id}/edit`} className="btn-secondary">Edit</Link>
              <button className="btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}