package com.backend.dto;

import com.backend.entities.FileUpload;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileUploadDto {
    private Long id;
    private String file;

    public FileUploadDto(FileUpload fileUpload) {
        this.id = fileUpload.getId();
        this.file = fileUpload.getFile();
    }
}