package com.sabbir.autorepair;

import com.sabbir.autorepair.entity.RepairEntity;
import com.sabbir.autorepair.entity.UserWithPassword;
import com.sabbir.autorepair.model.Repair;
import com.sabbir.autorepair.service.RepairService;
import com.sabbir.autorepair.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.logging.Logger;

@SpringBootApplication(scanBasePackages = {"com.sabbir.autorepair"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Component
class ApplicationLoader implements CommandLineRunner {
    private static Logger logger = Logger.getLogger(CommandLineRunner.class.getName());
    @Autowired
    UserService userService;

    @Autowired
    RepairService repairService;

    @Override
    public void run(String... args) {
        final UserWithPassword manager = new UserWithPassword();
        manager.setUsername("sabbir");
        manager.setPassword("ahmed");
        if (userService.getUserByUsername("sabbir") == null)
            userService.createManager(manager);

        final UserWithPassword user = new UserWithPassword();
        user.setUsername("user1");
        user.setPassword("123456");
        if (userService.getUserByUsername("user1") == null)
            userService.createUser(user);

        RepairEntity repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-23 17:00");
        repairEntity.setRepairName("repair x");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
            logger.info("Repair: " + repair.toString());
        } catch (Exception ex) {

        }

        repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-23 18:00");
        repairEntity.setRepairName("repair y");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
            logger.info("Repair: " + repair.toString());
        } catch (Exception ex) {

        }

        repairEntity = new RepairEntity();
        repairEntity.setDateTime("2017-09-24 17:00");
        repairEntity.setRepairName("repair z");
        repairEntity.setDescription("Hello world");
        repairEntity.setAssignedUserId(2L);
        try {
            final Repair repair = repairService.createRepair(repairEntity);
            logger.info("Repair: " + repair.toString());
        } catch (Exception ex) {

        }

    }
}

@Configuration
class CustomConfiguration {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}

@Configuration
@EnableWebSecurity
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private DataSource dataSource;

    @Value("${spring.queries.users-query}")
    private String usersQuery;

    @Value("${spring.queries.roles-query}")
    private String rolesQuery;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/manager/**").hasAuthority("manager")
                .antMatchers(HttpMethod.GET, "/api/user/all").hasAnyAuthority("manager", "user")
                .antMatchers("/api/user/**").hasAuthority("manager")
                .antMatchers("/api/ping").hasAnyAuthority("manager", "user")
                .antMatchers(HttpMethod.POST, "/api/repair").hasAuthority("manager")
                .antMatchers(HttpMethod.GET, "/api/repair/**").hasAnyAuthority("manager", "user")
                .antMatchers(HttpMethod.PUT, "/api/repair/**").hasAnyAuthority("manager", "user")
                .antMatchers(HttpMethod.DELETE, "/api/repair/**").hasAnyAuthority("manager")
                .antMatchers(HttpMethod.POST, "/api/repair/{id}/comment").hasAnyAuthority("manager", "user")
                .antMatchers(HttpMethod.GET, "/api/repair/{id}/comment").hasAnyAuthority("manager", "user")
                .and()
                .httpBasic().and().logout().disable();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD",
                "GET", "POST", "PUT", "DELETE", "PATCH"));
        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.setAllowCredentials(true);
        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    @Autowired
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.jdbcAuthentication()
                .usersByUsernameQuery(usersQuery)
                .authoritiesByUsernameQuery(rolesQuery)
                .dataSource(dataSource)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    public void configure(WebSecurity web) {
        web.debug(false);
        web.ignoring()
                .antMatchers("/api/registeruser")
                .antMatchers("/api/login")
                .antMatchers("/");
    }
}

@Configuration
class WebApplicationConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
    }


    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
        return container -> {
            container.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND,
                    "/others"));
        };
    }

}



