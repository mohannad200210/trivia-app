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
