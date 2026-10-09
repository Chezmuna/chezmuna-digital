'use client';
import { useState } from 'react';
export default function ImageField({ name, label, current }) {
  const [data, setData] = useState(''), [busy, setBusy] = useState(false);
  async function pick(e) {
    const f = e.target.files?.[0]; if (!f) return; setBusy(true);
    const url = URL.createObjectURL(f), im = new Image(); im.src = url; await im.decode().catch(() => {});
    const s = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas');
    c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
    setData(c.toDataURL('image/jpeg', 0.82)); URL.revokeObjectURL(url); setBusy(false);
  }
  const shown = data || (current ? `/api/img/${current}` : '');
  return (<div><label className="f">{label}</label>
    {shown && <img src={shown} alt="" style={{ maxWidth: 240, maxHeight: 160, borderRadius: 8, display: 'block', marginBottom: 8 }} />}
    <input type="hidden" name={name} value={current || ''} /><input type="hidden" name={name + '_data'} value={data} />
    <input type="file" accept="image/*" onChange={pick} />{busy && <span className="meta"> Processing…</span>}
    {current ? <label className="opt" style={{ marginTop: 8 }}><input type="checkbox" name={name + '_clear'} /><span>Remove current image</span></label> : null}</div>);
}
