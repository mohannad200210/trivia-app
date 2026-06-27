-- supabase/questions.sql
-- Full question bank — 96 Arabic trivia questions
-- 8 categories × 3 difficulty levels × 4 questions each
--
-- HOW TO RUN: Supabase → SQL Editor → New Query → paste → Run
--
-- Requires categories table to be seeded (seed.sql) first.
-- Category IDs are looked up by name_en so this works regardless of generated UUIDs.

INSERT INTO questions
  (category_id, difficulty, question_text_ar, question_text_en, choices, correct_choice_id, is_active)
VALUES

-- ═══════════════════════════════════════════════════════════════
-- معلومات عامة — General Knowledge
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='General Knowledge'), 'easy',
 'ما هي عاصمة المملكة العربية السعودية؟', 'What is the capital of Saudi Arabia?',
 '[{"id":"a","text_ar":"الرياض","text_en":"Riyadh"},{"id":"b","text_ar":"جدة","text_en":"Jeddah"},{"id":"c","text_ar":"مكة المكرمة","text_en":"Mecca"},{"id":"d","text_ar":"الدمام","text_en":"Dammam"}]'::jsonb,
 'a', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'easy',
 'كم عدد أيام السنة الميلادية العادية؟', 'How many days are in a regular calendar year?',
 '[{"id":"a","text_ar":"360","text_en":"360"},{"id":"b","text_ar":"364","text_en":"364"},{"id":"c","text_ar":"365","text_en":"365"},{"id":"d","text_ar":"366","text_en":"366"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'easy',
 'ما هو أكبر كوكب في المجموعة الشمسية؟', 'What is the largest planet in the solar system?',
 '[{"id":"a","text_ar":"زحل","text_en":"Saturn"},{"id":"b","text_ar":"المشتري","text_en":"Jupiter"},{"id":"c","text_ar":"أورانوس","text_en":"Uranus"},{"id":"d","text_ar":"نبتون","text_en":"Neptune"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'easy',
 'كم عدد أضلاع المثلث؟', 'How many sides does a triangle have?',
 '[{"id":"a","text_ar":"2","text_en":"2"},{"id":"b","text_ar":"3","text_en":"3"},{"id":"c","text_ar":"4","text_en":"4"},{"id":"d","text_ar":"5","text_en":"5"}]'::jsonb,
 'b', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='General Knowledge'), 'medium',
 'ما هو أكبر محيطات العالم؟', 'What is the largest ocean in the world?',
 '[{"id":"a","text_ar":"المحيط الأطلسي","text_en":"Atlantic"},{"id":"b","text_ar":"المحيط الهندي","text_en":"Indian"},{"id":"c","text_ar":"المحيط الهادئ","text_en":"Pacific"},{"id":"d","text_ar":"المحيط المتجمد الشمالي","text_en":"Arctic"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'medium',
 'من اخترع الهاتف؟', 'Who invented the telephone?',
 '[{"id":"a","text_ar":"توماس إديسون","text_en":"Thomas Edison"},{"id":"b","text_ar":"نيكولا تيسلا","text_en":"Nikola Tesla"},{"id":"c","text_ar":"غراهام بيل","text_en":"Alexander Graham Bell"},{"id":"d","text_ar":"ألبرت أينشتاين","text_en":"Albert Einstein"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'medium',
 'ما هي عاصمة اليابان؟', 'What is the capital of Japan?',
 '[{"id":"a","text_ar":"أوساكا","text_en":"Osaka"},{"id":"b","text_ar":"كيوتو","text_en":"Kyoto"},{"id":"c","text_ar":"هيروشيما","text_en":"Hiroshima"},{"id":"d","text_ar":"طوكيو","text_en":"Tokyo"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'medium',
 'كم عدد قارات العالم؟', 'How many continents are there in the world?',
 '[{"id":"a","text_ar":"5","text_en":"5"},{"id":"b","text_ar":"6","text_en":"6"},{"id":"c","text_ar":"7","text_en":"7"},{"id":"d","text_ar":"8","text_en":"8"}]'::jsonb,
 'c', true),

-- HARD
((SELECT id FROM categories WHERE name_en='General Knowledge'), 'hard',
 'كم عدد عظام جسم الإنسان البالغ؟', 'How many bones are in the adult human body?',
 '[{"id":"a","text_ar":"196","text_en":"196"},{"id":"b","text_ar":"206","text_en":"206"},{"id":"c","text_ar":"216","text_en":"216"},{"id":"d","text_ar":"226","text_en":"226"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'hard',
 'ما هو الرمز الكيميائي للذهب؟', 'What is the chemical symbol for gold?',
 '[{"id":"a","text_ar":"Ag","text_en":"Ag"},{"id":"b","text_ar":"Gd","text_en":"Gd"},{"id":"c","text_ar":"Au","text_en":"Au"},{"id":"d","text_ar":"Go","text_en":"Go"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'hard',
 'من اكتشف البنسلين؟', 'Who discovered penicillin?',
 '[{"id":"a","text_ar":"لويس باستور","text_en":"Louis Pasteur"},{"id":"b","text_ar":"ألكسندر فلمنج","text_en":"Alexander Fleming"},{"id":"c","text_ar":"روبرت كوك","text_en":"Robert Koch"},{"id":"d","text_ar":"إدوارد جينر","text_en":"Edward Jenner"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='General Knowledge'), 'hard',
 'ما هي أسرع حيوان بري في العالم؟', 'What is the fastest land animal in the world?',
 '[{"id":"a","text_ar":"الأسد","text_en":"Lion"},{"id":"b","text_ar":"النمر","text_en":"Leopard"},{"id":"c","text_ar":"الفهد","text_en":"Cheetah"},{"id":"d","text_ar":"الغزال","text_en":"Gazelle"}]'::jsonb,
 'c', true),

