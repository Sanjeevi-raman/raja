import { useEffect, useState } from 'react';
import { ClipboardList, FolderKanban, Image as ImageIcon, LogOut, Package, Save, Settings, ShieldCheck, ShoppingBag, Tags } from 'lucide-react';
import { getContent, request } from '../lib/api';

const fields = { products: ['name', 'category', 'price', 'badge', 'description', 'features', 'specifications', 'colors'], categories: ['name', 'count'], brands: ['name', 'category', 'products', 'description'], industries: ['name', 'description'], gallery: ['title', 'type'], projects: ['name', 'category', 'location', 'year', 'products', 'description'] };
const labels = { products: 'Products', categories: 'Categories', brands: 'Brands', industries: 'Industries', gallery: 'Gallery', projects: 'Projects', enquiries: 'Customer enquiries', orders: 'Customer orders' };
const blank = collection => Object.fromEntries(fields[collection].map(key => [key, '']));
const nav = [['site', Settings], ['products', Package], ['categories', Tags], ['brands', ShieldCheck], ['industries', Package], ['projects', FolderKanban], ['gallery', ImageIcon], ['enquiries', ClipboardList], ['orders', ShoppingBag]];

export default function DashboardPage() {
  const [token, setToken] = useState(localStorage.getItem('raja_admin_token')); const [content, setContent] = useState(null); const [view, setView] = useState('site'); const [editing, setEditing] = useState(null); const [records, setRecords] = useState([]); const [notice, setNotice] = useState(''); const [pendingCatalogue, setPendingCatalogue] = useState(null);
  const isRecords = view === 'orders' || view === 'enquiries';
  const reload = async () => { try { if (isRecords) setRecords(await request(`/admin/${view}`)); else setContent(await getContent()); } catch (error) { setNotice(error.message); } };
  useEffect(() => { if (token) reload(); }, [token, view]);
  const login = async event => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); try { const result = await request('/auth/login', 'POST', values); localStorage.setItem('raja_admin_token', result.token); setToken(result.token); setNotice(''); } catch (error) { setNotice(error.message); } };
  const logout = async () => { try { await request('/auth/logout', 'POST'); } finally { localStorage.removeItem('raja_admin_token'); setToken(null); } };
  const save = async event => { event.preventDefault(); const value = Object.fromEntries(new FormData(event.currentTarget)); ['image', 'logo', 'heroImage', 'heroImage2', 'heroImage3', 'aboutImage'].forEach(field => { if (editing?.[field]) value[field] = editing[field]; }); try { if (view === 'site') await request('/site', 'PUT', value); else { let saved = await request(`/${view}${editing?.id ? `/${editing.id}` : ''}`, editing?.id ? 'PUT' : 'POST', value); if (view === 'products' && pendingCatalogue) { const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(pendingCatalogue.file); }); saved = await request(`/products/${saved.id}/catalogue`, 'PUT', { fileName: pendingCatalogue.name, data: dataUrl }); } } localStorage.setItem('raja_content_updated', String(Date.now())); window.dispatchEvent(new Event('raja-content-updated')); setNotice('Saved successfully.'); setPendingCatalogue(null); setEditing(null); reload(); } catch (error) { setNotice(error.message); } };
  const remove = async id => { if (!window.confirm('Delete this item?')) return; try { await request(`/${view}/${id}`, 'DELETE'); reload(); } catch (error) { setNotice(error.message); } };
  const updateStatus = async (id, status) => { try { await request(`/admin/${view}/${id}`, 'PATCH', { status }); setRecords(items => items.map(item => item.id === id ? { ...item, status } : item)); } catch (error) { setNotice(error.message); } };
  const upload = (event, field) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setEditing(item => ({ ...(item || (view === 'site' ? content?.site : blank(view))), [field || (view === 'brands' ? 'logo' : view === 'site' ? 'heroImage' : 'image')]: reader.result })); reader.readAsDataURL(file); };
  const uploadCatalogue = event => { const file = event.target.files?.[0]; if (!file) return; setPendingCatalogue({ name: file.name, file }); setEditing(item => ({ ...(item || blank(view)), catalogName: file.name })); };
  const removeCatalogue = async () => { if (!editing?.id) return; try { await request(`/products/${editing.id}/catalogue`, 'DELETE'); setPendingCatalogue(null); setEditing(item => ({ ...item, catalogName: undefined, catalogUrl: undefined })); setNotice('Catalogue removed.'); } catch (error) { setNotice(error.message); } };
  if (!token) return <main className="login-page"><form onSubmit={login}><ShieldCheck size={36}/><h1>Admin sign in</h1><p>Manage products, customer enquiries and orders.</p><input name="email" type="email" placeholder="admin@rajaelectricals.com" defaultValue="admin@rajaelectricals.com" autoComplete="username" required/><input name="password" type="password" placeholder="Password" autoComplete="current-password" required/><button>Sign in</button><a className="login-home" href="#home">← Back to home</a>{notice && <em>{notice}</em>}</form></main>;
  const list = content?.[view] || []; const current = editing || (view === 'site' ? content?.site : null);
  return <div className="cms-admin"><aside><b>RAJA CMS</b>{nav.map(([key, Icon]) => <button className={view === key ? 'active' : ''} onClick={() => { setView(key); setEditing(null); setNotice(''); setPendingCatalogue(null); }} key={key}><Icon size={16}/>{key === 'site' ? 'Website content' : labels[key]}</button>)}<button onClick={logout}><LogOut size={16}/>Logout</button></aside><main><header><div><small>CONTENT MANAGER</small><h1>{view === 'site' ? 'Homepage content' : labels[view]}</h1></div>{!isRecords && view !== 'site' && <button className="add-btn" onClick={() => { setEditing(blank(view)); setPendingCatalogue(null); }}>+ Add {labels[view].slice(0, -1)}</button>}</header>{notice && <p className="cms-notice">{notice}</p>}{isRecords ? <Records items={records} type={view} onStatus={updateStatus}/> : <>{current && <Editor key={`${view}-${current.id || 'site'}-${(current.image || current.logo || '').length}`} view={view} item={current} categories={content?.categories || []} onSave={save} onUpload={upload} onUploadCatalogue={uploadCatalogue} pendingCatalogue={pendingCatalogue} onRemoveCatalogue={removeCatalogue}/>} {view !== 'site' && !editing && <div className="cms-list">{list.map(item => <article key={item.id}><img src={item.image || item.logo} alt=""/><div><b>{item.name || item.title}</b><small>{item.category || item.type || item.description}</small></div><button onClick={() => setEditing(item)}>Edit</button><button className="delete" onClick={() => remove(item.id)}>Delete</button></article>)}</div>}</>}</main></div>;
}

