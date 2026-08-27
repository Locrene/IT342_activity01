package edu.cit.lobitana.activity01.controller;

import edu.cit.lobitana.activity01.entity.User;
import edu.cit.lobitana.activity01.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import edu.cit.lobitana.activity01.security.JwtUtil;
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;
    public UserController(UserRepository userRepository, JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/register
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Username already taken");
            return ResponseEntity.badRequest().body(error);
        }
        user.setPassword(encoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("id", saved.getId());
        response.put("username", saved.getUsername());
        return ResponseEntity.ok(response);
    }

    // POST /api/login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User credentials) {

        Optional<User> found = userRepository.findByUsername(credentials.getUsername());

        Map<String, Object> response = new HashMap<>();

        if (found.isPresent() && encoder.matches(credentials.getPassword(), found.get().getPassword())) {
            String token = jwtUtil.generateToken(found.get().getUsername());
            response.put("message", "Login successful");
            response.put("id", found.get().getId());
            response.put("username", found.get().getUsername());
            response.put("token", token);
            return ResponseEntity.ok(response);
        }

        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }

    // GET /api/user/{id}
    @GetMapping("/user/{id}")
    public ResponseEntity<Object> getUser(@PathVariable Long id) {

        Optional<User> found = userRepository.findById(id);

        if (found.isPresent()) {
            return ResponseEntity.ok(found.get());
        }

        Map<String, Object> error = new HashMap<>();
        error.put("message", "User with id " + id + " not found");
        return ResponseEntity.status(404).body(error);
    }
}