-- Seed data for JewelTrack
-- Gold items
INSERT INTO jewellery_items (name, type, carat, weight_grams, amount_spent, remarks, created_at, updated_at)
VALUES
('Bridal Kundan Set', 'GOLD', 22.00, 120.000, 45000.00, 'Bought for wedding, Chennai 2019', NOW(), NOW()),
('Traditional Gold Bangles', 'GOLD', 22.00, 45.500, 16800.00, 'Family heirloom', NOW(), NOW()),
('Gold Necklace 18K', 'GOLD', 18.00, 32.250, 12500.00, 'Simple design for daily wear', NOW(), NOW()),
('Gold Earrings 24K', 'GOLD', 24.00, 12.800, 5800.00, 'Stud earrings', NOW(), NOW()),
('Gold Coin 22K', 'GOLD', 22.00, 8.000, 3200.00, 'Investment coin, 10g', NOW(), NOW()),
('Gold Chain 18K', 'GOLD', 18.00, 25.000, 9500.00, 'Link chain', NOW(), NOW());

-- Silver items
INSERT INTO jewellery_items (name, type, carat, weight_grams, amount_spent, remarks, created_at, updated_at)
VALUES
('Silver Pendant', 'SILVER', NULL, 15.500, 850.00, 'Moon phase design', NOW(), NOW()),
('Silver Bangles', 'SILVER', NULL, 65.000, 3200.00, 'Pair of bangles', NOW(), NOW()),
('Silver Coin 925', 'SILVER', NULL, 25.000, 1200.00, '92.5% silver', NOW(), NOW()),
('Silver Earrings', 'SILVER', NULL, 8.200, 450.00, 'Hoop earrings', NOW(), NOW());

-- Other items
INSERT INTO jewellery_items (name, type, carat, weight_grams, amount_spent, remarks, created_at, updated_at)
VALUES
('Platinum Ring', 'OTHER', NULL, 6.500, 18500.00, 'Engagement ring', NOW(), NOW()),
('Pearl Strand', 'OTHER', NULL, 45.000, 2200.00, 'Freshwater pearls', NOW(), NOW());
