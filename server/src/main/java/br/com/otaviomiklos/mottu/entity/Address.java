package br.com.otaviomiklos.mottu.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_MOTTU_ADDRESSES")

@Getter
@Setter
@NoArgsConstructor
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ds_street", nullable = false)
    private String street;

    @Column(name = "ds_zipcode", nullable = false)
    private String zipCode;

    @Column(name = "ds_city", nullable = false)
    private String city;

    @Column(name = "ds_state", nullable = false)
    private String state;

    @Column(name = "ds_country", nullable = false)
    private String country;

    @OneToOne(mappedBy = "address")
    private Subsidiary subsidiary;

    @Override
    public String toString() {
        return street + ", " + city + " - " + state + " | " + country + ". " + zipCode; 
    }
}