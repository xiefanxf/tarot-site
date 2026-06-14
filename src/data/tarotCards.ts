import type { DrawnCard, TarotCard, SpreadType, QuestionCategory } from '@/types/tarot';

const cardImage = (filename: string) => `${import.meta.env.BASE_URL}cards/${filename}`;

export const questionCategories: QuestionCategory[] = [
  { id: 'love', label: '感情姻缘', icon: 'heart' },
  { id: 'career', label: '事业前程', icon: 'briefcase' },
  { id: 'wealth', label: '财富运势', icon: 'coins' },
  { id: 'health', label: '健康身心', icon: 'heart-pulse' },
  { id: 'general', label: '综合指引', icon: 'sparkles' },
];

export const spreads: SpreadType[] = [
  {
    id: 'single',
    name: '单张牌',
    nameEn: 'The Single Card',
    description: '抽取一张牌，获取当下的核心指引与启示',
    positions: [
      { index: 0, label: '指引', x: 50, y: 45, description: '此刻宇宙要传递给妳的核心讯息' },
    ],
  },
  {
    id: 'three_card',
    name: '时间之流',
    nameEn: 'The Three-Card Spread',
    description: '三张牌揭示过去、现在与未来的能量流动',
    positions: [
      { index: 0, label: '过去', x: 20, y: 45, description: '影响当前情况的根源与过往经历' },
      { index: 1, label: '现在', x: 50, y: 45, description: '妳当下的处境与核心状态' },
      { index: 2, label: '未来', x: 80, y: 45, description: '按照当前轨迹发展的近期未来' },
    ],
  },
  {
    id: 'celtic_cross',
    name: '凯尔特十字',
    nameEn: 'The Celtic Cross',
    description: '经典的十张牌深度解析牌阵，全面洞察问题',
    positions: [
      { index: 0, label: '现状', x: 32, y: 52, description: '当前问题的核心状态' },
      { index: 1, label: '挑战', x: 32, y: 40, description: '横亘在面前的阻碍或助力', isCross: true },
      { index: 2, label: '根基', x: 32, y: 84, description: '问题的深层基础与潜意识' },
      { index: 3, label: '过去', x: 8, y: 52, description: '刚刚过去的影响因素' },
      { index: 4, label: '目标', x: 56, y: 52, description: '最好的结果与冠冕' },
      { index: 5, label: '未来', x: 32, y: 16, description: '即将到来的能量' },
      { index: 6, label: '自我', x: 82, y: 16, description: '妳在当前情境中的角色' },
      { index: 7, label: '环境', x: 82, y: 39, description: '外部环境与他人影响' },
      { index: 8, label: '希望', x: 82, y: 62, description: '内心的希望或恐惧' },
      { index: 9, label: '结果', x: 82, y: 85, description: '问题的最终结果' },
    ],
  },
];

