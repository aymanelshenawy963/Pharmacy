-- ============================================================
-- Pharmacy demo catalog seed  (curated: real photos + detailed illustrations)
-- Resets the product catalog to a known, verified set.
-- Safe to run repeatedly (it clears the catalog first, then re-inserts).
--
-- Usage:  sqlcmd -S ".\SQLEXPRESS" -E -d PharmacyDb -i seed-mock-data.sql
-- Note:   this clears existing products, categories, photos and demo orders.
-- ============================================================
SET NOCOUNT ON;

-- 1) Clear existing catalog + demo orders (FK-safe order) ----
DELETE FROM OrderItems;
DELETE FROM Orders;
DELETE FROM Photos;
DELETE FROM Products;
DELETE FROM Categories;

-- 2) Categories ---------------------------------------------
INSERT INTO Categories (Name, Description) VALUES
 (N'Pain Relief',              N'Trusted medicines for everyday aches and pains.'),
 (N'Cold & Flu',               N'Relief and recovery essentials for cold, flu, and infection.'),
 (N'Vitamins & Supplements',   N'Daily nutrition to support your wellbeing.'),
 (N'Skin Care',                N'Targeted treatments for healthy, protected skin.'),
 (N'Personal Care',            N'Everyday hygiene and personal wellness essentials.');

-- 3) Products (CategoryId resolved by name) -----------------
--    Columns: CategoryId, Name, Description, NewPrice, OldPrice, Stock,
--             RequiresPrescription, HasStrips, StripCount, TopSelling
INSERT INTO Products (CategoryId, Name, Description, NewPrice, OldPrice, Stock, RequiresPrescription, HasStrips, StripCount, TopSelling)
VALUES
 ((SELECT Id FROM Categories WHERE Name=N'Pain Relief'),            N'Ibuprofen 200mg Tablets',          N'Anti-inflammatory relief for pain, swelling, and fever.',      7.99, 9.99, 150, 0, 1, 10, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Pain Relief'),            N'Muscle & Joint Pain Relief Gel',   N'Cooling gel that soothes muscle, joint, and back pain.',       8.99, 11.49, 90, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Cold & Flu'),             N'Amoxicillin 500mg Capsules',       N'Broad-spectrum antibiotic for common bacterial infections.',   12.99, 15.99, 60, 1, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Cold & Flu'),             N'Salbutamol Inhaler 100mcg',        N'Reliever inhaler that eases asthma and breathing difficulty.',  13.99, 16.99, 40, 1, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Cold & Flu'),             N'Oral Rehydration Salts (10 Sachets)', N'Replenishes fluids and electrolytes lost to fever or upset stomach.', 4.49, 5.99, 140, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Vitamins & Supplements'), N'Vitamin C 1000mg Effervescent',    N'Immune-supporting vitamin C in a refreshing effervescent tablet.', 7.99, 9.99, 160, 0, 0, NULL, 1),
 ((SELECT Id FROM Categories WHERE Name=N'Vitamins & Supplements'), N'Vitamin D3 2000 IU Softgels',      N'Supports bones, teeth, and immune health year-round.',         10.99, 13.99, 140, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Vitamins & Supplements'), N'Daily Multivitamin Tablets',       N'Complete daily nutrition with 23 vitamins and minerals.',      12.49, 15.99, 130, 0, 0, NULL, 1),
 ((SELECT Id FROM Categories WHERE Name=N'Skin Care'),              N'Hydrocortisone 1% Cream 15g',      N'Calms itching, redness, and skin irritation.',                 7.99, 9.99, 95, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Skin Care'),              N'Sunscreen SPF 50 Face Fluid',      N'Lightweight broad-spectrum sun protection for the face.',      15.99, 19.99, 85, 0, 0, NULL, 1),
 ((SELECT Id FROM Categories WHERE Name=N'Skin Care'),              N'Petroleum Jelly 100ml',            N'Protects and soothes dry, chapped skin and lips.',             4.99, 6.49, 180, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Personal Care'),          N'Lubricant Eye Drops 10ml',         N'Instant relief for dry, tired, or irritated eyes.',            8.49, 10.49, 100, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Personal Care'),          N'Cotton Buds (200 Pack)',           N'Everyday cotton swabs for gentle cleaning and care.',          2.99, 3.99, 300, 0, 0, NULL, 0),
 ((SELECT Id FROM Categories WHERE Name=N'Personal Care'),          N'Antibacterial Hand Sanitizer 250ml', N'Kills 99.9% of germs with 70% alcohol - no water needed.',   4.99, 6.49, 300, 0, 0, NULL, 1);

-- 4) Product images (ProductId resolved by name) ------------
INSERT INTO Photos (ImageName, ProductId)
SELECT v.img, p.Id FROM Products p
JOIN (VALUES
 (N'Ibuprofen 200mg Tablets',            N'/Images/mock/ibuprofen-200mg.jpg'),
 (N'Muscle & Joint Pain Relief Gel',     N'/Images/mock/muscle-gel.svg'),
 (N'Amoxicillin 500mg Capsules',         N'/Images/mock/amoxicillin.jpg'),
 (N'Salbutamol Inhaler 100mcg',          N'/Images/mock/salbutamol-inhaler.jpg'),
 (N'Oral Rehydration Salts (10 Sachets)',N'/Images/mock/ors-sachets.jpg'),
 (N'Vitamin C 1000mg Effervescent',      N'/Images/mock/vitamin-c.svg'),
 (N'Vitamin D3 2000 IU Softgels',        N'/Images/mock/vitamin-d3.svg'),
 (N'Daily Multivitamin Tablets',         N'/Images/mock/multivitamin.svg'),
 (N'Hydrocortisone 1% Cream 15g',        N'/Images/mock/hydrocortisone.jpg'),
 (N'Sunscreen SPF 50 Face Fluid',        N'/Images/mock/sunscreen-spf50.jpg'),
 (N'Petroleum Jelly 100ml',              N'/Images/mock/petroleum-jelly.jpg'),
 (N'Lubricant Eye Drops 10ml',           N'/Images/mock/eye-drops.jpg'),
 (N'Cotton Buds (200 Pack)',             N'/Images/mock/cotton-buds.jpg'),
 (N'Antibacterial Hand Sanitizer 250ml', N'/Images/mock/hand-sanitizer.svg')
) AS v(name, img) ON p.Name = v.name;

PRINT 'Catalog seed complete: 5 categories, 14 products.';
