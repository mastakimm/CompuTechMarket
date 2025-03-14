package com.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

    String saveImageToStorage(MultipartFile uploadDirectory, String imageFile) {

        return imageFile;
    }

    void deleteImageFromStorage(String uploadDirectory, String imageFile) {

    }
}
