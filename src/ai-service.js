/**
 * AI Service — abstraction layer for all AI features.
 * 
 * CURRENT: Demo mode with template-based responses.
 * TO UPGRADE: Change provider to 'anthropic', set apiEndpoint to your 
 * Vercel serverless function URL, and the rest of the app just works.
 */

export const AI_CONFIG = {
  provider: 'demo', // 'demo' | 'anthropic' | 'openrouter'
  apiEndpoint: null, // e.g. '/api/chat' for Vercel serverless
};

// ─── RECIPE POOL ─────────────────────────────────────────────
const RECIPES = [
  {
    id: 'r1', title: 'Golden Turmeric Oatmeal', category: 'Breakfast', prepTime: '10 min',
    tags: ['anti-inflammatory', 'easy-prep', 'dairy-free-option', 'gut-health'],
    description: 'Warming oats with turmeric, cinnamon, and honey — a gentle anti-inflammatory start to the day.',
    ingredients: ['1 cup rolled oats', '2 cups water or almond milk', '1 tsp turmeric', '½ tsp cinnamon', '1 tbsp honey or maple syrup', 'Pinch of black pepper (activates turmeric)', 'Fresh berries on top'],
    steps: ['Bring liquid to a boil, stir in oats and reduce heat.', 'Cook 5 minutes, stirring occasionally.', 'Stir in turmeric, cinnamon, and pepper.', 'Top with honey and berries. Serve warm.'],
  },
  {
    id: 'r2', title: 'Berry Antioxidant Smoothie', category: 'Breakfast', prepTime: '5 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'high-omega3'],
    description: 'Packed with antioxidants and omega-3s. Minimal effort, maximum nutrition.',
    ingredients: ['1 cup mixed berries (frozen works great)', '1 banana', '1 tbsp ground flaxseed', '1 cup spinach', '1 cup almond milk', '1 tbsp almond butter'],
    steps: ['Add all ingredients to a blender.', 'Blend until smooth, about 60 seconds.', 'Pour and enjoy immediately.'],
  },
  {
    id: 'r3', title: 'Overnight Chia Pudding', category: 'Breakfast', prepTime: '5 min + overnight',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'gut-health', 'dairy-free-option'],
    description: 'Zero morning effort — prep the night before when you have energy, eat when you wake up.',
    ingredients: ['3 tbsp chia seeds', '1 cup coconut milk', '1 tsp vanilla extract', '1 tbsp maple syrup', 'Mango or berries for topping'],
    steps: ['Mix chia seeds, milk, vanilla, and maple syrup in a jar.', 'Stir well, refrigerate overnight (at least 4 hours).', 'Top with fruit in the morning.'],
  },
  {
    id: 'r4', title: 'Lemon Herb Salmon Salad', category: 'Lunch', prepTime: '15 min',
    tags: ['anti-inflammatory', 'high-omega3', 'gluten-free', 'low-sugar'],
    description: 'Omega-3 rich salmon over greens. One of the best meals for managing inflammation.',
    ingredients: ['1 salmon fillet (4-6 oz)', '4 cups mixed greens', '½ avocado, sliced', '¼ cup walnuts', '2 tbsp olive oil', '1 tbsp lemon juice', 'Fresh dill, salt, pepper'],
    steps: ['Season salmon with salt, pepper, and dill. Bake at 400°F for 12 minutes.', 'Whisk olive oil and lemon juice for dressing.', 'Arrange greens, top with salmon, avocado, and walnuts.', 'Drizzle dressing over top.'],
  },
  {
    id: 'r5', title: 'Mediterranean Quinoa Bowl', category: 'Lunch', prepTime: '20 min',
    tags: ['anti-inflammatory', 'gluten-free', 'gut-health', 'high-fiber'],
    description: 'A colorful, nutrient-dense bowl that hits every anti-inflammatory note.',
    ingredients: ['1 cup cooked quinoa', '½ cup chickpeas (drained)', '½ cucumber, diced', '½ cup cherry tomatoes, halved', '¼ cup kalamata olives', '2 tbsp hummus', '1 tbsp olive oil', 'Lemon juice, salt, oregano'],
    steps: ['Cook quinoa according to package directions. Let cool slightly.', 'Toss chickpeas, cucumber, tomatoes, and olives together.', 'Layer quinoa, then veggie mix, then hummus on top.', 'Drizzle with olive oil and lemon juice. Season to taste.'],
  },
  {
    id: 'r6', title: 'Ginger-Carrot Soup', category: 'Lunch', prepTime: '25 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'dairy-free', 'gut-health'],
    description: 'Ginger is a powerhouse anti-inflammatory. This soup is soothing on hard days.',
    ingredients: ['4 large carrots, chopped', '1 inch fresh ginger, minced', '1 small onion, diced', '2 cups vegetable broth', '1 cup coconut milk', '1 tbsp olive oil', 'Salt, pepper, cumin'],
    steps: ['Sauté onion and ginger in olive oil for 3 minutes.', 'Add carrots and broth. Bring to boil, simmer 15 minutes until carrots are soft.', 'Blend until smooth. Stir in coconut milk.', 'Season with cumin, salt, and pepper.'],
  },
  {
    id: 'r7', title: 'Honey Garlic Baked Salmon', category: 'Dinner', prepTime: '25 min',
    tags: ['anti-inflammatory', 'high-omega3', 'gluten-free', 'low-sugar'],
    description: 'Simple baked salmon — the omega-3 content makes this one of the best meals for chronic pain.',
    ingredients: ['2 salmon fillets', '2 tbsp honey', '3 cloves garlic, minced', '1 tbsp soy sauce (or coconut aminos)', '1 tbsp olive oil', 'Steamed broccoli for serving', 'Brown rice for serving'],
    steps: ['Preheat oven to 400°F.', 'Mix honey, garlic, soy sauce, and olive oil.', 'Place salmon on lined baking sheet, pour sauce over.', 'Bake 12-15 minutes. Serve with broccoli and rice.'],
  },
  {
    id: 'r8', title: 'Turkey Veggie Stir Fry', category: 'Dinner', prepTime: '20 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free-option', 'low-sugar'],
    description: 'Lean protein with colorful vegetables. Quick enough for low-energy evenings.',
    ingredients: ['1 lb ground turkey', '2 cups mixed bell peppers, sliced', '1 cup snap peas', '2 cloves garlic, minced', '1 tbsp fresh ginger, grated', '2 tbsp coconut aminos', '1 tbsp sesame oil', 'Rice or cauliflower rice'],
    steps: ['Heat sesame oil in a large pan over medium-high heat.', 'Cook turkey until browned, about 6 minutes. Set aside.', 'Sauté garlic, ginger, peppers, and snap peas for 4 minutes.', 'Return turkey, add coconut aminos. Toss and serve over rice.'],
  },
  {
    id: 'r9', title: 'Slow Cooker Lentil Stew', category: 'Dinner', prepTime: '10 min + slow cook',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'dairy-free', 'gut-health', 'high-fiber'],
    description: 'Dump everything in and walk away. Perfect for high-pain days when standing is hard.',
    ingredients: ['1½ cups dried lentils, rinsed', '1 can diced tomatoes', '3 cups vegetable broth', '2 carrots, diced', '2 celery stalks, diced', '1 onion, diced', '2 tsp cumin', '1 tsp turmeric', 'Salt, pepper, bay leaf'],
    steps: ['Add all ingredients to slow cooker.', 'Cook on low for 6-8 hours or high for 3-4 hours.', 'Remove bay leaf. Season to taste.', 'Stores well for 4-5 days — meal prep hero.'],
  },
  {
    id: 'r10', title: 'Anti-Inflammatory Trail Mix', category: 'Snack', prepTime: '5 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'high-omega3'],
    description: 'Keep a batch ready for when you need fuel but not a full meal.',
    ingredients: ['½ cup walnuts', '½ cup almonds', '¼ cup pumpkin seeds', '¼ cup dark chocolate chips (70%+)', '¼ cup dried tart cherries', '2 tbsp coconut flakes'],
    steps: ['Mix all ingredients in a bowl.', 'Store in an airtight container.', 'Portion into small bags for grab-and-go.'],
  },
  {
    id: 'r11', title: 'Golden Milk (Turmeric Latte)', category: 'Snack', prepTime: '5 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'dairy-free-option', 'gut-health'],
    description: 'A warm, soothing drink that doubles as medicine. Great before bed.',
    ingredients: ['1 cup coconut or oat milk', '1 tsp turmeric', '½ tsp cinnamon', '¼ tsp ginger powder', 'Pinch of black pepper', '1 tsp honey or maple syrup'],
    steps: ['Warm milk in a small saucepan over medium heat.', 'Whisk in turmeric, cinnamon, ginger, and pepper.', 'Heat until steaming but not boiling.', 'Sweeten to taste. Drink warm.'],
  },
  {
    id: 'r12', title: 'Hummus & Veggie Plate', category: 'Snack', prepTime: '5 min',
    tags: ['anti-inflammatory', 'easy-prep', 'gluten-free', 'gut-health', 'high-fiber'],
    description: 'Minimal prep, maximum crunch. Good protein and fiber for sustained energy.',
    ingredients: ['½ cup hummus', '1 cup carrot sticks', '1 cup cucumber slices', '½ cup cherry tomatoes', '¼ cup olives', 'Sprinkle of za\'atar or paprika on hummus'],
    steps: ['Scoop hummus into a bowl, sprinkle with seasoning.', 'Arrange vegetables around hummus.', 'Eat. That\'s it. No cooking required.'],
  },
];

