// src/routes/Reader.tsx
import React from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import data from '../store/manga.json'
import { history } from '../utils/store'
import JSZip from 'jszip'

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}
const IMG_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']

export default function Reader() {
  const { slug, chapter } = useParams()
  const [sp, setSp] = useSearchParams()
  const mode = sp.get('mode') || localStorage.getItem('mr.mode') || 'page'
  const setMode = (m: string) => {
    localStorage.setItem('mr.mode', m)
    sp.set('mode', m)
    setSp(sp, { replace: true })
  }

  const s = data.series.find(x => x.slug === slug)
  const chNum = Number(chapter)
  const ch: any = s?.chapters.find((c: any) => c.number === chNum)

  // Jika chapter pakai CBZ, ini list URL blob gambar hasil unzip
  const [images, setImages] = React.useState<string[] | null>(null)

  React.useEffect(() => {
    if (s && ch) history.push({ slug: s.slug, title: s.title, cover: s.cover, at: Date.now() })
  }, [slug, chapter])

  // Loader CBZ (jika ch.cbzUrl ada)
  React.useEffect(() => {
    let toRevoke: string[] = []
    async function loadCbz() {
      if (!ch?.cbzUrl) { setImages(null); return }
      const res = await fetch(ch.cbzUrl)
      if (!res.ok) throw new Error('Gagal fetch CBZ: ' + res.status)
      const buf = await res.arrayBuffer()
      const zip = await JSZip.loadAsync(buf)

      const names = Object.keys(zip.files)
        .filter(n => IMG_EXTS.some(ext => n.toLowerCase().endsWith(ext)))
        .sort(naturalSort)

      const urls: string[] = []
      for (const name of names) {
        const blob = await zip.file(name)!.async('blob')
        const url = URL.createObjectURL(blob)
        urls.push(url)
      }
      setImages(urls)
      toRevoke = urls
    }
    loadCbz().catch(e => { console.error(e); setImages([]) })
    return () => toRevoke.forEach(u => URL.revokeObjectURL(u))
  }, [ch?.cbzUrl])

  if (!s || !ch) return <main className="container-page">Not found</main>
  const prev = s.chapters.find((c: any) => c.number === chNum - 1)
  const next = s.chapters.find((c: any) => c.number === chNum + 1)
  const goto = (n: number) => { window.location.href = `/manga/${s.slug}/${n}?mode=${mode}` }

  const ext = (ch.ext || 'png').toLowerCase()

  return (
    <main>
      <div className="sticky top-0 z-20 backdrop-blur bg-bg/80 border-b border-edge">
        <div className="container-page flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Link className={`btn ${!prev ? 'opacity-50 pointer-events-none' : ''}`} to={prev ? `/manga/${s.slug}/${prev.number}?mode=${mode}` : '#'}>← Sebelum</Link>
            <Link className="btn" to={`/manga/${s.slug}?mode=${mode}`}>Chapters</Link>
            <Link className={`btn ${!next ? 'opacity-50 pointer-events-none' : ''}`} to={next ? `/manga/${s.slug}/${next.number}?mode=${mode}` : '#'}>Berikut →</Link>
          </div>
          <div className="flex items-center gap-2">
            <label className="chip">Mode</label>
            <button className={`btn ${mode === 'page' ? 'ring-2 ring-accent' : ''}`} onClick={() => setMode('page')}>Halaman</button>
            <button className={`btn ${mode === 'webtoon' ? 'ring-2 ring-accent' : ''}`} onClick={() => setMode('webtoon')}>Webtoon</button>
            <select className="btn" defaultValue={ch.number} onChange={(e) => goto(Number(e.target.value))}>
              {s.chapters.map((c: any) => <option key={c.number} value={c.number}>Ep {c.number}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={`container-page flex flex-col items-center ${mode === 'webtoon' ? 'gap-0' : 'gap-3'}`}>
        {Array.isArray(images)
          ? (images.length === 0
              ? <div className="muted">CBZ tidak bisa dibaca.</div>
              : images.map((src, i) => (
                  <img key={i} src={src} alt={`CBZ Page ${i + 1}`} loading="lazy"
                       className={`w-full ${mode === 'webtoon' ? 'max-w-[1200px] rounded-none border-0' : 'max-w-[950px] rounded-lg border border-edge'}`} />
                )))
          : Array.from({ length: ch.pages }).map((_, i) => {
              const n = String(i + 1).padStart(3, '0')
              const src = `/manga/${s.slug}/${ch.number}/${n}.${ext}`
              return <img key={n} src={src} alt={`Page ${n}`} loading="lazy"
                className={`w-full ${mode === 'webtoon' ? 'max-w-[1200px] rounded-none border-0' : 'max-w-[950px] rounded-lg border border-edge'}`} />
            })
        }
      </div>
    </main>
  )
                                   }
