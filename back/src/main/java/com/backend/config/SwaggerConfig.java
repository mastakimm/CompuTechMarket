package com.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Value("${urls.production.api}")
    private String domain;

    @Bean
    public OpenAPI config() {
        return new OpenAPI()
                .addServersItem(new Server().url("http://" + domain).description("production"))
                .addSecurityItem(new SecurityRequirement().addList("accessToken"))
                .components(new Components().addSecuritySchemes("accessToken",
                        new SecurityScheme()
                                .name("accessToken")
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .scheme("accessToken")
                ))
                .info(new Info()
                        .title("CompuTechMarket")
                        .version("v1")
                        .description("CompuTechMarket: E-Commerce. Rest API specifications"));
    }
}
