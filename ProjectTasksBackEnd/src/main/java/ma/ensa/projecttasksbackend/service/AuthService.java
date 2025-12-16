package ma.ensa.projecttasksbackend.service;


import lombok.RequiredArgsConstructor;
import ma.ensa.projecttasksbackend.dto.auth.AuthResponseDTO;
import ma.ensa.projecttasksbackend.dto.auth.LoginRequestDTO;
import ma.ensa.projecttasksbackend.dto.auth.RegisterRequestDTO;
import ma.ensa.projecttasksbackend.entity.User;
import ma.ensa.projecttasksbackend.exception.UserAlreadyExistsException;
import ma.ensa.projecttasksbackend.repository.UserRepository;
import ma.ensa.projecttasksbackend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("Email " + request.email() + " is already registered.");
        }

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList()));

        return new AuthResponseDTO(jwtToken, "Bearer", user.getId());
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow();

        String jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList()));

        return new AuthResponseDTO(jwtToken, "Bearer", user.getId());
    }
}
