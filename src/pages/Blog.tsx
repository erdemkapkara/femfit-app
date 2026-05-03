import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  body: string;
}

interface Comment {
  text: string;
  author: string;
  timestamp: string;
  anonymous: boolean;
}

const POSTS: Post[] = [
  {
    id: 'pcos',
    title: 'Understanding PCOS: What Every Woman Should Know',
    author: 'Dr. Maya Chen',
    date: '2026-04-10',
    excerpt: 'Polycystic ovary syndrome affects 1 in 10 women of reproductive age. Here\'s a clear breakdown of symptoms, causes, and management strategies.',
    body: `Polycystic ovary syndrome (PCOS) is one of the most common hormonal disorders, affecting up to 10% of women during their reproductive years. Despite its prevalence, it's often misunderstood or misdiagnosed.

**What is PCOS?**
PCOS is characterized by hormonal imbalance, irregular periods, and the presence of small cysts on the ovaries (though not all women with PCOS have cysts). The root cause is insulin resistance combined with elevated androgens (male hormones).

**Key Symptoms**
- Irregular or absent periods
- Excess hair growth (hirsutism) on face, chest, or back
- Acne and oily skin
- Weight gain, especially around the waist
- Difficulty conceiving
- Mood changes and fatigue

**Management Strategies**
Lifestyle changes are the first-line treatment. Regular exercise, particularly strength training and cardio, significantly improves insulin sensitivity. A low-glycemic diet — rich in fiber, lean protein, and healthy fats — helps regulate blood sugar.

For fitness, cycle syncing is especially beneficial for women with PCOS. Aligning your workouts with your hormonal fluctuations can reduce inflammation, improve energy, and support hormonal balance.

Talk to your doctor about medical options like metformin or hormonal contraceptives if lifestyle changes alone aren't sufficient.`,
  },
  {
    id: 'cycle-syncing',
    title: 'Cycle Syncing: The Science of Training with Your Hormones',
    author: 'Sarah Williams, CSCS',
    date: '2026-04-18',
    excerpt: 'Your hormones shift dramatically across your menstrual cycle — and your workouts should too. Here\'s how to optimize your training for each phase.',
    body: `Cycle syncing is the practice of aligning your diet, exercise, and lifestyle to the four phases of the menstrual cycle. Pioneered by functional nutritionist Alissa Vitti, this approach works with your hormonal fluctuations instead of against them.

**The Four Phases**

*Menstrual Phase (Days 1-5)*
Estrogen and progesterone are at their lowest. Energy is naturally lower. This is the time for rest, gentle yoga, and walking. Don't push hard workouts — your body is doing significant internal work.

*Follicular Phase (Days 6-13)*
Estrogen begins to rise. You'll feel more energetic, creative, and social. This is the best time to try new workouts, increase intensity, and push your limits. HIIT and strength training shine here.

*Ovulation Phase (Days 14-16)*
Estrogen peaks and testosterone surges. Your strength and endurance are at their highest. PR attempts, heavy lifts, and high-intensity cardio are all optimal now.

*Luteal Phase (Days 17-28)*
Progesterone rises while estrogen dips slightly. Endurance improves but raw power decreases. Focus on steady-state cardio, pilates, and moderate strength training. Carbohydrate needs increase in this phase.

**Practical Tips**
- Track your cycle so you know which phase you're in
- Plan challenging workouts for the follicular and ovulatory phases
- Don't compare performance across phases — each has its purpose
- Listen to your body over any rigid schedule`,
  },
  {
    id: 'nutrition-myths',
    title: '5 Nutrition Myths That Are Holding Women Back',
    author: 'Dr. Priya Kapoor, RD',
    date: '2026-04-25',
    excerpt: 'From "carbs are the enemy" to "eat less, move more" — these widespread nutrition myths do real harm to women\'s health and fitness progress.',
    body: `Nutrition advice is everywhere, and unfortunately much of it is wrong — especially for women. Here are five persistent myths and what the science actually says.

**Myth 1: Carbs are the enemy**
Carbohydrates are your body's preferred fuel source, especially for the brain and during exercise. The issue is *type* and *quantity*, not carbs themselves. Complex carbs (oats, sweet potato, brown rice) are anti-inflammatory and support hormonal balance. Cutting carbs excessively disrupts cortisol and thyroid function.

**Myth 2: Eating fat makes you fat**
Healthy fats (avocado, olive oil, nuts, fatty fish) are essential for producing estrogen, progesterone, and testosterone. Low-fat diets have been linked to hormonal disruption and fertility issues. Fat does not cause fat storage — excess total calories do.

**Myth 3: You need to eat less to lose weight**
Chronically undereating raises cortisol, slows metabolism, and increases muscle breakdown. Women especially suffer from this: restrictive eating is associated with amenorrhea, bone density loss, and mood disorders. Eat enough — focus on food quality, not just quantity.

**Myth 4: Protein is only for bodybuilders**
Women consistently under-eat protein. Aim for 1.6-2.2g per kg of body weight if you're active. Protein supports lean muscle, satiety, hormonal production, and immune function.

**Myth 5: All calories are equal**
A 500-calorie donut and a 500-calorie meal of salmon, vegetables, and quinoa create entirely different hormonal, metabolic, and satiety responses. Food quality matters enormously.`,
  },
  {
    id: 'workout-phases',
    title: 'The Best Workouts for Each Phase of Your Cycle',
    author: 'Emma Rodriguez, PT',
    date: '2026-05-02',
    excerpt: 'A practical guide to matching your workouts to your hormones — with specific exercise recommendations for every phase.',
    body: `Your body's performance capacity genuinely changes across the menstrual cycle. Here's a practical guide to making the most of each phase.

**Menstrual Phase: Restore**
Best: Yin yoga, gentle stretching, walking, swimming
Avoid: High-intensity interval training, heavy lifting

During menstruation, your iron levels may drop and energy is naturally lower. Restorative movement reduces prostaglandins (the hormones responsible for cramps) and supports recovery. Focus on breathwork and gentle flow.

**Follicular Phase: Build**
Best: New skill training, HIIT, strength training at moderate loads, group fitness classes
Avoid: Nothing — this is your most adaptable phase

Rising estrogen increases muscle recovery speed and pain tolerance. This is the ideal time to start a new program or increase training volume. Muscle-building is most efficient here.

**Ovulation Phase: Peak**
Best: Heavy lifting, sprints, athletic performance, competitive sports
Avoid: Overtraining — injury risk increases near ovulation

Testosterone peaks during ovulation, enhancing power and explosive strength. Ligament laxity also increases, so warm up thoroughly and prioritize form over load.

**Luteal Phase: Sustain**
Best: Moderate strength training, pilates, yoga, steady-state cardio, swimming
Avoid: Drastically reducing activity — movement reduces PMS symptoms

Progesterone supports endurance. Many women perform best at longer, moderate-effort activities. Increase carbohydrate intake slightly to support mood and energy.`,
  },
  {
    id: 'mental-health',
    title: 'The Cycle-Mental Health Connection: What You Need to Know',
    author: 'Dr. Laila Hassan, Psychiatrist',
    date: '2026-05-09',
    excerpt: 'Hormonal fluctuations across the menstrual cycle significantly impact mood, anxiety, and cognitive function. Here\'s how to navigate them.',
    body: `The relationship between the menstrual cycle and mental health is profound — yet it's rarely discussed openly. Understanding this connection can transform how you relate to your emotions and seek support.

**Hormones and the Brain**
Estrogen and progesterone directly influence neurotransmitters. Estrogen boosts serotonin and dopamine, improving mood and focus. When estrogen drops — particularly in the late luteal phase — so can these chemicals, triggering low mood, irritability, and anxiety.

**Premenstrual Syndrome (PMS) vs. PMDD**
PMS affects up to 75% of menstruating women with mild symptoms. Premenstrual dysphoric disorder (PMDD) affects 3-8% and involves severe depression, rage, or anxiety specifically in the luteal phase that resolves with menstruation. PMDD is a legitimate medical condition that responds well to SSRIs, hormonal therapy, and structured lifestyle interventions.

**Exercise as Medicine**
Regular aerobic exercise is one of the most evidence-based interventions for cycle-related mood changes. It increases endorphins and serotonin while reducing cortisol. Even 20-30 minutes of brisk walking 4-5 times per week significantly improves PMS symptoms.

**Practical Coping Strategies**
- Track your mood alongside your cycle to identify patterns
- Reduce alcohol and caffeine in the luteal phase (they amplify anxiety)
- Prioritize sleep — progesterone disruption worsens insomnia
- Magnesium (300mg/day) has strong evidence for reducing PMS-related depression and irritability
- Reach out to a mental health professional if symptoms are severe or impair functioning`,
  },
  {
    id: 'hormones',
    title: 'The Four Key Hormones of Your Cycle — Explained Simply',
    author: 'Dr. Nina Park, Endocrinologist',
    date: '2026-05-15',
    excerpt: 'Estrogen, progesterone, FSH, and LH drive your entire menstrual cycle. Here\'s what each one does and why it matters for your health.',
    body: `The menstrual cycle is orchestrated by four main hormones. Understanding them gives you a clear picture of what's happening in your body each month.

**Follicle-Stimulating Hormone (FSH)**
Produced by the pituitary gland, FSH triggers the growth of follicles in the ovaries during the early follicular phase. Each follicle contains an egg. As follicles mature, they produce estrogen, which feeds back to the pituitary to regulate FSH levels.

**Estrogen (Estradiol)**
The dominant hormone of the first half of the cycle. Estrogen:
- Builds the uterine lining (endometrium)
- Improves mood, energy, and cognitive function
- Enhances muscle recovery and bone density
- Peaks just before ovulation, triggering the LH surge

**Luteinizing Hormone (LH)**
Produced by the pituitary, LH surges mid-cycle to trigger the release of an egg from the dominant follicle. This is ovulation. Ovulation predictor kits (OPKs) detect this LH surge.

**Progesterone**
Produced by the corpus luteum (the shell of the released follicle), progesterone:
- Prepares the uterine lining for implantation
- Rises in the luteal phase, causing a slight body temperature increase
- Promotes sleep and has a calming effect
- Drops sharply if no pregnancy occurs, triggering menstruation

**Imbalances to Watch For**
- Low progesterone: short luteal phase, PMS, anxiety, insomnia
- High androgens (testosterone): PCOS, acne, irregular cycles
- Estrogen dominance: heavy periods, fibroids, mood swings
- Always consult a healthcare provider for hormone testing and interpretation.`,
  },
];

