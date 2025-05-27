package com.cts.project.restaurant.controller;

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

//import com.cts.project.restaurant.Client.MenuItemClient;
import com.cts.project.restaurant.dto.MenuItemsDTO;
import com.cts.project.restaurant.entity.Restaurant;
import com.cts.project.restaurant.service.RestaurantServiceImpl;

@RestController
@RequestMapping("/restaurant")
public class RestaurantController {
	@Autowired
	private RestaurantServiceImpl restaurantService;
	
	@PostMapping("/addRestaurant")
	public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant){
		return new ResponseEntity<>(restaurantService.addRestaurant(restaurant),HttpStatus.CREATED);
	}
	@GetMapping("/viewAllRestaurant")
	public ResponseEntity<List<Restaurant>> getRestaurant(){
		return ResponseEntity.ok(restaurantService.getAllRestaurants());
	}
	@GetMapping("/viewRestaurantById/{id}")
	public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id){
		return new ResponseEntity<>(restaurantService.getRestaurantById(id),HttpStatus.FOUND);
	}
	@PutMapping("/updateRestaurant/{id}")
	public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id,@RequestBody Restaurant restaurant){
		return new ResponseEntity<>(restaurantService.updateRestaurant(id, restaurant),HttpStatus.ACCEPTED);
	}
	@DeleteMapping("/deleteRestaurant/{id}")
	public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id){
		restaurantService.deleteRestaurant(id);
		return ResponseEntity.noContent().build();
	}
	@GetMapping("/restaurant/{id}")
    public ResponseEntity<Restaurant> getRestaurantWithMenu(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantWithMenu(id);
        return new ResponseEntity<>((restaurant),HttpStatus.FOUND);
    }
	
//	@PostMapping("/{restaurantId}/menuItem")
//    public ResponseEntity<MenuItemsDTO> addMenuItemToRestaurant(@PathVariable Long restaurantId, @RequestBody MenuItemsDTO menuItem) {
//        MenuItemsDTO createdMenuItem = restaurantService.addMenuItemToRestaurant(restaurantId, menuItem);
//        return new ResponseEntity<>(createdMenuItem, HttpStatus.CREATED);
//    }
	
}
