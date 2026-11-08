package com.jeweltrack.backend.service;

import com.jeweltrack.backend.entity.JewelleryItem;
import com.jeweltrack.backend.entity.JewelleryType;
import com.jeweltrack.backend.repository.JewelleryItemRepository;
import com.jeweltrack.backend.dto.*;
import com.jeweltrack.backend.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JewelleryItemServiceImpl implements JewelleryItemService {

    private final JewelleryItemRepository repository;

    public JewelleryItemServiceImpl(JewelleryItemRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<JewelleryItemDto> getAllItems(String type, String name, BigDecimal carat, String sort, Integer page, Integer size) {
        JewelleryType jewelleryType = type != null ? JewelleryType.valueOf(type) : null;

        // Build sort specification
        Sort sortObj = Sort.unsorted();
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            String sortField = sortParts[0];
            boolean ascending = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc");
            sortObj = Sort.by(ascending ? Sort.Order.asc(sortField) : Sort.Order.desc(sortField));
        }

        List<JewelleryItem> items = repository.filterItemsWithSort(jewelleryType, name, carat, sortObj);

        return items.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public JewelleryItemDto getItemById(Long id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }

    @Override
    public JewelleryItemDto createItem(@Valid JewelleryItemCreateRequest request) {
        JewelleryItem item = new JewelleryItem();
        item.setName(request.getName());
        item.setType(JewelleryType.valueOf(request.getType()));
        item.setCarat(request.getCarat());
        item.setWeightGrams(request.getWeightGrams());
        item.setAmountSpent(request.getAmountSpent());
        item.setRemarks(request.getRemarks());

        JewelleryItem saved = repository.save(item);
        return toDto(saved);
    }

    @Override
    public JewelleryItemDto updateItem(Long id, @Valid JewelleryItemUpdateRequest request) {
        JewelleryItem existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        existing.setName(request.getName());
        existing.setType(JewelleryType.valueOf(request.getType()));
        existing.setCarat(request.getCarat());
        existing.setWeightGrams(request.getWeightGrams());
        existing.setAmountSpent(request.getAmountSpent());
        existing.setRemarks(request.getRemarks());

        JewelleryItem updated = repository.save(existing);
        return toDto(updated);
    }

    @Override
    public void deleteItem(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Item not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public DashboardSummary getDashboardSummary() {
        DashboardSummary summary = new DashboardSummary();

        summary.setTotalGoldGrams(getTotalWeight(JewelleryType.GOLD));
        summary.setTotalGoldValue(getTotalValue(JewelleryType.GOLD));
        summary.setTotalSilverGrams(getTotalWeight(JewelleryType.SILVER));
        summary.setTotalSilverValue(getTotalValue(JewelleryType.SILVER));
        summary.setTotalOtherGrams(getTotalWeight(JewelleryType.OTHER));
        summary.setTotalOtherValue(getTotalValue(JewelleryType.OTHER));
        summary.setTotalItems((int) repository.countAll());
        summary.setTotalAmountSpent(getTotalAmountSpent());

        return summary;
    }

    private BigDecimal getTotalWeight(JewelleryType type) {
        return repository.findTotalWeightByType(type).orElse(BigDecimal.ZERO);
    }

    private BigDecimal getTotalValue(JewelleryType type) {
        return repository.findTotalAmountByType(type).orElse(BigDecimal.ZERO);
    }

    private BigDecimal getTotalAmountSpent() {
        return repository.findTotalAmountSpent().orElse(BigDecimal.ZERO);
    }

    private JewelleryItemDto toDto(JewelleryItem item) {
        JewelleryItemDto dto = new JewelleryItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setType(item.getType().name());
        dto.setCarat(item.getCarat());
        dto.setWeightGrams(item.getWeightGrams());
        dto.setAmountSpent(item.getAmountSpent());
        dto.setRemarks(item.getRemarks());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