-- ═══════════════════════════════════════════════════════════════
-- جغرافيا — Geography
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Geography'), 'easy',
 'ما هي أكبر قارة في العالم؟', 'What is the largest continent?',
 '[{"id":"a","text_ar":"أفريقيا","text_en":"Africa"},{"id":"b","text_ar":"آسيا","text_en":"Asia"},{"id":"c","text_ar":"أمريكا الشمالية","text_en":"North America"},{"id":"d","text_ar":"أوروبا","text_en":"Europe"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'easy',
 'ما هي عاصمة مصر؟', 'What is the capital of Egypt?',
 '[{"id":"a","text_ar":"الإسكندرية","text_en":"Alexandria"},{"id":"b","text_ar":"الأقصر","text_en":"Luxor"},{"id":"c","text_ar":"القاهرة","text_en":"Cairo"},{"id":"d","text_ar":"أسوان","text_en":"Aswan"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'easy',
 'ما هي عاصمة الإمارات العربية المتحدة؟', 'What is the capital of the UAE?',
 '[{"id":"a","text_ar":"دبي","text_en":"Dubai"},{"id":"b","text_ar":"الشارقة","text_en":"Sharjah"},{"id":"c","text_ar":"أبوظبي","text_en":"Abu Dhabi"},{"id":"d","text_ar":"عجمان","text_en":"Ajman"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'easy',
 'أي نهر هو الأطول في العالم؟', 'Which river is the longest in the world?',
 '[{"id":"a","text_ar":"الأمازون","text_en":"Amazon"},{"id":"b","text_ar":"النيل","text_en":"Nile"},{"id":"c","text_ar":"المسيسيبي","text_en":"Mississippi"},{"id":"d","text_ar":"اليانغتسي","text_en":"Yangtze"}]'::jsonb,
 'b', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Geography'), 'medium',
 'ما هي أصغر قارة في العالم؟', 'What is the smallest continent?',
 '[{"id":"a","text_ar":"أوروبا","text_en":"Europe"},{"id":"b","text_ar":"أنتاركتيكا","text_en":"Antarctica"},{"id":"c","text_ar":"أستراليا","text_en":"Australia"},{"id":"d","text_ar":"أمريكا الجنوبية","text_en":"South America"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'medium',
 'ما هي عاصمة كندا؟', 'What is the capital of Canada?',
 '[{"id":"a","text_ar":"تورنتو","text_en":"Toronto"},{"id":"b","text_ar":"مونتريال","text_en":"Montreal"},{"id":"c","text_ar":"فانكوفر","text_en":"Vancouver"},{"id":"d","text_ar":"أوتاوا","text_en":"Ottawa"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'medium',
 'ما هو اسم المضيق الفاصل بين أوروبا وأفريقيا؟', 'What is the strait separating Europe and Africa?',
 '[{"id":"a","text_ar":"مضيق هرمز","text_en":"Strait of Hormuz"},{"id":"b","text_ar":"مضيق ملقا","text_en":"Strait of Malacca"},{"id":"c","text_ar":"مضيق جبل طارق","text_en":"Strait of Gibraltar"},{"id":"d","text_ar":"مضيق باب المندب","text_en":"Bab-el-Mandeb"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'medium',
 'كم عدد دول العالم المعترف بها في الأمم المتحدة؟', 'How many UN member states are there?',
 '[{"id":"a","text_ar":"173","text_en":"173"},{"id":"b","text_ar":"183","text_en":"183"},{"id":"c","text_ar":"193","text_en":"193"},{"id":"d","text_ar":"203","text_en":"203"}]'::jsonb,
 'c', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Geography'), 'hard',
 'ما هي أصغر دولة في العالم من حيث المساحة؟', 'What is the smallest country in the world by area?',
 '[{"id":"a","text_ar":"موناكو","text_en":"Monaco"},{"id":"b","text_ar":"سان مارينو","text_en":"San Marino"},{"id":"c","text_ar":"الفاتيكان","text_en":"Vatican City"},{"id":"d","text_ar":"ليختنشتاين","text_en":"Liechtenstein"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'hard',
 'ما هي عاصمة أستراليا؟', 'What is the capital of Australia?',
 '[{"id":"a","text_ar":"سيدني","text_en":"Sydney"},{"id":"b","text_ar":"ملبورن","text_en":"Melbourne"},{"id":"c","text_ar":"بريسبان","text_en":"Brisbane"},{"id":"d","text_ar":"كانبيرا","text_en":"Canberra"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'hard',
 'ما هو ارتفاع جبل إيفرست تقريبًا؟', 'What is the approximate height of Mount Everest?',
 '[{"id":"a","text_ar":"7848 م","text_en":"7,848 m"},{"id":"b","text_ar":"8448 م","text_en":"8,448 m"},{"id":"c","text_ar":"8848 م","text_en":"8,848 m"},{"id":"d","text_ar":"9048 م","text_en":"9,048 m"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Geography'), 'hard',
 'أي دولة تمر من خلالها خطوط الطول الـ 180؟', 'The International Date Line runs mainly through which ocean?',
 '[{"id":"a","text_ar":"المحيط الأطلسي","text_en":"Atlantic Ocean"},{"id":"b","text_ar":"المحيط الهندي","text_en":"Indian Ocean"},{"id":"c","text_ar":"المحيط الهادئ","text_en":"Pacific Ocean"},{"id":"d","text_ar":"البحر المتوسط","text_en":"Mediterranean"}]'::jsonb,
 'c', true),

