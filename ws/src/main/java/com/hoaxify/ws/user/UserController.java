package com.hoaxify.ws.user;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUser;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.vm.UserUpdateVM;
import com.hoaxify.ws.user.vm.UserVM;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

	@Autowired
	UserService userService;

	@CrossOrigin
	@PostMapping("/users")
	@ResponseStatus(HttpStatus.CREATED)
	public GenericResponse createUser(@Valid @RequestBody User user) {
		userService.save(user);
		GenericResponse response = new GenericResponse("kullanici olusturuldu!");
		return response;
	}

	// json yerine dto/vm yöntemi best practise!!!!!!!!!!!!!!!!!!!

	// User objesini UserVm'e donusturmek gerekiyor alttaki yöntemler ile.

//	@GetMapping("/api/1.0/users")
//	Page<UserVm> getUsers(Pageable page) {
//		return userService.getUsers(page).map(new Function<User, UserVm>() {
//
//			@Override
//			public UserVm apply(User user) {
//				return new UserVm(user);
//			}
//		});
//	}

	// lamda hali!!!!!!!!!!

//	@GetMapping("/api/1.0/users")
//	Page<UserVm> getUsers(Pageable page) {
//		return userService.getUsers(page).map((user)-> {
//				return new UserVm(user);
//		});
//	}

	// method reference hali
	// map fonksiyonu içerde tekil olarak tek tek bütün user objelerini UserVm in
	// constructor ına yolluyor
	@GetMapping("/users")
	Page<UserVM> getUsers(Pageable page, @CurrentUser User user) {
		Page<UserVM> userVm = userService.getUsers(page, user).map(UserVM::new);
		return userVm;
	}

	// {username şeklinde identifier ekledim}
	@GetMapping("/users/{username}")
	UserVM getUser(@PathVariable String username) {
		User user = userService.getByUsername(username);
		return new UserVM(user);
	}

	@PutMapping("users/{username}")
	@PreAuthorize("#username == #loggedInUser.username")
	ResponseEntity<?> updateUser(@Valid @RequestBody UserUpdateVM updatedUser, @PathVariable String username,
			@CurrentUser User loggedInUser) throws IOException {
		// spring security nin PreAuthorize özelliği ile alttaki koşulu üstte sağlamış
		// oluyoruz.

//		if(!loggedInUser.getUsername().equals(username))
//		{
//			ApiError error = new ApiError(403, "Cannot change another users data", "/api/1.0/users/"+username);
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
//		}

		User user = userService.updateUser(username, updatedUser);
		return ResponseEntity.ok(new UserVM(user));
	}
	
	@DeleteMapping("users/{username}")
	@PreAuthorize("#username == principal.username")
	public GenericResponse deleteUser(@PathVariable String username) throws IOException {
		userService.deleteUser(username);
		return new GenericResponse("User removed");
	}
}
