package com.cts.project.restaurant.service;

import java.util.List;

import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;

public interface RestaurantServiceInterface {
	List<Restaurant> getAllRestaurants();
    Restaurant getRestaurantById(Long id);
    Restaurant addRestaurant(Restaurant restaurant);
    Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant);
    Restaurant getRestaurantWithMenu(Long restaurantId);
    void deleteRestaurant(long id);
//	MenuItemsDTO addMenuItemToRestaurant(Long restaurantId, MenuItemsDTO menuItem);
}
