package com.hoaxify.ws.hoax;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.hoax.vm.HoaxSubmitVM;
import com.hoaxify.ws.hoax.vm.HoaxVM;
import com.hoaxify.ws.shared.CurrentUser;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.User;

@RestController
@RequestMapping("/api/1.0")
public class HoaxController {
	
	@Autowired
	HoaxService hoaxService;
	
	
	@PostMapping("/hoaxes")
	public GenericResponse saveHoax(@Valid @RequestBody HoaxSubmitVM hoaxSubmitVM ,@CurrentUser User user)
	{
		hoaxService.save(hoaxSubmitVM,user);
		return new GenericResponse("hoax is saved");
	}
	
	@GetMapping("/hoaxes")
	public Page<HoaxVM> getHoaxes(@PageableDefault(sort = "id",direction = Direction.DESC) Pageable page){
		return hoaxService.getHoaxes(page).map(HoaxVM::new);
	}
	
	@GetMapping({"/hoaxes/{id:[0-9]+}","users/{username}/hoaxes/{id:[0-9]+}"}) 
	public ResponseEntity<?> getHoaxesRelative(@PageableDefault(sort = "id",direction = Direction.DESC) Pageable page, 
			@PathVariable long id,
			@PathVariable(required = false) String username,
			@RequestParam(name="count",required = false,defaultValue = "false") boolean count,
			@RequestParam(name="direction",defaultValue="before") String direction){
		if(count==true) {
			long newHoaxCount=hoaxService.getNewHoaxesCount(id,username);
			//newHoaxCount'u alttaki gibi { count:8 } şeklinde bir JSON objesine dönüştürmek gerek.
			Map<String,Long> response=new HashMap<>();
			response.put("count", newHoaxCount);
			return  ResponseEntity.ok(response);
		}
		if(direction.equals("after"))
		{
			List<Hoax> newHoaxes = hoaxService.getNewHoaxes(id,username,page.getSort());
			List<HoaxVM> newHoaxesVM =newHoaxes.stream().map(HoaxVM::new).collect(Collectors.toList());
			return ResponseEntity.ok(newHoaxesVM);
		}
		return ResponseEntity.ok(hoaxService.getOldHoaxes(id,username,page).map(HoaxVM::new));
	}

	@GetMapping("users/{username}/hoaxes")
	public Page<HoaxVM> getUserHoaxes(@PathVariable String username, @PageableDefault(sort = "id",direction = Direction.DESC) Pageable page){
		return hoaxService.getHoaxesOfUser(username,page).map(HoaxVM::new);
	}
	
	@DeleteMapping("/hoaxes/{id:[0-9]+}")
	@PreAuthorize("@hoaxSecurityService.isAllowedToDelete(#id,principal)")
	public GenericResponse deleteHoax (@PathVariable long id) throws IOException
	{
		hoaxService.deleteHoax(id);
		return new GenericResponse("Hoax removed");
	}
	

	
	
//	@GetMapping("users/{username}/hoaxes/{id:[0-9]+}")
//	public ResponseEntity<?> getUserHoaxesRelative(@PathVariable String username, @PageableDefault(sort = "id",direction = Direction.DESC) Pageable page,
//			@PathVariable long id,@RequestParam(name="count",required = false,defaultValue = "false") boolean count,
//			@RequestParam(name="direction",defaultValue="before") String direction){
//				if(count==true) {
//			long newHoaxCountOfUser=hoaxService.getNewHoaxesCountOfUser(id,username);
//			//newHoaxCount'u alttaki gibi { count:8 } şeklinde bir JSON objesine dönüştürmek gerek.
//			Map<String,Long> response=new HashMap<>();
//			response.put("count", newHoaxCountOfUser);
//			return  ResponseEntity.ok(response);
//		}
//		if(direction.equals("after"))
//		{
//			List<Hoax> newHoaxesOfUser = hoaxService.getNewHoaxesOfUser(username,id,page.getSort());
//			List<HoaxVM> newHoaxesOfUserVM =newHoaxesOfUser.stream().map(HoaxVM::new).collect(Collectors.toList());
//			return ResponseEntity.ok(newHoaxesOfUserVM);
//		}
//		return ResponseEntity.ok(hoaxService.getOldHoaxesOfUser(id,username,page).map(HoaxVM::new));
//	}
	
}
