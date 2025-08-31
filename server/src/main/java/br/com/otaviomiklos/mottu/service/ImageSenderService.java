package br.com.otaviomiklos.mottu.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.client.RestTemplate;

import br.com.otaviomiklos.mottu.exception.UnableToProcessImage;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class ImageSenderService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> sendImage(byte[] imageBytes, String filename) {

        ByteArrayResource imageResource = new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", imageResource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
            "http://tag_detection:5000/detect",
            requestEntity,
            String.class
        );

        int status = response.getStatusCode().value();
        if (status != 200 && status != 404) throw new UnableToProcessImage("Não foi possível processar a imagem"); 
        return response;
    }
}