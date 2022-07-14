package com.hoaxify.ws.auth;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.hoaxify.ws.user.User;

import lombok.Data;

@Data
@Entity
public class Token {

	@Id
	private String token;
	@ManyToOne
	private User user;
}
