package com.cts.project.menuItems.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cts.project.menuItems.model.MenuItems;
import com.cts.project.menuItems.repo.MenuItemRepository;

@Service
public class MenuItemService {
	@Autowired
	private MenuItemRepository menuItemRepository;

	public MenuItems addMenuItem(MenuItems menuItem) {
		return menuItemRepository.save(menuItem);
	}

	public List<MenuItems> getAllMenuItems() {
		return menuItemRepository.findAll();
	}

	public MenuItems getMenuItemById(Long id) {
		return menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu Item Not Found"));
	}

	public List<MenuItems> getMenuItemsByRestaurant(Long restaurantID) {
		return menuItemRepository.findByRestaurantID(restaurantID);
	}

	public MenuItems updateMenuItem(Long id, MenuItems updatedMenuItem) {
		MenuItems existingItem = getMenuItemById(id);
		if (existingItem != null) {
			existingItem.setName(updatedMenuItem.getName());
			existingItem.setDescription(updatedMenuItem.getDescription());
			existingItem.setPrice(updatedMenuItem.getPrice());
			return menuItemRepository.save(existingItem);
		} else {
			throw new RuntimeException("Menu Item Not Found");
		}
	}
	public void deleteMenuItem(Long id) {
		menuItemRepository.deleteById(id);
	}

}
