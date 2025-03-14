package com.backend.services;

import com.backend.entities.Product;
import com.backend.entities.FileUpload;
import com.backend.repositories.FileUploadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileUploadService {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    public FileUpload saveFileUpload(String base64File, Product product) {
        FileUpload fileUpload = new FileUpload();
        fileUpload.setFile(base64File);
        fileUpload.setProduct(product);
        return fileUploadRepository.save(fileUpload);
    }

    public void deleteFileUpload(FileUpload fileUpload) {
        fileUploadRepository.delete(fileUpload);
    }

    public void deleteFileUploadById(Long id) {
        fileUploadRepository.deleteById(id);
    }
}
