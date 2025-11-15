"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faTag,
  faFilter,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faEdit,
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
  faSearch,
  faSort,
  faEye,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import type { Drink } from "../../app/[lang]/types/drink";
import type { Category } from "../../app/[lang]/types/category";
import "./MenuManagement.scss";

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

interface MenuManagementProps {
  drinks: Drink[];
  categories: Category[];
  onAddDrink?: () => void;
  onAddCategory?: () => void;
  onEditCategory?: (category: Category) => void;
  onEditDrink?: (drink: Drink) => void;
  onDeleteDrink?: (id: string) => Promise<void>;
  onDeleteCategory?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const MenuManagement: React.FC<MenuManagementProps> = ({
  drinks,
  categories,
  onAddDrink,
  onAddCategory,
  onEditCategory,
  onEditDrink,
  onDeleteDrink,
  onDeleteCategory,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language || "sr";

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Drink | Category | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [pricePreset, setPricePreset] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastFilterKey, setLastFilterKey] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const itemsPerPage = 10;
  const topRef = useRef<HTMLDivElement>(null);

  // Calculate min and max prices
  const prices = drinks.map(d => d.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Reset page when filters change
  useEffect(() => {
    const currentFilterKey = `${selectedCategories.join(',')}-${priceRange.join(',')}-${searchTerm}-${sortBy}`;
    if (lastFilterKey !== currentFilterKey) {
      setCurrentPage(1);
      setLastFilterKey(currentFilterKey);
    }
  }, [selectedCategories, priceRange, searchTerm, sortBy, lastFilterKey]);

  // 🔹 ESC zatvara modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDeleteConfirm(null);
        setShowImagePreview(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getCategoryName = (cat?: Category) => {
    if (!cat) return "";
    if (typeof cat.name === "string") return cat.name;
    return (
      cat.name[language] ?? cat.name["sr"] ?? Object.values(cat.name)[0] ?? ""
    );
  };

  const getDrinkName = (drink: Drink) => {
    if (!i18n.isInitialized) return "";
    return typeof drink.name === "object"
      ? drink.name[language] ?? drink.name.sr ?? drink.name.en ?? ""
      : drink.name;
  };

  const deleteDrink = async (id: string) => {
    if (!onDeleteDrink) return;
    try {
      await onDeleteDrink(id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePricePreset = (preset: string) => {
    setPricePreset(preset);
    switch (preset) {
      case "<500":
        setPriceRange([minPrice, 500]);
        break;
      case "500–1000":
        setPriceRange([500, 1000]);
        break;
      case ">1000":
        setPriceRange([1000, maxPrice]);
        break;
      default:
        setPriceRange([minPrice, maxPrice]);
    }
  };

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

  const filteredDrinks = drinks
    .filter(drink => {
      const categoryMatch = selectedCategories.length === 0 ||
        selectedCategories.includes(drink.category?._id || (drink as any).categoryId);

      const priceMatch = drink.price >= priceRange[0] && drink.price <= priceRange[1];

      const drinkName = getDrinkName(drink);
      const searchMatch = drinkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(drink.category as Category).toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && priceMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = getDrinkName(a);
        const nameB = getDrinkName(b);
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDrinks = filteredDrinks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      className="menu-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      ref={topRef}
    >
      {/* HEADER */}
      <div className="management-header">
        <div className="search-filter-row">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={t("admin.menuManagement.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ×
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
              <option value="name">{t("admin.menuManagement.sortOptions.name")}</option>
              <option value="priceLow">{t("admin.menuManagement.sortOptions.priceLow")}</option>
              <option value="priceHigh">{t("admin.menuManagement.sortOptions.priceHigh")}</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-add-drink" onClick={onAddDrink}>
            <FontAwesomeIcon icon={faPlus} /> {t("admin.addDrink.addButton")}
          </button>
          <button className="btn-add-category" onClick={onAddCategory}>
            <FontAwesomeIcon icon={faTag} /> {t("admin.addCategory.addButton")}
          </button>
          <button
            className="btn-filters"
            onClick={() => {
              setShowFilters(!showFilters);
              if (!showFilters) setShowCategories(false);
            }}
          >
            <FontAwesomeIcon icon={faFilter} /> {t("admin.menuManagement.filters")}
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
          </button>
          <button
            className="btn-categories"
            onClick={() => {
              setShowCategories(!showCategories);
              if (!showCategories) setShowFilters(false);
            }}
          >
            <FontAwesomeIcon icon={faTag} /> {t("admin.menuManagement.categoriesManagementButton")}
            <FontAwesomeIcon icon={showCategories ? faChevronUp : faChevronDown} />
          </button>
        </div>

        {/* FILTERS COLLAPSIBLE */}
        {showFilters && (
          <div className="filters-container">
            <div className="filters-grid">
              {/* CATEGORIES */}
              <div className="filter-section">
                <h4>{t("admin.menuManagement.categories")}</h4>
                <div className="categories-list">
                  {categories.map((cat) => (
                    <label key={cat._id} className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => handleCategoryToggle(cat._id)}
                      />
                      <span className="checkmark"></span>
                      <FontAwesomeIcon icon={faIconsMap[cat.icon]} className="category-icon" />
                      {getCategoryName(cat)}
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE RANGE SLIDER */}
              <div className="filter-section">
                <h4>{t("admin.menuManagement.priceRange")}</h4>
                <div className="price-slider-container">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="price-slider"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="price-slider"
                  />
                  <div className="price-range-display">
                    {priceRange[0]} RSD - {priceRange[1]} RSD
                  </div>
                </div>
              </div>

              {/* PRICE PRESETS */}
              <div className="filter-section">
                <h4>{t("admin.menuManagement.pricePresets")}</h4>
                <div className="price-presets">
                  <button
                    className={pricePreset === "<500" ? "active" : ""}
                    onClick={() => handlePricePreset("<500")}
                  >
                    {'<500'}
                  </button>
                  <button
                    className={pricePreset === "500–1000" ? "active" : ""}
                    onClick={() => handlePricePreset("500–1000")}
                  >
                    500–1000
                  </button>
                  <button
                    className={pricePreset === ">1000" ? "active" : ""}
                    onClick={() => handlePricePreset(">1000")}
                  >
                    {'>1000'}
                  </button>
                  <button
                    className={pricePreset === "all" ? "active" : ""}
                    onClick={() => handlePricePreset("all")}
                  >
                    {t("admin.menuManagement.all")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CATEGORIES MANAGEMENT COLLAPSIBLE */}
      {showCategories && (
        <div className="categories-management">
          <h4>{t("admin.menuManagement.categoriesManagement")}</h4>
          <div className="categories-list">
            {categories.map((cat) => (
              <div key={cat._id} className="category-item">
                <div className="category-info">
                  <FontAwesomeIcon icon={faIconsMap[cat.icon]} className="category-icon" />
                  <span>{getCategoryName(cat)}</span>
                </div>
                <div className="category-actions">
                  <button className="edit-btn" onClick={() => onEditCategory?.(cat)} title={t("admin.menuManagement.tooltips.editCategory")}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="delete-btn" onClick={() => setShowDeleteConfirm(cat)} title={t("admin.menuManagement.tooltips.deleteCategory")}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRINKS LIST */}
      <div className="drinks-list">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          paginatedDrinks.map((drink) => (
            <div key={drink._id} className="drink-item">
              <div
                className="image-container"
                onClick={() => {
                  if (drink.image) {
                    setPreviewImage(drink.image);
                    setShowImagePreview(true);
                  }
                }}
                style={{ cursor: drink.image ? 'pointer' : 'default' }}
              >
                {drink.image ? (
                  <>
                    <img
                      src={drink.image}
                      alt={getDrinkName(drink)}
                      className="drink-img"
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <FontAwesomeIcon icon={faEye} className="preview-icon" />
                      <span className="preview-text">{t("admin.menuManagement.preview")}</span>
                    </div>
                  </>
                ) : (
                  <div className="placeholder-image">
                    <FontAwesomeIcon icon={faCoffee} />
                  </div>
                )}
              </div>
              <div className="drink-info">
                <h4>{getDrinkName(drink)}</h4>
                <p>{getCategoryName(drink.category as Category)}</p>
                <span className="price">{drink.price} RSD</span>
              </div>
              <div className="drink-actions">
                <button onClick={() => onEditDrink?.(drink)} title={t("admin.menuManagement.tooltips.editDrink")}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => setShowDeleteConfirm(drink)} title={t("admin.menuManagement.tooltips.deleteDrink")}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={goToPrevious}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={goToNext}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-confirm-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDeleteConfirm(null)}>×</button>
            <h3>{t("admin.menuManagement.deleteConfirm.title")}</h3>
            <p>
              {showDeleteConfirm && 'price' in showDeleteConfirm
                ? t("admin.menuManagement.deleteConfirm.drinkMessage")
                : t("admin.menuManagement.deleteConfirm.categoryMessage")
              }{" "}
              {showDeleteConfirm && 'price' in showDeleteConfirm
                ? getDrinkName(showDeleteConfirm)
                : showDeleteConfirm && getCategoryName(showDeleteConfirm as Category)
              }
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                {t("admin.menuManagement.deleteConfirm.cancel")}
              </button>
              <button
                className="btn-confirm"
                onClick={() => {
                  if ('price' in showDeleteConfirm) {
                    // It's a drink
                    deleteDrink(showDeleteConfirm._id);
                  } else {
                    // It's a category
                    onDeleteCategory?.(showDeleteConfirm._id);
                    setShowDeleteConfirm(null);
                  }
                }}
              >
                {t("admin.menuManagement.deleteConfirm.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
      {showImagePreview && (
        <div className="menu-modal-overlay" onClick={() => setShowImagePreview(false)}>
          <div className="menu-modal-content image-preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="menu-modal-close" onClick={() => setShowImagePreview(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="image-preview-container">
              <img
                src={previewImage}
                alt="Full size preview"
                className="preview-image"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MenuManagement;
