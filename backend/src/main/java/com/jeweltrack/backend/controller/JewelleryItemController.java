package com.jeweltrack.backend.controller;

import com.jeweltrack.backend.dto.DashboardSummary;
import com.jeweltrack.backend.dto.JewelleryItemCreateRequest;
import com.jeweltrack.backend.dto.JewelleryItemDto;
import com.jeweltrack.backend.dto.JewelleryItemUpdateRequest;
import com.jeweltrack.backend.service.JewelleryItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/api/v1")
public class JewelleryItemController {

    private final JewelleryItemService service;

    public JewelleryItemController(JewelleryItemService service) {
        this.service = service;
    }

    @GetMapping("/items")
    public List<JewelleryItemDto> getAllItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal carat,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return service.getAllItems(type, name, carat, sort, page, size);
    }

    @GetMapping("/items/{id}")
    public JewelleryItemDto getItemById(@PathVariable Long id) {
        return service.getItemById(id);
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public JewelleryItemDto createItem(@Valid @RequestBody JewelleryItemCreateRequest request) {
        return service.createItem(request);
    }

    @PutMapping("/items/{id}")
    public JewelleryItemDto updateItem(@PathVariable Long id, @Valid @RequestBody JewelleryItemUpdateRequest request) {
        return service.updateItem(id, request);
    }

    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
    }

    @GetMapping("/dashboard/summary")
    public DashboardSummary getDashboardSummary() {
        return service.getDashboardSummary();
    }
}
