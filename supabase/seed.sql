-- supabase/seed.sql
-- Starter data for the Jeopardy-style 6x6 board game.
-- Run AFTER applying supabase/migrations/0001_board_schema.sql.
--
-- 8 categories × 3 point values (200/400/600) × 4 questions = 96 questions.
-- Pool has >=2 active questions per (category, point_value) so the
-- game-creation step can pick 2 distinct ones per cell.

INSERT INTO categories (name_ar, name_en, icon_url, sort_order) VALUES
  ('معلومات عامة',   'General Knowledge', NULL, 1),
  ('جغرافيا',         'Geography',         NULL, 2),
  ('رياضة',           'Sports',            NULL, 3),
  ('أفلام ومسلسلات',  'Movies & TV',       NULL, 4),
  ('تاريخ',           'History',           NULL, 5),
  ('علوم',            'Science',           NULL, 6),
  ('ألعاب',           'Gaming',            NULL, 7),
  ('فن وموسيقى',      'Art & Music',       NULL, 8)
ON CONFLICT DO NOTHING;

INSERT INTO questions
  (category_id, point_value, question_text_ar, answer_text_ar, is_active)
VALUES

-- ═══════════════════════════════════════════════════════════════
-- معلومات عامة — General Knowledge
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='General Knowledge'), 200,
 'ما هي عاصمة المملكة العربية السعودية؟', 'الرياض', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 200,
 'كم عدد أيام السنة الميلادية العادية؟', '365', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 200,
 'ما هو أكبر كوكب في المجموعة الشمسية؟', 'المشتري', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 200,
 'كم عدد أضلاع المثلث؟', '3', true),

-- 400
((SELECT id FROM categories WHERE name_en='General Knowledge'), 400,
 'ما هو أكبر محيطات العالم؟', 'المحيط الهادئ', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 400,
 'من اخترع الهاتف؟', 'غراهام بيل', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 400,
 'ما هي عاصمة اليابان؟', 'طوكيو', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 400,
 'كم عدد قارات العالم؟', '7', true),

-- 600
((SELECT id FROM categories WHERE name_en='General Knowledge'), 600,
 'كم عدد عظام جسم الإنسان البالغ؟', '206', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 600,
 'ما هو الرمز الكيميائي للذهب؟', 'Au', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 600,
 'من اكتشف البنسلين؟', 'ألكسندر فلمنج', true),
((SELECT id FROM categories WHERE name_en='General Knowledge'), 600,
 'ما هي أسرع حيوان بري في العالم؟', 'الفهد', true),

-- ═══════════════════════════════════════════════════════════════
-- جغرافيا — Geography
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Geography'), 200,
 'ما هي أكبر قارة في العالم؟', 'آسيا', true),
((SELECT id FROM categories WHERE name_en='Geography'), 200,
 'ما هي عاصمة مصر؟', 'القاهرة', true),
((SELECT id FROM categories WHERE name_en='Geography'), 200,
 'ما هي عاصمة الإمارات العربية المتحدة؟', 'أبوظبي', true),
((SELECT id FROM categories WHERE name_en='Geography'), 200,
 'أي نهر هو الأطول في العالم؟', 'النيل', true),

-- 400
((SELECT id FROM categories WHERE name_en='Geography'), 400,
 'ما هي أصغر قارة في العالم؟', 'أستراليا', true),
((SELECT id FROM categories WHERE name_en='Geography'), 400,
 'ما هي عاصمة كندا؟', 'أوتاوا', true),
((SELECT id FROM categories WHERE name_en='Geography'), 400,
 'ما هو اسم المضيق الفاصل بين أوروبا وأفريقيا؟', 'مضيق جبل طارق', true),
((SELECT id FROM categories WHERE name_en='Geography'), 400,
 'كم عدد دول العالم المعترف بها في الأمم المتحدة؟', '193', true),

-- 600
((SELECT id FROM categories WHERE name_en='Geography'), 600,
 'ما هي أصغر دولة في العالم من حيث المساحة؟', 'الفاتيكان', true),
((SELECT id FROM categories WHERE name_en='Geography'), 600,
 'ما هي عاصمة أستراليا؟', 'كانبيرا', true),
((SELECT id FROM categories WHERE name_en='Geography'), 600,
 'ما هو ارتفاع جبل إيفرست تقريبًا؟', '8848 م', true),
((SELECT id FROM categories WHERE name_en='Geography'), 600,
 'أي محيط تمر من خلاله خطوط الطول الـ 180 (خط التاريخ الدولي) بشكل رئيسي؟',
 'المحيط الهادئ', true),

-- ═══════════════════════════════════════════════════════════════
-- رياضة — Sports
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Sports'), 200,
 'كم عدد لاعبي كرة القدم من كل فريق في الملعب؟', '11', true),
((SELECT id FROM categories WHERE name_en='Sports'), 200,
 'أي منتخب فاز بكأس العالم 2022 في قطر؟', 'الأرجنتين', true),
((SELECT id FROM categories WHERE name_en='Sports'), 200,
 'كم مدة مباراة كرة القدم النظامية؟', '90 دقيقة', true),
((SELECT id FROM categories WHERE name_en='Sports'), 200,
 'كم عدد اللاعبين في فريق كرة السلة الواحد على أرض الملعب؟', '5', true),

-- 400
((SELECT id FROM categories WHERE name_en='Sports'), 400,
 'في أي عام فازت البرازيل بأول كأس عالم؟', '1958', true),
((SELECT id FROM categories WHERE name_en='Sports'), 400,
 'أي نادٍ فاز بأكبر عدد من بطولات دوري أبطال أوروبا؟', 'ريال مدريد', true),
((SELECT id FROM categories WHERE name_en='Sports'), 400,
 'ما هي الرياضة التي اشتُهر بها محمد علي كلاي؟', 'الملاكمة', true),
