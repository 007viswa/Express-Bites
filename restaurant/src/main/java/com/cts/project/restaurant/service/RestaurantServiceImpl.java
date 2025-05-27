package com.cts.project.restaurant.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cts.project.restaurant.Client.MenuItemClient;
import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;
import com.cts.project.restaurant.repo.RestaurantRepository;

@Service
public class RestaurantServiceImpl implements RestaurantServiceInterface {

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private MenuItemClient menuItemClient;

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Override
    public Restaurant getRestaurantById(Long id) {
        Optional<Restaurant> opt = restaurantRepository.findById(id);
        Restaurant restaurant = opt.orElse(null);
        List<MenuItemsDTO> menuItems = menuItemClient.getMenuItemsByRestaurant(id);
        restaurant.setMenuItems(menuItems.stream().distinct().toList());
        restaurant.setMenuItems(menuItems);
        return restaurant;
    }
//    @Override
//    public MenuItemsDTO addMenuItemToRestaurant(Long restaurantId, MenuItemsDTO menuItem) {
//        return menuItemClient.addMenuItem(restaurantId, menuItem);
//    }

    @Override
    public Restaurant addRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) {
        Restaurant existingRestaurant = getRestaurantById(id);
        if (existingRestaurant != null) {
            existingRestaurant.setName(updatedRestaurant.getName());
            existingRestaurant.setAddress(updatedRestaurant.getAddress());
            existingRestaurant.setPhoneNumber(updatedRestaurant.getPhoneNumber());
            existingRestaurant.setEmail(updatedRestaurant.getEmail());
            existingRestaurant.setDescription(updatedRestaurant.getDescription());
            return restaurantRepository.save(existingRestaurant);
        } else {
            throw new RuntimeException("Restaurant Not Found");
        }
    }

    @Override
    public Restaurant getRestaurantWithMenu(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Fetch menu items from MenuItem microservice using Feign
        List<MenuItemsDTO> menuItems = menuItemClient.getMenuItemsByRestaurant(restaurantId);

        // Attach menu items to restaurant object
        restaurant.setMenuItems(menuItems);

        return restaurant;
    }

    @Override
    public void deleteRestaurant(long id) {
        restaurantRepository.deleteById(id);
    }
}
