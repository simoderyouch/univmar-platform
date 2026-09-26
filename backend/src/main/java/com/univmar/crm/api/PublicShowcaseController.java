package com.univmar.crm.api;

import static com.univmar.common.api.ApiResponse.of;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.crm.ShowcaseService;
import com.univmar.crm.api.ShowcaseDtos.PublicResponse;
import com.univmar.crm.domain.ShowcaseKind;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/showcase")
public class PublicShowcaseController {
    private final ShowcaseService showcase;
    public PublicShowcaseController(ShowcaseService showcase) { this.showcase = showcase; }
    @GetMapping("/products") public ApiResponse<List<PublicResponse>> products(HttpServletRequest request) { return of(showcase.publicList(ShowcaseKind.PRODUCT), requestId(request)); }
    @GetMapping("/projects") public ApiResponse<List<PublicResponse>> projects(HttpServletRequest request) { return of(showcase.publicList(ShowcaseKind.PROJECT), requestId(request)); }
    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