-- ═══════════════════════════════════════════════════════════════
-- رياضة — Sports
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Sports'), 'easy',
 'كم عدد لاعبي كرة القدم من كل فريق في الملعب؟', 'How many players per team are on the football pitch?',
 '[{"id":"a","text_ar":"9","text_en":"9"},{"id":"b","text_ar":"10","text_en":"10"},{"id":"c","text_ar":"11","text_en":"11"},{"id":"d","text_ar":"12","text_en":"12"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'easy',
 'أي منتخب فاز بكأس العالم 2022 في قطر؟', 'Which team won the 2022 FIFA World Cup in Qatar?',
 '[{"id":"a","text_ar":"فرنسا","text_en":"France"},{"id":"b","text_ar":"الأرجنتين","text_en":"Argentina"},{"id":"c","text_ar":"البرازيل","text_en":"Brazil"},{"id":"d","text_ar":"إنجلترا","text_en":"England"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'easy',
 'كم مدة مباراة كرة القدم النظامية؟', 'How long is a standard football match?',
 '[{"id":"a","text_ar":"80 دقيقة","text_en":"80 minutes"},{"id":"b","text_ar":"85 دقيقة","text_en":"85 minutes"},{"id":"c","text_ar":"90 دقيقة","text_en":"90 minutes"},{"id":"d","text_ar":"100 دقيقة","text_en":"100 minutes"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'easy',
 'كم عدد اللاعبين في فريق كرة السلة الواحد على أرض الملعب؟', 'How many players per basketball team are on court?',
 '[{"id":"a","text_ar":"4","text_en":"4"},{"id":"b","text_ar":"5","text_en":"5"},{"id":"c","text_ar":"6","text_en":"6"},{"id":"d","text_ar":"7","text_en":"7"}]'::jsonb,
 'b', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Sports'), 'medium',
 'في أي عام فازت البرازيل بأول كأس عالم؟', 'In what year did Brazil win their first World Cup?',
 '[{"id":"a","text_ar":"1950","text_en":"1950"},{"id":"b","text_ar":"1954","text_en":"1954"},{"id":"c","text_ar":"1958","text_en":"1958"},{"id":"d","text_ar":"1962","text_en":"1962"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'medium',
 'أي نادٍ فاز بأكبر عدد من بطولات دوري أبطال أوروبا؟', 'Which club has won the most UEFA Champions League titles?',
 '[{"id":"a","text_ar":"برشلونة","text_en":"Barcelona"},{"id":"b","text_ar":"بايرن ميونيخ","text_en":"Bayern Munich"},{"id":"c","text_ar":"ليفربول","text_en":"Liverpool"},{"id":"d","text_ar":"ريال مدريد","text_en":"Real Madrid"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'medium',
 'ما هي الرياضة التي اشتُهر بها محمد علي كلاي؟', 'What sport is Muhammad Ali Clay famous for?',
 '[{"id":"a","text_ar":"المصارعة","text_en":"Wrestling"},{"id":"b","text_ar":"الملاكمة","text_en":"Boxing"},{"id":"c","text_ar":"كرة القدم","text_en":"Football"},{"id":"d","text_ar":"رفع الأثقال","text_en":"Weightlifting"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'medium',
 'كم عدد أشواط في مباراة التنس الكبرى (Grand Slam) للرجال؟', 'How many sets are in a men''s Grand Slam tennis match?',
 '[{"id":"a","text_ar":"3","text_en":"3"},{"id":"b","text_ar":"4","text_en":"4"},{"id":"c","text_ar":"5","text_en":"5"},{"id":"d","text_ar":"6","text_en":"6"}]'::jsonb,
 'c', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Sports'), 'hard',
 'في أي عام أُقيمت أولى دورات الألعاب الأولمبية الحديثة؟', 'In what year were the first modern Olympic Games held?',
 '[{"id":"a","text_ar":"1886","text_en":"1886"},{"id":"b","text_ar":"1892","text_en":"1892"},{"id":"c","text_ar":"1896","text_en":"1896"},{"id":"d","text_ar":"1900","text_en":"1900"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'hard',
 'كم ميدالية ذهبية فاز بها مايكل فيلبس في الألعاب الأولمبية؟', 'How many Olympic gold medals did Michael Phelps win?',
 '[{"id":"a","text_ar":"18","text_en":"18"},{"id":"b","text_ar":"20","text_en":"20"},{"id":"c","text_ar":"23","text_en":"23"},{"id":"d","text_ar":"25","text_en":"25"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'hard',
 'أي منتخب فاز بأكبر عدد من كؤوس العالم لكرة القدم؟', 'Which national team has won the most FIFA World Cups?',
 '[{"id":"a","text_ar":"ألمانيا","text_en":"Germany"},{"id":"b","text_ar":"إيطاليا","text_en":"Italy"},{"id":"c","text_ar":"الأرجنتين","text_en":"Argentina"},{"id":"d","text_ar":"البرازيل","text_en":"Brazil"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Sports'), 'hard',
 'في أي مدينة يقع ملعب ويمبلدون الشهير؟', 'In which city is the famous Wimbledon tennis venue located?',
 '[{"id":"a","text_ar":"مانشستر","text_en":"Manchester"},{"id":"b","text_ar":"لندن","text_en":"London"},{"id":"c","text_ar":"باريس","text_en":"Paris"},{"id":"d","text_ar":"نيويورك","text_en":"New York"}]'::jsonb,
 'b', true),

