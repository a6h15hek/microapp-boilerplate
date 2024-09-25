package service.main;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import main.Start;

@SpringBootTest(classes = Start.class)
class StartTests {

    @Test
    void contextLoads() {
        // This test will fail if the application context cannot start
    }
}
