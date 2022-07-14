package com.hoaxify.ws.auth;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;
import com.hoaxify.ws.user.vm.UserVM;

@Service
public class AuthService {

	UserRepository userRepository;

	PasswordEncoder passwordEncoder;

	TokenRepository tokenRepository;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			TokenRepository tokenRepository) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.tokenRepository = tokenRepository;
	}

	public AuthResponse authenticate(Credentials credentials) {

		User inDB = userRepository.findByUsername(credentials.getUsername());

		if (inDB == null) {
			throw new AuthException();
		}

		boolean matches = passwordEncoder.matches(credentials.getPassword(), inDB.getPassword());

		if (!matches) {
			throw new AuthException();
		}

		UserVM userVM = new UserVM(inDB);
		Date expireAt = new Date(System.currentTimeMillis() + 30 * 1000);
//		String token = Jwts.builder()
//				.setSubject("" + inDB.getId())
//				.signWith(SignatureAlgorithm.HS512, "my-app-secret")
//				.setExpiration(expireAt).compact();
		String token = generateRandomToken();
		Token tokenEntity = new Token();
		tokenEntity.setToken(token);
		tokenEntity.setUser(inDB);
		tokenRepository.save(tokenEntity);

		AuthResponse response = new AuthResponse();
		response.setUser(userVM);
		response.setToken(token);
		return response;
	}

	@Transactional
	public UserDetails getUserDetails(String token) {

		Optional<Token> optionalToken = tokenRepository.findById(token);
		if (!optionalToken.isPresent()) {
			return null;
		}
		return optionalToken.get().getUser();

//		JwtParser parser = Jwts.parser().setSigningKey("my-app-secret");
//
//		try {
//			parser.parse(token);
//			Claims claims = parser.parseClaimsJws(token).getBody();
//			long userId = Long.valueOf(claims.getSubject());
//			User user = userRepository.getOne(userId);
//			User actualUser = (User) ((HibernateProxy) user).getHibernateLazyInitializer().getImplementation();
//			return actualUser;
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		return null;
	}

	public String generateRandomToken() {
		return UUID.randomUUID().toString().replace("-", "");
	}

	public void clearToken(String token) {
		tokenRepository.deleteById(token);
	}

}
