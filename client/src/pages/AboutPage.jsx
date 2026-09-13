import { useState } from 'react';
import { Award, Boxes, Building2, Clock, Heart, MapPin, MessageCircle, Quote, ShieldCheck, Star, Target, Truck, Users, Wrench } from 'lucide-react';
import { images } from '../data/catalog';
import { Btn, CountUp, CtaBand, PageHead } from '../components/ui';

const JOURNEY = [
  { year: '2000', title: 'The First Store', text: 'Raja Electricals opens as a modest electrical store in Chennai with a handful of products and a strong commitment to service.' },
  { year: '2008', title: 'Hardware & More', text: 'The range expands into hardware, tools and safety equipment to serve growing demand from local contractors.' },
  { year: '2015', title: 'Bulk & Project Supply', text: 'Raja Electricals begins supporting project and bulk orders for facilities, plants and infrastructure teams.' },
  { year: '2020', title: '5,000+ Products', text: 'The catalogue crosses 5,000 products across 200+ brands with reliable same-day dispatch.' },
  { year: 'Today', title: 'A Trusted Partner', text: 'Thousands of contractors, facilities and industrial teams rely on us for genuine products and practical guidance.' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Genuine & Warranted', text: 'Every product is authentic and covered by manufacturer warranty.' },
  { icon: Users, title: 'Customer First', text: 'Practical guidance from the first enquiry through to delivery.' },
  { icon: Wrench, title: 'The Right Fit', text: 'We help you pick the right product for the job — not just the cheapest.' },
  { icon: Truck, title: 'Reliable Delivery', text: 'Local delivery that keeps your site and project moving.' },
  { icon: Target, title: 'Bulk Support', text: 'Special pricing and handling for large project quantities.' },
  { icon: Heart, title: 'Built on Trust', text: '25 years of long-term relationships, not just transactions.' },
];

export default function AboutPage({ go, content }) {
  const [activeYear, setActiveYear] = useState(0);
  const site = content?.site || {};
  const image = site.aboutImage || (images && images.worker) || site.heroImage;
  const stats = [
    { icon: Clock, number: '25+', label: 'Years of Trust' },
    { icon: Heart, number: '10K+', label: 'Happy Customers' },
    { icon: Boxes, number: '5K+', label: 'Products' },
  ];

  return (
    <>
      <PageHead
        crumb="About Us"
        title={<>Built on <em>Trust.</em><br />Powered by <i>Experience.</i></>}
        desc={site.aboutIntro || 'A dependable supply partner for professionals building, maintaining and growing.'}
      />

      <section className="about-story">
        <div className="about-story-head">
          <span className="about-badge"><Building2 size={18} /> THE RAJA STORY</span>
          <h2>From a Small Store to a <span>Trusted Industry Partner</span></h2>
          <p>A 25-year journey of growth, trust and unwavering commitment to quality.</p>
        </div>

        <div className="about-story-grid">
          <div className="about-story-copy">
            <div className="about-stats">
              {stats.map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label}>
                    <Icon size={20} />
                    <b><CountUp value={stat.number} /></b>
                    <small>{stat.label}</small>
                  </div>
                );
              })}
            </div>

            <div className="about-story-card">
              <span className="about-quote"><Quote size={22} /></span>
              <p>
                Raja Electricals 'N' Hardware began its journey in <strong>2000</strong> as a modest store in{' '}
                <span className="about-pin"><MapPin size={13} />Chennai</span>, starting with a handful of products and a strong commitment to service.
              </p>
              <p>
                {site.aboutDescription || 'For over two decades, Raja Electricals has helped contractors, facilities and industrial teams source dependable products without unnecessary delays.'}
              </p>
              <blockquote>
                Today, with 5000+ products across 200+ brands, we continue to serve Chennai's growing industrial landscape with the same dedication that defined our earliest days.
              </blockquote>
              <div className="about-story-cta">
                <Btn onClick={() => go('products')}><Boxes size={16} /> Explore Products</Btn>
                <Btn plain onClick={() => go('contactus')}><MessageCircle size={16} /> Get in Touch</Btn>
              </div>
            </div>
          </div>

          <div className="about-story-media">
            <figure>
              <img src={image} alt="Raja Electricals team and warehouse" />
              <figcaption>
                <span className="about-rating">
                  {[0, 1, 2, 3, 4].map(index => <Star key={index} />)}<span>4.8/5</span>
                </span>
                <small>Trusted by businesses across Chennai</small>
              </figcaption>
            </figure>
            <div className="about-float about-float-a">
              <span><Award size={22} /></span><b>25+</b><small>Years of Excellence</small>
            </div>
            <div className="about-float about-float-b">
              <span><ShieldCheck size={22} /></span><b>100% Genuine</b><small>Authentic Products</small>
            </div>
          </div>
        </div>
      </section>

      <section className="about-journey">
        <div className="about-journey-head">
          <small>OUR JOURNEY</small>
          <h2>Milestones of <em>Growth</em></h2>
          <p>From one small store to a dependable supply partner — tap a milestone to explore.</p>
        </div>
        <div className="about-timeline">
          {JOURNEY.map((item, index) => (
            <button key={item.year} className={activeYear === index ? 'active' : ''} onClick={() => setActiveYear(index)}>
              <b>{item.year}</b>
              <small>{item.title}</small>
            </button>
          ))}
        </div>
        <div className="about-milestone">
          <b>{JOURNEY[activeYear].year}</b>
          <div>
            <h3>{JOURNEY[activeYear].title}</h3>
            <p>{JOURNEY[activeYear].text}</p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values-head">
          <small>WHAT WE STAND FOR</small>
          <h2>The Values Behind <em>Every Order</em></h2>
        </div>
        <div className="about-values-grid">
          {VALUES.map(value => {
            const Icon = value.icon;
            return (
              <article key={value.title}>
                <span><Icon size={24} /></span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand go={go} />
    </>
  );
}
