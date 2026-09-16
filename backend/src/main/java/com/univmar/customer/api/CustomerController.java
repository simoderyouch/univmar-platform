package com.univmar.customer.api;
import com.univmar.customer.CustomerService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/customer") @PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {
    private final CustomerService service; public CustomerController(CustomerService service) { this.service=service; } private Long id(Authentication a){return (Long)a.getPrincipal();}
    @GetMapping("/profile") public CustomerDtos.ProfileResponse profile(Authentication a){return service.profile(id(a));}@PutMapping("/profile") public CustomerDtos.ProfileResponse update(@Valid @RequestBody CustomerDtos.Profile p,Authentication a){return service.updateProfile(id(a),p);}
    @GetMapping("/addresses") public List<CustomerDtos.AddressResponse> addresses(Authentication a){return service.addresses(id(a));}@PostMapping("/addresses") @ResponseStatus(HttpStatus.CREATED) public CustomerDtos.AddressResponse addAddress(@Valid @RequestBody CustomerDtos.Address x,Authentication a){return service.addAddress(id(a),x);}@PutMapping("/addresses/{addressId}") public CustomerDtos.AddressResponse updateAddress(@PathVariable Long addressId,@Valid @RequestBody CustomerDtos.Address x,Authentication a){return service.updateAddress(id(a),addressId,x);}
    @GetMapping("/projects") public List<CustomerDtos.ProjectResponse> projects(Authentication a){return service.projects(id(a));}@PostMapping("/projects") @ResponseStatus(HttpStatus.CREATED) public CustomerDtos.ProjectResponse addProject(@Valid @RequestBody CustomerDtos.Project x,Authentication a){return service.addProject(id(a),x);}@PutMapping("/projects/{projectId}") public CustomerDtos.ProjectResponse updateProject(@PathVariable Long projectId,@Valid @RequestBody CustomerDtos.Project x,Authentication a){return service.updateProject(id(a),projectId,x);}
}
