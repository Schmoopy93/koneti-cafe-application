"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MenuManagement from "@/components/menu/MenuManagement";
import AddCategory from "@/components/forms/AddCategory";
import AddDrink from "@/components/forms/AddDrink";
import Modal from "../ui/Modal";
import type { Drink } from "@/app/[lang]/types/drink";
import type { Category } from "@/app/[lang]/types/category";
import { apiRequest } from "@/utils/api";

interface MenuManagementPageProps {
  drinks: Drink[];
  categories: Category[];
}

const MenuManagementPage: React.FC<MenuManagementPageProps> = ({
  drinks: initialDrinks,
  categories: initialCategories,
}) => {
  const { t } = useTranslation();
  const [drinks, setDrinks] = useState<Drink[]>(initialDrinks);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Greška pri učitavanju kategorija:", err);
    }
  };

  const fetchDrinks = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest("/drinks");
      if (res.ok) setDrinks(await res.json());
    } catch (err) {
      console.error("Greška pri učitavanju pića:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handleri
  const handleAddDrink = () => setShowAddDrink(true);
  const handleAddCategory = () => setShowAddCategory(true);

  const handleDrinkAdded = async () => {
    await fetchDrinks();
    setShowAddDrink(false);
    setEditingDrink(null);
  };

  const handleCategoryAdded = async () => {
    await fetchCategories();
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowAddCategory(true);
  };

  const handleEditDrink = (drink: Drink) => {
    setEditingDrink(drink);
    setShowAddDrink(true);
  };

  const handleDeleteDrink = async (drinkId: string) => {
    try {
      const res = await apiRequest(`/drinks/${drinkId}`, {
        method: "DELETE",
        useToken: true
      });
      if (res.ok) {
        setDrinks((prev) => prev.filter((d) => d._id !== drinkId));
      }
    } catch (err) {
      console.error("Greška pri brisanju pića:", err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const res = await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
        useToken: true
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== categoryId));
        // Also remove drinks that belong to this category
        setDrinks((prev) => prev.filter((d) => d.category?._id !== categoryId));
      }
    } catch (err) {
      console.error("Greška pri brisanju kategorije:", err);
    }
  };

  return (
    <div className="menu-management-page">
      <MenuManagement
        drinks={drinks}
        categories={categories}
        onAddDrink={handleAddDrink}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onEditDrink={handleEditDrink}
        onDeleteDrink={handleDeleteDrink}
        onDeleteCategory={handleDeleteCategory}
        isLoading={isLoading}
      />

      {/* ✅ Modal za kategorije */}
      <Modal
        show={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? t("admin.addCategory.editTitle") : t("admin.addCategory.title")}
        emoji="🍸"
      >
        <AddCategory
          onClose={() => {
            setShowAddCategory(false);
            setEditingCategory(null);
          }}
          onSuccess={handleCategoryAdded}
          editData={editingCategory || undefined}
        />
      </Modal>

      {/* ✅ Modal za pića */}
      <Modal
        show={showAddDrink}
        onClose={() => {
          setShowAddDrink(false);
          setEditingDrink(null);
        }}
        title={editingDrink ? t("admin.addDrink.editTitle") : t("admin.addDrink.title")}
        emoji="🍹"
      >
        <AddDrink
          onClose={() => {
            setShowAddDrink(false);
            setEditingDrink(null);
          }}
          onSuccess={handleDrinkAdded}
          editData={editingDrink || undefined}
        />
      </Modal>
    </div>
  );
};

export default MenuManagementPage;