((SELECT id FROM categories WHERE name_en='Sports'), 400,
 'كم عدد أشواط مباراة التنس الكبرى (Grand Slam) للرجال؟', '5', true),

-- 600
((SELECT id FROM categories WHERE name_en='Sports'), 600,
 'في أي عام أُقيمت أولى دورات الألعاب الأولمبية الحديثة؟', '1896', true),
((SELECT id FROM categories WHERE name_en='Sports'), 600,
 'كم ميدالية ذهبية فاز بها مايكل فيلبس في الألعاب الأولمبية؟', '23', true),
((SELECT id FROM categories WHERE name_en='Sports'), 600,
 'أي منتخب فاز بأكبر عدد من كؤوس العالم لكرة القدم؟', 'البرازيل', true),
((SELECT id FROM categories WHERE name_en='Sports'), 600,
 'في أي مدينة يقع ملعب ويمبلدون الشهير؟', 'لندن', true),

-- ═══════════════════════════════════════════════════════════════
-- أفلام ومسلسلات — Movies & TV
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Movies & TV'), 200,
 'في أي عام صدر فيلم تيتانيك؟', '1997', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 200,
 'ما اسم الفيلم الذي تظهر فيه شخصية سيمبا؟', 'الأسد الملك', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 200,
 'من يؤدي دور توني ستارك (Iron Man) في أفلام مارفل؟', 'روبرت داوني جونيور', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 200,
 'ما اسم مسلسل الأطباء الأمريكي الشهير الذي يدور في مستشفى Grey Sloan؟',
 'Grey''s Anatomy', true),

-- 400
((SELECT id FROM categories WHERE name_en='Movies & TV'), 400,
 'من أخرج فيلم Inception؟', 'كريستوفر نولان', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 400,
 'ما هو الفيلم الأعلى إيرادًا في تاريخ السينما؟', 'أفاتار', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 400,
 'ما اسم المسلسل الأمريكي الذي تدور أحداثه حول صنع المخدرات في نيو مكسيكو؟',
 'Breaking Bad', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 400,
 'في أي عام صدر فيلم The Dark Knight؟', '2008', true),

-- 600
((SELECT id FROM categories WHERE name_en='Movies & TV'), 600,
 'من فاز بجائزة أوسكار أفضل ممثل عن دوره في فيلم Forrest Gump؟', 'توم هانكس', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 600,
 'ما هي جنسية مخرج فيلم Parasite الحائز على أوسكار أفضل فيلم 2020؟',
 'كورية جنوبية', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 600,
 'من أخرج فيلم Pulp Fiction؟', 'كوينتن تارانتينو', true),
((SELECT id FROM categories WHERE name_en='Movies & TV'), 600,
 'كم عدد حلقات مسلسل Game of Thrones إجمالًا؟', '73', true),

-- ═══════════════════════════════════════════════════════════════
-- تاريخ — History
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='History'), 200,
 'من هو أول رئيس للولايات المتحدة الأمريكية؟', 'جورج واشنطن', true),
((SELECT id FROM categories WHERE name_en='History'), 200,
 'في أي عام بدأت الحرب العالمية الثانية؟', '1939', true),
((SELECT id FROM categories WHERE name_en='History'), 200,
 'ما هي الحضارة القديمة التي بنت الأهرامات؟', 'المصريون القدماء', true),
((SELECT id FROM categories WHERE name_en='History'), 200,
 'من هو النبي الذي أُنزل عليه القرآن الكريم؟', 'محمد ﷺ', true),

-- 400
((SELECT id FROM categories WHERE name_en='History'), 400,
 'في أي عام سقط جدار برلين؟', '1989', true),
((SELECT id FROM categories WHERE name_en='History'), 400,
 'في أي عام استقلت الهند عن بريطانيا؟', '1947', true),
((SELECT id FROM categories WHERE name_en='History'), 400,
 'من قاد الثورة الفرنسية إلى السلطة لاحقًا وأصبح إمبراطورًا؟',
 'نابليون بونابرت', true),
((SELECT id FROM categories WHERE name_en='History'), 400,
 'في أي مدينة ألقيت أول قنبلة ذرية في التاريخ؟', 'هيروشيما', true),

-- 600
((SELECT id FROM categories WHERE name_en='History'), 600,
 'في أي عام هبط الإنسان على سطح القمر لأول مرة؟', '1969', true),
((SELECT id FROM categories WHERE name_en='History'), 600,
 'ما هي أول امرأة تفوز بجائزة نوبل؟', 'ماري كوري', true),
((SELECT id FROM categories WHERE name_en='History'), 600,
 'في أي عام سقطت الإمبراطورية الرومانية الغربية؟', '476 م', true),
((SELECT id FROM categories WHERE name_en='History'), 600,
 'من كتب وثيقة الاستقلال الأمريكية عام 1776؟', 'توماس جيفرسون', true),

-- ═══════════════════════════════════════════════════════════════
-- علوم — Science
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Science'), 200,
 'ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟', 'النيتروجين', true),
((SELECT id FROM categories WHERE name_en='Science'), 200,
 'ما هو الرمز الكيميائي للأكسجين؟', 'O', true),
((SELECT id FROM categories WHERE name_en='Science'), 200,
 'ما هي درجة غليان الماء على مستوى سطح البحر؟', '100 درجة مئوية', true),
((SELECT id FROM categories WHERE name_en='Science'), 200,
 'ما هو أصغر كوكب في المجموعة الشمسية؟', 'عطارد', true),

-- 400
((SELECT id FROM categories WHERE name_en='Science'), 400,
 'كم عدد عناصر الجدول الدوري؟', '118', true),
((SELECT id FROM categories WHERE name_en='Science'), 400,
 'من صاغ نظرية النسبية الخاصة؟', 'ألبرت أينشتاين', true),