-- ═══════════════════════════════════════════════════════════════
-- أفلام ومسلسلات — Movies & TV
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Movies & TV'), 'easy',
 'في أي عام صدر فيلم تيتانيك؟', 'In what year was Titanic released?',
 '[{"id":"a","text_ar":"1995","text_en":"1995"},{"id":"b","text_ar":"1997","text_en":"1997"},{"id":"c","text_ar":"1999","text_en":"1999"},{"id":"d","text_ar":"2001","text_en":"2001"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'easy',
 'ما اسم الفيلم الذي تظهر فيه شخصية سيمبا؟', 'In which film does the character Simba appear?',
 '[{"id":"a","text_ar":"علاء الدين","text_en":"Aladdin"},{"id":"b","text_ar":"الجميلة والوحش","text_en":"Beauty and the Beast"},{"id":"c","text_ar":"الأسد الملك","text_en":"The Lion King"},{"id":"d","text_ar":"موانا","text_en":"Moana"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'easy',
 'من يؤدي دور توني ستارك (Iron Man) في أفلام مارفل؟', 'Who plays Tony Stark (Iron Man) in Marvel films?',
 '[{"id":"a","text_ar":"كريس إيفانز","text_en":"Chris Evans"},{"id":"b","text_ar":"كريس هيمسورث","text_en":"Chris Hemsworth"},{"id":"c","text_ar":"روبرت داوني جونيور","text_en":"Robert Downey Jr."},{"id":"d","text_ar":"مارك رافالو","text_en":"Mark Ruffalo"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'easy',
 'ما اسم مسلسل الأطباء الأمريكي الشهير الذي يدور في مستشفى Grey Sloan؟', 'What is the famous medical drama set in Grey Sloan Memorial Hospital?',
 '[{"id":"a","text_ar":"House M.D.","text_en":"House M.D."},{"id":"b","text_ar":"Grey''s Anatomy","text_en":"Grey''s Anatomy"},{"id":"c","text_ar":"ER","text_en":"ER"},{"id":"d","text_ar":"Scrubs","text_en":"Scrubs"}]'::jsonb,
 'b', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Movies & TV'), 'medium',
 'من أخرج فيلم Inception؟', 'Who directed the film Inception?',
 '[{"id":"a","text_ar":"ستيفن سبيلبرغ","text_en":"Steven Spielberg"},{"id":"b","text_ar":"جيمس كاميرون","text_en":"James Cameron"},{"id":"c","text_ar":"كريستوفر نولان","text_en":"Christopher Nolan"},{"id":"d","text_ar":"مارتن سكورسيزي","text_en":"Martin Scorsese"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'medium',
 'ما هو الفيلم الأعلى إيرادًا في تاريخ السينما؟', 'What is the highest-grossing film of all time?',
 '[{"id":"a","text_ar":"تيتانيك","text_en":"Titanic"},{"id":"b","text_ar":"أفينجرز: إندغيم","text_en":"Avengers: Endgame"},{"id":"c","text_ar":"أفاتار","text_en":"Avatar"},{"id":"d","text_ar":"حرب النجوم","text_en":"Star Wars"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'medium',
 'ما اسم المسلسل الأمريكي الذي تدور أحداثه حول صنع المخدرات في نيو مكسيكو؟', 'What US series is about making drugs in New Mexico?',
 '[{"id":"a","text_ar":"Narcos","text_en":"Narcos"},{"id":"b","text_ar":"Breaking Bad","text_en":"Breaking Bad"},{"id":"c","text_ar":"Ozark","text_en":"Ozark"},{"id":"d","text_ar":"Dexter","text_en":"Dexter"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'medium',
 'في أي عام صدر فيلم The Dark Knight؟', 'In what year was The Dark Knight released?',
 '[{"id":"a","text_ar":"2005","text_en":"2005"},{"id":"b","text_ar":"2006","text_en":"2006"},{"id":"c","text_ar":"2007","text_en":"2007"},{"id":"d","text_ar":"2008","text_en":"2008"}]'::jsonb,
 'd', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Movies & TV'), 'hard',
 'من فاز بجائزة أوسكار أفضل ممثل عن دوره في فيلم Forrest Gump؟', 'Who won the Oscar for Best Actor for Forrest Gump?',
 '[{"id":"a","text_ar":"براد بيت","text_en":"Brad Pitt"},{"id":"b","text_ar":"توم هانكس","text_en":"Tom Hanks"},{"id":"c","text_ar":"جاك نيكولسون","text_en":"Jack Nicholson"},{"id":"d","text_ar":"ميل غيبسون","text_en":"Mel Gibson"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'hard',
 'ما هي جنسية مخرج فيلم Parasite الحائز على أوسكار أفضل فيلم 2020؟', 'What is the nationality of the director of Parasite (Oscar winner 2020)?',
 '[{"id":"a","text_ar":"يابانية","text_en":"Japanese"},{"id":"b","text_ar":"صينية","text_en":"Chinese"},{"id":"c","text_ar":"كورية جنوبية","text_en":"South Korean"},{"id":"d","text_ar":"تايوانية","text_en":"Taiwanese"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'hard',
 'من أخرج فيلم Pulp Fiction؟', 'Who directed Pulp Fiction?',
 '[{"id":"a","text_ar":"ديفيد فينشر","text_en":"David Fincher"},{"id":"b","text_ar":"ريدلي سكوت","text_en":"Ridley Scott"},{"id":"c","text_ar":"كوينتن تارانتينو","text_en":"Quentin Tarantino"},{"id":"d","text_ar":"براين دي بالما","text_en":"Brian De Palma"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Movies & TV'), 'hard',
 'كم عدد حلقات مسلسل Game of Thrones إجمالًا؟', 'How many episodes does Game of Thrones have in total?',
 '[{"id":"a","text_ar":"63","text_en":"63"},{"id":"b","text_ar":"67","text_en":"67"},{"id":"c","text_ar":"73","text_en":"73"},{"id":"d","text_ar":"79","text_en":"79"}]'::jsonb,
 'c', true),