// ─── COACH RESPONSE SYSTEM ──────────────────────────────────
const COACH_PATTERNS = [
  { keywords: ['pain', 'hurt', 'ache', 'flare', 'bad day'], response: (p) =>
    `I hear you — pain flares are exhausting, and I want you to know that what you're feeling is valid. Here are a few things that might help right now:\n\n• Try the 4-7-8 breathing exercise in the Breathe section — it activates your parasympathetic nervous system.\n• Gentle movement (even just stretching in bed) can sometimes interrupt the pain signal cycle.\n• If you haven't yet, log today's check-in. Tracking patterns helps us understand your triggers over time.\n\n${p?.notes ? `Based on your profile, I'm keeping your conditions in mind with any suggestions I make.` : ''}\n\n⚕️ *I'm not a doctor. If your pain is new, severe, or concerning, please reach out to your healthcare provider.*` },
  { keywords: ['sleep', 'insomnia', 'tired', 'exhausted', 'fatigue'], response: (p) =>
    `Sleep and chronic conditions are deeply intertwined — poor sleep amplifies pain, and pain disrupts sleep. A few evidence-backed suggestions:\n\n• Try the 4-7-8 breathing pattern about 20 minutes before bed.\n• Keep a consistent wake time, even on bad days — it's more important than bedtime.\n• Avoid screens for 30 minutes before sleep. Try journaling instead.\n• The Lesson "Sleep & The Pain Cycle" in your program has more detailed strategies.\n\n⚕️ *I'm not a doctor. If fatigue is significantly impacting your daily life, please discuss with your healthcare provider.*` },
  { keywords: ['food', 'eat', 'diet', 'nutrition', 'meal', 'recipe', 'cook'], response: (p) =>
    `Great question! Nutrition plays a bigger role in managing chronic conditions than most people realize. Anti-inflammatory foods can genuinely help over time.\n\nCheck out the Recipes section in Wellness — I've curated options based on your profile. Key principles:\n\n• Focus on omega-3 rich foods (salmon, walnuts, flaxseed)\n• Turmeric + black pepper is a powerful anti-inflammatory combo\n• Minimize processed foods and added sugars\n• Stay hydrated — track it in your Food Diary\n\n${p?.notes ? `I'll keep your specific needs in mind for any food recommendations.` : ''}\n\n⚕️ *I'm not a doctor or dietitian. For personalized nutrition plans, consult a registered dietitian familiar with your condition.*` },
  { keywords: ['exercise', 'move', 'walk', 'stretch', 'activity', 'workout'], response: (p) =>
    `Movement with a chronic condition is about finding your baseline — the amount you can do consistently without triggering a crash. This is covered in the "Breaking the Boom-Bust Cycle" lesson.\n\nSome gentle starting points:\n\n• 5-minute walks (seriously, that's enough to start)\n• Gentle stretching from a seated or lying position\n• The breathing exercises count as activity for your nervous system\n• Yoga and tai chi have evidence for chronic pain management\n\nThe key: do less than you think you can on good days. Consistency > intensity.\n\n⚕️ *I'm not a doctor. Discuss any new exercise routine with your healthcare provider.*` },
  { keywords: ['anxious', 'anxiety', 'stress', 'worried', 'panic', 'overwhelm'], response: (p) =>
    `Anxiety and chronic conditions often travel together — your nervous system is already on high alert, so stress hits harder. That's not weakness, it's biology.\n\nRight now, try this:\n\n• The Box Breath exercise (Breathe section) is specifically designed for acute stress\n• The "Defusing From Difficult Thoughts" lesson teaches ACT techniques for anxiety\n• Name 5 things you can see right now — grounding pulls you into the present\n\nLonger term, regular breathing practice genuinely rewires your stress response over weeks.\n\n⚕️ *I'm not a doctor. If anxiety is significantly impacting your daily life, please reach out to a mental health professional.*` },
  { keywords: ['sad', 'depressed', 'hopeless', 'grief', 'loss', 'cry'], response: (p) =>
    `What you're feeling makes complete sense. Chronic conditions involve real grief — grief for the life you had, the things you can't do, the person you were before. That's not self-pity, it's a natural response to a difficult reality.\n\nA few thoughts:\n\n• Your journal is a safe space to process these feelings — writing helps externalize what's swirling inside\n• The "Values Compass" lesson can help reconnect you with what still matters\n• The community section has others who understand exactly this feeling\n• Small acts of self-compassion matter more than you think\n\n⚕️ *I'm not a doctor. If you're experiencing persistent depression, please reach out to a mental health professional. You deserve support.*` },
  { keywords: ['hello', 'hi', 'hey', 'start', 'help', 'what can you'], response: (p) =>
    `Hi${p?.name ? ' ' + p.name : ''}! I'm your Theralevia wellness coach. I can help with:\n\n• Understanding and managing your symptoms\n• Breathing and mindfulness techniques\n• Nutrition and anti-inflammatory eating\n• Sleep strategies\n• Exercise guidance for chronic conditions\n• Emotional support and coping strategies\n\nWhat's on your mind today? I'm here to listen and help however I can.\n\n⚕️ *Quick reminder: I'm an AI wellness coach, not a doctor. For medical advice, please consult your healthcare provider.*` },
];

