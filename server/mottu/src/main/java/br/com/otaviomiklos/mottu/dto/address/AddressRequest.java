package br.com.otaviomiklos.mottu.dto.address;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressRequest {
    
    @NotBlank(message = "O nome da rua é obrigatório")
    private String street;
    
    @NotBlank(message = "O código postal é obrigatório")
    private String zipCode;
    
    @NotBlank(message = "A cidade é obrigatória")
    private String city;
    
    @NotBlank(message = "O estado é obrigatório")
    private String state;
    
    @NotBlank(message = "O país é obrigatório")
    private String country;
}
