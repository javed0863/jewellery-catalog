package com.jeweltrack.backend.service;

import com.jeweltrack.backend.dto.DashboardSummary;
import com.jeweltrack.backend.dto.JewelleryItemCreateRequest;
import com.jeweltrack.backend.dto.JewelleryItemDto;
import com.jeweltrack.backend.dto.JewelleryItemUpdateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public interface JewelleryItemService {

    List<JewelleryItemDto> getAllItems(String type, String name, String sort, Integer page, Integer size);

    JewelleryItemDto getItemById(Long id);

    JewelleryItemDto createItem(@Valid JewelleryItemCreateRequest request);

    JewelleryItemDto updateItem(Long id, @Valid JewelleryItemUpdateRequest request);

    void deleteItem(Long id);

    DashboardSummary getDashboardSummary();
}
