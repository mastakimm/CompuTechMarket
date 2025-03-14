package com.backend.dto.componentType;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestNewComponentType {
    @NotBlank
    private String name;

    @NotEmpty
    private String picture;
}