-- ═══════════════════════════════════════════════════════════════
-- تاريخ — History
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='History'), 'easy',
 'من هو أول رئيس للولايات المتحدة الأمريكية؟', 'Who was the first president of the United States?',
 '[{"id":"a","text_ar":"أبراهام لينكولن","text_en":"Abraham Lincoln"},{"id":"b","text_ar":"توماس جيفرسون","text_en":"Thomas Jefferson"},{"id":"c","text_ar":"جورج واشنطن","text_en":"George Washington"},{"id":"d","text_ar":"جون آدامز","text_en":"John Adams"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='History'), 'easy',
 'في أي عام بدأت الحرب العالمية الثانية؟', 'In what year did World War II begin?',
 '[{"id":"a","text_ar":"1935","text_en":"1935"},{"id":"b","text_ar":"1937","text_en":"1937"},{"id":"c","text_ar":"1939","text_en":"1939"},{"id":"d","text_ar":"1941","text_en":"1941"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='History'), 'easy',
 'ما هي الحضارة القديمة التي بنت الأهرامات؟', 'Which ancient civilization built the pyramids?',
 '[{"id":"a","text_ar":"الرومان","text_en":"Romans"},{"id":"b","text_ar":"اليونانيون","text_en":"Greeks"},{"id":"c","text_ar":"البابليون","text_en":"Babylonians"},{"id":"d","text_ar":"المصريون القدماء","text_en":"Ancient Egyptians"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='History'), 'easy',
 'من هو النبي الذي أُنزل عليه القرآن الكريم؟', 'Which prophet received the Holy Quran?',
 '[{"id":"a","text_ar":"موسى عليه السلام","text_en":"Moses"},{"id":"b","text_ar":"عيسى عليه السلام","text_en":"Jesus"},{"id":"c","text_ar":"إبراهيم عليه السلام","text_en":"Abraham"},{"id":"d","text_ar":"محمد ﷺ","text_en":"Muhammad (PBUH)"}]'::jsonb,
 'd', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='History'), 'medium',
 'في أي عام سقط جدار برلين؟', 'In what year did the Berlin Wall fall?',
 '[{"id":"a","text_ar":"1985","text_en":"1985"},{"id":"b","text_ar":"1987","text_en":"1987"},{"id":"c","text_ar":"1989","text_en":"1989"},{"id":"d","text_ar":"1991","text_en":"1991"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='History'), 'medium',
 'في أي عام استقلت الهند عن بريطانيا؟', 'In what year did India gain independence from Britain?',
 '[{"id":"a","text_ar":"1945","text_en":"1945"},{"id":"b","text_ar":"1947","text_en":"1947"},{"id":"c","text_ar":"1950","text_en":"1950"},{"id":"d","text_ar":"1952","text_en":"1952"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='History'), 'medium',
 'من قاد الثورة الفرنسية إلى السلطة لاحقًا وأصبح إمبراطورًا؟', 'Who rose to power after the French Revolution and became Emperor?',
 '[{"id":"a","text_ar":"لويس السادس عشر","text_en":"Louis XVI"},{"id":"b","text_ar":"نابليون بونابرت","text_en":"Napoleon Bonaparte"},{"id":"c","text_ar":"شارلمان","text_en":"Charlemagne"},{"id":"d","text_ar":"ماكسيميليان","text_en":"Maximilien Robespierre"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='History'), 'medium',
 'في أي مدينة ألقيت أول قنبلة ذرية في التاريخ؟', 'On which city was the first atomic bomb dropped?',
 '[{"id":"a","text_ar":"ناغازاكي","text_en":"Nagasaki"},{"id":"b","text_ar":"طوكيو","text_en":"Tokyo"},{"id":"c","text_ar":"هيروشيما","text_en":"Hiroshima"},{"id":"d","text_ar":"أوساكا","text_en":"Osaka"}]'::jsonb,
 'c', true),

-- HARD
((SELECT id FROM categories WHERE name_en='History'), 'hard',
 'في أي عام هبط الإنسان على سطح القمر لأول مرة؟', 'In what year did humans first land on the Moon?',
 '[{"id":"a","text_ar":"1965","text_en":"1965"},{"id":"b","text_ar":"1967","text_en":"1967"},{"id":"c","text_ar":"1969","text_en":"1969"},{"id":"d","text_ar":"1972","text_en":"1972"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='History'), 'hard',
 'ما هي أول امرأة تفوز بجائزة نوبل؟', 'Who was the first woman to win a Nobel Prize?',
 '[{"id":"a","text_ar":"روزاليند فرانكلين","text_en":"Rosalind Franklin"},{"id":"b","text_ar":"ماري كوري","text_en":"Marie Curie"},{"id":"c","text_ar":"دوروثي هودجكين","text_en":"Dorothy Hodgkin"},{"id":"d","text_ar":"باربرا ماكلينتوك","text_en":"Barbara McClintock"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='History'), 'hard',
 'في أي عام سقطت الإمبراطورية الرومانية الغربية؟', 'In what year did the Western Roman Empire fall?',
 '[{"id":"a","text_ar":"376 م","text_en":"376 AD"},{"id":"b","text_ar":"410 م","text_en":"410 AD"},{"id":"c","text_ar":"455 م","text_en":"455 AD"},{"id":"d","text_ar":"476 م","text_en":"476 AD"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='History'), 'hard',
 'من كتب وثيقة الاستقلال الأمريكية عام 1776؟', 'Who primarily wrote the American Declaration of Independence in 1776?',
 '[{"id":"a","text_ar":"جورج واشنطن","text_en":"George Washington"},{"id":"b","text_ar":"بنجامين فرانكلين","text_en":"Benjamin Franklin"},{"id":"c","text_ar":"توماس جيفرسون","text_en":"Thomas Jefferson"},{"id":"d","text_ar":"جون آدامز","text_en":"John Adams"}]'::jsonb,
 'c', true),