const Blog: React.FC = () => {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const all: Record<string, Comment[]> = {};
    POSTS.forEach(p => {
      const saved = localStorage.getItem(`femfit-blog-comments-${p.id}`);
      if (saved) all[p.id] = JSON.parse(saved);
    });
    setComments(all);

    const profile = localStorage.getItem('femfit-profile');
    if (profile) setIsAnonymous(JSON.parse(profile).isAnonymous || false);
  }, []);

  const handleComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const profile = JSON.parse(localStorage.getItem('femfit-profile') || '{}');
    const displayName = isAnonymous ? 'Anonymous Member' : (profile.name || 'You');
    const comment: Comment = {
      text,
      author: displayName,
      timestamp: new Date().toLocaleString(),
      anonymous: isAnonymous,
    };
    const updated = [...(comments[postId] || []), comment];
    setComments({ ...comments, [postId]: updated });
    localStorage.setItem(`femfit-blog-comments-${postId}`, JSON.stringify(updated));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-femfit-sand to-femfit-linen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Wellness Blog</h1>
        <p className="text-gray-500 text-sm mb-6">Science-backed articles on women's health, hormones, and fitness</p>

        <div className="space-y-5">
          {POSTS.map(post => {
            const open = expandedPost === post.id;
            const postComments = comments[post.id] || [];
            return (
              <div key={post.id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Header */}
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => setExpandedPost(open ? null : post.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-charcoal mb-1">{post.title}</h2>
                      <p className="text-xs text-gray-400 mb-2">{post.author} · {post.date}</p>
                      <p className="text-sm text-gray-600">{post.excerpt}</p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {open ? <ChevronUp size={20} className="text-sage" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </button>

                {/* Expanded body */}
                {open && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-sage/20 pt-4 mb-6">
                      {post.body.split('\n\n').map((para, i) => {
                        if (para.startsWith('**') && para.endsWith('**')) {
                          return <h3 key={i} className="font-bold text-charcoal mt-4 mb-1">{para.replace(/\*\*/g, '')}</h3>;
                        }
                        if (para.startsWith('*') && para.endsWith('*')) {
                          return <p key={i} className="font-semibold text-sage text-sm mt-3 mb-0.5">{para.replace(/\*/g, '')}</p>;
                        }
                        if (para.startsWith('- ') || para.includes('\n- ')) {
                          return (
                            <ul key={i} className="list-disc list-inside text-sm text-gray-600 space-y-0.5 my-2">
                              {para.split('\n').map((line, j) => (
                                <li key={j}>{line.replace(/^- /, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={i} className="text-sm text-gray-600 my-2 leading-relaxed">{para}</p>;
                      })}
                    </div>

                    {/* Comments */}
                    <div className="border-t border-sage/20 pt-4">
                      <h3 className="text-sm font-bold text-charcoal mb-3">
                        Comments ({postComments.length})
                      </h3>

                      {postComments.map((c, i) => (
                        <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-charcoal">{c.author}</span>
                            <span className="text-xs text-gray-400">{c.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600">{c.text}</p>
                        </div>
                      ))}

                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                          placeholder={`Comment as ${isAnonymous ? 'Anonymous Member' : 'yourself'}…`}
                          className="flex-1 border border-sage/30 rounded-lg px-3 py-2 text-sm focus:border-sage outline-none"
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          className="bg-sage text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90"
                        >
                          Post
                        </button>
                      </div>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={e => setIsAnonymous(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-xs text-gray-500">Post anonymously</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
