package ma.ensa.projecttasksbackend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.ensa.projecttasksbackend.dto.auth.AuthResponseDTO;
import ma.ensa.projecttasksbackend.dto.auth.LoginRequestDTO;
import ma.ensa.projecttasksbackend.dto.auth.RegisterRequestDTO;
import ma.ensa.projecttasksbackend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody @Valid RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

}
