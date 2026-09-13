import { useEffect, useState, useRef } from 'react';
import { Award, Boxes, CheckCircle2, Clock, HardHat, Headphones, Package, Shield, Star, Truck, Users, Wrench, Zap } from 'lucide-react';
import { categories as staticCategories, images } from '../data/catalog';
import { Btn, CtaBand } from '../components/ui';

const fallbackImage = item => item?.image || item?.logo || images.worker;
const homeContent = {
  site: { welcome: 'Welcome to Raja Electricals', heroTitle: 'Powering Every Project.', heroText: 'Electrical · Hardware · Safety · Industrial Solutions', trustYears: 25, productCount: 5000, deliveryText: 'Genuine products. Practical guidance.', supplyText: 'For over two decades, Raja Electricals has helped contractors, facilities and industrial teams source dependable products.' },
  categories: staticCategories.map(([name, image, count], id) => ({ id, name, image: image || images.worker, count })),
  products: [{ id: 1, name: 'Industrial Safety Helmet', image: images.helmet, price: 'Contact for price', badge: 'Popular' }, { id: 2, name: 'Power Tools', image: images.tools, price: 'Contact for price', badge: 'Featured' }, { id: 3, name: 'Water Pump', image: images.pump, price: 'Contact for price', badge: 'Reliable' }, { id: 4, name: 'Electrical Supplies', image: images.worker, price: 'Contact for price', badge: 'Top rated' }],
  brands: [{ id: 1, name: 'Electrical Brands', logo: images.worker, products: 'Electrical supplies' }, { id: 2, name: 'Safety Brands', logo: images.safety, products: 'Safety products' }, { id: 3, name: 'Tool Brands', logo: images.tools, products: 'Tools and hardware' }],
  industries: [{ id: 1, name: 'Construction', image: images.site, description: 'Reliable supplies for active worksites.' }, { id: 2, name: 'Manufacturing', image: images.plant, description: 'Industrial products for daily operations.' }, { id: 3, name: 'Facilities', image: images.worker, description: 'Maintenance and repair essentials.' }, { id: 4, name: 'Infrastructure', image: images.safety, description: 'Safety and site-ready solutions.' }],
};

const partnerLogoModules = import.meta.glob('../assets/PARTNERS/PARTNERS/*', {
  eager: true,
  import: 'default',
  query: '?url',
});
const partnerLogo = file => partnerLogoModules[`../assets/PARTNERS/PARTNERS/${file}`];
const galleryImageModules = import.meta.glob('../assets/gallary/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
});
const galleryImage = file => galleryImageModules[`../assets/gallary/${file}`];

const brandsData = [
  ['1.png'], ['2.jpg'], ['3.jpg'], ['4.jpg'], ['5.png'], ['6.jpg'], ['7.png'], ['8.jpg'], ['9.png'], ['10.jpg'], ['11.png'], ['12.jpg'], ['13.png'],
  ['14.jpg'], ['15.png'], ['16.jpg'], ['17.png'], ['18.png'], ['19.png'], ['20.png'], ['21.png'], ['22.png'], ['23.png'], ['24.jpg'], ['25.png'], ['26.png'],
].map(([file], index) => ({
  id: `brand-${index + 1}`,
  name: `Brand ${index + 1}`,
  logo: partnerLogo(file),
}));

// Custom hook for count-up animation
function useCountUp(targetValue, duration = 2000) {
  const [value, setValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(easeOutExpo * targetValue);
      
      setValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, targetValue, duration]);

  return { value, elementRef };
}

// Component for hero animated numbers
function AnimatedHeroNumber({ targetValue, suffix = '+', duration = 2000 }) {
  const { value, elementRef } = useCountUp(targetValue, duration);
  
  const formatValue = (val) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return val.toString();
  };

  return (
    <b ref={elementRef}>
      {formatValue(value)}{suffix}
    </b>
  );
}

