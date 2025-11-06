"use client";

import React, { useState, useEffect } from "react";
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
  name: string;
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [mounted, setMounted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, name: string} | null>(null);
  const itemsPerPage = 8;

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => setMounted(true), []);

  const activeCategory = selectedCategory || categories[0]?._id || "";
  const activeCategoryObj = categories.find(
    (cat) => cat._id === activeCategory
  );

  const getCategoryName = (cat?: Category) => {
    if (!cat || !i18n.isInitialized) return "";
    return typeof cat.name === "object"
      ? cat.name[i18n.language] ?? cat.name.en
      : cat.name;
  };

  const filteredDrinks = drinks
    .filter((d) => d.category?._id === activeCategory)
    .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
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

  return (
    <div className="drink-menu-layout">
      {!isMobile && (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <img
              src="/koneti-logo.png"
              alt="Koneti Logo"
              className="logo-img"
            />
          </div>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon
              icon={collapsed ? faChevronRight : faChevronLeft}
            />
          </button>
          <div className="sidebar-title">
            {activeCategoryObj
              ? getCategoryName(activeCategoryObj)
              : t("menu.title")}
          </div>
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  activeCategory === cat._id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat._id)}
                title={getCategoryName(cat)}
              >
                {cat.icon && (
                  <FontAwesomeIcon
                    icon={faIconsMap[cat.icon]}
                    className="icon"
                  />
                )}
                <span>{getCategoryName(cat)}</span>
                <span className="category-count">
                  {drinks.filter(d => d.category?._id === cat._id).length}
                </span>
              </button>
            ))}
          </div>
        </aside>
      )}

      <motion.main
        key={activeCategory + currentPage}
        className="drink-content"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {isMobile && (
          <div className="mobile-category-grid">
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-btn ${
                  activeCategory === cat._id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.icon && (
                  <FontAwesomeIcon
                    icon={faIconsMap[cat.icon]}
                    className="icon"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <h2 className="content-title">
          <span className="highlight">
            {activeCategoryObj
              ? getCategoryName(activeCategoryObj)
              : t("menu.title")}
          </span>
          {filteredDrinks.length > 0 && (
            <span className="results-count">
              ({filteredDrinks.length} {t("menu.itemsFound")})
            </span>
          )}
        </h2>

        <div className="menu-controls">
          <div className="search-filter-row">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t("menu.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>

            <div className="filter-container">
              <FontAwesomeIcon icon={faSort} className="filter-icon" />
              <select
                className="filter-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">{t("menu.sortOptions.name")}</option>
                <option value="price-low">{t("menu.sortOptions.priceLow")}</option>
                <option value="price-high">
                  {t("menu.sortOptions.priceHigh")}
                </option>
              </select>
            </div>
          </div>
          
          <div className="pdf-menu-container">
            <button 
              className="pdf-menu-btn view-pdf"
              onClick={() => window.open('/Cenovnik.pdf', '_blank')}
            >
              <FontAwesomeIcon icon={faEye} />
              <span>{t("menu.viewPDF")}</span>
            </button>
            <button 
              className="pdf-menu-btn download-pdf"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Cenovnik.pdf';
                link.download = 'Koneti-Cenovnik.pdf';
                link.click();
              }}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>{t("menu.downloadPDF")}</span>
            </button>
          </div>
        </div>

        {filteredDrinks.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>{t("menu.noResults")}</h3>
            <p>{t("menu.tryDifferent")}</p>
          </div>
        ) : (
          <div className="drinks-grid">
            {currentDrinks.map((drink, index) => (
            <motion.div
              key={drink._id}
              className="drink-card"
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
            >
              <div className="card-inner">
                <div className="image-container">
                  {drink.image ? (
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="drink-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="placeholder-image">
                      <FontAwesomeIcon icon={faCoffee} />
                    </div>
                  )}
                  <div className="card-overlay">
                    <button 
                      className="view-details"
                      onClick={() => {
                        if (drink.image) {
                          setSelectedImage({src: drink.image, name: drink.name});
                          setShowImageModal(true);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </div>
                <div className="card-content">
                  <h3>{drink.name}</h3>
                  <div className="price-container">
                    <span className="price">
                      {drink.price} {t("menu.currency")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {filteredDrinks.length > itemsPerPage && (
          <div className="pagination-controls">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
              {t("menu.pagination.prev")}
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              {t("menu.pagination.next")}
            </button>
          </div>
        )}
      </motion.main>
      
      {showImageModal && selectedImage && (
        <div className="image-modal-backdrop" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img src={selectedImage.src} alt={selectedImage.name} />
            <h3>{selectedImage.name}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuClient;