const DEFAULT_RESPONSE = (p) =>
  `Thank you for sharing that${p?.name ? ', ' + p.name : ''}. Living with a chronic condition means navigating challenges that most people don't see.\n\nHere are some things I can help with:\n\n• Pain management strategies\n• Sleep improvement techniques\n• Nutrition and anti-inflammatory recipes\n• Breathing exercises for your nervous system\n• Emotional support and coping tools\n\nFeel free to ask about any of these, or just tell me how you're feeling today.\n\n⚕️ *I'm not a doctor. For medical concerns, please consult your healthcare provider.*`;

// ─── EXPORTED FUNCTIONS ──────────────────────────────────────

export async function getCoachResponse(message, profile = {}, history = []) {
  if (AI_CONFIG.provider !== 'demo' && AI_CONFIG.apiEndpoint) {
    // Real API call — swap in when ready
    const res = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, profile, history }),
    });
    const data = await res.json();
    return data.response;
  }

  // Demo mode: pattern matching
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200)); // simulate thinking
  const lower = message.toLowerCase();
  const match = COACH_PATTERNS.find(p => p.keywords.some(k => lower.includes(k)));
  return match ? match.response(profile) : DEFAULT_RESPONSE(profile);
}

export function getRecipeSuggestions(profile = {}) {
  const notes = (profile.notes || '').toLowerCase();
  const conditions = [];
  if (notes.includes('fibro') || notes.includes('lupus') || notes.includes('arthritis') || notes.includes('inflam')) {
    conditions.push('anti-inflammatory');
  }
  if (notes.includes('gluten')) conditions.push('gluten-free');
  if (notes.includes('dairy')) conditions.push('dairy-free', 'dairy-free-option');
  if (notes.includes('easy') || notes.includes('fatigue') || notes.includes('tired')) conditions.push('easy-prep');
  if (notes.includes('gut') || notes.includes('digest') || notes.includes('ibs')) conditions.push('gut-health');

  if (conditions.length === 0) return RECIPES; // Return all if no conditions specified

  // Score recipes by how many condition tags they match
  const scored = RECIPES.map(r => ({
    ...r,
    score: r.tags.filter(t => conditions.includes(t)).length,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function getAllRecipes() {
  return RECIPES;
}
