package com.cts.project.menuItems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cts.project.menuItems.model.MenuItems;
import com.cts.project.menuItems.service.MenuItemService;

@RestController
@RequestMapping("/api")
public class MenuItemController {
	@Autowired
	private MenuItemService menuItemService;

	@PostMapping("/addMenu")
	public ResponseEntity<MenuItems> addMenuItem(@RequestBody MenuItems menuItem) {
		return new ResponseEntity<>(menuItemService.addMenuItem(menuItem), HttpStatus.CREATED);
	}

	@GetMapping("/viewMenu/{id}")
	public ResponseEntity<MenuItems> getMenuItemById(@PathVariable Long id) {
		return ResponseEntity.ok(menuItemService.getMenuItemById(id));
	}
	@GetMapping("/viewMenu")
	public ResponseEntity<List<MenuItems>> getMenuItem(){
		return ResponseEntity.ok(menuItemService.getAllMenuItems());
	}

	@GetMapping("/menuItems/{restaurantID}")
	public ResponseEntity<List<MenuItems>> getMenuItemsByRestaurant(@PathVariable Long restaurantID) {
		return ResponseEntity.ok(menuItemService.getMenuItemsByRestaurant(restaurantID));
	}

	@PutMapping("/updateMenu/{id}")
	public ResponseEntity<MenuItems> updateMenuItem(@PathVariable Long id, @RequestBody MenuItems updatedMenuItem) {
		return ResponseEntity.ok(menuItemService.updateMenuItem(id, updatedMenuItem));
	}

	@DeleteMapping("/deleteMenu/{id}")
	public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
		menuItemService.deleteMenuItem(id);
		return ResponseEntity.noContent().build();
	}
}
