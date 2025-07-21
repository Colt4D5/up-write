-- Migration to add contributesToWordCount column to notebook table
-- This will add the column and set default values based on notebook type

ALTER TABLE notebook ADD COLUMN contributes_to_word_count INTEGER DEFAULT 0;

-- Set contributesToWordCount to true for 'chapters' notebooks, false for others
UPDATE notebook SET contributes_to_word_count = 1 WHERE type = 'chapters';
UPDATE notebook SET contributes_to_word_count = 0 WHERE type != 'chapters';