((SELECT id FROM categories WHERE name_en='Science'), 400,
 'ما هي سرعة الضوء تقريبًا في الفراغ؟', '300,000 كم/ث', true),
((SELECT id FROM categories WHERE name_en='Science'), 400,
 'ما هو الرمز الكيميائي للصوديوم؟', 'Na', true),

-- 600
((SELECT id FROM categories WHERE name_en='Science'), 600,
 'ما هو الجسيم الذي يُعطي المادة كتلتها ويُعرف بـ "جسيم الإله"؟',
 'بوزون هيغز', true),
((SELECT id FROM categories WHERE name_en='Science'), 600,
 'كم عدد كروموسومات الإنسان السليم؟', '46', true),
((SELECT id FROM categories WHERE name_en='Science'), 600,
 'ما هو العنصر الأكثر وفرة في قشرة الأرض؟', 'الأكسجين', true),
((SELECT id FROM categories WHERE name_en='Science'), 600,
 'ما هو الاسم العلمي لعملية تحويل الضوء إلى طاقة في النباتات؟',
 'التمثيل الضوئي', true),

-- ═══════════════════════════════════════════════════════════════
-- ألعاب — Gaming
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Gaming'), 200,
 'ما هي لعبة الفيديو الأكثر مبيعًا في التاريخ؟', 'ماينكرافت', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 200,
 'ما هو اسم البطل الرئيسي في سلسلة The Legend of Zelda؟', 'لينك', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 200,
 'ما هو اسم العدو الرئيسي في سلسلة Super Mario؟', 'بولزر', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 200,
 'ما هي شركة تطوير لعبة Fortnite؟', 'Epic Games', true),

-- 400
((SELECT id FROM categories WHERE name_en='Gaming'), 400,
 'في أي عام أُطلقت لعبة Super Mario Bros لأول مرة؟', '1985', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 400,
 'ما هي شركة تطوير سلسلة God of War؟', 'Santa Monica Studio', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 400,
 'ما هو اسم العالم الخيالي في سلسلة The Elder Scrolls؟', 'Tamriel', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 400,
 'ما هو اسم البطولة العالمية الرسمية للعبة League of Legends؟',
 'World Championship', true),

-- 600
((SELECT id FROM categories WHERE name_en='Gaming'), 600,
 'في أي عام صدرت أول نسخة من لعبة FIFA؟', '1993', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 600,
 'في أي عام صدرت لعبة Half-Life الأولى؟', '1998', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 600,
 'ما هو اسم المطور الياباني الأسطوري خالق سلسلة Metal Gear؟',
 'هيديو كوجيما', true),
((SELECT id FROM categories WHERE name_en='Gaming'), 600,
 'ما هو أطول لعبة RPG من حيث ساعات اللعب في سلسلة Persona؟',
 'Persona 5 Royal', true),

-- ═══════════════════════════════════════════════════════════════
-- فن وموسيقى — Art & Music
-- ═══════════════════════════════════════════════════════════════

-- 200
((SELECT id FROM categories WHERE name_en='Art & Music'), 200,
 'من رسم لوحة الموناليزا؟', 'ليوناردو دافنشي', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 200,
 'من هو الملقب بـ "ملك البوب"؟', 'مايكل جاكسون', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 200,
 'من غنى أغنية "Bohemian Rhapsody"؟', 'كوين', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 200,
 'أين تقع لوحة الموناليزا؟', 'متحف اللوفر — باريس', true),

-- 400
((SELECT id FROM categories WHERE name_en='Art & Music'), 400,
 'من مؤلف سيمفونية القدر (السيمفونية الخامسة)؟', 'بيتهوفن', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 400,
 'ما هو اسم الفرقة الموسيقية التي كان عضوًا فيها جون لينون؟',
 'البيتلز', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 400,
 'من رسم لوحة "الصرخة"؟', 'إدفارد مونك', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 400,
 'في أي عام ظهرت فرقة البيتلز لأول مرة على برنامج Ed Sullivan Show؟',
 '1964', true),

-- 600
((SELECT id FROM categories WHERE name_en='Art & Music'), 600,
 'من مؤلف أوبرا "كارمن"؟', 'جورج بيزيه', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 600,
 'في أي عام رسم بيكاسو لوحة "غيرنيكا"؟', '1937', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 600,
 'من رسم لوحة "The Birth of Venus" (ميلاد فينوس)؟', 'ساندرو بوتيشيلي', true),
((SELECT id FROM categories WHERE name_en='Art & Music'), 600,
 'ما هو الأسلوب الفني الذي ابتكره بيكاسو وبراك؟', 'التكعيبية', true);

-- Verify: should show 8 categories and 96 questions.
SELECT
  (SELECT COUNT(*) FROM categories) AS total_categories,
  (SELECT COUNT(*) FROM questions)  AS total_questions;

