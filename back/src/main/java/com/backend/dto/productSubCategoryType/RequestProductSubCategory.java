package com.backend.dto.productSubCategoryType;


import com.backend.internal.DTO;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@DTO
@Getter
@Setter
public class RequestProductSubCategory {

    @NotEmpty
    @NotNull
    @Size(min=3, max=15)
    private String name;

    @NotNull
    private Long parentCategoryId;
}
