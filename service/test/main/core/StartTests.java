package main.core;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import core.Start;

@SpringBootTest(classes = Start.class)
class StartTests {

    @Test
    void contextLoads() {
        // This test will fail if the application context cannot start
    }
}