-- ═══════════════════════════════════════════════════════════════
-- علوم — Science
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Science'), 'easy',
 'ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟', 'What is the most abundant gas in Earth''s atmosphere?',
 '[{"id":"a","text_ar":"الأكسجين","text_en":"Oxygen"},{"id":"b","text_ar":"النيتروجين","text_en":"Nitrogen"},{"id":"c","text_ar":"ثاني أكسيد الكربون","text_en":"Carbon Dioxide"},{"id":"d","text_ar":"الهيدروجين","text_en":"Hydrogen"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Science'), 'easy',
 'ما هو الرمز الكيميائي للأكسجين؟', 'What is the chemical symbol for oxygen?',
 '[{"id":"a","text_ar":"Ox","text_en":"Ox"},{"id":"b","text_ar":"Og","text_en":"Og"},{"id":"c","text_ar":"O","text_en":"O"},{"id":"d","text_ar":"On","text_en":"On"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'easy',
 'ما هي درجة غليان الماء على مستوى سطح البحر؟', 'What is the boiling point of water at sea level?',
 '[{"id":"a","text_ar":"90 درجة مئوية","text_en":"90°C"},{"id":"b","text_ar":"95 درجة مئوية","text_en":"95°C"},{"id":"c","text_ar":"100 درجة مئوية","text_en":"100°C"},{"id":"d","text_ar":"110 درجة مئوية","text_en":"110°C"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'easy',
 'ما هو أصغر كوكب في المجموعة الشمسية؟', 'What is the smallest planet in the solar system?',
 '[{"id":"a","text_ar":"المريخ","text_en":"Mars"},{"id":"b","text_ar":"الزهرة","text_en":"Venus"},{"id":"c","text_ar":"عطارد","text_en":"Mercury"},{"id":"d","text_ar":"أورانوس","text_en":"Uranus"}]'::jsonb,
 'c', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Science'), 'medium',
 'كم عدد عناصر الجدول الدوري؟', 'How many elements are in the periodic table?',
 '[{"id":"a","text_ar":"108","text_en":"108"},{"id":"b","text_ar":"112","text_en":"112"},{"id":"c","text_ar":"116","text_en":"116"},{"id":"d","text_ar":"118","text_en":"118"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Science'), 'medium',
 'من صاغ نظرية النسبية الخاصة؟', 'Who formulated the special theory of relativity?',
 '[{"id":"a","text_ar":"إسحاق نيوتن","text_en":"Isaac Newton"},{"id":"b","text_ar":"ألبرت أينشتاين","text_en":"Albert Einstein"},{"id":"c","text_ar":"ستيفن هوكينغ","text_en":"Stephen Hawking"},{"id":"d","text_ar":"نيلز بور","text_en":"Niels Bohr"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Science'), 'medium',
 'ما هي سرعة الضوء تقريبًا في الفراغ؟', 'What is the approximate speed of light in a vacuum?',
 '[{"id":"a","text_ar":"200,000 كم/ث","text_en":"200,000 km/s"},{"id":"b","text_ar":"250,000 كم/ث","text_en":"250,000 km/s"},{"id":"c","text_ar":"300,000 كم/ث","text_en":"300,000 km/s"},{"id":"d","text_ar":"350,000 كم/ث","text_en":"350,000 km/s"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'medium',
 'ما هو الرمز الكيميائي للصوديوم؟', 'What is the chemical symbol for sodium?',
 '[{"id":"a","text_ar":"So","text_en":"So"},{"id":"b","text_ar":"Sd","text_en":"Sd"},{"id":"c","text_ar":"Na","text_en":"Na"},{"id":"d","text_ar":"Sm","text_en":"Sm"}]'::jsonb,
 'c', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Science'), 'hard',
 'ما هو الجسيم الذي يُعطي المادة كتلتها ويُعرف بـ "جسيم الإله"؟', 'Which particle gives matter its mass, nicknamed the "God particle"?',
 '[{"id":"a","text_ar":"الكوارك","text_en":"Quark"},{"id":"b","text_ar":"النيوترينو","text_en":"Neutrino"},{"id":"c","text_ar":"بوزون هيغز","text_en":"Higgs boson"},{"id":"d","text_ar":"الإلكترون","text_en":"Electron"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'hard',
 'كم عدد كروموسومات الإنسان السليم؟', 'How many chromosomes does a healthy human have?',
 '[{"id":"a","text_ar":"42","text_en":"42"},{"id":"b","text_ar":"44","text_en":"44"},{"id":"c","text_ar":"46","text_en":"46"},{"id":"d","text_ar":"48","text_en":"48"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'hard',
 'ما هو العنصر الأكثر وفرة في قشرة الأرض؟', 'What is the most abundant element in Earth''s crust?',
 '[{"id":"a","text_ar":"الحديد","text_en":"Iron"},{"id":"b","text_ar":"السيليكون","text_en":"Silicon"},{"id":"c","text_ar":"الأكسجين","text_en":"Oxygen"},{"id":"d","text_ar":"الألومنيوم","text_en":"Aluminum"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Science'), 'hard',
 'ما هو الاسم العلمي لعملية تحويل الضوء إلى طاقة في النباتات؟', 'What is the scientific name for plants converting light to energy?',
 '[{"id":"a","text_ar":"التنفس الخلوي","text_en":"Cellular respiration"},{"id":"b","text_ar":"التمثيل الضوئي","text_en":"Photosynthesis"},{"id":"c","text_ar":"الانتشار","text_en":"Osmosis"},{"id":"d","text_ar":"التخمر","text_en":"Fermentation"}]'::jsonb,
 'b', true),