export const tarotCards: TarotCard[] = [
  // 大阿卡纳 Major Arcana (22张)
  {
    id: 'm0', name: '愚人', nameEn: 'The Fool', arcana: 'major', suit: 'major', number: 0, romanNumeral: '0',
    image: cardImage('0_fool.jpg'),
    uprightKeywords: ['新的开始', '纯真', '自发性', '自由精神', '冒险'],
    uprightDescription: '你正站在新旅程的起点。像愚人一样，你需要对未知保持信任，勇敢地踏出那一步。不要害怕跌落，因为每一次坠落都是为了更高的飞翔。宇宙在保护着你，保持那颗赤子之心，去拥抱无限的可能。',
    reversedKeywords: ['鲁莽', '冒险', '优柔寡断', '愚蠢', '缺乏方向'],
    reversedDescription: '此刻需要谨慎。你的行为可能过于冲动，缺乏对潜在风险的评估。请暂停片刻，看清脚下的路。不要盲目乐观，也不要被表面的诱惑所迷惑。先思考，再行动。',
    element: 'Air', planet: 'Uranus',
  },
  {
    id: 'm1', name: '魔术师', nameEn: 'The Magician', arcana: 'major', suit: 'major', number: 1, romanNumeral: 'I',
    image: cardImage('1_magician.jpg'),
    uprightKeywords: ['创造力', '意志力', '显化', '技巧', '自信'],
    uprightDescription: '你拥有实现目标所需的所有资源和能力。魔术师提醒你，你已经具备了火、水、风、土四元素的力量。现在是将想法付诸行动的时刻。相信自己的能力，专注于你的意图，你可以将梦想化为现实。',
    reversedKeywords: ['欺骗', '操控', '缺乏动力', '才华未展', '不自信'],
    reversedDescription: '你可能感到自己的才能没有被充分发挥，或者在某些情况下被误导。小心不要被他人的花言巧语所欺骗，也不要自欺。重新审视自己的技能和资源，找回那份内在的自信。',
    element: 'Air', planet: 'Mercury',
  },
  {
    id: 'm2', name: '女祭司', nameEn: 'The High Priestess', arcana: 'major', suit: 'major', number: 2, romanNumeral: 'II',
    image: cardImage('2_priestess.jpg'),
    uprightKeywords: ['直觉', '潜意识', '内在智慧', '神秘', '宁静'],
    uprightDescription: '是时候倾听内心的声音了。女祭司守护着潜意识深处的智慧，她邀请你进入内在的宁静空间。不要被外界的喧嚣所干扰，相信你的直觉——它比理性分析更了解真相。答案已经在你的心中。',
    reversedKeywords: ['忽视直觉', '表面化', '秘密', '情绪失衡', '迷茫'],
    reversedDescription: '你可能过于依赖理性分析，而忽略了内心的声音。或者你被某些秘密所困扰，无法看清真相。请给自己一些独处的时间，重新连接内在的智慧。真相需要静心才能听见。',
    element: 'Water', planet: 'Moon',
  },
  {
    id: 'm3', name: '女皇', nameEn: 'The Empress', arcana: 'major', suit: 'major', number: 3, romanNumeral: 'III',
    image: cardImage('3_empress.jpg'),
    uprightKeywords: ['丰饶', '母性', '创造力', '感官', '自然'],
    uprightDescription: '丰收的季节来临了。女皇代表着创造力、爱与丰饶的能量。无论是孕育新的项目、培养一段关系，还是享受生活的美好，这都是一个充满生机的时刻。亲近自然，善待自己，让创造的能量自由流动。',
    reversedKeywords: ['不孕', '依赖', '创造力受阻', '过度保护', '物质主义'],
    reversedDescription: '你可能感到创造力受阻，或者在关系中过于依赖他人。也可能你对自己过于严苛，忘记了享受生活的乐趣。重新找回与自然的连接，给自己更多的滋养和关爱。',
    element: 'Earth', planet: 'Venus',
  },
  {
    id: 'm4', name: '皇帝', nameEn: 'The Emperor', arcana: 'major', suit: 'major', number: 4, romanNumeral: 'IV',
    image: cardImage('4_emperor.jpg'),
    uprightKeywords: ['权威', '稳定', '父性', '结构', '控制'],
    uprightDescription: '建立秩序和结构的时刻到了。皇帝代表着权威、纪律和稳定的力量。无论是在事业还是生活中，你需要制定清晰的计划，建立稳固的基础。用理性和决心去面对挑战，你将成为自己生命中的主宰。',
    reversedKeywords: ['专制', '僵化', '缺乏纪律', '滥用权力', '不稳定'],
    reversedDescription: '你可能过于僵化或专制，需要学会灵活变通。或者你缺乏必要的纪律和结构，导致生活混乱。找到权威与弹性之间的平衡，建立健康的边界。',
    element: 'Fire', planet: 'Mars',
  },
  {
    id: 'm5', name: '教皇', nameEn: 'The Hierophant', arcana: 'major', suit: 'major', number: 5, romanNumeral: 'V',
    image: cardImage('5_hierophant.jpg'),
    uprightKeywords: ['传统', '信仰', '教导', '精神指引', '仪式'],
    uprightDescription: '遵循传统和智慧的指引。教皇代表着精神导师、教育机构和传统价值观。这是一个学习和接受教导的时刻，寻求有经验者的建议。尊重既定的规则和仪式，它们蕴含着世代相传的智慧。',
    reversedKeywords: ['叛逆', '非传统', '教条', '迷信', '精神危机'],
    reversedDescription: '你可能正在质疑传统观念和权威。这并非坏事——打破旧有的束缚，寻找属于自己的道路。但要小心不要陷入另一种极端的教条。保持开放的心态，探索真正适合你的信念体系。',
    element: 'Earth', zodiac: 'Taurus',
  },
  {
    id: 'm6', name: '恋人', nameEn: 'The Lovers', arcana: 'major', suit: 'major', number: 6, romanNumeral: 'VI',
    image: cardImage('6_lovers.jpg'),
    uprightKeywords: ['爱情', '选择', '和谐', '价值观', '结合'],
    uprightDescription: '重要的选择和深刻的关系正在你的生命中展开。恋人牌不仅代表浪漫爱情，更象征着价值观的统合与灵魂的结合。这是一个需要做决定的时刻——选择那条与你的内心真正共鸣的道路。爱会指引你。',
    reversedKeywords: ['失衡', '错误选择', '价值观冲突', '分离', '不忠'],
    reversedDescription: '关系中可能存在失衡或不和谐。你可能面临一个艰难的选择，价值观的冲突让你感到困惑。诚实地面对自己和他人，重新审视什么对你真正重要。不要违背内心的真实感受。',
    element: 'Air', zodiac: 'Gemini',
  },
  {
    id: 'm7', name: '战车', nameEn: 'The Chariot', arcana: 'major', suit: 'major', number: 7, romanNumeral: 'VII',
    image: cardImage('7_chariot.jpg'),
    uprightKeywords: ['意志力', '胜利', '决心', '控制', '前进'],
    uprightDescription: '以坚定的意志力驶向胜利。战车代表着通过决心和自律克服困难。你内在的黑白两面——对立的力量——正在被驾驭和统一。不要退缩，保持专注，你将征服一切障碍，到达目标的彼岸。',
    reversedKeywords: ['失控', '缺乏方向', '挫败', '侵略性', '放弃'],
    reversedDescription: '你可能感到失去了控制，或者缺乏明确的方向。挫败感可能让你想要放弃。但不要被情绪左右，重新找回内心的坚定。检查你的目标是否真正符合你的价值观，然后调整方向重新出发。',
    element: 'Water', zodiac: 'Cancer',
  },
  {
    id: 'm8', name: '力量', nameEn: 'Strength', arcana: 'major', suit: 'major', number: 8, romanNumeral: 'VIII',
    image: cardImage('8_strength.jpg'),
    uprightKeywords: ['内在力量', '勇气', '耐心', '同情心', '自制'],
    uprightDescription: '真正的力量来自内心的温柔与坚韧。不是用武力压制，而是用爱和耐心驯服内在的野兽。你比自己想象的更强大。以柔克刚，用同情心去面对挑战，你会发现内在的勇气无穷无尽。',
    reversedKeywords: ['软弱', '缺乏自信', '压抑', '失控', '滥用力量'],
    reversedDescription: '你可能感到自信不足，或者正在压抑某些情绪。不要对自己过于苛刻。真正的力量不是否认脆弱，而是接纳它。给自己一些时间和空间，重新找回内在的平衡与勇气。',
    element: 'Fire', zodiac: 'Leo',
  },
  {
    id: 'm9', name: '隐士', nameEn: 'The Hermit', arcana: 'major', suit: 'major', number: 9, romanNumeral: 'IX',
    image: cardImage('9_hermit.jpg'),
    uprightKeywords: ['内省', '孤独', '智慧', '指引', '寻找真理'],
    uprightDescription: '退后一步，在独处中寻找答案。隐士举着灯笼，在黑暗中照亮前行的路。这是一个向内探索的时刻，远离喧嚣，与自己的灵魂对话。你不需要他人的认可，真理就在你手中的灯光里。',
    reversedKeywords: ['孤立', '逃避', '迷失', '拒绝建议', '过度孤独'],
    reversedDescription: '你可能过于孤立自己，或者陷入了过度思考的漩涡。内省是宝贵的，但不要让它变成逃避。适时地走出你的壳，与他人连接。有时候，答案不在孤独中，而在分享中。',
    element: 'Earth', zodiac: 'Virgo',
  },
  {
    id: 'm10', name: '命运之轮', nameEn: 'Wheel of Fortune', arcana: 'major', suit: 'major', number: 10, romanNumeral: 'X',
    image: cardImage('10_wheel.jpg'),
    uprightKeywords: ['命运', '转变', '周期', '好运', '机遇'],
    uprightDescription: '命运之轮正在转动，带来转变和机遇。无论是上升还是下降，都是生命循环的一部分。顺应变化的潮流，抓住这个时刻的机遇。记住，好运不会永远停留，所以要善用当前的顺境。',
    reversedKeywords: ['厄运', '抗拒改变', '恶性循环', '失控', '坏运气'],
    reversedDescription: '你可能感到被困在一个恶性循环中，或者遭遇了一些挫折。命运之轮提醒我们，逆境也是暂时的。检查是否有需要改变的模式，接受变化，打破旧的循环。黎明前的黑暗总是最深的。',
    element: 'Fire', planet: 'Jupiter',
  },
  {
    id: 'm11', name: '正义', nameEn: 'Justice', arcana: 'major', suit: 'major', number: 11, romanNumeral: 'XI',
    image: cardImage('11_justice.jpg'),
    uprightKeywords: ['公正', '平衡', '真理', '因果', '法律'],
    uprightDescription: '因果的平衡正在显现。正义牌提醒我们，每一个行为都有其后果。面对真相，无论它是否符合你的期待。以公正和客观的态度去处理事务，做出符合道德和良知的决定。真理终将 凯旋。',
    reversedKeywords: ['不公', '偏见', '逃避责任', '不平衡', '法律纠纷'],
    reversedDescription: '可能存在不公平的情况，或者你在逃避某些责任。诚实地审视自己的行为和动机。不要试图欺骗自己或他人。承认错误并做出修正，才能恢复内心的平衡。',
    element: 'Air', zodiac: 'Libra',
  },
  {
    id: 'm12', name: '倒吊人', nameEn: 'The Hanged Man', arcana: 'major', suit: 'major', number: 12, romanNumeral: 'XII',
    image: cardImage('12_hanged.jpg'),
    uprightKeywords: ['牺牲', '放下', '新视角', '等待', '觉悟'],
    uprightDescription: '有时候，我们需要暂停和放手，才能看到真相。倒吊人以不同的角度看待世界，他自愿的牺牲带来了深刻的觉悟。不要抗拒当前的停滞，利用这段时间重新审视。放下执着，答案会自然浮现。',
    reversedKeywords: ['固执', '停滞', '无意义的牺牲', '抗拒', '拖延'],
    reversedDescription: '你可能固执地坚持某种方式，即使它已经不起作用。或者在无意义的情况下继续牺牲自己。学会分辨哪些值得坚持，哪些需要放手。有时候，最大的智慧在于知道何时放弃。',
    element: 'Water', planet: 'Neptune',
  },
  {
    id: 'm13', name: '死神', nameEn: 'Death', arcana: 'major', suit: 'major', number: 13, romanNumeral: 'XIII',
    image: cardImage('13_death.jpg'),
    uprightKeywords: ['结束', '转变', '新生', '放下', '蜕变'],
    uprightDescription: '旧的必须离去，新的才能到来。死神不是终结，而是蜕变和重生的门户。某段关系、某种模式或某个阶段正在结束，虽然过程可能痛苦，但这是必要的清理。拥抱变化，让自己从灰烬中重生。',
    reversedKeywords: ['抗拒结束', '停滞', '恐惧改变', '无法放手', '衰亡'],
    reversedDescription: '你可能在抗拒必要的结束，紧抓着已经死去的东西不放。这种抗拒只会延长痛苦。学会放手，相信结束是为了更好的开始。不要恐惧改变——它是生命唯一的常数。',
    element: 'Water', zodiac: 'Scorpio',
  },
  {
    id: 'm14', name: '节制', nameEn: 'Temperance', arcana: 'major', suit: 'major', number: 14, romanNumeral: 'XIV',
    image: cardImage('14_temperance.jpg'),
    uprightKeywords: ['平衡', '调和', '耐心', '中庸', '炼金术'],
    uprightDescription: '在极端之间找到平衡与和谐。节制天使将两个杯中的水混合，象征着对立面的融合。无论是在情绪、工作还是关系中，寻找中庸之道。耐心地进行调和，你会发现炼金术般的转化正在发生。',
    reversedKeywords: ['极端', '失衡', '过度', '缺乏耐心', '冲突'],
    reversedDescription: '你可能陷入了某种极端，或者生活中存在失衡。过度的工作、情绪或行为正在造成问题。重新找回平衡，学会节制。对立的力量需要被调和，而不是压制。',
    element: 'Fire', zodiac: 'Sagittarius',
  },
  {
    id: 'm15', name: '恶魔', nameEn: 'The Devil', arcana: 'major', suit: 'major', number: 15, romanNumeral: 'XV',
    image: cardImage('15_devil.jpg'),
    uprightKeywords: ['束缚', '欲望', '物质主义', '诱惑', '成瘾'],
    uprightDescription: '看看是什么束缚了你。恶魔代表着我们对物质、欲望和恐惧的执着。这些锁链看似坚固，但实际上是自我施加的。意识到你的束缚，然后选择解放自己。你有力量打破这些链条。',
    reversedKeywords: ['解放', '打破束缚', '觉醒', '摆脱依赖', '面对阴影'],
    reversedDescription: '打破束缚的时刻已经到来。你正在觉醒，意识到自己曾经被什么所控制。无论是成瘾的关系、物质依赖还是负面模式，你正在获得自由。继续这个解放的过程，拥抱真正的自主。',
    element: 'Earth', zodiac: 'Capricorn',
  },
  {
    id: 'm16', name: '高塔', nameEn: 'The Tower', arcana: 'major', suit: 'major', number: 16, romanNumeral: 'XVI',
    image: cardImage('16_tower.jpg'),
    uprightKeywords: ['突变', '觉醒', '崩塌', '启示', '解放'],
    uprightDescription: '突如其来的改变正在打破旧有的结构。高塔的崩塌虽然令人震惊，但它清除了建立在虚假基础上的东西。这个剧变是一个觉醒的机会——真理在废墟中闪耀。不要恐惧，这是宇宙在为你清理道路。',
    reversedKeywords: ['逃避灾难', '延迟改变', '内在崩塌', '恐惧', '抵抗'],
    reversedDescription: '你可能在逃避必要的改变，或者内在的崩塌正在暗中发生。不要试图维持已经不稳定的东西。有时候，我们需要主动拆除旧塔，而不是等待它倒塌。面对真相，即使它令人不安。',
    element: 'Fire', planet: 'Mars',
  },
  {
    id: 'm17', name: '星星', nameEn: 'The Star', arcana: 'major', suit: 'major', number: 17, romanNumeral: 'XVII',
    image: cardImage('17_star.jpg'),
    uprightKeywords: ['希望', '灵感', '宁静', '更新', '精神连接'],
    uprightDescription: '暴风雨后的宁静，希望在夜空中闪耀。星星带来了治愈和更新的能量。你的梦想正在被宇宙听见，保持信心和耐心。这是一个与更高精神力量连接的时刻，相信一切都会好起来的。',
    reversedKeywords: ['绝望', '失去信心', '脱离现实', '缺乏灵感', '空虚'],
    reversedDescription: '你可能感到希望渺茫，或者与内在的精神连接断裂了。不要被暂时的黑暗所迷惑，星星依然在天空中，只是被云层遮挡。重新找回你的信仰和希望，哪怕只是微小的光芒。',
    element: 'Air', zodiac: 'Aquarius',
  },
  {
    id: 'm18', name: '月亮', nameEn: 'The Moon', arcana: 'major', suit: 'major', number: 18, romanNumeral: 'XVIII',
    image: cardImage('18_moon.jpg'),
    uprightKeywords: ['幻觉', '潜意识', '恐惧', '直觉', '梦境'],
    uprightDescription: '在迷雾中前行，相信你的直觉。月亮照亮了潜意识的深处，揭示隐藏的真相和恐惧。事情可能不像表面看起来那样，但不要害怕。跟随内心的指引，穿越这片神秘的领域，你会发现宝贵的洞察。',
    reversedKeywords: ['混乱', '欺骗', '恐惧消散', '幻觉破灭', '情绪不稳'],
    reversedDescription: '迷雾正在散去，真相逐渐显现。你可能终于看清了某些幻觉或欺骗。虽然这个过程可能令人不安，但它是必要的。释放你的恐惧，拥抱 清明。真相会让你自由。',
    element: 'Water', zodiac: 'Pisces',
  },
  {
    id: 'm19', name: '太阳', nameEn: 'The Sun', arcana: 'major', suit: 'major', number: 19, romanNumeral: 'XIX',
    image: cardImage('19_sun.jpg'),
    uprightKeywords: ['快乐', '成功', '活力', '真相', '正面能量'],
    uprightDescription: '阳光普照，万物欣欣向荣。太阳是塔罗中最吉祥的牌，代表着纯粹的快乐、成功和活力。你的正面积能量正在吸引美好的事物。享受这个时刻，与他人分享你的光芒。生命是美好的。',
    reversedKeywords: ['暂时的忧郁', '自我怀疑', '过度乐观', '延迟的成功', '被遮蔽'],
    reversedDescription: '可能有暂时的乌云遮住了阳光，但这只是短暂的。检查是否有自我怀疑在影响你。不要过度乐观而忽略细节。相信太阳总会再次照耀——保持信心。',
    element: 'Fire', planet: 'Sun',
  },
  {
    id: 'm20', name: '审判', nameEn: 'Judgement', arcana: 'major', suit: 'major', number: 20, romanNumeral: 'XX',
    image: cardImage('20_judgement.jpg'),
    uprightKeywords: ['重生', '召唤', '宽恕', '内在审判', '觉醒'],
    uprightDescription: '生命的召唤唤醒了你沉睡的灵魂。审判牌代表着一个重要的觉醒时刻——你听到了内心深处的呼唤。这是一个宽恕自己和他人、释放过去、迎接新生的时刻。站起来，回应你的使命。',
    reversedKeywords: ['自我怀疑', '拒绝召唤', '缺乏宽恕', '内疚', '逃避'],
    reversedDescription: '你可能在逃避某个重要的召唤，或者被内疚和自我怀疑所困扰。不要让过去的错误定义你的未来。学会宽恕自己，勇敢地回应内心的声音。你的使命在等待着。',
    element: 'Fire', zodiac: 'Pluto',
  },
  {
    id: 'm21', name: '世界', nameEn: 'The World', arcana: 'major', suit: 'major', number: 21, romanNumeral: 'XXI',
    image: cardImage('21_world.jpg'),
    uprightKeywords: ['完成', '成就', '整合', '圆满', '旅行'],
    uprightDescription: '一个完整的循环已经达成，成就的桂冠属于你。世界牌代表着圆满、整合和成功的完成。你经历了一段漫长的旅程，现在收获了果实。庆祝你的成就，同时准备迎接新的循环。世界是妳的舞台。',
    reversedKeywords: ['未完成的循环', '延迟', '缺乏封闭', '空虚', '不完美'],
    reversedDescription: '可能还有一些未完成的事情，或者你感到某个循环没有妥善结束。不要急于开始新的事物，先完成手头的工作。寻找缺失的部分，给过去一个圆满的 了结。',
    element: 'Earth', planet: 'Saturn',
  },
  // 权杖 Wands (14张)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const wandsData: Record<number, { name: string; nameEn: string; keywords: string[]; desc: string; rKeywords: string[]; rDesc: string }> = {
      1: { name: '权杖一', nameEn: 'Ace of Wands', keywords: ['灵感', '创造', '新机会', '激情'], desc: '创造的火花被点燃，新的灵感如火焰般燃烧。这是一个充满激情和创造力的开端，抓住这股能量去实现你的愿景。', rKeywords: ['延迟', '缺乏动力', '创意受阻', '错失机会'], rDesc: '创意之火暂时熄灭，或者新计划遭遇延迟。不要灰心，这只是暂时的停滞。重新点燃你的激情。' },
      2: { name: '权杖二', nameEn: 'Two of Wands', keywords: ['规划', '决策', '远见', '探索'], desc: '站在城堡的高处眺望远方，你正在规划未来的蓝图。这是一个需要做决策的时刻，勇敢地探索未知的领域。', rKeywords: ['恐惧', '犹豫不决', '缺乏规划', '目光短浅'], rDesc: '你可能因为恐惧而无法做出决定，或者计划不够周全。克服内心的不安，勇敢地迈出第一步。' },
      3: { name: '权杖三', nameEn: 'Three of Wands', keywords: ['远见', '合作', '扩张', '进展'], desc: '远方的船只正在靠岸，初步的努力开始看见成果。保持远见，继续拓展视野，合作会带来更大的成功。', rKeywords: ['延迟', '合作问题', '障碍', '失望'], rDesc: '预期的成果可能延迟到来，或者合作中出现了问题。保持耐心，调整策略，继续前进。' },
      4: { name: '权杖四', nameEn: 'Four of Wands', keywords: ['庆祝', '和谐', '家庭', '稳定'], desc: '丰收的庆典正在进行，这是一个值得庆祝的时刻。家庭、友谊和社区带来温暖和支持。享受这份和谐与喜悦。', rKeywords: ['不稳定', '家庭冲突', '缺乏支持', '过渡期'], rDesc: '可能感到归属感的缺失，或者家庭/社交环境存在不和谐。寻找建立更稳固基础的方法。' },
      5: { name: '权杖五', nameEn: 'Five of Wands', keywords: ['冲突', '竞争', '挑战', '分歧'], desc: '竞争和冲突围绕着你，但这不一定是坏事。健康的竞争可以激发潜力，关键是明智地选择值得投入的战斗。', rKeywords: ['避免冲突', '内心矛盾', '不公平竞争', '疲惫'], rDesc: '你可能在逃避必要的对抗，或者感到被不公平的竞争所消耗。找到更健康的方式处理分歧。' },
      6: { name: '权杖六', nameEn: 'Six of Wands', keywords: ['胜利', '认可', '荣耀', '自信'], desc: '胜利的游行正在进行，你的成就得到了认可。自信地享受这份荣耀，这是你应得的。继续前行，更多的成功在等着你。', rKeywords: ['骄傲', '缺乏认可', '延迟的成功', '自负'], rDesc: '可能感到成就未被认可，或者骄傲正在影响你的人际关系。保持谦逊，继续努力。' },
      7: { name: '权杖七', nameEn: 'Seven of Wands', keywords: ['防御', '坚持', '勇气', '立场'], desc: '你需要为自己的信念和立场而战。面对挑战时，请站稳脚跟，你有能力守护自己的位置。', rKeywords: ['不堪重负', '放弃', '软弱', '防线松动'], rDesc: '你可能感到被挑战压垮，想要放弃。重新评估手中的资源，寻求支持，你不必独自战斗。' },
      8: { name: '权杖八', nameEn: 'Eight of Wands', keywords: ['快速', '行动', '进展', '消息'], desc: '事情正在加速发展，快速的行动带来进展。好消息可能即将到来。抓住这股动能，迅速推进你的计划。', rKeywords: ['延迟', '混乱', '匆忙', '方向错误'], rDesc: '进展可能比预期慢，或者匆忙的行动导致了混乱。调整节奏，确保方向正确。' },
      9: { name: '权杖九', nameEn: 'Nine of Wands', keywords: ['坚韧', '防备', '坚持', '最后防线'], desc: '你已经经历了许多 战斗，但依然站立着。最后的考验即将来临，保持警惕和坚韧。你比想象中更强大。', rKeywords: ['疲惫', '偏执', '放弃', '缺乏准备'], rDesc: '疲惫可能让你想要放弃，或者过度的防备让你感到孤立。休息片刻，然后重新站起来。' },
      10: { name: '权杖十', nameEn: 'Ten of Wands', keywords: ['负担', '责任', '压力', '过劳'], desc: '你背负了太多责任与压力。现在需要重新判断真正重要的优先事项，学会委派，或放下一部分不必独自承担的负担。', rKeywords: ['崩溃', '无法放下', '委派失败', '倦怠'], rDesc: '负担已经接近极限，你需要立即采取行动减轻压力。学会说不，也允许自己寻求帮助。' },
      11: { name: '权杖侍从', nameEn: 'Page of Wands', keywords: ['热情', '探索', '新想法', '冒险'], desc: '年轻的侍从带着好奇和热情探索世界。新的想法和冒险在召唤你。保持开放和热情，勇敢尝试。', rKeywords: ['冲动', '缺乏方向', '不成熟', '延迟'], rDesc: '热情可能导致冲动的决定，或者缺乏具体的方向。在追求新想法之前，先制定计划。' },
      12: { name: '权杖骑士', nameEn: 'Knight of Wands', keywords: ['行动', '冒险', '魅力', '冲动'], desc: '充满魅力和活力的骑士冲锋在前。这是采取行动的时刻，但要记得带上理智。冒险伴随着机遇，也需要方向。', rKeywords: ['鲁莽', '不耐烦', '愤怒', '缺乏承诺'], rDesc: '冲动和鲁莽可能带来问题，或者你缺乏完成任务的耐心。三思而后行，别让热情烧得太快。' },
      13: { name: '权杖王后', nameEn: 'Queen of Wands', keywords: ['自信', '热情', '独立', '魅力'], desc: '权杖王后散发着自信和热情的光芒。她独立而充满魅力，用自己的光芒照亮他人。相信你的直觉和创造力。', rKeywords: ['自我怀疑', '嫉妒', '过度情绪化', '专横'], rDesc: '自信可能变成了专横，或者自我怀疑正在侵蚀你的光芒。重新找回内在的平衡。' },
      14: { name: '权杖国王', nameEn: 'King of Wands', keywords: ['领导力', '远见', '企业家', '魅力'], desc: '权杖国王是具有远见和魅力的领导者。他勇敢追求愿景，同时激励他人同行。现在适合展现你的领导力。', rKeywords: ['专横', '冲动', '暴怒', '缺乏方向'], rDesc: '领导力可能变成专横，或者冲动决策带来问题。用智慧平衡热情，让方向比声势更重要。' },
    };
    const d = wandsData[num];
    return {
      id: `w${num}`, name: d.name, nameEn: d.nameEn, arcana: 'minor' as const, suit: 'wands' as const, number: num,
      romanNumeral: ['','I','II','III','IV','V','VI','VII','VIII','IX','X','Page','Knight','Queen','King'][num],
      image: cardImage(`w${num}.jpg`), uprightKeywords: d.keywords, uprightDescription: d.desc,
      reversedKeywords: d.rKeywords, reversedDescription: d.rDesc, element: 'Fire',
    };
  }),
  // 圣杯 Cups (14张)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const cupsData: Record<number, { name: string; nameEn: string; keywords: string[]; desc: string; rKeywords: string[]; rDesc: string }> = {
      1: { name: '圣杯一', nameEn: 'Ace of Cups', keywords: ['爱', '情感', '直觉', '灵性'], desc: '爱与情感的泉源正在涌现。新的感情、创意灵感或灵性觉醒即将到来。打开你的心，接受这份馈赠。', rKeywords: ['情感封闭', '压抑', '错失爱', '空虚'], rDesc: '情感可能被压抑或封闭，无法感受到爱的流动。重新审视你的内心世界。' },
      2: { name: '圣杯二', nameEn: 'Two of Cups', keywords: ['结合', '和谐', '伙伴关系', '爱情'], desc: '两颗心在和谐中共鸣。这是一段基于相互尊重与理解的关系，无论是爱情还是合作，都值得珍惜。', rKeywords: ['失衡', '分离', '冲突', '不平等'], rDesc: '关系中可能存在失衡或沟通问题。坦诚面对问题，寻求更健康的平衡。' },
      3: { name: '圣杯三', nameEn: 'Three of Cups', keywords: ['庆祝', '友谊', '社群', '快乐'], desc: '与朋友们一起庆祝生活的喜悦。友情和社群带来支持和快乐。享受这些美好的时刻。', rKeywords: ['孤立', '过度放纵', '八卦', '孤独'], rDesc: '可能感到被排斥或孤立，或者在社交中过度放纵。寻找真正的 联结。' },
      4: { name: '圣杯四', nameEn: 'Four of Cups', keywords: ['沉思', '不满', '重新评估', '冷漠'], desc: '你对现状感到不满，正在重新审视生活给予你的选择。有时候，我们需要向内看，才能发现真正需要的东西。', rKeywords: ['觉醒', '新机会', '脱离', '自怜'], rDesc: '你可能正在从冷漠中觉醒，新的机会正在出现。睁开眼睛，看看周围仍然存在的美好。' },
      5: { name: '圣杯五', nameEn: 'Five of Cups', keywords: ['失落', '悲伤', '失望', '遗憾'], desc: '失去和悲伤笼罩着你，但请记住，并非所有的杯子都倒了。还有两个杯子依然站立。允许自己悲伤，然后重新站起来。', rKeywords: ['接受', '向前看', '康复', '找到希望'], rDesc: '康复的过程正在进行，你开始看到希望。接受失去，拥抱新的可能性。' },
      6: { name: '圣杯六', nameEn: 'Six of Cups', keywords: ['怀旧', '童年', '纯真', '礼物'], desc: '童年的记忆和纯真的时光带来温暖。有人可能送来一份意想不到的礼物，也可能是你重新连接内在小孩的时刻。', rKeywords: ['沉溺过去', '不成熟', '逃避现实', '停滞'], rDesc: '过度沉溺于过去可能阻碍你前进。珍惜回忆，但也要把自己带回当下。' },
      7: { name: '圣杯七', nameEn: 'Seven of Cups', keywords: ['幻想', '选择', '欲望', '幻觉'], desc: '许多选择和幻想摆在你面前，但并非所有都真实可行。分辨幻觉与现实，才能做出明智选择。', rKeywords: ['决断', '清晰', '面对真相', '克服幻觉'], rDesc: '混乱的选择正在变得清晰，你开始看清真相。做出决定，然后行动。' },
      8: { name: '圣杯八', nameEn: 'Eight of Cups', keywords: ['离开', '寻求', '放手', '旅程'], desc: '放下不再滋养你的事物，开始一段内在旅程。有时候，离开是为了找到更深层的满足。勇敢向前走。', rKeywords: ['恐惧离开', '停滞', '犹豫', '逃避'], rDesc: '你可能害怕离开熟悉的环境，即使它已经不再满足你。勇气是找到真正满足的第一步。' },
      9: { name: '圣杯九', nameEn: 'Nine of Cups', keywords: ['满足', '愿望成真', '幸福', '满足'], desc: '愿望之杯已满，幸福与满足环绕着你。享受这份丰盛，并与他人分享你的好运。这是一张愿望成真的牌。', rKeywords: ['不满', '过度放纵', '贪婪', '空虚'], rDesc: '外在的满足可能掩盖内在的空洞。寻找真正的满足，而不是只用物质或享乐填补自己。' },
      10: { name: '圣杯十', nameEn: 'Ten of Cups', keywords: ['家庭幸福', '和谐', '圆满', '爱'], desc: '家庭的幸福与情感的圆满正在显现。这是充满爱与和谐的时刻，与所爱之人共享生活的美好。', rKeywords: ['家庭冲突', '不和谐', '破碎的梦想', '分离'], rDesc: '家庭或亲密关系中可能存在不和谐。重新审视什么对你真正重要，修复破裂的连接。' },
      11: { name: '圣杯侍从', nameEn: 'Page of Cups', keywords: ['敏感', '直觉', '新感情', '创意'], desc: '敏感的侍从带来情感讯息。新的感情或创造灵感正在敲门。保持内心开放，相信你的直觉。', rKeywords: ['情感不成熟', '幻想', '过度敏感', '逃避'], rDesc: '情感上的不成熟可能导致误解或幻想破灭。请在现实与梦想之间保持平衡。' },
      12: { name: '圣杯骑士', nameEn: 'Knight of Cups', keywords: ['浪漫', '魅力', '追求', '理想主义'], desc: '浪漫的骑士带着爱的讯息而来。追求你的梦想和理想，但不要忘记脚踏实地。让心引领道路。', rKeywords: ['逃避', '不切实际', '情绪化', '承诺问题'], rDesc: '理想主义可能导致逃避现实，或者情绪化影响判断。找到梦想与现实之间的平衡。' },
      13: { name: '圣杯王后', nameEn: 'Queen of Cups', keywords: ['同理心', '直觉', '温柔', '情感智慧'], desc: '圣杯王后是同理心和情感智慧的化身。她倾听内心的声音，温柔地关怀他人。信任直觉，也善待自己。', rKeywords: ['情感失衡', '过度敏感', '被情绪淹没', '依赖'], rDesc: '同理心可能让你被他人的情绪淹没。设立边界，保护自己的情感健康。' },
      14: { name: '圣杯国王', nameEn: 'King of Cups', keywords: ['情感平衡', '慈悲', '外交', '成熟'], desc: '圣杯国王展现了成熟的情感掌控。他在情绪的海洋中保持平衡，以慈悲和智慧引导他人。', rKeywords: ['情绪压抑', '操控', '冷漠', '不稳定'], rDesc: '你可能压抑情绪，或用情感影响他人。学会健康地表达和处理情绪。' },
    };
    const d = cupsData[num];
    return {
      id: `c${num}`, name: d.name, nameEn: d.nameEn, arcana: 'minor' as const, suit: 'cups' as const, number: num,
      romanNumeral: ['','I','II','III','IV','V','VI','VII','VIII','IX','X','Page','Knight','Queen','King'][num],
      image: cardImage(`c${num}.jpg`), uprightKeywords: d.keywords, uprightDescription: d.desc,
      reversedKeywords: d.rKeywords, reversedDescription: d.rDesc, element: 'Water',
    };
  }),
  // 宝剑 Swords (14张)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const swordsData: Record<number, { name: string; nameEn: string; keywords: string[]; desc: string; rKeywords: string[]; rDesc: string }> = {
      1: { name: '宝剑一', nameEn: 'Ace of Swords', keywords: ['清晰', '真相', '突破', '新思维'], desc: '真理之剑划破迷雾，带来清晰的洞察和新的思维方式。这是突破的时刻，请勇敢面对真相。', rKeywords: ['混乱', '谎言', '思维阻塞', '不公'], rDesc: '思维可能混乱或被误导，真相也许被掩盖。重新整理想法，寻找清明。' },
      2: { name: '宝剑二', nameEn: 'Two of Swords', keywords: ['僵局', '选择', '平衡', '逃避'], desc: '蒙眼的女子手持交叉的剑，面临艰难选择。僵局已经出现，你需要摘下蒙眼的布，面对真相。', rKeywords: ['逃避决定', '信息过载', '困惑', '打破僵局'], rDesc: '逃避决定会让情况更加复杂。收集信息，然后做出选择，任何清醒的决定都比停滞更有力量。' },
      3: { name: '宝剑三', nameEn: 'Three of Swords', keywords: ['心碎', '悲伤', '痛苦', '释放'], desc: '三把剑刺穿心脏，代表深刻的情感痛苦。允许自己感受悲伤，因为只有释放，才会开始疗愈。', rKeywords: ['康复', '宽恕', '走出悲伤', '释放痛苦'], rDesc: '疗愈的过程已经开始，你开始走出心碎。宽恕自己和他人，让伤口慢慢愈合。' },
      4: { name: '宝剑四', nameEn: 'Four of Swords', keywords: ['休息', '恢复', '冥想', '沉思'], desc: '战斗之后，休息和恢复是必要的。退到安静的空间，让身心得到修复。', rKeywords: ['不安', '无法休息', '停滞', '焦虑'], rDesc: '焦虑可能让你无法休息，但疲惫会影响判断力。请强制自己暂停和充电。' },
      5: { name: '宝剑五', nameEn: 'Five of Swords', keywords: ['冲突', '胜利', '背叛', '空虚'], desc: '这是一场没有真正赢家的战斗。即使你看似赢了，也要问问自己：代价是否值得？', rKeywords: ['和解', '后悔', '修复', '开放沟通'], rDesc: '过去的冲突需要被处理。开放沟通，寻求和解，真正的胜利是和平。' },
      6: { name: '宝剑六', nameEn: 'Six of Swords', keywords: ['过渡', '离开', '疗愈之旅', '前进'], desc: '你正在渡过困难的水域，前往更平静的岸边。这是转变期，离开困扰你的环境，寻找新的安稳。', rKeywords: ['滞留', '抗拒改变', '无法前进', '延迟'], rDesc: '你可能抗拒离开熟悉但痛苦的环境。接受改变，是疗愈的必要步骤。' },
      7: { name: '宝剑七', nameEn: 'Seven of Swords', keywords: ['欺骗', '策略', '偷窃', '隐秘'], desc: '有人可能不够诚实，或者你正在用间接方式达到目的。检查动机与方法，正直才是长远的智慧。', rKeywords: ['真相暴露', '改变策略', '诚实', '面对后果'], rDesc: '秘密可能被揭露，或者欺骗的策略失效。诚实面对，承担后果，然后继续向前。' },
      8: { name: '宝剑八', nameEn: 'Eight of Swords', keywords: ['束缚', '限制', '无助', '自我设限'], desc: '你看似被困住，但许多束缚其实来自自我设限。移开蒙眼的布，走出自己筑起的牢笼。', rKeywords: ['解放', '新视角', '摆脱束缚', '自由'], rDesc: '你开始意识到束缚并非完全真实，解放的时刻已经到来。迈出第一步，自由就在前方。' },
      9: { name: '宝剑九', nameEn: 'Nine of Swords', keywords: ['焦虑', '噩梦', '恐惧', '过度思考'], desc: '深夜的焦虑折磨着你，恐惧和担忧让你无法入睡。请记住，念头并不等于现实，黎明总会到来。', rKeywords: ['希望', '面对恐惧', '康复', '释放焦虑'], rDesc: '曙光正在穿透黑暗。面对你的恐惧，寻求支持，你不必独自承受这些思绪。' },
      10: { name: '宝剑十', nameEn: 'Ten of Swords', keywords: ['结束', '背叛', '痛苦', '重生'], desc: '一个痛苦的结束已经到来，但触底之后，唯一的方向就是向上。从废墟中，新的开端正在孕育。', rKeywords: ['复苏', '新的开始', '走出低谷', '学习'], rDesc: '即使最深的痛苦也会过去。恢复已经开始，从这次经历中学习，然后继续前行。' },
      11: { name: '宝剑侍从', nameEn: 'Page of Swords', keywords: ['好奇', '警觉', '新想法', '坦诚'], desc: '警觉而好奇的侍从带来新的想法和讯息。保持思维敏捷，但记得在说话之前先思考。', rKeywords: ['流言', '冲动', '缺乏策略', '过度分析'], rDesc: '好奇心可能带来流言或冲动表达。开口之前先想清楚，明智地使用你的理性。' },
      12: { name: '宝剑骑士', nameEn: 'Knight of Swords', keywords: ['行动', '果断', '雄心', '激进'], desc: '果断的骑士以极快速度冲向目标。雄心和驱动力推动着你，但要小心别在路上伤到自己或他人。', rKeywords: ['鲁莽', '冲动', '侵略性', '缺乏规划'], rDesc: '过度匆忙可能导致失控。放慢一点，确保你的行动不会伤害他人或自己。' },
      13: { name: '宝剑王后', nameEn: 'Queen of Swords', keywords: ['独立', '清晰', '直接', '智慧'], desc: '宝剑王后是理智与清晰沟通的化身。她独立而公正，用智慧和诚实面对一切。表达你的真相。', rKeywords: ['冷酷', '过度理性', '疏远', '苛刻'], rDesc: '过度理性可能让你显得冷漠或疏远。请在理智与慈悲之间找到平衡。' },
      14: { name: '宝剑国王', nameEn: 'King of Swords', keywords: ['权威', '真理', '公正', '智力'], desc: '宝剑国王是公正与智识力量的化身。他用逻辑和公平做出决策，也是真相的守护者。', rKeywords: ['滥用权力', '冷酷', '操控', '不公正'], rDesc: '理智可能被用于操控或不公正的目的。记住，真正的力量来自正直。' },
    };
    const d = swordsData[num];
    return {
      id: `s${num}`, name: d.name, nameEn: d.nameEn, arcana: 'minor' as const, suit: 'swords' as const, number: num,
      romanNumeral: ['','I','II','III','IV','V','VI','VII','VIII','IX','X','Page','Knight','Queen','King'][num],
      image: cardImage(`s${num}.jpg`), uprightKeywords: d.keywords, uprightDescription: d.desc,
      reversedKeywords: d.rKeywords, reversedDescription: d.rDesc, element: 'Air',
    };
  }),
  // 星币 Pentacles (14张)
  ...Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const pentsData: Record<number, { name: string; nameEn: string; keywords: string[]; desc: string; rKeywords: string[]; rDesc: string }> = {
      1: { name: '星币一', nameEn: 'Ace of Pentacles', keywords: ['新机会', '财富', '物质', '实现'], desc: '物质世界的大门正在打开，新的财务或事业机会出现。这是一颗种子，需要你的滋养才能成长。', rKeywords: ['错失机会', '财务损失', '贪婪', '延迟'], rDesc: '机会可能就在眼前，但你尚未抓住，或者财务计划遭遇延迟。保持警觉，留意新的可能性。' },
      2: { name: '星币二', nameEn: 'Two of Pentacles', keywords: ['平衡', '灵活', '适应', '调度'], desc: '生活像一场需要技巧的杂耍，你在多个优先事项之间寻找平衡。保持灵活，顺着节奏调整。', rKeywords: ['失衡', '过度承担', '混乱', '压力'], rDesc: '承担太多可能导致崩溃。重新排序优先级，放下一些不必要的负担，专注真正重要的事。' },
      3: { name: '星币三', nameEn: 'Three of Pentacles', keywords: ['合作', '技能', '团队', '工艺'], desc: '你的技能正在被认可，团队合作带来成功。继续打磨技艺，与他人协作创造更好的成果。', rKeywords: ['缺乏协作', '技能不足', '团队冲突', '平庸'], rDesc: '团队合作可能不顺畅，或者个人技能需要提升。寻求反馈，把时间投入学习和练习。' },
      4: { name: '星币四', nameEn: 'Four of Pentacles', keywords: ['保守', '稳定', '控制', '物质安全'], desc: '你紧握资源，寻求物质上的安全感。但小心不要过度占有，紧握的拳头也无法接受新的馈赠。', rKeywords: ['贪婪', '物质主义', '吝啬', '放手'], rDesc: '对物质的执着可能阻碍成长。学习放手与分享，丰盛需要流动。' },
      5: { name: '星币五', nameEn: 'Five of Pentacles', keywords: ['困难', '损失', '孤立', '贫困'], desc: '物质上的困难让你感到孤立无援。但帮助可能就在附近，窗内仍有灯光。伸出手，你不必独自受苦。', rKeywords: ['康复', '新机会', '走出困境', '求助'], rDesc: '情况正在好转，新的机会正在出现。接纳帮助，相信更好的时期正在到来。' },
      6: { name: '星币六', nameEn: 'Six of Pentacles', keywords: ['慷慨', '给予', '接受', '平衡'], desc: '这是施与受的艺术。慷慨创造丰盛的循环，无论给予还是接受，都请保持平衡与感恩。', rKeywords: ['债务', '不平等', '附条件给予', '依赖'], rDesc: '给予或接受可能带有条件，关系也许不够平等。寻求建立在真诚交换上的连接。' },
      7: { name: '星币七', nameEn: 'Seven of Pentacles', keywords: ['耐心', '评估', '成长', '等待'], desc: '种下种子之后，现在是等待与评估的时刻。你的投入需要时间结果，请保持耐心和坚持。', rKeywords: ['不耐烦', '不良投资', '焦虑', '放弃太早'], rDesc: '急躁可能导致过早放弃。信任过程，你的努力会在合适的时机看见回报。' },
      8: { name: '星币八', nameEn: 'Eight of Pentacles', keywords: ['勤奋', '学徒', '专注', '工艺'], desc: '专注于你的技艺，精通一门技能需要持续练习。学徒期和耐心打磨会带来卓越。', rKeywords: ['平庸', '缺乏动力', '完美主义', '倦怠'], rDesc: '你可能感到动力不足或精疲力竭。想起最初开始的原因，从小事做起，重新点燃热情。' },
      9: { name: '星币九', nameEn: 'Nine of Pentacles', keywords: ['独立', '富足', '自给', '享受'], desc: '你享受着自己劳动的果实，独立自主而满足。丰盛不仅是物质，也来自自足与自信。', rKeywords: ['过度消费', '依赖', '空虚', '缺乏纪律'], rDesc: '物质舒适可能掩盖内在缺乏。真正的丰盛来自内在，不只是拥有更多东西。' },
      10: { name: '星币十', nameEn: 'Ten of Pentacles', keywords: ['遗产', '家庭', '长期成功', '传统'], desc: '长期努力创造了持久成功与家庭传承。这是丰盛和安全感的时刻，请享受这些累积而来的果实。', rKeywords: ['家庭冲突', '财务不稳定', '短期思维', '失去传统'], rDesc: '家庭或财务事项可能需要关注。平衡传统与创新，才能维持长久的稳定。' },
      11: { name: '星币侍从', nameEn: 'Page of Pentacles', keywords: ['学习', '机会', '务实', '新计划'], desc: '年轻的侍从带来物质世界的新机会与学习。可以有大梦想，但也要落在务实行动上。', rKeywords: ['缺乏动力', '不切实际', '拖延', '错失良机'], rDesc: '梦想需要行动才能显化。停止拖延，今天就迈出第一个务实的小步骤。' },
      12: { name: '星币骑士', nameEn: 'Knight of Pentacles', keywords: ['勤奋', '可靠', '耐心', '务实'], desc: '这是最可靠的骑士，缓慢而稳健地赢得长程竞赛。努力工作与坚持，是你现在的力量。', rKeywords: ['停滞', '固执', '过度谨慎', '无聊'], rDesc: '过度小心可能导致停滞。请在谨慎规划与实际行动之间找到平衡。' },
      13: { name: '星币王后', nameEn: 'Queen of Pentacles', keywords: ['滋养', '丰盛', '实用', '关怀'], desc: '星币王后是滋养与丰盛的化身。她务实而充满爱心，能够创造温暖、稳定又繁荣的环境。', rKeywords: ['过度牺牲', '忽视自我', '物质焦虑', '失衡'], rDesc: '滋养他人时，不要忘记照顾自己。你的幸福感也是创造丰盛的基础。' },
      14: { name: '星币国王', nameEn: 'King of Pentacles', keywords: ['成功', '领导', '富裕', '稳定'], desc: '星币国王代表物质成功与成熟领导力的高峰。他凭借智慧和努力建立稳固成果，也懂得明智地享受成就。', rKeywords: ['贪婪', '固执', '物质主义', '吝啬'], rDesc: '成功不应变成贪婪或僵化。分享你的丰盛，保持谦逊，也向新的想法开放。' },
    };
    const d = pentsData[num];
    return {
      id: `p${num}`, name: d.name, nameEn: d.nameEn, arcana: 'minor' as const, suit: 'pentacles' as const, number: num,
      romanNumeral: ['','I','II','III','IV','V','VI','VII','VIII','IX','X','Page','Knight','Queen','King'][num],
      image: cardImage(`p${num}.jpg`), uprightKeywords: d.keywords, uprightDescription: d.desc,
      reversedKeywords: d.rKeywords, reversedDescription: d.rDesc, element: 'Earth',
    };
  }),
];

export function getCardById(id: string): TarotCard | undefined {
  return tarotCards.find(c => c.id === id);
}

export function shuffleCards(): TarotCard[] {
  const cards = [...tarotCards];
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function drawCards(count: number): DrawnCard[] {
  const shuffled = shuffleCards();
  return shuffled.slice(0, count).map((card, i) => ({
    card,
    isReversed: Math.random() < 0.3,
    position: i,
    isRevealed: false,
  }));
}
