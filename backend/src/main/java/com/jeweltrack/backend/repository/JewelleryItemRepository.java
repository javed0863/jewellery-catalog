package com.jeweltrack.backend.repository;

import com.jeweltrack.backend.entity.JewelleryItem;
import com.jeweltrack.backend.entity.JewelleryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface JewelleryItemRepository extends JpaRepository<JewelleryItem, Long> {

    List<JewelleryItem> findByType(JewelleryType type);

    List<JewelleryItem> findByTypeAndNameContainingIgnoreCase(JewelleryType type, String name);

    List<JewelleryItem> findByNameContainingIgnoreCase(String name);

    List<JewelleryItem> findByCarat(BigDecimal carat);

    List<JewelleryItem> findByTypeAndCarat(JewelleryType type, BigDecimal carat);

    @Query("SELECT SUM(i.weightGrams) FROM JewelleryItem i WHERE i.type = :type")
    Optional<BigDecimal> findTotalWeightByType(@Param("type") JewelleryType type);

    @Query("SELECT SUM(i.amountSpent) FROM JewelleryItem i WHERE i.type = :type")
    Optional<BigDecimal> findTotalAmountByType(@Param("type") JewelleryType type);

    @Query("SELECT COUNT(i) FROM JewelleryItem i")
    long countAll();

    @Query("SELECT SUM(i.amountSpent) FROM JewelleryItem i")
    Optional<BigDecimal> findTotalAmountSpent();

    @Query("SELECT j FROM JewelleryItem j " +
           "WHERE (:type IS NULL OR j.type = :type) " +
           "AND (:name IS NULL OR LOWER(j.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:carat IS NULL OR j.carat = :carat)")
    List<JewelleryItem> filterItems(
            @Param("type") JewelleryType type,
            @Param("name") String name,
            @Param("carat") BigDecimal carat);

    @Query("SELECT j FROM JewelleryItem j " +
           "WHERE (:type IS NULL OR j.type = :type) " +
           "AND (:name IS NULL OR LOWER(j.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:carat IS NULL OR j.carat = :carat)")
    List<JewelleryItem> filterItemsWithSort(
            @Param("type") JewelleryType type,
            @Param("name") String name,
            @Param("carat") BigDecimal carat,
            Sort sort);
}