-- ═══════════════════════════════════════════════════════════════
-- ألعاب — Gaming
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Gaming'), 'easy',
 'ما هي لعبة الفيديو الأكثر مبيعًا في التاريخ؟', 'What is the best-selling video game of all time?',
 '[{"id":"a","text_ar":"GTA V","text_en":"GTA V"},{"id":"b","text_ar":"ماينكرافت","text_en":"Minecraft"},{"id":"c","text_ar":"Wii Sports","text_en":"Wii Sports"},{"id":"d","text_ar":"تتريس","text_en":"Tetris"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'easy',
 'ما هو اسم البطل الرئيسي في سلسلة The Legend of Zelda؟', 'What is the name of the main hero in The Legend of Zelda?',
 '[{"id":"a","text_ar":"زيلدا","text_en":"Zelda"},{"id":"b","text_ar":"غانون","text_en":"Ganon"},{"id":"c","text_ar":"لينك","text_en":"Link"},{"id":"d","text_ar":"إيبونا","text_en":"Epona"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'easy',
 'ما هو اسم العدو الرئيسي في سلسلة Super Mario؟', 'What is the main villain in the Super Mario series?',
 '[{"id":"a","text_ar":"ووريو","text_en":"Wario"},{"id":"b","text_ar":"دونكي كونغ","text_en":"Donkey Kong"},{"id":"c","text_ar":"بيرانها بلانت","text_en":"Piranha Plant"},{"id":"d","text_ar":"بولزر","text_en":"Bowser"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'easy',
 'ما هي شركة تطوير لعبة Fortnite؟', 'Which company developed Fortnite?',
 '[{"id":"a","text_ar":"Activision","text_en":"Activision"},{"id":"b","text_ar":"Epic Games","text_en":"Epic Games"},{"id":"c","text_ar":"Ubisoft","text_en":"Ubisoft"},{"id":"d","text_ar":"EA","text_en":"EA"}]'::jsonb,
 'b', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Gaming'), 'medium',
 'في أي عام أُطلقت لعبة Super Mario Bros لأول مرة؟', 'In what year was Super Mario Bros first released?',
 '[{"id":"a","text_ar":"1983","text_en":"1983"},{"id":"b","text_ar":"1985","text_en":"1985"},{"id":"c","text_ar":"1987","text_en":"1987"},{"id":"d","text_ar":"1989","text_en":"1989"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'medium',
 'ما هي شركة تطوير سلسلة God of War؟', 'Who developed the God of War series?',
 '[{"id":"a","text_ar":"Microsoft Studios","text_en":"Microsoft Studios"},{"id":"b","text_ar":"Nintendo EPD","text_en":"Nintendo EPD"},{"id":"c","text_ar":"Santa Monica Studio","text_en":"Santa Monica Studio"},{"id":"d","text_ar":"Naughty Dog","text_en":"Naughty Dog"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'medium',
 'ما هو اسم العالم الخيالي في سلسلة The Elder Scrolls؟', 'What is the fictional world in The Elder Scrolls series called?',
 '[{"id":"a","text_ar":"Tamriel","text_en":"Tamriel"},{"id":"b","text_ar":"Azeroth","text_en":"Azeroth"},{"id":"c","text_ar":"Hyrule","text_en":"Hyrule"},{"id":"d","text_ar":"Albion","text_en":"Albion"}]'::jsonb,
 'a', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'medium',
 'ما هو اسم البطولة العالمية الرسمية للعبة League of Legends؟', 'What is the official world championship for League of Legends called?',
 '[{"id":"a","text_ar":"The International","text_en":"The International"},{"id":"b","text_ar":"World Championship","text_en":"World Championship"},{"id":"c","text_ar":"EVO","text_en":"EVO"},{"id":"d","text_ar":"Global Series","text_en":"Global Series"}]'::jsonb,
 'b', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Gaming'), 'hard',
 'في أي عام صدرت أول نسخة من لعبة FIFA؟', 'In what year was the first FIFA game released?',
 '[{"id":"a","text_ar":"1991","text_en":"1991"},{"id":"b","text_ar":"1993","text_en":"1993"},{"id":"c","text_ar":"1995","text_en":"1995"},{"id":"d","text_ar":"1997","text_en":"1997"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'hard',
 'في أي عام صدرت لعبة Half-Life الأولى؟', 'In what year was Half-Life first released?',
 '[{"id":"a","text_ar":"1996","text_en":"1996"},{"id":"b","text_ar":"1998","text_en":"1998"},{"id":"c","text_ar":"2000","text_en":"2000"},{"id":"d","text_ar":"2002","text_en":"2002"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'hard',
 'ما هو اسم المطور الياباني الأسطوري خالق سلسلة Metal Gear؟', 'Who is the legendary Japanese creator of the Metal Gear series?',
 '[{"id":"a","text_ar":"هيديكي كاميا","text_en":"Hideki Kamiya"},{"id":"b","text_ar":"شيغيرو مياموتو","text_en":"Shigeru Miyamoto"},{"id":"c","text_ar":"هيدي كوجيما","text_en":"Hideo Kojima"},{"id":"d","text_ar":"يوشي يامادا","text_en":"Yoshi Yamada"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Gaming'), 'hard',
 'ما هو أطول لعبة RPG من حيث ساعات اللعب وفقًا لـ HowLongToBeat في سلسلة Persona؟', 'Which Persona game has the longest playtime according to HowLongToBeat?',
 '[{"id":"a","text_ar":"Persona 3","text_en":"Persona 3"},{"id":"b","text_ar":"Persona 4","text_en":"Persona 4"},{"id":"c","text_ar":"Persona 5 Royal","text_en":"Persona 5 Royal"},{"id":"d","text_ar":"Persona 2","text_en":"Persona 2"}]'::jsonb,
 'c', true),

-- ═══════════════════════════════════════════════════════════════
-- فن وموسيقى — Art & Music
-- ═══════════════════════════════════════════════════════════════

