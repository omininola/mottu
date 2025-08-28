package br.com.otaviomiklos.mottu.dto.address;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressResponse {
    
    private Long id;
    private String street;
    private String zipCode;
    private String city;
    private String state;
    private String country;
}