function Records({ items, type, onStatus }) {
  const options = type === 'orders' ? ['New', 'Confirmed', 'Processing', 'Completed', 'Cancelled'] : ['New', 'Contacted', 'Closed'];
  if (!items.length) return <p>No customer requests yet.</p>;
  return <div className="cms-list">{items.map(item => {
    const receivedAt = item.created_at || item.createdAt || item.submittedAt;
    const isOrder = type === 'orders';
    return <article className="customer-record" key={item.id}><div>
      <b>{isOrder ? item.customerName : item.name} — {isOrder ? item.productName : item.product || 'General enquiry'}</b>
      <small>
        <strong>Phone:</strong> {item.phone}{item.email && <> · <strong>Email:</strong> {item.email}</>}{item.company && <> · <strong>Company:</strong> {item.company}</>}<br/>
        {isOrder ? <><strong>Quantity:</strong> {item.quantity}{item.notes && <> · <strong>Notes:</strong> {item.notes}</>}</> : <><strong>Requirement:</strong> {item.quantity || 'Not specified'}<br/><strong>Message:</strong> {item.message || 'No additional message.'}{item.source && <><br/><strong>Source:</strong> {item.source}</>}</>}
        {receivedAt && <><br/><strong>Received:</strong> {new Date(receivedAt).toLocaleString()}</>}
      </small>
    </div><select value={item.status || 'New'} onChange={event => onStatus(item.id, event.target.value)}>{options.map(status => <option key={status}>{status}</option>)}</select></article>;
  })}</div>;
}
function Editor({ view, item, categories, onSave, onUpload, onUploadCatalogue, pendingCatalogue, onRemoveCatalogue }) {
  const names = view === 'site'
    ? ['businessName', 'welcome', 'heroTitle', 'heroText', 'deliveryText', 'businessHours', 'trustYears', 'productCount', 'supplyTitle', 'supplyText', 'aboutKicker', 'aboutTitle', 'aboutIntro', 'aboutDescription', 'aboutValues', 'phone', 'email', 'address', 'whatsappNumber', 'whatsappMessage']
    : fields[view];
  const imageFields = view === 'site'
    ? [['heroImage', 'Hero image 1'], ['heroImage2', 'Hero image 2'], ['heroImage3', 'Hero image 3'], ['aboutImage', 'About page image']]
    : [[view === 'brands' ? 'logo' : 'image', `Upload ${view === 'brands' ? 'logo' : 'image'}`]];
  return <form className="cms-editor" onSubmit={onSave}>
    <h2>{view === 'site' ? 'Edit Home, About and contact content' : item.id ? 'Edit item' : 'Add item'}</h2>
    {names.map(name => <label key={name}>{name.replace(/([A-Z])/g, ' $1')}{view === 'products' && name === 'category' ? <select name="category" defaultValue={item.category || ''} required><option value="" disabled>Select a category</option>{categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}</select> : <textarea name={name} defaultValue={item[name] || ''} required={view === 'products' && (name === 'name' || name === 'category')} rows={name.includes('Description') || name.includes('description') || name.includes('Text') || name.includes('Values') || name === 'heroTitle' || name === 'features' || name === 'specifications' ? 3 : 1}/>}</label>)}
    {imageFields.map(([field, label]) => <label key={field}>{label}<input type="file" accept="image/*" onChange={event => onUpload(event, field)}/>{item[field] && <img className="cms-preview" src={item[field]} alt={`${label} preview`}/>}</label>)}
    {view === 'products' && <label>Upload catalogue (PDF)<input type="file" accept="application/pdf" onChange={onUploadCatalogue}/>{pendingCatalogue && <small style={{ color: 'var(--orange)' }}>To upload: {pendingCatalogue.name} (saved when you press Save)</small>}{!pendingCatalogue && item.catalogName && <small>Current file: {item.catalogName}</small>}{!pendingCatalogue && item.id && item.catalogUrl && <button type="button" className="delete" style={{ marginTop: '8px' }} onClick={onRemoveCatalogue}>Remove catalogue</button>}</label>}
    <button><Save size={16}/>Save changes</button>
  </form>;
}
