package ma.ensa.projecttasksbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.ensa.projecttasksbackend.dto.auth.AuthResponseDTO;
import ma.ensa.projecttasksbackend.dto.auth.LoginRequestDTO;
import ma.ensa.projecttasksbackend.dto.auth.RegisterRequestDTO;
import ma.ensa.projecttasksbackend.security.CustomUserDetailsService;
import ma.ensa.projecttasksbackend.security.JwtAuthenticationFilter;
import ma.ensa.projecttasksbackend.security.JwtService;
import ma.ensa.projecttasksbackend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    public void testRegister_Success() throws Exception {
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                "Mohamed El Mostafi",
                "mohamed.elmostafi0@gmail.com",
                "password123"
        );

        AuthResponseDTO authResponse = new AuthResponseDTO(
                "fake-jwt-token",
                "Bearer",
                1L
        );

        when(authService.register(any(RegisterRequestDTO.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("fake-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    public void testRegister_ValidationError_EmptyEmail() throws Exception {
        RegisterRequestDTO registerRequest = new RegisterRequestDTO(
                "Mohamed El Mostafi",
                "",
                "password123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testLogin_Success() throws Exception {
        // Prepare test data
        LoginRequestDTO loginRequest = new LoginRequestDTO(
                "mohamed.elmostafi0@gmail.com",
                "password123"
        );

        AuthResponseDTO authResponse = new AuthResponseDTO(
                "fake-jwt-token",
                "Bearer",
                1L
        );

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("fake-jwt-token"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    public void testLogin_ValidationError_InvalidEmail() throws Exception {
        LoginRequestDTO loginRequest = new LoginRequestDTO(
                "invalid-email",
                "password123"
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testLogin_ValidationError_EmptyPassword() throws Exception {
        LoginRequestDTO loginRequest = new LoginRequestDTO(
                "mohamed.elmostafi0@gmail.com",
                ""
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }
}

