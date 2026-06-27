/**
 * mock-questions.ts — Hard-coded question bank for Phase 1 (pre-Supabase).
 *
 * When the real Supabase project is connected, replace `selectQuestions()` with
 * a single query and delete this file. The play screen never needs to change.
 *
 * Questions match the `Question` interface in lib/types.ts exactly.
 * No `any` types (SKILL.md §9).
 */

import type { Question } from '@/lib/types'

// ── Question bank ──────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // ── معلومات عامة (General) ────────────────────────────────────────────────
  {
    id: 'gen-1', category_id: 'general', difficulty: 'easy',
    question_text_ar: 'ما هي عاصمة المملكة العربية السعودية؟',
    question_text_en: 'What is the capital of Saudi Arabia?',
    choices: [
      { id: 'a', text_ar: 'الرياض',      text_en: 'Riyadh'  },
      { id: 'b', text_ar: 'جدة',          text_en: 'Jeddah'  },
      { id: 'c', text_ar: 'مكة المكرمة', text_en: 'Mecca'   },
      { id: 'd', text_ar: 'الدمام',       text_en: 'Dammam'  },
    ],
    correct_choice_id: 'a', media_url: null, is_active: true,
  },
  {
    id: 'gen-2', category_id: 'general', difficulty: 'easy',
    question_text_ar: 'كم عدد أيام السنة الميلادية العادية؟',
    question_text_en: 'How many days in a regular calendar year?',
    choices: [
      { id: 'a', text_ar: '360', text_en: '360' },
      { id: 'b', text_ar: '364', text_en: '364' },
      { id: 'c', text_ar: '365', text_en: '365' },
      { id: 'd', text_ar: '366', text_en: '366' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'gen-3', category_id: 'general', difficulty: 'medium',
    question_text_ar: 'ما هو أكبر محيطات العالم؟',
    question_text_en: 'What is the largest ocean in the world?',
    choices: [
      { id: 'a', text_ar: 'المحيط الأطلسي', text_en: 'Atlantic' },
      { id: 'b', text_ar: 'المحيط الهندي',  text_en: 'Indian'   },
      { id: 'c', text_ar: 'المحيط الهادئ',  text_en: 'Pacific'  },
      { id: 'd', text_ar: 'المحيط المتجمد', text_en: 'Arctic'   },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'gen-4', category_id: 'general', difficulty: 'hard',
    question_text_ar: 'ما هي العملة الرسمية لليابان؟',
    question_text_en: 'What is the official currency of Japan?',
    choices: [
      { id: 'a', text_ar: 'يوان',  text_en: 'Yuan'  },
      { id: 'b', text_ar: 'وون',   text_en: 'Won'   },
      { id: 'c', text_ar: 'ين',    text_en: 'Yen'   },
      { id: 'd', text_ar: 'دولار', text_en: 'Dollar' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },

  // ── جغرافيا (Geography) ───────────────────────────────────────────────────
  {
    id: 'geo-1', category_id: 'geo', difficulty: 'easy',
    question_text_ar: 'ما هي أكبر قارة في العالم؟',
    question_text_en: 'What is the largest continent?',
    choices: [
      { id: 'a', text_ar: 'أفريقيا',   text_en: 'Africa'        },
      { id: 'b', text_ar: 'آسيا',       text_en: 'Asia'          },
      { id: 'c', text_ar: 'أمريكا الشمالية', text_en: 'North America' },
      { id: 'd', text_ar: 'أوروبا',    text_en: 'Europe'        },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'geo-2', category_id: 'geo', difficulty: 'easy',
    question_text_ar: 'ما هي عاصمة مصر؟',
    question_text_en: 'What is the capital of Egypt?',
    choices: [
      { id: 'a', text_ar: 'الإسكندرية', text_en: 'Alexandria' },
      { id: 'b', text_ar: 'الأقصر',     text_en: 'Luxor'      },
      { id: 'c', text_ar: 'أسوان',       text_en: 'Aswan'      },
      { id: 'd', text_ar: 'القاهرة',    text_en: 'Cairo'      },
    ],
    correct_choice_id: 'd', media_url: null, is_active: true,
  },
  {
    id: 'geo-3', category_id: 'geo', difficulty: 'medium',
    question_text_ar: 'أي نهر هو الأطول في العالم؟',
    question_text_en: 'Which river is the longest in the world?',
    choices: [
      { id: 'a', text_ar: 'الأمازون',   text_en: 'Amazon'    },
      { id: 'b', text_ar: 'النيل',       text_en: 'Nile'      },
      { id: 'c', text_ar: 'المسيسيبي', text_en: 'Mississippi' },
      { id: 'd', text_ar: 'اليانغتسي', text_en: 'Yangtze'   },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'geo-4', category_id: 'geo', difficulty: 'hard',
    question_text_ar: 'ما هي أصغر دولة في العالم من حيث المساحة؟',
    question_text_en: 'What is the smallest country in the world by area?',
    choices: [
      { id: 'a', text_ar: 'موناكو',      text_en: 'Monaco'      },
      { id: 'b', text_ar: 'سان مارينو', text_en: 'San Marino'  },
      { id: 'c', text_ar: 'ليختنشتاين', text_en: 'Liechtenstein' },
      { id: 'd', text_ar: 'الفاتيكان', text_en: 'Vatican City' },
    ],
    correct_choice_id: 'd', media_url: null, is_active: true,
  },

  // ── رياضة (Sports) ────────────────────────────────────────────────────────
  {
    id: 'spo-1', category_id: 'sports', difficulty: 'easy',
    question_text_ar: 'كم عدد لاعبي كرة القدم في الملعب من كل فريق؟',
    question_text_en: 'How many players are on each football team on the pitch?',
    choices: [
      { id: 'a', text_ar: '9',  text_en: '9'  },
      { id: 'b', text_ar: '10', text_en: '10' },
      { id: 'c', text_ar: '11', text_en: '11' },
      { id: 'd', text_ar: '12', text_en: '12' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'spo-2', category_id: 'sports', difficulty: 'medium',
    question_text_ar: 'أي منتخب فاز بكأس العالم 2022 في قطر؟',
    question_text_en: 'Which team won the 2022 FIFA World Cup in Qatar?',
    choices: [
      { id: 'a', text_ar: 'فرنسا',    text_en: 'France'    },
      { id: 'b', text_ar: 'البرازيل', text_en: 'Brazil'    },
      { id: 'c', text_ar: 'الأرجنتين', text_en: 'Argentina' },
      { id: 'd', text_ar: 'إنجلترا', text_en: 'England'   },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'spo-3', category_id: 'sports', difficulty: 'hard',
    question_text_ar: 'في أي عام فازت البرازيل بأول كأس عالم لكرة القدم؟',
    question_text_en: 'In what year did Brazil win their first FIFA World Cup?',
    choices: [
      { id: 'a', text_ar: '1950', text_en: '1950' },
      { id: 'b', text_ar: '1954', text_en: '1954' },
      { id: 'c', text_ar: '1958', text_en: '1958' },
      { id: 'd', text_ar: '1962', text_en: '1962' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },

  // ── أفلام ومسلسلات (Movies & TV) ─────────────────────────────────────────
  {
    id: 'mov-1', category_id: 'movies', difficulty: 'easy',
    question_text_ar: 'في أي عام صدر فيلم تيتانيك؟',
    question_text_en: 'In what year was Titanic released?',
    choices: [
      { id: 'a', text_ar: '1995', text_en: '1995' },
      { id: 'b', text_ar: '1997', text_en: '1997' },
      { id: 'c', text_ar: '1999', text_en: '1999' },
      { id: 'd', text_ar: '2001', text_en: '2001' },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'mov-2', category_id: 'movies', difficulty: 'medium',
    question_text_ar: 'من أخرج فيلم "Inception" (الأصل)؟',
    question_text_en: 'Who directed the film "Inception"?',
    choices: [
      { id: 'a', text_ar: 'ستيفن سبيلبرغ',   text_en: 'Steven Spielberg'  },
      { id: 'b', text_ar: 'كريستوفر نولان',  text_en: 'Christopher Nolan' },
      { id: 'c', text_ar: 'جيمس كاميرون',    text_en: 'James Cameron'     },
      { id: 'd', text_ar: 'مارتن سكورسيزي', text_en: 'Martin Scorsese'   },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'mov-3', category_id: 'movies', difficulty: 'hard',
    question_text_ar: 'ما هو الفيلم الأعلى إيراداً في تاريخ السينما؟',
    question_text_en: 'What is the highest-grossing film of all time?',
    choices: [
      { id: 'a', text_ar: 'تيتانيك',            text_en: 'Titanic'          },
      { id: 'b', text_ar: 'أفينجرز: إندغيم',   text_en: 'Avengers: Endgame' },
      { id: 'c', text_ar: 'أفاتار',              text_en: 'Avatar'           },
      { id: 'd', text_ar: 'حرب النجوم',         text_en: 'Star Wars'        },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },

  // ── تاريخ (History) ───────────────────────────────────────────────────────
  {
    id: 'his-1', category_id: 'history', difficulty: 'easy',
    question_text_ar: 'من هو أول رئيس للولايات المتحدة الأمريكية؟',
    question_text_en: 'Who was the first president of the United States?',
    choices: [
      { id: 'a', text_ar: 'أبراهام لينكولن', text_en: 'Abraham Lincoln'   },
      { id: 'b', text_ar: 'جورج واشنطن',    text_en: 'George Washington' },
      { id: 'c', text_ar: 'توماس جيفرسون',  text_en: 'Thomas Jefferson'  },
      { id: 'd', text_ar: 'بنجامين فرانكلين', text_en: 'Benjamin Franklin' },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'his-2', category_id: 'history', difficulty: 'medium',
    question_text_ar: 'في أي عام سقط جدار برلين؟',
    question_text_en: 'In what year did the Berlin Wall fall?',
    choices: [
      { id: 'a', text_ar: '1985', text_en: '1985' },
      { id: 'b', text_ar: '1987', text_en: '1987' },
      { id: 'c', text_ar: '1989', text_en: '1989' },
      { id: 'd', text_ar: '1991', text_en: '1991' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'his-3', category_id: 'history', difficulty: 'hard',
    question_text_ar: 'في أي عام هبط الإنسان على سطح القمر لأول مرة؟',
    question_text_en: 'In what year did humans first land on the Moon?',
    choices: [
      { id: 'a', text_ar: '1965', text_en: '1965' },
      { id: 'b', text_ar: '1967', text_en: '1967' },
      { id: 'c', text_ar: '1969', text_en: '1969' },
      { id: 'd', text_ar: '1971', text_en: '1971' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },

  // ── علوم (Science) ────────────────────────────────────────────────────────
  {
    id: 'sci-1', category_id: 'science', difficulty: 'easy',
    question_text_ar: 'ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟',
    question_text_en: 'What is the most abundant gas in Earth\'s atmosphere?',
    choices: [
      { id: 'a', text_ar: 'الأكسجين',   text_en: 'Oxygen'   },
      { id: 'b', text_ar: 'ثاني أكسيد الكربون', text_en: 'CO₂' },
      { id: 'c', text_ar: 'النيتروجين', text_en: 'Nitrogen' },
      { id: 'd', text_ar: 'الهيدروجين', text_en: 'Hydrogen' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'sci-2', category_id: 'science', difficulty: 'medium',
    question_text_ar: 'كم عدد عناصر الجدول الدوري؟',
    question_text_en: 'How many elements are in the periodic table?',
    choices: [
      { id: 'a', text_ar: '108', text_en: '108' },
      { id: 'b', text_ar: '112', text_en: '112' },
      { id: 'c', text_ar: '116', text_en: '116' },
      { id: 'd', text_ar: '118', text_en: '118' },
    ],
    correct_choice_id: 'd', media_url: null, is_active: true,
  },
  {
    id: 'sci-3', category_id: 'science', difficulty: 'hard',
    question_text_ar: 'ما هي سرعة الضوء تقريباً في الفراغ؟',
    question_text_en: 'What is the approximate speed of light in a vacuum?',
    choices: [
      { id: 'a', text_ar: '200,000 كم/ث', text_en: '200,000 km/s' },
      { id: 'b', text_ar: '300,000 كم/ث', text_en: '300,000 km/s' },
      { id: 'c', text_ar: '400,000 كم/ث', text_en: '400,000 km/s' },
      { id: 'd', text_ar: '500,000 كم/ث', text_en: '500,000 km/s' },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },

  // ── ألعاب (Gaming) ────────────────────────────────────────────────────────
  {
    id: 'gam-1', category_id: 'gaming', difficulty: 'easy',
    question_text_ar: 'ما هي لعبة الفيديو الأكثر مبيعاً في التاريخ؟',
    question_text_en: 'What is the best-selling video game of all time?',
    choices: [
      { id: 'a', text_ar: 'ماينكرافت',        text_en: 'Minecraft'    },
      { id: 'b', text_ar: 'GTA V',             text_en: 'GTA V'        },
      { id: 'c', text_ar: 'ويي سبورتس',       text_en: 'Wii Sports'   },
      { id: 'd', text_ar: 'تتريس',             text_en: 'Tetris'       },
    ],
    correct_choice_id: 'a', media_url: null, is_active: true,
  },
  {
    id: 'gam-2', category_id: 'gaming', difficulty: 'medium',
    question_text_ar: 'في أي عام أُطلقت لعبة "Super Mario Bros" لأول مرة؟',
    question_text_en: 'In what year was Super Mario Bros first released?',
    choices: [
      { id: 'a', text_ar: '1983', text_en: '1983' },
      { id: 'b', text_ar: '1985', text_en: '1985' },
      { id: 'c', text_ar: '1987', text_en: '1987' },
      { id: 'd', text_ar: '1989', text_en: '1989' },
    ],
    correct_choice_id: 'b', media_url: null, is_active: true,
  },
  {
    id: 'gam-3', category_id: 'gaming', difficulty: 'hard',
    question_text_ar: 'ما هي شركة تطوير لعبة "The Legend of Zelda"؟',
    question_text_en: 'Who developed "The Legend of Zelda"?',
    choices: [
      { id: 'a', text_ar: 'سيغا',     text_en: 'Sega'     },
      { id: 'b', text_ar: 'سوني',     text_en: 'Sony'     },
      { id: 'c', text_ar: 'نينتندو', text_en: 'Nintendo' },
      { id: 'd', text_ar: 'أتاري',   text_en: 'Atari'    },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },

  // ── فن وموسيقى (Art & Music) ─────────────────────────────────────────────
  {
    id: 'art-1', category_id: 'art', difficulty: 'easy',
    question_text_ar: 'من رسم لوحة "الموناليزا"؟',
    question_text_en: 'Who painted the "Mona Lisa"?',
    choices: [
      { id: 'a', text_ar: 'مايكل أنجلو',      text_en: 'Michelangelo'   },
      { id: 'b', text_ar: 'فنسنت فان غوخ',   text_en: 'Van Gogh'       },
      { id: 'c', text_ar: 'ليوناردو دافنشي', text_en: 'Leonardo da Vinci' },
      { id: 'd', text_ar: 'رافائيل',          text_en: 'Raphael'        },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'art-2', category_id: 'art', difficulty: 'easy',
    question_text_ar: 'من هو الملقب بـ "ملك البوب"؟',
    question_text_en: 'Who is known as the "King of Pop"?',
    choices: [
      { id: 'a', text_ar: 'برينس',          text_en: 'Prince'          },
      { id: 'b', text_ar: 'إلفيس بريسلي',  text_en: 'Elvis Presley'   },
      { id: 'c', text_ar: 'مايكل جاكسون', text_en: 'Michael Jackson'  },
      { id: 'd', text_ar: 'فريدي ميركوري', text_en: 'Freddie Mercury' },
    ],
    correct_choice_id: 'c', media_url: null, is_active: true,
  },
  {
    id: 'art-3', category_id: 'art', difficulty: 'hard',
    question_text_ar: 'من هو مؤلف سيمفونية "القدر" الخامسة الشهيرة؟',
    question_text_en: 'Who composed the famous "Fate" Symphony No. 5?',
    choices: [
      { id: 'a', text_ar: 'موزارت',     text_en: 'Mozart'     },
      { id: 'b', text_ar: 'باخ',        text_en: 'Bach'       },
      { id: 'c', text_ar: 'شوبان',      text_en: 'Chopin'     },
      { id: 'd', text_ar: 'بيتهوفن',   text_en: 'Beethoven'  },
    ],
    correct_choice_id: 'd', media_url: null, is_active: true,
  },
]

// ── Fisher-Yates shuffle ───────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Select `count` random questions filtered by category and difficulty.
 *
 * This function signature is intentionally identical to what a Supabase query
 * will expose — the play screen never needs to change when the data source swaps.
 *
 * @param categoryIds - Array of category IDs to filter by (empty = all categories)
 * @param difficulty  - Difficulty level to filter by
 * @param count       - Number of questions to return (default 10)
 */
export function selectQuestions(
  categoryIds: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  count = 10
): Question[] {
  const filtered = QUESTIONS.filter(
    (q) =>
      q.is_active &&
      q.difficulty === difficulty &&
      (categoryIds.length === 0 || categoryIds.includes(q.category_id))
  )
  return shuffle(filtered).slice(0, count)
}
