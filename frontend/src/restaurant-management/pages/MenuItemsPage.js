import React from "react";
import MenuItemList from "../components/MenuItems/MenuItemList";

function MenuItemsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Items Management</h1>
      <MenuItemList />
    </div>
  );
}

export default MenuItemsPage;