-- EASY
((SELECT id FROM categories WHERE name_en='Art & Music'), 'easy',
 'من رسم لوحة الموناليزا؟', 'Who painted the Mona Lisa?',
 '[{"id":"a","text_ar":"مايكل أنجلو","text_en":"Michelangelo"},{"id":"b","text_ar":"رافائيل","text_en":"Raphael"},{"id":"c","text_ar":"فنسنت فان غوخ","text_en":"Van Gogh"},{"id":"d","text_ar":"ليوناردو دافنشي","text_en":"Leonardo da Vinci"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'easy',
 'من هو الملقب بـ "ملك البوب"؟', 'Who is known as the "King of Pop"?',
 '[{"id":"a","text_ar":"برينس","text_en":"Prince"},{"id":"b","text_ar":"مايكل جاكسون","text_en":"Michael Jackson"},{"id":"c","text_ar":"إلفيس بريسلي","text_en":"Elvis Presley"},{"id":"d","text_ar":"فريدي ميركوري","text_en":"Freddie Mercury"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'easy',
 'من غنى أغنية "Bohemian Rhapsody"؟', 'Who sang "Bohemian Rhapsody"?',
 '[{"id":"a","text_ar":"البيتلز","text_en":"The Beatles"},{"id":"b","text_ar":"رولينج ستونز","text_en":"Rolling Stones"},{"id":"c","text_ar":"كوين","text_en":"Queen"},{"id":"d","text_ar":"ليد زيبلين","text_en":"Led Zeppelin"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'easy',
 'أين تقع لوحة الموناليزا؟', 'Where is the Mona Lisa currently displayed?',
 '[{"id":"a","text_ar":"متحف البرادو — مدريد","text_en":"Prado Museum, Madrid"},{"id":"b","text_ar":"متحف البريطاني — لندن","text_en":"British Museum, London"},{"id":"c","text_ar":"متحف اللوفر — باريس","text_en":"Louvre Museum, Paris"},{"id":"d","text_ar":"متحف الفاتيكان — روما","text_en":"Vatican Museum, Rome"}]'::jsonb,
 'c', true),

-- MEDIUM
((SELECT id FROM categories WHERE name_en='Art & Music'), 'medium',
 'من مؤلف سيمفونية القدر (السيمفونية الخامسة)؟', 'Who composed Symphony No. 5 (the "Fate" Symphony)?',
 '[{"id":"a","text_ar":"موزارت","text_en":"Mozart"},{"id":"b","text_ar":"باخ","text_en":"Bach"},{"id":"c","text_ar":"بيتهوفن","text_en":"Beethoven"},{"id":"d","text_ar":"شوبان","text_en":"Chopin"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'medium',
 'ما هو اسم الفرقة الموسيقية التي كان عضوًا فيها جون لينون؟', 'Which band was John Lennon a member of?',
 '[{"id":"a","text_ar":"رولينج ستونز","text_en":"Rolling Stones"},{"id":"b","text_ar":"البيتلز","text_en":"The Beatles"},{"id":"c","text_ar":"بينك فلويد","text_en":"Pink Floyd"},{"id":"d","text_ar":"ذا هو","text_en":"The Who"}]'::jsonb,
 'b', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'medium',
 'من رسم لوحة "الصرخة"؟', 'Who painted "The Scream"?',
 '[{"id":"a","text_ar":"فنسنت فان غوخ","text_en":"Vincent van Gogh"},{"id":"b","text_ar":"بول غوغان","text_en":"Paul Gauguin"},{"id":"c","text_ar":"إدفارد مونك","text_en":"Edvard Munch"},{"id":"d","text_ar":"سلفادور دالي","text_en":"Salvador Dalí"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'medium',
 'في أي عام ظهرت الفرقة الموسيقية البيتلز لأول مرة على برنامج Ed Sullivan Show؟', 'In what year did The Beatles first appear on The Ed Sullivan Show?',
 '[{"id":"a","text_ar":"1962","text_en":"1962"},{"id":"b","text_ar":"1964","text_en":"1964"},{"id":"c","text_ar":"1966","text_en":"1966"},{"id":"d","text_ar":"1968","text_en":"1968"}]'::jsonb,
 'b', true),

-- HARD
((SELECT id FROM categories WHERE name_en='Art & Music'), 'hard',
 'من مؤلف أوبرا "كارمن"؟', 'Who composed the opera "Carmen"?',
 '[{"id":"a","text_ar":"فيردي","text_en":"Verdi"},{"id":"b","text_ar":"بوتشيني","text_en":"Puccini"},{"id":"c","text_ar":"جورج بيزيه","text_en":"Georges Bizet"},{"id":"d","text_ar":"واغنر","text_en":"Wagner"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'hard',
 'في أي عام رسم بيكاسو لوحة "غيرنيكا"؟', 'In what year did Picasso paint "Guernica"?',
 '[{"id":"a","text_ar":"1932","text_en":"1932"},{"id":"b","text_ar":"1935","text_en":"1935"},{"id":"c","text_ar":"1937","text_en":"1937"},{"id":"d","text_ar":"1940","text_en":"1940"}]'::jsonb,
 'c', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'hard',
 'من رسم لوحة "The Birth of Venus" (ميلاد فينوس)؟', 'Who painted "The Birth of Venus"?',
 '[{"id":"a","text_ar":"رافائيل","text_en":"Raphael"},{"id":"b","text_ar":"ليوناردو دافنشي","text_en":"Leonardo da Vinci"},{"id":"c","text_ar":"تيتيان","text_en":"Titian"},{"id":"d","text_ar":"ساندرو بوتيشيلي","text_en":"Sandro Botticelli"}]'::jsonb,
 'd', true),

((SELECT id FROM categories WHERE name_en='Art & Music'), 'hard',
 'ما هو الأسلوب الفني الذي ابتكره بيكاسو وبراك؟', 'What art movement did Picasso and Braque pioneer?',
 '[{"id":"a","text_ar":"الانطباعية","text_en":"Impressionism"},{"id":"b","text_ar":"السريالية","text_en":"Surrealism"},{"id":"c","text_ar":"التكعيبية","text_en":"Cubism"},{"id":"d","text_ar":"التعبيرية","text_en":"Expressionism"}]'::jsonb,
 'c', true);

-- Verify: should show 96
SELECT COUNT(*) AS total_questions FROM questions;
