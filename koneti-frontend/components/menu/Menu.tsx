"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faGlassWhiskey,
  faCocktail,
  faWineGlassAlt,
  faBeer,
  faMugHot,
  faWineBottle,
  faGlassMartiniAlt,
  faGlassCheers,
  faGlassWater,
  faBlender,
  faBottleDroplet,
  faChampagneGlasses,
  faIceCream,
  faLemon,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faSort,
  faFilePdf,
  faDownload,
  faEye,
  faTimes,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";
import "./Menu.scss";

interface Category {
  _id: string;
  name: string | Record<string, string>;
  icon?: string;
}

interface Drink {
  _id: string;
  name: string | Record<string, string>;
  price: number;
  image?: string;
  category?: Category;
}

interface MenuClientProps {
  initialCategories: Category[];
  initialDrinks: Drink[];
}

const faIconsMap: Record<string, any> = {
  faCoffee,
  faGlassWhiskey,
  faCocktail,
  faWineGlassAlt,
  faBeer,
  faMugHot,
  faWineBottle,
  faGlassMartiniAlt,
  faGlassCheers,
  faGlassWater,
  faBlender,
  faBottleDroplet,
  faChampagneGlasses,
  faIceCream,
  faLemon,
};

const MenuClient: React.FC<MenuClientProps> = ({
  initialCategories,
  initialDrinks,
}) => {
  const { i18n, t } = useTranslation();

  const [categories] = useState<Category[]>(initialCategories);
  const [drinks] = useState<Drink[]>(initialDrinks);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategories[0]?._id || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastFilterKey, setLastFilterKey] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [mounted, setMounted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, name: string} | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState<number>(-1);
  const itemsPerPage = 8;
  const topRef = useRef<HTMLDivElement>(null);

  const activeCategory = selectedCategory || categories[0]?._id || "";



  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page when category or filters change
  useEffect(() => {
    const currentFilterKey = `${activeCategory}-${searchTerm}-${sortBy}`;
    if (lastFilterKey !== currentFilterKey) {
      setCurrentPage(1);
      setLastFilterKey(currentFilterKey);
    }
  }, [activeCategory, searchTerm, sortBy, lastFilterKey]);
  const activeCategoryObj = Array.isArray(categories) 
    ? categories.find((cat) => cat._id === activeCategory)
    : undefined;

  const getCategoryName = (cat?: Category) => {
    if (!cat || !i18n.isInitialized) return "";
    return typeof cat.name === "object"
      ? cat.name[i18n.language] ?? cat.name.en
      : cat.name;
  };

  const getDrinkName = (drink: Drink) => {
    if (!i18n.isInitialized) return "";
    return typeof drink.name === "object"
      ? drink.name[i18n.language] ?? drink.name.sr ?? drink.name.en ?? ""
      : drink.name;
  };

  const filteredDrinks = drinks
    .filter((d) => d.category?._id === activeCategory)
    .filter((d) => {
      const drinkName = getDrinkName(d);
      return drinkName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = getDrinkName(a);
        const nameB = getDrinkName(b);
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrinks = filteredDrinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top after state update
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll to top after state update
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top after state update
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <motion.div
      className="menu-public-drink-menu-layout"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={topRef}
      role="region"
      aria-label="Meni - Sveže kafe i piće"
      itemScope
      itemType="https://schema.org/Menu"
    >
      {!isMobile && (
        <aside className={`menu-public-sidebar ${collapsed ? "menu-public-collapsed" : ""}`} role="navigation" aria-label="Kategorije menija">
          {/* Centered Logo */}
          <div className="menu-public-sidebar-logo">
            <img
              src="/koneti-logo.png"
              alt="Koneti Café Logo"
              className="menu-public-logo-img"
            />
          </div>

          <button
            className="menu-public-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            aria-controls="category-list"
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
              aria-hidden="true"
            />
          </button>
          <div className="menu-public-sidebar-title">
            {activeCategoryObj
              ? getCategoryName(activeCategoryObj)
              : t("menu.title")}
          </div>

          <div className="menu-public-category-list" id="category-list">
            {Array.isArray(categories) && categories.map((cat) => (
                <motion.button
                  key={cat._id}
                  className={`menu-public-category-btn ${
                    activeCategory === cat._id ? "menu-public-active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat._id)}
                  title={getCategoryName(cat)}
                  aria-label={`${getCategoryName(cat)} kategorija`}
                  aria-pressed={activeCategory === cat._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  itemScope
                  itemType="https://schema.org/MenuSection"
                >
                  {cat.icon && (
                    <FontAwesomeIcon
                      icon={faIconsMap[cat.icon]}
                      className="menu-public-icon"
                      aria-hidden="true"
                    />
                  )}
                  {!collapsed && <span itemProp="name">{getCategoryName(cat)}</span>}
                  {!collapsed && (
                    <span className="menu-public-category-count" aria-label={`${drinks.filter(d => d.category?._id === cat._id).length} stavki`}>
                      {drinks.filter(d => d.category?._id === cat._id).length}
                    </span>
                  )}
                </motion.button>
              ))}
          </div>
        </aside>
      )}

      <motion.main
        key={activeCategory + currentPage}
        className="menu-public-drink-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {isMobile && (
          <div className="menu-public-mobile-category-container">
            <button
              className="menu-public-category-dropdown-trigger"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span className="menu-public-trigger-icon">
                {activeCategoryObj?.icon && (
                  <FontAwesomeIcon icon={faIconsMap[activeCategoryObj.icon]} />
                )}
              </span>
              <span className="menu-public-trigger-text">
                {activeCategoryObj ? getCategoryName(activeCategoryObj) : t("menu.title")}
              </span>
              <FontAwesomeIcon
                icon={showCategoryDropdown ? faChevronRight : faChevronLeft}
                className="menu-public-trigger-chevron"
              />
            </button>

            <div className={`menu-public-mobile-category-grid ${showCategoryDropdown ? 'menu-public-show' : ''}`}>
              {Array.isArray(categories) && categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`menu-public-mobile-category-btn ${
                    activeCategory === cat._id ? "menu-public-active" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setShowCategoryDropdown(false);
                  }}
                  title={getCategoryName(cat)}
                >
                  {cat.icon && (
                    <FontAwesomeIcon
                      icon={faIconsMap[cat.icon]}
                      className="menu-public-icon"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="menu-public-content-header">
          <h2 className="menu-public-content-title">
            <span className="menu-public-highlight">
              {activeCategoryObj
                ? getCategoryName(activeCategoryObj)
                : t("menu.title")}
            </span>
          </h2>
          {filteredDrinks.length > 0 && (
            <div className="menu-public-stats">
              <div className="menu-public-stat-item">
                <span className="menu-public-stat-number">{filteredDrinks.length}</span>
                <span className="menu-public-stat-label">{t("menu.stats.total")} {activeCategoryObj ? getCategoryName(activeCategoryObj) : t("menu.title")}</span>
              </div>
              {totalPages > 1 && (
                <span className="menu-public-stat">
                  {t("admin.galleryManagement.page")}: <strong>{currentPage} {t("admin.galleryManagement.of")} {totalPages}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="menu-public-menu-controls">
          <div className="menu-public-search-filter-row">
            <div className="menu-public-search-container">
              <FontAwesomeIcon icon={faSearch} className="menu-public-search-icon" aria-hidden="true" />
              <input
                type="text"
                className="menu-public-search-input"
                placeholder={t("menu.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t("menu.searchPlaceholder")}
              />
              {searchTerm && (
                <button
                  className="menu-public-clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Očisti pretragu"
                >
                  <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="menu-public-filter-container">
              <FontAwesomeIcon icon={faSort} className="menu-public-filter-icon" aria-hidden="true" />
              <select
                className="menu-public-filter-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sortiraj meni stavke"
              >
                <option value="name">{t("menu.sortOptions.name")}</option>
                <option value="price-low">{t("menu.sortOptions.priceLow")}</option>
                <option value="price-high">
                  {t("menu.sortOptions.priceHigh")}
                </option>
              </select>
            </div>
          </div>

          <div className="menu-public-pdf-menu-container">
            <button
              className="menu-public-pdf-menu-btn menu-public-view-pdf"
              onClick={() => window.open('/Cenovnik.pdf', '_blank')}
              aria-label="Pregledaj PDF meni"
            >
              <FontAwesomeIcon icon={faEye} aria-hidden="true" />
              <span>{t("menu.viewPDF")}</span>
            </button>
            <button
              className="menu-public-pdf-menu-btn menu-public-download-pdf"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Cenovnik.pdf';
                link.download = 'Koneti-Cenovnik.pdf';
                link.click();
              }}
              aria-label="Preuzmi PDF meni"
            >
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
              <span>{t("menu.downloadPDF")}</span>
            </button>
          </div>
        </div>

        {filteredDrinks.length === 0 ? (
          <div className="menu-public-no-results">
            <div className="menu-public-no-results-icon">🔍</div>
            <h3>{t("menu.noResults")}</h3>
            <p>{t("menu.tryDifferent")}</p>
          </div>
        ) : (
          <div className="menu-public-drinks-grid" role="list">
            {currentDrinks.map((drink, index) => (
            <motion.article
              key={drink._id}
              className="menu-public-drink-card"
              initial={mounted ? { opacity: 0, y: 40, scale: 0.9 } : false}
              animate={mounted ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              tabIndex={0}
              role="listitem"
              itemScope
              itemType="https://schema.org/MenuItem"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (drink.image) {
                    setSelectedImage({src: drink.image, name: getDrinkName(drink)});
                    setShowImageModal(true);
                  }
                }
              }}
              style={{
                outline: keyboardFocusIndex === index ? '2px solid var(--color-accent-light)' : 'none',
                outlineOffset: '2px'
              }}
              aria-label={`${getDrinkName(drink)} - ${drink.price} RSD`}
            >
              <div className="menu-public-card-inner">
                <div
                  className="menu-public-image-container"
                  onClick={() => {
                    if (drink.image) {
                      setSelectedImage({src: drink.image, name: getDrinkName(drink)});
                      setShowImageModal(true)
                    }
                  }}
                >
                  {drink.image && !imageErrors.has(drink._id) ? (
                    <img
                      src={drink.image}
                      alt={`Koneti Cafe - ${getDrinkName(drink)} - ${getCategoryName(drink.category)}`}
                      className="menu-public-drink-img"
                      loading="lazy"
                      itemProp="image"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(drink._id));
                      }}
                    />
                  ) : (
                    <div className="menu-public-placeholder-image">
                      <FontAwesomeIcon icon={faCoffee} aria-hidden="true" />
                    </div>
                  )}
                  <div className="menu-public-image-overlay">
                    <FontAwesomeIcon icon={faEye} className="preview-icon" aria-hidden="true" />
                    {/* <span className="preview-text">{t('menu.preview')}</span> */}
                  </div>
                </div>
                <div className="menu-public-drink-info">
                  <h4 itemProp="name">{getDrinkName(drink)}</h4>
                  <p itemProp="description">{getCategoryName(drink.category)}</p>
                  <span className="menu-public-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price">{drink.price}</span>
                    <span itemProp="priceCurrency" content="RSD"> RSD</span>
                  </span>
                </div>
              </div>
            </motion.article>
            ))}
          </div>
        )}

        {filteredDrinks.length > itemsPerPage && (
          <>
            <div className="menu-public-page-info">
              <span className="menu-public-page-label">{t("menu.pagination.pageLabel")}:</span>
              <span className="menu-public-page-current">{currentPage}</span>
              <span className="menu-public-page-separator">{t("menu.pagination.of")}</span>
              <span className="menu-public-page-total">{totalPages}</span>
            </div>
            <div className="menu-public-pagination" role="navigation" aria-label="Navigacija po stranicama">
              <button
                className="menu-public-pagination-btn"
                onClick={goToPrevious}
                disabled={currentPage === 1}
                aria-label="Prethodna stranica"
              >
                <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`menu-public-pagination-btn ${currentPage === page ? 'menu-public-active' : ''}`}
                  onClick={() => goToPage(page)}
                  aria-label={`Stranica ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                className="menu-public-pagination-btn"
                onClick={goToNext}
                disabled={currentPage === totalPages}
                aria-label="Sledeća stranica"
              >
                <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </motion.main>
      
      {showImageModal && selectedImage && (
        <div className="menu-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="menu-modal-content image-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="menu-modal-close" onClick={() => setShowImageModal(false)} aria-label="Zatvori pregled slike">
              <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
            </button>
            <div className="image-preview-container">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.name}
                className="preview-image"
              />
            </div>
            <h3>{getDrinkName({ name: selectedImage.name } as Drink)}</h3>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MenuClient;
