package br.com.otaviomiklos.mottu.dto.subsidiary;

import br.com.otaviomiklos.mottu.dto.address.AddressRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubsidiaryRequest {
    
    @NotBlank(message = "O nome da filial é obrigatório")
    private String name;
    
    @Valid
    @NotNull(message = "O endereço é obrigatório")
    private AddressRequest address;
}
