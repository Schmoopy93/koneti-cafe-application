"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSearch,
  faGlassMartiniAlt,
  faChevronLeft,
  faChevronRight,
  faSort,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import { Drink } from "../../app/types/drink";
import { Category } from "../../app/types/category";
import "./MenuManagement.scss";

interface MenuManagementProps {
  drinks: Drink[];
  categories: Category[];
  onAddDrink?: () => void;
  onAddCategory?: () => void;
  onEditDrink?: (drink: Drink) => void;
  onDeleteDrink?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const MenuManagement: React.FC<MenuManagementProps> = ({
  drinks: externalDrinks,
  categories: externalCategories,
  onAddDrink,
  onAddCategory,
  onEditDrink,
  onDeleteDrink,
  isLoading: externalLoading = false,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language || "sr";

  const [categories, setCategories] = useState<Category[]>(externalCategories);
  const [drinks, setDrinks] = useState<Drink[]>(externalDrinks);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Drink | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(externalLoading);
  const itemsPerPage = 8;

  // 🔹 Sync sa props
  useEffect(() => setCategories(externalCategories), [externalCategories]);
  useEffect(() => setDrinks(externalDrinks), [externalDrinks]);
  useEffect(() => setIsLoading(externalLoading), [externalLoading]);
  useEffect(() => setCurrentPage(1), [selectedCategory, searchTerm]);

  // 🔹 ESC zatvara modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowDeleteConfirm(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const getCategoryName = (cat?: Category) => {
    if (!cat) return "";
    if (typeof cat.name === "string") return cat.name;
    return (
      cat.name[language] ?? cat.name["sr"] ?? Object.values(cat.name)[0] ?? ""
    );
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

  // 🔹 Filtriranje i sortiranje
  const filteredDrinks = drinks
    .filter((d) => {
      if (selectedCategory === "all") return true;
      const catId =
        typeof (d as any).categoryId === "string"
          ? (d as any).categoryId
          : d.category?._id;
      return String(catId) === String(selectedCategory);
    })
    .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  const totalPages = Math.ceil(filteredDrinks.length / itemsPerPage);
  const paginatedDrinks = filteredDrinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="menu-management">
      {/* HEADER */}
      <div className="management-header">
        <div className="search-section">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder={t("admin.menuManagement.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="category-tabs">
          <button
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            {t("admin.menuManagement.allCategories")} ({drinks.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={selectedCategory === cat._id ? "active" : ""}
              onClick={() => setSelectedCategory(String(cat._id))}
            >
              {getCategoryName(cat)} (
              {
                drinks.filter(
                  (d) =>
                    String(d.category?._id || (d as any).categoryId) ===
                    String(cat._id)
                ).length
              }
              )
            </button>
          ))}
        </div>

        <div className="filter-container">
          <FontAwesomeIcon icon={faSort} className="filter-icon" />
          <label>{t("admin.menuManagement.sortLabel")}</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">
              {t("admin.menuManagement.sortOptions.name")}
            </option>
            <option value="price-low">
              {t("admin.menuManagement.sortOptions.priceLow")}
            </option>
            <option value="price-high">
              {t("admin.menuManagement.sortOptions.priceHigh")}
            </option>
          </select>
        </div>

        <div className="action-buttons">
          <button className="btn-add-drink" onClick={onAddDrink}>
            <FontAwesomeIcon icon={faPlus} /> {t("admin.addDrink.addButton")}
          </button>
          <button className="btn-add-category" onClick={onAddCategory}>
            <FontAwesomeIcon icon={faTag} /> {t("admin.addCategory.addButton")}
          </button>
        </div>
      </div>

      {/* DRINKS GRID */}
      <div className="admin-drinks-section">
        <h3>
          <FontAwesomeIcon
            icon={faGlassMartiniAlt}
            style={{ marginRight: "0.5rem" }}
          />
          {selectedCategory === "all"
            ? `${t("admin.menuManagement.allDrinks")} (${
                filteredDrinks.length
              })`
            : `${getCategoryName(
                categories.find(
                  (c) => String(c._id) === String(selectedCategory)
                )
              )} (${filteredDrinks.length})`}
        </h3>

        <div className="admin-drinks-grid">
          {isLoading ? (
            <div className="admin-drinks-loading">Loading...</div>
          ) : (
            paginatedDrinks.map((drink) => (
              <div key={drink._id} className="admin-drink-card">
                {(drink as any).image || (drink as any).imageUrl ? (
                  <Image
                    src={(drink as any).image || (drink as any).imageUrl}
                    alt={drink.name}
                    width={200}
                    height={200}
                    className="admin-drink-image"
                  />
                ) : null}
                <div className="admin-card-content">
                  <h4>{drink.name}</h4>
                  <p>{getCategoryName(drink.category)}</p>
                  <span className="price">{drink.price} RSD</span>
                </div>
                <div className="admin-drink-actions">
                  <button
                    onClick={() => onEditDrink?.(drink)}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(drink)}
                    className="delete-btn"
                  >
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
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div
          className="delete-confirm-overlay"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div
            className="delete-confirm-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{t("admin.menuManagement.deleteConfirm.title")}</h3>
            <p>
              {t("admin.menuManagement.deleteConfirm.message")}{" "}
              <strong>{showDeleteConfirm.name}</strong>?
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
                onClick={() => deleteDrink(showDeleteConfirm._id)}
              >
                {t("admin.menuManagement.deleteConfirm.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