-- ═══════════════════════════════════════════════════════════════════════════
-- PHASE 2 SEED — Super-categories + full sub-category list
-- Run AFTER 0002_super_categories.sql migration.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Super-categories ────────────────────────────────────────────────────────
INSERT INTO super_categories (name_ar, icon_emoji, icon_url, sort_order) VALUES
  ('الأردن',    '🇯🇴', 'https://images.unsplash.com/photo-1548783369-623f52a56127?w=120&q=80', 1),
  ('عام',       '🧠', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=120&q=80', 2),
  ('إسلامي',   '🕌', 'https://images.unsplash.com/photo-1565267145629-df9fcea79379?w=120&q=80', 3),
  ('دول',       '🌍', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=120&q=80', 4),
  ('حروف',      '🔤', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=120&q=80', 5),
  ('ولا كلمة', '💬', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&q=80', 6),
  ('تفكير',     '🧩', 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=120&q=80', 7),
  ('بنات',      '💄', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&q=80', 8),
  ('فن عربي',  '🎭', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=120&q=80', 9),
  ('أغاني',    '🎵', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=120&q=80', 10),
  ('فن أجنبي', '🎬', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&q=80', 11),
  ('فن تركي',  '🏰', 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=120&q=80', 12),
  ('كرة قدم',  '⚽', 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=120&q=80', 13),
  ('رياضة',    '🏆', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&q=80', 14),
  ('أنمي',     '🈯', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=120&q=80', 15),
  ('بباي',     '📺', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&q=80', 16),
  ('ألعاب',    '🎮', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&q=80', 17)
ON CONFLICT DO NOTHING;

-- ── Helper: look up a super-category id by name ──────────────────────────────
-- We'll use subselects inline below.

-- ── الأردن sub-categories ────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('الأردن',           'Jordan',           NULL, 'https://images.unsplash.com/photo-1548783369-623f52a56127?w=300&q=80', NULL, NULL, 101, (SELECT id FROM super_categories WHERE name_ar='الأردن')),
  ('شعارات أردنية',    'Jordanian Logos',  NULL, 'https://images.unsplash.com/photo-1580137197581-df2bb346a786?w=300&q=80', NULL, NULL, 102, (SELECT id FROM super_categories WHERE name_ar='الأردن')),
  ('شارع الجوعانين',  'Jawaaeen Street',  NULL, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', NULL, NULL, 103, (SELECT id FROM super_categories WHERE name_ar='الأردن')),
  ('كرة قدم أردنية',  'Jordanian Football',NULL,'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&q=80', NULL, NULL, 104, (SELECT id FROM super_categories WHERE name_ar='الأردن'))
ON CONFLICT DO NOTHING;

-- ── عام sub-categories ───────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('عالم الساعات', 'Watches',        NULL, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80', 51,  3, 201, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('Falcons',       'Falcons',        NULL, 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&q=80', 52,  3, 202, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('لغة وأدب',     'Language & Lit', NULL, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80', NULL,NULL,203, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('عالم الشعر',   'Poetry',         NULL, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80', NULL,NULL,204, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('تاريخ',        'History',        NULL, 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80', NULL,NULL,205, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('سيرة ذاتية',  'Biography',      NULL, 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&q=80', NULL,NULL,206, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('معلومات عامة', 'General Info',   NULL, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80', NULL,NULL,207, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('تكنولوجيا',    'Technology',     NULL, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80', NULL,NULL,208, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('عالم الحيوان', 'Animals',        NULL, 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&q=80', NULL,NULL,209, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('عطور عالمية',  'Perfumes',       NULL, 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&q=80', NULL,NULL,210, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('طب عام',       'Medicine',       NULL, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&q=80', NULL,NULL,211, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('طب الأسنان',   'Dentistry',      NULL, 'https://images.unsplash.com/photo-1588776814546-1ffedbe6d967?w=300&q=80', NULL,NULL,212, (SELECT id FROM super_categories WHERE name_ar='عام')),
  ('سيارات',       'Cars',           NULL, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80', NULL,NULL,213, (SELECT id FROM super_categories WHERE name_ar='عام'))
ON CONFLICT DO NOTHING;

-- ── إسلامي sub-categories ────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('السيرة النبوية', 'Prophetic Seerah', NULL, 'https://images.unsplash.com/photo-1565267145629-df9fcea79379?w=300&q=80', 47, 3, 301, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('قصص الأنبياء',  'Prophets Stories', NULL, 'https://images.unsplash.com/photo-1519817650390-64a993880e39?w=300&q=80', 57, 3, 302, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('الصحابة',       'Companions',       NULL, 'https://images.unsplash.com/photo-1581791538161-8a9f7d2b3da6?w=300&q=80', 15, 3, 303, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('معاني القرآن',  'Quran Meanings',   NULL, 'https://images.unsplash.com/photo-1591981921327-27c71f9b0a30?w=300&q=80', 48, 3, 304, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('جزء عم',        'Juz Amma',         NULL, 'https://images.unsplash.com/photo-1604519754897-1c86f92e9c43?w=300&q=80', 41, 3, 305, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('جزء تبارك',     'Juz Tabarak',      NULL, 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=300&q=80', 15, 3, 306, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('من القارئ',     'Who is Reciting',  NULL, 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=300&q=80', 18, 3, 307, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('أناشيد',        'Nasheeds',         NULL, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80', 15, 3, 308, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('أحاديث',        'Hadith',           NULL, 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=300&q=80', 23, 3, 309, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('إسلامي',        'Islamic',          NULL, 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=300&q=80', NULL,NULL,310, (SELECT id FROM super_categories WHERE name_ar='إسلامي')),
  ('القرآن',        'Quran',            NULL, 'https://images.unsplash.com/photo-1585036156261-1e2ac775f4e5?w=300&q=80', NULL,NULL,311, (SELECT id FROM super_categories WHERE name_ar='إسلامي'))
ON CONFLICT DO NOTHING;

-- ── دول sub-categories ───────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('ما هي الدولة',   'What Country',     NULL, 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=300&q=80', 26, 3, 401, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('رؤساء الدول',    'World Leaders',    NULL, 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&q=80', 20, 3, 402, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('أعلام',          'Flags',            NULL, 'https://images.unsplash.com/photo-1520637836862-4d197d17c70a?w=300&q=80', 33, 3, 403, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('لون العلم',      'Flag Colors',      NULL, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80', 34, 3, 404, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('أعلام قديمة',    'Old Flags',        NULL, 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=300&q=80', 11, 3, 405, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('عواصم',          'Capitals',         NULL, 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80', 36, 3, 406, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('خرايط',          'Maps',             NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', 32, 3, 407, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('الحرب العالمية', 'World War',        NULL, 'https://images.unsplash.com/photo-1533777419517-29dce82cdc72?w=300&q=80', 31, 3, 408, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('النشيد الوطني',  'National Anthem',  NULL, 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=300&q=80',  9, 3, 409, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('لغات ولهجات',    'Languages',        NULL, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=80', 19, 3, 410, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('جغرافيا',        'Geography',        NULL, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80', NULL,NULL,411, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('دول و عواصم',    'Countries & Caps', NULL, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=80', NULL,NULL,412, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('سياحة وسفر',     'Tourism',          NULL, 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=300&q=80', NULL,NULL,413, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('عالم الطيران',   'Aviation',         NULL, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&q=80', NULL,NULL,414, (SELECT id FROM super_categories WHERE name_ar='دول')),
  ('عملات',          'Currencies',       NULL, 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=300&q=80', NULL,NULL,415, (SELECT id FROM super_categories WHERE name_ar='دول'))
ON CONFLICT DO NOTHING;

-- ── حروف sub-categories ──────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('حروف',          'Letters',          NULL, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80', 218, 3, 501, (SELECT id FROM super_categories WHERE name_ar='حروف')),
  ('حروف إسلامي',   'Islamic Letters',  NULL, 'https://images.unsplash.com/photo-1585036156261-1e2ac775f4e5?w=300&q=80',  34, 3, 502, (SELECT id FROM super_categories WHERE name_ar='حروف')),
  ('حروف كروية',    'Football Letters', NULL, 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=300&q=80',     49, 3, 503, (SELECT id FROM super_categories WHERE name_ar='حروف')),
  ('حروف أنمي',     'Anime Letters',    NULL, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80',  50, 3, 504, (SELECT id FROM super_categories WHERE name_ar='حروف')),
  ('حروف متحركة',   'Motion Letters',   NULL, 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=300&q=80', NULL,NULL,505, (SELECT id FROM super_categories WHERE name_ar='حروف'))
ON CONFLICT DO NOTHING;

-- ── ولا كلمة sub-categories ──────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('ولا كلمة مصارعة', 'WWE No Word',    NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80', 23, 3, 601, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة')),
  ('ولا كلمة أنمي',   'Anime No Word',  NULL, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80', 44, 3, 602, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة')),
  ('ولا كلمة',        'No Word',        NULL, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80', NULL,NULL,603, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة')),
  ('ولا كلمة عامة',   'General No Word',NULL, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80', NULL,NULL,604, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة')),
  ('ولا كلمة كروية',  'Football No Word',NULL,'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=300&q=80',   NULL,NULL,605, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة')),
  ('ولا كلمة فن أجنبي','Foreign Art NW',NULL, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80',NULL,NULL,606, (SELECT id FROM super_categories WHERE name_ar='ولا كلمة'))
ON CONFLICT DO NOTHING;

-- ── تفكير sub-categories ──────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('ركز شوي',       'Focus',           NULL, 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=300&q=80', 174, 3, 701, (SELECT id FROM super_categories WHERE name_ar='تفكير')),
  ('خمن الصورة',    'Guess the Image', NULL, 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=300&q=80', 102, 3, 702, (SELECT id FROM super_categories WHERE name_ar='تفكير')),
  ('كلمات معكوسة',  'Reversed Words',  NULL, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=80',  49, 3, 703, (SELECT id FROM super_categories WHERE name_ar='تفكير')),
  ('لون الصورة',    'Image Color',     NULL, 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',  29, 3, 704, (SELECT id FROM super_categories WHERE name_ar='تفكير')),
  ('رسم',           'Drawing',         NULL, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80', NULL,NULL,705, (SELECT id FROM super_categories WHERE name_ar='تفكير'))
ON CONFLICT DO NOTHING;

-- ── بنات sub-categories ───────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('بنات وبس',  'Girls Only',  NULL, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80', NULL,NULL,801, (SELECT id FROM super_categories WHERE name_ar='بنات')),
  ('براندات',    'Brands',      NULL, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80', NULL,NULL,802, (SELECT id FROM super_categories WHERE name_ar='بنات')),
  ('Cosmetics',  'Cosmetics',   NULL, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80', NULL,NULL,803, (SELECT id FROM super_categories WHERE name_ar='بنات'))
ON CONFLICT DO NOTHING;

-- ── فن عربي sub-categories ───────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('الزير سالم',      'Al-Zeer Salem',    NULL, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80', 35, 3, 901, (SELECT id FROM super_categories WHERE name_ar='فن عربي')),
  ('باب الحارة',      'Bab Al-Hara',      NULL, 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=300&q=80', 41, 3, 902, (SELECT id FROM super_categories WHERE name_ar='فن عربي')),
  ('مسرح الزعيم',     'Al-Zaeem Theatre', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', 21, 3, 903, (SELECT id FROM super_categories WHERE name_ar='فن عربي')),
  ('فن عربي',         'Arab Art',         NULL, 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=300&q=80', NULL,NULL,904, (SELECT id FROM super_categories WHERE name_ar='فن عربي')),
  ('مقاطع فن عربي',   'Arab Art Clips',   NULL, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80', NULL,NULL,905, (SELECT id FROM super_categories WHERE name_ar='فن عربي')),
  ('قصة فيلم عربي',   'Arab Movie Story', NULL, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80', NULL,NULL,906, (SELECT id FROM super_categories WHERE name_ar='فن عربي'))
ON CONFLICT DO NOTHING;

-- ── أغاني sub-categories ─────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('كلثوميات',          'Kulthum Songs',     NULL, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80', 20, 3, 1001, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('فرقة ميامي',        'Miami Band',        NULL, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80', 25, 3, 1002, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('عبدالكريم عبدالقادر','Abdul Kareem',     NULL, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80', 10, 3, 1003, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('أبوبكر سالم',       'Abu Bakr Salem',   NULL, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80', 10, 3, 1004, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('فرقة الأخوة',       'Al-Ikhwa Band',    NULL, 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&q=80', 41, 3, 1005, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('حسين الجسمي',       'Hussain Al-Jassmi',NULL, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80', 10, 3, 1006, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('بدر الشعيبي',       'Badr Al-Shuaibi',  NULL, 'https://images.unsplash.com/photo-1534361960057-19f4434a4d97?w=300&q=80', 10, 3, 1007, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('عايض',              'Ayedh',            NULL, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80', 10, 3, 1008, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('آدم',               'Adam',             NULL, 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=300&q=80', 10, 3, 1009, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('أحلام',             'Ahlam',            NULL, 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=300&q=80', 10, 3, 1010, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('شيرين',             'Sherine',          NULL, 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80', 10, 3, 1011, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('أغاني',             'Songs',            NULL, 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=300&q=80', NULL,NULL,1012, (SELECT id FROM super_categories WHERE name_ar='أغاني')),
  ('Songs',             'Songs EN',         NULL, 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&q=80', NULL,NULL,1013, (SELECT id FROM super_categories WHERE name_ar='أغاني'))
ON CONFLICT DO NOTHING;

-- ── فن أجنبي sub-categories ──────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('أفلام كلاسيك',        'Classic Films',      NULL, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80', 38, 3, 1101, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('أفلام رعب',           'Horror Films',       NULL, 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&q=80', 48, 3, 1102, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('خمن الفيلم الأجنبي',  'Guess Foreign Film', NULL, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80', 33, 3, 1103, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('طقم فنان أجنبي',      'Foreign Cast',       NULL, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80', 32, 3, 1104, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('The Sopranos',        'The Sopranos',       NULL, 'https://image.tmdb.org/t/p/w300/57okjmXQKFOjCDlQ3t2dMiRQnRi.jpg',       24, 3, 1105, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Big Bang Theory',     'Big Bang Theory',    NULL, 'https://image.tmdb.org/t/p/w300/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg',       43, 3, 1106, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('The Office',          'The Office',         NULL, 'https://image.tmdb.org/t/p/w300/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',       20, 3, 1107, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Friends',             'Friends',            NULL, 'https://image.tmdb.org/t/p/w300/f496cm9enuEsZkSPzCwnTESEK5s.jpg',       46, 3, 1108, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('The Boys',            'The Boys',           NULL, 'https://image.tmdb.org/t/p/w300/stTEycfG9928HYGEISBFaG1ngjM.jpg',       20, 3, 1109, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Game Of Thrones',     'Game Of Thrones',    NULL, 'https://image.tmdb.org/t/p/w300/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',       56, 3, 1110, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('House of the Dragon', 'House of Dragon',    NULL, 'https://image.tmdb.org/t/p/w300/z2yahl2uefxDCl0nogcRBstwruJ.jpg',       34, 3, 1111, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Breaking Bad',        'Breaking Bad',       NULL, 'https://image.tmdb.org/t/p/w300/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',        21, 3, 1112, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Prison Break',        'Prison Break',       NULL, 'https://image.tmdb.org/t/p/w300/5E1BhkCgjLBlCCBxQECJYcJFTX8.jpg',       39, 3, 1113, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Dexter',              'Dexter',             NULL, 'https://image.tmdb.org/t/p/w300/58H6Ctze1nnpS2s1ohkS6oICCkb.jpg',       27, 3, 1114, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Peaky Blinders',      'Peaky Blinders',     NULL, 'https://image.tmdb.org/t/p/w300/vUUqzWa2LnHIVqkaKVn3nyfVpAT.jpg',       23, 3, 1115, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('The Walking Dead',    'The Walking Dead',   NULL, 'https://image.tmdb.org/t/p/w300/n7PBbTzkSFW0oAg5pPGMiKhNpNa.jpg',       38, 3, 1116, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Vikings',             'Vikings',            NULL, 'https://image.tmdb.org/t/p/w300/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg',        40, 3, 1117, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('From',                'From',               NULL, 'https://image.tmdb.org/t/p/w300/2Riz4HFRm7Q0ijMRGS85bfUqYUr.jpg',        34, 3, 1118, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Dark',                'Dark',               NULL, 'https://image.tmdb.org/t/p/w300/apbrbWs5M9mV8I4wMiMmnMgrqZV.jpg',        22, 3, 1119, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Cobra Kai',           'Cobra Kai',          NULL, 'https://image.tmdb.org/t/p/w300/obLBdhLxlowaB46PBGM1f3FXAZQ.jpg',        55, 3, 1120, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Stranger Things',     'Stranger Things',    NULL, 'https://image.tmdb.org/t/p/w300/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',        48, 3, 1121, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Better Call Saul',    'Better Call Saul',   NULL, 'https://image.tmdb.org/t/p/w300/fC2HDm5t0kR9aK9fJdya4Cynbfn.jpg',        30, 3, 1122, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Suits',               'Suits',              NULL, 'https://image.tmdb.org/t/p/w300/oTJGCHFBEJE9DNFIAHy6aHsq8MN.jpg',        23, 3, 1123, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Brooklyn 99',         'Brooklyn Nine-Nine', NULL, 'https://image.tmdb.org/t/p/w300/hgRMSOt7a1b8qyQR68vUixJPang.jpg',        23, 3, 1124, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Harry Potter',        'Harry Potter',       NULL, 'https://image.tmdb.org/t/p/w300/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg',        30, 3, 1125, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Lord of the Rings',   'Lord of the Rings',  NULL, 'https://image.tmdb.org/t/p/w300/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',        20, 3, 1126, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Star Wars',           'Star Wars',          NULL, 'https://image.tmdb.org/t/p/w300/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',        30, 3, 1127, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Squid Game',          'Squid Game',         NULL, 'https://image.tmdb.org/t/p/w300/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',        35, 3, 1128, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('فن أجنبي',            'Foreign Art',        NULL, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80', NULL,NULL,1129, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('مقاطع فن أجنبي',      'Foreign Art Clips',  NULL, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80', NULL,NULL,1130, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('قصة فيلم أجنبي',      'Foreign Film Story', NULL, 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&q=80', NULL,NULL,1131, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('طاقم الفيلم',          'Film Cast',          NULL, 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?w=300&q=80', NULL,NULL,1132, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('بوستر فيلم أجنبي',    'Foreign Film Poster',NULL, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&q=80', NULL,NULL,1133, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Bollywood',           'Bollywood',          NULL, 'https://images.unsplash.com/photo-1533075377664-92b9f0f1b0c0?w=300&q=80', NULL,NULL,1134, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('Marvel',              'Marvel',             NULL, 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=300&q=80', NULL,NULL,1135, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي')),
  ('DC',                  'DC',                 NULL, 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=300&q=80', NULL,NULL,1136, (SELECT id FROM super_categories WHERE name_ar='فن أجنبي'))
ON CONFLICT DO NOTHING;

-- ── فن تركي sub-categories ───────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('قيامة أرطغرل', 'Ertugrul',        NULL, 'https://image.tmdb.org/t/p/w300/mb0UlZOWWvzJYZlW1EyBhS5SLLP.jpg', 50, 3, 1201, (SELECT id FROM super_categories WHERE name_ar='فن تركي')),
  ('المؤسس عثمان', 'Kurulus Osman',   NULL, 'https://image.tmdb.org/t/p/w300/tFoTRDorKlzgmkVDHc1sD0Rla3W.jpg', 50, 3, 1202, (SELECT id FROM super_categories WHERE name_ar='فن تركي')),
  ('الحفرة',        'Çukur',          NULL, 'https://image.tmdb.org/t/p/w300/1X7vow16X7CnCoRgKyqq58ucyVX.jpg', 75, 3, 1203, (SELECT id FROM super_categories WHERE name_ar='فن تركي')),
  ('قطاع الطرق',   'Eşkıya',          NULL, 'https://image.tmdb.org/t/p/w300/t6ATTJRAmYLFSJQ3bPNEEMuLaFo.jpg', 47, 3, 1204, (SELECT id FROM super_categories WHERE name_ar='فن تركي')),
  ('فن تركي',      'Turkish Art',     NULL, 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=300&q=80', NULL,NULL,1205, (SELECT id FROM super_categories WHERE name_ar='فن تركي'))
ON CONFLICT DO NOTHING;

-- ── كرة قدم sub-categories ───────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('لاعبين صغار',      'Young Players',     NULL, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&q=80',  54, 3, 1301, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('Ai كروية',          'AI Football',       NULL, 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=300&q=80',  49, 3, 1302, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('Messi',             'Messi',             NULL, 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=300&q=80',  30, 3, 1303, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('C.Ronaldo',         'Cristiano Ronaldo', NULL, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&q=80',  28, 3, 1304, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('أين الكرة',         'Where is the Ball', NULL, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&q=80',  29, 3, 1305, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('كأس الخليج',        'Gulf Cup',          NULL, 'https://images.unsplash.com/photo-1548711879-e1ad2e7e94ec?w=300&q=80',     26, 3, 1306, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('كوبا أمريكا',       'Copa America',      NULL, 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&q=80',     27, 3, 1307, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('أمم أوروبا',        'Euro',              NULL, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80',  33, 3, 1308, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('PL 25/26',          'PL 25/26',          NULL, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80',    105, 3, 1309, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('PL 24/25',          'PL 24/25',          NULL, 'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?w=300&q=80', 195, 3, 1310, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('UCL 24/25',         'UCL 24/25',         NULL, 'https://images.unsplash.com/photo-1569474397285-25e6dda2a9c9?w=300&q=80',  25, 3, 1311, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('الكلاسيكو',         'El Clasico',        NULL, 'https://images.unsplash.com/photo-1516578443938-5570ae33db8f?w=300&q=80',  25, 3, 1312, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('ملاعب',             'Stadiums',          NULL, 'https://images.unsplash.com/photo-1578220369262-1cde9b7ad082?w=300&q=80',  24, 3, 1313, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('تشكيلات',           'Formations',        NULL, 'https://images.unsplash.com/photo-1533560696583-be2d9d0b26f5?w=300&q=80',  53, 3, 1314, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('خمن اللاعب',        'Guess the Player',  NULL, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&q=80',  34, 3, 1315, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('خمن الصورة كروية', 'Guess Football Img',NULL, 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=300&q=80',     33, 3, 1316, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('كرة قدم عالمية',    'World Football',    NULL, 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=300&q=80',   NULL,NULL,1317, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('كأس العالم',        'World Cup',         NULL, 'https://images.unsplash.com/photo-1551958219-acbc595b69b7?w=300&q=80',   NULL,NULL,1318, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('صوت المعلق',        'Commentator Voice', NULL, 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&q=80', NULL,NULL,1319, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('مدربين',            'Coaches',           NULL, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=300&q=80',   NULL,NULL,1320, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('مسيرة لاعب',        'Player Career',     NULL, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&q=80', NULL,NULL,1321, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('رقم اللاعب',        'Player Number',     NULL, 'https://images.unsplash.com/photo-1504016798967-7a462f689c5e?w=300&q=80', NULL,NULL,1322, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('من هو اللاعب',      'Who is the Player', NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80', NULL,NULL,1323, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('اسم اللاعب',        'Player Name',       NULL, 'https://images.unsplash.com/photo-1484482340112-e1e2682b4856?w=300&q=80', NULL,NULL,1324, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('من سجل الهدف',      'Who Scored',        NULL, 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=300&q=80',   NULL,NULL,1325, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('تحدي اللاعبين',     'Player Challenge',  NULL, 'https://images.unsplash.com/photo-1551958219-acbc595b69b7?w=300&q=80',   NULL,NULL,1326, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('شعارات كُروية',     'Club Badges',       NULL, 'https://images.unsplash.com/photo-1516578443938-5570ae33db8f?w=300&q=80', NULL,NULL,1327, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('أطقم اللاعبين',     'Player Kits',       NULL, 'https://images.unsplash.com/photo-1504016798967-7a462f689c5e?w=300&q=80', NULL,NULL,1328, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('اسم الدوري',        'League Name',       NULL, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&q=80',   NULL,NULL,1329, (SELECT id FROM super_categories WHERE name_ar='كرة قدم')),
  ('تسريحة لاعب',       'Player Haircut',    NULL, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&q=80', NULL,NULL,1330, (SELECT id FROM super_categories WHERE name_ar='كرة قدم'))
ON CONFLICT DO NOTHING;

-- ── رياضة sub-categories ──────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('تنس',         'Tennis',       NULL, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&q=80', 43, 3, 1401, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('بادل',        'Padel',        NULL, 'https://images.unsplash.com/photo-1578496479932-143d46eb2254?w=300&q=80', 23, 3, 1402, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('Bodybuilding','Bodybuilding', NULL, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=80', 20, 3, 1403, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('Formula 1',   'Formula 1',   NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', 85, 3, 1404, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('مصارعة',      'Wrestling',   NULL, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80', NULL,NULL,1405, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('NBA',         'NBA',         NULL, 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=300&q=80', NULL,NULL,1406, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('UFC',         'UFC',         NULL, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300&q=80', NULL,NULL,1407, (SELECT id FROM super_categories WHERE name_ar='رياضة')),
  ('رياضة',       'Sports',      NULL, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80', NULL,NULL,1408, (SELECT id FROM super_categories WHERE name_ar='رياضة'))
ON CONFLICT DO NOTHING;

-- ── أنمي sub-categories ───────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('شخصية أنمي',   'Anime Character',  NULL, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80', 42, 3, 1501, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Naruto',        'Naruto',           NULL, 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoPart1.jpg',          50, 3, 1502, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Attack on Titan','Attack on Titan', NULL, 'https://image.tmdb.org/t/p/w300/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',       29, 3, 1503, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('One Piece',     'One Piece',        NULL, 'https://image.tmdb.org/t/p/w300/e3NBGiAifW9Xt8xD5tpARskjccO.jpg',      129, 3, 1504, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Hunter × Hunter','Hunter x Hunter', NULL, 'https://image.tmdb.org/t/p/w300/gHybBGMjMtHiRXLTMdOHLMCrOOL.jpg',      52, 3, 1505, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Bleach',        'Bleach',           NULL, 'https://image.tmdb.org/t/p/w300/2EewmxXe72ogD0EaWM8gqa0ccIw.jpg',       55, 3, 1506, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Demon Slayer',  'Demon Slayer',     NULL, 'https://image.tmdb.org/t/p/w300/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg',       30, 3, 1507, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Dragon Ball',   'Dragon Ball',      NULL, 'https://image.tmdb.org/t/p/w300/oaKP5gRuLsG2WFdUDWMFpGhVHgp.jpg',       32, 3, 1508, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('Pokémon',       'Pokemon',          NULL, 'https://image.tmdb.org/t/p/w300/uDgy6hyPd9qv7b2r3JyILyjbsHG.jpg',       48, 3, 1509, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('طقم أنمي',      'Anime Cast',       NULL, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&q=80', 34, 3, 1510, (SELECT id FROM super_categories WHERE name_ar='أنمي')),
  ('أنمي',          'Anime',            NULL, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80', NULL,NULL,1511, (SELECT id FROM super_categories WHERE name_ar='أنمي'))
ON CONFLICT DO NOTHING;

-- ── بباي sub-categories ───────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('سبيستون',  'Spacetoon',     NULL, 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&q=80', NULL,NULL,1601, (SELECT id FROM super_categories WHERE name_ar='بباي')),
  ('بباي قديم','Old Cartoons',  NULL, 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=300&q=80', NULL,NULL,1602, (SELECT id FROM super_categories WHERE name_ar='بباي')),
  ('بـباي',    'Baby Cartoons', NULL, 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=300&q=80', NULL,NULL,1603, (SELECT id FROM super_categories WHERE name_ar='بباي'))
ON CONFLICT DO NOTHING;

-- ── ألعاب sub-categories ──────────────────────────────────────────────────────
INSERT INTO categories (name_ar, name_en, icon_url, cover_image_url, remaining_games, star_rating, sort_order, super_category_id) VALUES
  ('Call of Duty',   'Call of Duty',    NULL, 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=300&q=80', 70, 3, 1701, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('Resident Evil',  'Resident Evil',   NULL, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=80', 23, 3, 1702, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('Valorant',       'Valorant',        NULL, 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300&q=80', 19, 3, 1703, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('Mobile Legends', 'Mobile Legends',  NULL, 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&q=80', 28, 3, 1704, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('Minecraft',      'Minecraft',       NULL, 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&q=80', 37, 3, 1705, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('Video Games',    'Video Games',     NULL, 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=300&q=80', NULL,NULL,1706, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('مقاطع Games',   'Gaming Clips',    NULL, 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&q=80', NULL,NULL,1707, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('ولا كلمة Games','Gaming No Word',  NULL, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=80', NULL,NULL,1708, (SELECT id FROM super_categories WHERE name_ar='ألعاب')),
  ('بوستر لعبة',    'Game Poster',     NULL, 'https://images.unsplash.com/photo-1574155376612-bfa4ed8b05c9?w=300&q=80', NULL,NULL,1709, (SELECT id FROM super_categories WHERE name_ar='ألعاب'))
ON CONFLICT DO NOTHING;
