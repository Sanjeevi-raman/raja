import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Footer, Header } from './components/Layout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { ProductDetailPage, ProductsPage } from './pages/ProductsPage';
import GalleryPage from './pages/GalleryPage';
import BrandsPage from './pages/BrandsPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';

import { getContent } from './lib/api';
import { testSupabase } from './lib/testSupabase';

import preloaderLogoSrc from './assets/logo/logo.png';
import promotionImage from './assets/addimage/add.jpeg';

import './styles.css';
import './overrides.css';
import './mobile.css';
import './cms.css';
import './fixes.css';
import './footer-fix.css';
import './about.css';
import './home.css';


/* -------------------------------------------------------
   PAGE CONFIGURATION
------------------------------------------------------- */

const pages = {
  home: HomePage,
  about: AboutPage,
  aboutus: AboutPage,
  products: ProductsPage,
  productdetail: ProductDetailPage,
  gallery: GalleryPage,
  brands: BrandsPage,
  contact: ContactPage,
  contactus: ContactPage,
  dashboard: DashboardPage,
};


/* -------------------------------------------------------
   ROUTING
------------------------------------------------------- */

const getPage = () =>
  window.location.hash
    .slice(1)
    .toLowerCase()
    .replaceAll('-', '') || 'home';


/* -------------------------------------------------------
   COMPANY CONTACT DETAILS
------------------------------------------------------- */

const COMPANY_PHONE = '+91 9003900533';

const COMPANY_WHATSAPP = '919003900533';


/* -------------------------------------------------------
   CONTACT DATA CLEANUP
------------------------------------------------------- */

const replaceLegacyContact = (data) => {
  if (!data?.site) {
    return data;
  }

  const site = data.site;

  return {
    ...data,

    site: {
      ...site,

      phone: COMPANY_PHONE,
      whatsappNumber: COMPANY_WHATSAPP,
    },
  };
};


/* -------------------------------------------------------
   PRELOADER
------------------------------------------------------- */

function Preloader() {
  return (
    <div
      className="site-preloader"
      role="status"
      aria-label="Loading Raja Electricals"
    >
      <div className="preloader-brand" aria-hidden="true">

        <span className="preloader-mark-frame">
          <img
            src={preloaderLogoSrc}
            alt=""
          />
        </span>

        <span className="preloader-copy">
          <strong>RAJA</strong>

          <small style={{ color: '#ffffff' }}>
            Electrical 'N' Hardwares
          </small>
        </span>

      </div>

      <div className="preloader-track">
        <i />
      </div>

      <small>
        Loading your electrical solutions
      </small>
    </div>
  );
}


/* -------------------------------------------------------
   MAIN APP
------------------------------------------------------- */

function App() {

  const [page, setPage] = useState(getPage);

  const [content, setContent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showPromotion, setShowPromotion] = useState(true);


  /* -----------------------------------------------------
     LOAD WEBSITE CONTENT
  ----------------------------------------------------- */

  const refreshContent = async () => {
    try {

      const data = await getContent();

      setContent(
        replaceLegacyContact(data)
      );

    } catch (error) {

      console.error(
        'Failed to load website content:',
        error
      );

      setContent({});
    }
  };


  /* -----------------------------------------------------
     INITIAL APP LOAD
  ----------------------------------------------------- */

  useEffect(() => {

    // Test Supabase connection
    testSupabase();

    // Load website content
    refreshContent();


    /*
      Keep your existing preloader behavior.
      It will disappear after 4 seconds.
    */
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 4000);


    /* ---------------------------------------------------
       ADMIN CONTENT UPDATE
    --------------------------------------------------- */

    const refreshOnAdminSave = (event) => {

      if (event.type === 'raja-content-updated' || event.key === 'raja_content_updated') {
        refreshContent();
      }

    };


    /* ---------------------------------------------------
       REFRESH WHEN USER RETURNS TO TAB
    --------------------------------------------------- */

    const refreshOnFocus = () => {
      refreshContent();
    };


    window.addEventListener(
      'storage',
      refreshOnAdminSave
    );

    window.addEventListener(
      'raja-content-updated',
      refreshOnAdminSave
    );

    window.addEventListener(
      'focus',
      refreshOnFocus
    );


    /* ---------------------------------------------------
       CLEANUP
    --------------------------------------------------- */

    return () => {

      window.clearTimeout(timer);

      window.removeEventListener(
        'storage',
        refreshOnAdminSave
      );

      window.removeEventListener(
        'raja-content-updated',
        refreshOnAdminSave
      );

      window.removeEventListener(
        'focus',
        refreshOnFocus
      );

    };

  }, []);


  /* -----------------------------------------------------
     HASH / PAGE CHANGE
  ----------------------------------------------------- */

  useEffect(() => {

    const syncPage = () => {

      setPage(getPage());

      refreshContent();

      window.scrollTo(0, 0);

    };


    window.addEventListener(
      'hashchange',
      syncPage
    );


    return () => {

      window.removeEventListener(
        'hashchange',
        syncPage
      );

    };

  }, []);


  /* -----------------------------------------------------
     NAVIGATION
  ----------------------------------------------------- */

  const go = (target, options = {}) => {

    if (
      (target === 'contact' ||
        target === 'contactus') &&
      !options.keepOrder
    ) {

      localStorage.removeItem(
        'raja_selected_product'
      );

    }


    setPage(target);

    window.location.hash = target;

    window.scrollTo(0, 0);

  };


  /* -----------------------------------------------------
     CURRENT PAGE
  ----------------------------------------------------- */

  const Page =
    pages[page] || HomePage;


  /* -----------------------------------------------------
     DASHBOARD
  ----------------------------------------------------- */

  if (page === 'dashboard') {
    return <Page />;
  }


  /* -----------------------------------------------------
     MAIN WEBSITE
  ----------------------------------------------------- */

  return (
    <>
      {/* PRELOADER */}
      {loading && <Preloader />}


      {/* HEADER */}
      <Header
        go={go}
        site={content?.site}
        currentPage={page}
      />


      {/* PAGE */}
      <Page
        go={go}
        content={content}
      />


      {/* FOOTER */}
      <Footer
        go={go}
        site={content?.site}
      />


      {/* PROMOTION POPUP */}

      {!loading && showPromotion && (

        <div
          className="promotion-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Special offer"
        >

          <div className="promotion-card">

            <button
              type="button"
              className="promotion-close"
              onClick={() =>
                setShowPromotion(false)
              }
              aria-label="Close promotion"
            >
              ×
            </button>


            <img
              src={promotionImage}
              alt="Special offer"
            />


            <button
              type="button"
              className="promotion-cancel"
              onClick={() =>
                setShowPromotion(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </>
  );
}


/* -------------------------------------------------------
   START REACT
------------------------------------------------------- */

createRoot(
  document.getElementById('root')
).render(
  <App />
);
