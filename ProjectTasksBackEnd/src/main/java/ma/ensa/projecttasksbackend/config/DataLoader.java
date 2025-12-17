package ma.ensa.projecttasksbackend.config;

import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensa.projecttasksbackend.entity.Project;
import ma.ensa.projecttasksbackend.entity.Task;
import ma.ensa.projecttasksbackend.entity.User;
import ma.ensa.projecttasksbackend.repository.ProjectRepository;
import ma.ensa.projecttasksbackend.repository.TaskRepository;
import ma.ensa.projecttasksbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already exists. Skipping data loading.");
            return;
        }

        log.info("Starting to load fake data...");

        List<User> users = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            User user = User.builder()
                    .fullName(faker.name().fullName())
                    .email(faker.internet().emailAddress())
                    .password(passwordEncoder.encode("password123"))
                    .build();
            users.add(userRepository.save(user));
            log.info("Created user: {} ({})", user.getFullName(), user.getEmail());
        }

        for (User user : users) {
            int projectCount = faker.number().numberBetween(5, 9);
            for (int i = 0; i < projectCount; i++) {
                Project project = Project.builder()
                        .title(faker.app().name() + " Project")
                        .description(faker.lorem().paragraph())
                        .user(user)
                        .build();
                project = projectRepository.save(project);
                log.info("Created project: {} for user: {}", project.getTitle(), user.getFullName());

                int taskCount = faker.number().numberBetween(3, 9);
                for (int j = 0; j < taskCount; j++) {
                    Date dueDate = faker.date().future(30, TimeUnit.DAYS);

                    Task task = Task.builder()
                            .title(faker.lorem().sentence(3, 5).replace(".", ""))
                            .description(faker.lorem().sentence(10, 20))
                            .dueDate(dueDate)
                            .completed(faker.bool().bool())
                            .project(project)
                            .build();
                    taskRepository.save(task);
                }
                log.info("Created {} tasks for project: {}", taskCount, project.getTitle());
            }
        }

        log.info("Fake data loading completed successfully!");
        log.info("Total users: {}", userRepository.count());
        log.info("Total projects: {}", projectRepository.count());
        log.info("Total tasks: {}", taskRepository.count());
    }
}

