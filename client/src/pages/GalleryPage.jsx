import { useState } from 'react';
import { CtaBand, PageHead } from '../components/ui';
import gallery1 from '../assets/gallary/1.webp';
import gallery2 from '../assets/gallary/2.webp';
import gallery3 from '../assets/gallary/3.webp';
import gallery4 from '../assets/gallary/4.webp';
import gallery5 from '../assets/gallary/5.webp';
import gallery6 from '../assets/gallary/6.webp';

// STATIC GALLERY DATA — 6 IMAGES
const GALLERY_DATA = [
  {
    id: 'g1',
    title: 'Raja Electricals Store',
    image: gallery1,
    type: 'Store'
  },
  {
    id: 'g2',
    title: 'Electrical Products',
    image: gallery2,
    type: 'Products'
  },
  {
    id: 'g3',
    title: 'Safety Equipment Range',
    image: gallery3,
    type: 'Products'
  },
  {
    id: 'g4',
    title: 'Professional Tools Collection',
    image: gallery4,
    type: 'Products'
  },
  {
    id: 'g5',
    title: 'Industrial Site Supply',
    image: gallery5,
    type: 'Projects'
  },
  {
    id: 'g6',
    title: 'Fast Delivery Service',
    image: gallery6,
    type: 'Store'
  }
];

export default function GalleryPage({ go, content }) {
  const [filter, setFilter] = useState('All');

  // Gallery uploads are stored in the database and returned in content.gallery.
  const items = Array.isArray(content?.gallery) ? content.gallery : [];

  const types = [
    'All',
    ...new Set(items.map(x => x.type || 'Other'))
  ];

  return (
    <>
      <PageHead
        crumb="Gallery"
        title={
          <>
            Our <em>Gallery</em>
          </>
        }
        desc="A closer look at our products, project support and deliveries."
      />

      <section className="gallery">

        {/* FILTER TABS */}
        <div className="tabs">
          {types.map(x => (
            <button
              key={x}
              className={filter === x ? 'selected' : ''}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>

        {/* GALLERY GRID */}
        <div className="gallery-grid">
          {items
            .filter(
              x => filter === 'All' || x.type === filter
            )
            .map(x => (
              <figure key={x.id}>
                <img
                  src={x.image}
                  alt={x.title}
                  loading="lazy"
                />

                <figcaption>
                  {x.title}
                </figcaption>
              </figure>
            ))}
          {!items.length && <p>No gallery images have been added yet.</p>}
        </div>

      </section>

      <CtaBand go={go} />
    </>
  );
}
