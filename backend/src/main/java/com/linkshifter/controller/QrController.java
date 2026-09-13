package com.linkshifter.controller;

import com.google.zxing.WriterException;
import com.linkshifter.service.QrService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QrController {

    private final QrService qrService;

    @Value("${app.base.url}")
    private String baseUrl;

    @GetMapping("/{alias}")
    public ResponseEntity<byte[]> getQrCode(@PathVariable String alias) {
        try {
            String shortUrl = baseUrl + "/" + alias;
            byte[] qrCode = qrService.generateQrCode(shortUrl, 300, 300);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCode);
        } catch (WriterException | IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