export default function HomePage({ go }) {
  const [slide, setSlide] = useState(0);
  const { site, categories, products, brands, industries } = homeContent;

  const slides = [site.heroImage, site.heroImage2, site.heroImage3].filter(Boolean);
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setSlide(current => (current + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    { icon: Truck, title: 'Fast Supply', desc: 'Responsive fulfilment for urgent site and maintenance needs.', color: '#e31b16' },
    { icon: HardHat, title: 'Site Ready', desc: 'Products selected for demanding industrial environments.', color: '#ff6b00' },
    { icon: Headphones, title: 'Real Support', desc: 'Talk to a knowledgeable team from enquiry to delivery.', color: '#0d9488' },
    { icon: Shield, title: 'Quality Assured', desc: 'Genuine branded products with warranty protection.', color: '#16a34a' },
    { icon: Package, title: 'Bulk Orders', desc: 'Special pricing and handling for large project quantities.', color: '#7c3aed' },
    { icon: Clock, title: 'Clear Advice', desc: 'Straightforward guidance on specifications and fit.', color: '#f59e0b' },
  ];

  const trustStats = [
    { icon: Award, value: site.trustYears || 25, label: 'Years of Trust', suffix: '' },
    { icon: Users, value: site.happyClients || 2000, label: 'Happy Customers', suffix: '+' },
    { icon: Package, value: site.productCount || 5000, label: 'Products', suffix: '+' },
    { icon: Shield, value: 100, label: 'Genuine Products', suffix: '%' },
  ];

  return (
    <>
      <section className="cms-hero">
        <div>
          <small>{site.welcome || 'Welcome to Raja Electricals'}</small>
          <HeroTitle title={site.heroTitle || 'Powering Every Project.'} />
          <p>{site.heroText || 'Electrical · Hardware · Safety · Industrial Solutions'}</p>
          <div className="hero-numbers">
            <div>
              <AnimatedHeroNumber targetValue={site.trustYears || 25} suffix="" />
              <span>Years of Trust</span>
            </div>
            <div>
              <AnimatedHeroNumber targetValue={site.productCount || 5000} suffix="+" />
              <span>Products</span>
            </div>
            <div>
              <AnimatedHeroNumber targetValue={site.happyClients || 2000} suffix="+" />
              <span>Customers Served</span>
            </div>
          </div>
          <Btn onClick={() => go('products')}>Explore products</Btn> <Btn plain onClick={() => go('contactus')}>Request a quote</Btn>
        </div>
        <div className="hero-image">
          {slides.length
            ? <img key={slides[slide]} src={slides[slide]} alt="Raja Electricals supplies" />
            : <img src={images.worker} alt="Raja Electricals supplies" />}
          <span><Shield size={19} />{site.deliveryText || 'Genuine products. Practical guidance.'}</span>
          {slides.length > 1 && (
            <div className="hero-dots">
              {slides.map((_, index) => (
                <button key={index} aria-label={`Show hero image ${index + 1}`} className={slide === index ? 'active' : ''} onClick={() => setSlide(index)} />
              ))}
            </div>
          )}
        </div>
      </section>




















      <Section
        pill="BRANDS"
        tone="violet"
        title="Brands We Deal With"
        text="Trusted brands organised by the products you need."
      >
        <div className="partner-logo-wall">
          <div className="partner-logo-grid">
            {brandsData.slice(0, 10).map((item, index) => (
              <div className="partner-logo-card" key={item.id} style={{ '--logo-order': index }}>
                <img src={item.logo} alt={item.name} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .partner-logo-wall {
            margin-top: 28px;
            padding: clamp(18px, 3vw, 38px);
            background: linear-gradient(135deg, #f7f9fc, #ffffff);
            border: 1px solid #e5e9ee;
            border-radius: 22px;
            box-shadow: 0 18px 45px rgba(21, 32, 43, 0.07);
          }

          .partner-logo-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 14px;
          }

          .partner-logo-card {
            min-height: 105px;
            display: grid;
            place-items: center;
            padding: 16px;
            border: 1px solid #e7ebef;
            border-radius: 12px;
            background: #fff;
            animation: logo-reveal 0.55s both;
            animation-delay: calc(var(--logo-order) * 55ms);
            animation-timeline: view();
            animation-range: entry 8% cover 28%;
            transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          }

          .partner-logo-card:hover {
            transform: translateY(-5px);
            border-color: #d8b5ff;
            box-shadow: 0 12px 25px rgba(91, 51, 173, 0.13);
          }

          .partner-logo-card img {
            display: block;
            width: 100%;
            max-width: 145px;
            height: 68px;
            object-fit: contain;
          }

          @keyframes logo-reveal {
            from { opacity: 0; transform: translateY(18px) scale(.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          @media (max-width: 700px) {
            .partner-logo-wall { margin-top: 20px; padding: 14px; border-radius: 16px; }
            .partner-logo-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
            .partner-logo-card { min-height: 82px; padding: 10px; }
            .partner-logo-card img { height: 50px; }
          }
        `}</style>
      </Section>

      <Section pill="CATEGORIES" featured sectionClass="category-section" eyebrow="OUR PRODUCT RANGE" title="Everything Your Project Needs" text="One dependable source for electricals, hardware, safety, tools, pumps and infrastructure supplies.">
        <div className="cms-grid category-cms-grid">
          {categories.map(item => (
            <button key={item.id} className="image-card" onClick={() => go('products')}>
              <img src={fallbackImage(item)} alt={item.name} />
              <div><b>{item.name}</b><small>{item.count}</small></div>
            </button>
          ))}
        </div>
      </Section>

      <Section pill="FEATURED" tone="amber" title="Popular Right Now" text="Top-selling products our customers trust.">
        <div className="cms-grid product-cms-grid">
          {products.slice(0, 4).map(item => (
            <article className="product-cms-card" key={item.id}>
              <div><img src={fallbackImage(item)} alt={item.name} /><span>{item.badge}</span></div>
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <button onClick={() => { localStorage.setItem('raja_selected_product', JSON.stringify(item)); go('productdetail'); }}>View details</button>
            </article>
          ))}
        </div>
      </Section>

      <section className="intro-section">
        <div className="intro-shop-image">
          <div className="shop-image-pair">
            <img src={galleryImage('1.webp')} alt="Raja Electricals shop front" />
            <img src={galleryImage('4.webp')} alt="Raja Electricals interior shop display" />
          </div>
          <div className="shop-image-overlay">
            <span>RAJA ELECTRICALS 'N' HARDWARES</span>
            <strong>RKA Innovations · Vellore Premium Bath Fittings</strong>
          </div>
        </div>

        <div className="intro-content">
          <small className="section-kicker">
            Why choose Raja Electricals 'N' Hardwares
          </small>

          <h2>
            Supply that keeps <em>work moving.</em>
          </h2>

          <p
            style={{
              fontSize: '15px',
              lineHeight: '1.85',
              color: 'var(--muted)',
              margin: '0 0 22px'
            }}
          >
            {site.supplyText ||
              'For over two decades, Raja Electricals has helped contractors, facilities and industrial teams source dependable products without unnecessary delays.'}
          </p>

          <ul className="check-list">
            {[
              'Genuine branded products with warranty',
              'Project and bulk-order support',
              'Reliable local delivery within 24 hours',
              'Helpful technical guidance from experts'
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="service-grid">
            {services.map(service => {
              const Icon = service.icon;
              return (
                <article key={service.title}>
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      background: `${service.color}18`,
                      color: service.color,
                      marginBottom: '16px'
                    }}
                  >
                    <Icon size={26} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                </article>
              );
            })}
          </div>
        </div>

        <style>{`
          .intro-section {
            display: grid;
            grid-template-columns: minmax(320px, 0.85fr) minmax(0, 1.6fr);
            gap: 70px;
            align-items: start;
          }

          .intro-shop-image {
            position: relative;
            width: 100%;
            height: 620px;
            overflow: hidden;
            border-radius: 18px;
            background: #f3f3f3;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
          }

          .intro-shop-image img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
            object-position: center;
          }

          .shop-image-pair { display: grid; grid-template-columns: 1.15fr .85fr; height: 100%; }
          .shop-image-pair img { min-width: 0; }

          .intro-shop-image::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.72),
              rgba(0, 0, 0, 0.05) 55%,
              transparent
            );
            pointer-events: none;
          }

          .shop-image-overlay {
            position: absolute;
            z-index: 2;
            left: 28px;
            right: 28px;
            bottom: 28px;
            color: #fff;
          }

          .shop-image-overlay span {
            display: block;
            margin-bottom: 8px;
            color: #ff2b2b;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }

          .shop-image-overlay strong {
            display: block;
            font-size: 22px;
            line-height: 1.25;
          }

          .intro-content {
            min-width: 0;
          }

          .intro-content .section-kicker {
            display: block;
            margin-bottom: 14px;
          }

          .intro-content h2 {
            margin: 0 0 25px;
          }

          .check-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px 35px;
            margin: 0 0 28px;
            padding: 0;
            list-style: none;
          }

          .check-list li {
            position: relative;
            padding-left: 36px;
            font-size: 15px;
            line-height: 1.5;
            font-weight: 700;
          }

          .check-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            top: 0;
            width: 25px;
            height: 25px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #ef1d1d;
            color: #fff;
            font-size: 14px;
            font-weight: 900;
          }

          .service-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .service-grid article {
            min-height: 260px;
            padding: 32px;
            border: 1px solid #e3e3e3;
            background: #fff;
            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              border-color 0.25s ease;
          }

          .service-grid article:hover {
            transform: translateY(-5px);
            border-color: #d5d5d5;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
          }

          .service-grid article h3 {
            margin: 0 0 10px;
          }

          .service-grid article p {
            margin: 0;
            color: var(--muted);
            font-size: 15px;
            line-height: 1.7;
          }

          @media (max-width: 1100px) {
            .intro-section {
              grid-template-columns: 1fr;
              gap: 40px;
            }

            .intro-shop-image {
              height: 420px;
            }

            .service-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (max-width: 700px) {
            .intro-section {
              gap: 30px;
            }

            .intro-shop-image {
              height: 330px;
              border-radius: 14px;
            }

            .shop-image-overlay {
              left: 20px;
              right: 20px;
              bottom: 20px;
            }

            .shop-image-overlay strong {
              font-size: 18px;
            }

            .check-list {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .service-grid {
              grid-template-columns: 1fr;
            }

            .service-grid article {
              min-height: auto;
              padding: 25px;
            }
          }
        `}</style>
      </section>

      

      <Section pill="QUALITY" tone="green" title="Safety, Quality & Reliability" text="Practical standards that guide every recommendation.">
        <div className="quality-points">
          {['Quality Products', 'Trusted Brands', 'Reliable Service', 'Proper Product Guidance', 'Safe & Reliable Solutions'].map(point => <span key={point}><CheckCircle2 size={18} />{point}</span>)}
        </div>
      </Section>

      <Section pill="INDUSTRIES" tone="green" title="Industries We Serve" text="Products and support shaped around your work.">
        <div className="cms-grid industry-cms-grid">
          {industries.map(item => (
            <article className="image-card" key={item.id}>
              <img src={fallbackImage(item)} alt={item.name} />
              <div><b>{item.name}</b><small>{item.description}</small></div>
            </article>
          ))}
        </div>
      </Section>

      <section className="home-trust">
        <div className="home-trust-grid">
          {trustStats.map(stat => {
            const Icon = stat.icon;
            return (
              <div className="home-trust-card" key={stat.label}>
                <Icon size={30} />
                <b>{stat.value}{stat.suffix}</b>
                <small>{stat.label}</small>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand go={go} />
    </>
  );
}

function HeroTitle({ title = '' }) {
  const [first, ...rest] = title.replace(/\.$/, '').split(' ');
  return <h1><span>{first}</span>{rest.length > 0 && <strong>{rest.join(' ')}.</strong>}</h1>;
}

function Section({ pill, tone = 'red', title, text, eyebrow, featured = false, sectionClass = '', children }) {
  const tones = { red: 'var(--red)', amber: '#f59e0b', violet: '#7c3aed', green: '#16a34a' };
  const color = tones[tone] || tones.red;
  const header = featured ? (
    <header className="range-featured">
      <small className="section-pill" style={{ borderColor: color, color, margin: 0 }}>{pill}</small>
      {eyebrow && <small className="range-eyebrow">{eyebrow}</small>}
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: 0 }}>{text}</p>
    </header>
  ) : (
    <header>
      <span className="section-pill" style={{ borderColor: color, color }}>{pill}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
  return (
    <section className={`cms-section ${sectionClass}`.trim()}>
      {header}
      {children}
    </section>
  );
}
