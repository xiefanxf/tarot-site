'use strict';

const tarotData = require('../../data/tarot.js');

const CATEGORY_ICONS = {
  love: '♡',
  career: '◇',
  wealth: '◉',
  health: '✦',
  general: '☼',
};

const CATEGORY_LABELS = {
  love: '感情姻缘',
  career: '事业前程',
  wealth: '财富运势',
  health: '健康身心',
  general: '综合指引',
};

function stageState(stage) {
  return {
    stage: stage,
    showIntro: stage === 'intro',
    showQuestion: stage === 'question',
    showShuffle: stage === 'shuffle',
    showSpreads: stage === 'spreads',
    showReading: stage === 'reading',
    showReveal: stage === 'reveal',
  };
}

function shuffledCopy(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[randomIndex];
    copy[randomIndex] = current;
  }
  return copy;
}

function drawCards(count, spread) {
  return shuffledCopy(tarotData.tarotCards).slice(0, count).map(function mapCard(card, index) {
    const isReversed = Math.random() < 0.3;
    const position = spread.positions[index];
    return {
      id: card.id,
      card: card,
      positionLabel: position.label,
      positionDescription: position.description,
      isReversed: isReversed,
      isRevealed: false,
      displayImage: '/assets/card_back.jpg',
      displayName: '等待翻牌',
      orientationLabel: '',
      keywords: [],
      description: '',
      imageClass: 'card-image',
      detailImageClass: 'detail-image',
    };
  });
}

function revealCard(card) {
  const keywords = card.isReversed ? card.card.reversedKeywords : card.card.uprightKeywords;
  return Object.assign({}, card, {
    isRevealed: true,
    displayImage: card.card.image,
    displayName: card.card.name,
    orientationLabel: card.isReversed ? '逆位' : '正位',
    keywords: keywords.slice(0, 4),
    description: card.isReversed ? card.card.reversedDescription : card.card.uprightDescription,
    imageClass: card.isReversed ? 'card-image card-image-reversed' : 'card-image',
    detailImageClass: card.isReversed ? 'detail-image detail-image-reversed' : 'detail-image',
  });
}

function buildSummary(cards, spread, category) {
  const reversedCount = cards.filter(function isReversed(item) { return item.isReversed; }).length;
  const majorCount = cards.filter(function isMajor(item) { return item.card.arcana === 'major'; }).length;
  const categoryLabel = CATEGORY_LABELS[category] || '综合指引';

  if (spread.id === 'single') {
    const card = cards[0];
    const keywords = card.isReversed ? card.card.reversedKeywords : card.card.uprightKeywords;
    const orientation = card.isReversed ? '逆位' : '正位';
    return card.card.name + orientation + '为你的' + categoryLabel + '带来核心指引：' + keywords.slice(0, 2).join('、') + '是此刻最值得留意的主题。';
  }

  if (spread.id === 'three_card') {
    let summary = '从' + cards[0].card.name + '的过往经历，到' + cards[1].card.name + '的当前状态，再到' + cards[2].card.name + '的未来走向，时间之流呈现了一条连续的发展脉络。';
    if (reversedCount > 1) {
      summary += '多张逆位牌提示，当前更需要自我梳理与耐心调整。';
    } else if (reversedCount === 0) {
      summary += '三张牌均为正位，整体能量流动较为顺畅。';
    }
    return summary;
  }

  let summary = '凯尔特十字从现状、挑战、根基与未来等十个角度，为这个问题提供了一次全景观察。';
  summary += majorCount >= 5
    ? '大阿卡纳占比较高，说明这更像是一次重要的阶段转折。'
    : '大小阿卡纳彼此交织，既包含长期主题，也取决于日常选择。';
  return summary;
}

function buildGuidance(cards) {
  const elementCounts = {};
  cards.forEach(function countElement(item) {
    const element = item.card.element || 'Unknown';
    elementCounts[element] = (elementCounts[element] || 0) + 1;
  });

  const dominantElement = Object.keys(elementCounts).sort(function sortElements(a, b) {
    return elementCounts[b] - elementCounts[a];
  })[0];
  const reversedCount = cards.filter(function isReversed(item) { return item.isReversed; }).length;
  const guidance = [];

  if (dominantElement === 'Fire') {
    guidance.push('火元素提醒你保持热情与行动力，同时为冲动留出一点缓冲。');
  } else if (dominantElement === 'Water') {
    guidance.push('水元素邀请你倾听内心，分辨直觉与一时情绪之间的差别。');
  } else if (dominantElement === 'Air') {
    guidance.push('风元素提示你整理信息、说清需求，并用开放的思维看待选择。');
  } else if (dominantElement === 'Earth') {
    guidance.push('土元素建议你回到现实基础，从一个可以立即执行的小行动开始。');
  }

  if (reversedCount === 0) {
    guidance.push('牌面整体顺畅，但仍请把解读当作观察自己的镜子，而非替你做决定的答案。');
  } else if (reversedCount <= 2) {
    guidance.push('少量逆位牌代表内在阻力，先承认它，再决定是否需要改变方向。');
  } else {
    guidance.push('逆位牌较多，适合放慢节奏，给自己一些时间重新梳理优先级。');
  }

  return guidance.map(function mapGuidance(text, index) {
    return { index: index + 1, text: text };
  });
}

Page({
  data: {
    stage: 'intro',
    showIntro: true,
    showQuestion: false,
    showShuffle: false,
    showSpreads: false,
    showReading: false,
    showReveal: false,
    themeClass: 'theme-light',
    themeIcon: '☾',
    isDark: false,
    deckCards: [0, 1, 2, 3, 4, 5, 6],
    categories: tarotData.questionCategories.map(function mapCategory(category) {
      return Object.assign({}, category, {
        iconText: CATEGORY_ICONS[category.id],
        buttonClass: 'category-button',
      });
    }),
    spreads: tarotData.spreads.map(function mapSpread(spread) {
      return Object.assign({}, spread, {
        countLabel: spread.positions.length + ' 张牌',
        previewLabels: spread.positions.slice(0, 4),
        extraPositionCount: Math.max(0, spread.positions.length - 4),
        hasExtraPositions: spread.positions.length > 4,
      });
    }),
    selectedCategory: '',
    selectedCategoryLabel: '',
    question: '',
    canStartShuffle: false,
    startShuffleDisabled: true,
    shufflePhase: 'idle',
    shuffleMessage: '集中精神，默念你的问题',
    shuffleReady: false,
    selectedSpread: null,
    readingCards: [],
    revealedCount: 0,
    allRevealed: false,
    readingStatus: '',
    readingGridClass: 'reading-grid',
    summary: '',
    guidance: [],
    majorCount: 0,
    minorCount: 0,
    reversedCount: 0,
  },

  onLoad: function onLoad() {
    this._timers = [];
    try {
      const systemInfo = xhs.getSystemInfoSync();
      if (systemInfo.theme === 'dark') {
        this.setData({ isDark: true, themeClass: 'theme-dark', themeIcon: '☀' });
      }
    } catch (error) {
      console.warn('Unable to read system theme', error);
    }
  },

  onUnload: function onUnload() {
    this.clearTimers();
  },

  clearTimers: function clearTimers() {
    (this._timers || []).forEach(function clearTimer(timer) { clearTimeout(timer); });
    this._timers = [];
  },

  schedule: function schedule(callback, delay) {
    const timer = setTimeout(callback, delay);
    this._timers.push(timer);
  },

  toggleTheme: function toggleTheme() {
    const isDark = !this.data.isDark;
    this.setData({
      isDark: isDark,
      themeClass: isDark ? 'theme-dark' : 'theme-light',
      themeIcon: isDark ? '☀' : '☾',
    });
  },

  startReadingFlow: function startReadingFlow() {
    this.setData(stageState('question'));
  },

  backToIntro: function backToIntro() {
    this.clearTimers();
    this.setData(stageState('intro'));
  },

  chooseCategory: function chooseCategory(event) {
    const categoryId = event.currentTarget.dataset.id;
    this.setData({
      categories: this.data.categories.map(function mapCategory(category) {
        return Object.assign({}, category, {
          buttonClass: category.id === categoryId ? 'category-button category-active' : 'category-button',
        });
      }),
      selectedCategory: categoryId,
      selectedCategoryLabel: CATEGORY_LABELS[categoryId],
      canStartShuffle: true,
      startShuffleDisabled: false,
    });
  },

  onQuestionInput: function onQuestionInput(event) {
    this.setData({ question: event.detail.value });
  },

  startShuffle: function startShuffle() {
    if (!this.data.selectedCategory) {
      xhs.showToast({ title: '请先选择占卜领域', icon: 'none' });
      return;
    }
    this.setData(stageState('shuffle'));
    this.runShuffle('shuffle');
  },

  runShuffle: function runShuffle(mode) {
    this.clearTimers();
    this.setData({
      shufflePhase: mode === 'cut' ? 'cutting' : 'mixing',
      shuffleMessage: mode === 'cut' ? '正在切牌…' : '正在洗牌…',
      shuffleReady: false,
    });

    this.schedule(function finishShuffle() {
      this.setData({
        shufflePhase: 'fanned',
        shuffleMessage: mode === 'cut' ? '切牌完成' : '牌已洗好',
        shuffleReady: true,
      });
    }.bind(this), mode === 'cut' ? 1100 : 1500);
  },

  reshuffle: function reshuffle() {
    this.runShuffle('shuffle');
  },

  cutDeck: function cutDeck() {
    this.runShuffle('cut');
  },

  backToQuestion: function backToQuestion() {
    this.clearTimers();
    this.setData(Object.assign(stageState('question'), { shuffleReady: false, shufflePhase: 'idle' }));
  },

  showSpreads: function showSpreads() {
    if (!this.data.shuffleReady) return;
    this.setData(stageState('spreads'));
  },

  backToShuffle: function backToShuffle() {
    this.setData(Object.assign(stageState('shuffle'), {
      shuffleReady: true,
      shufflePhase: 'fanned',
      shuffleMessage: '牌已洗好',
    }));
  },

  selectSpread: function selectSpread(event) {
    const spreadId = event.currentTarget.dataset.id;
    const spread = tarotData.spreads.find(function findSpread(item) { return item.id === spreadId; });
    if (!spread) return;
    const cards = drawCards(spread.positions.length, spread);
    this.setData(Object.assign(stageState('reading'), {
      selectedSpread: spread,
      readingCards: cards,
      revealedCount: 0,
      allRevealed: false,
      readingStatus: '轻触牌面 · 已翻开 0/' + cards.length,
      readingGridClass: spread.id === 'celtic_cross' ? 'reading-grid reading-grid-compact' : 'reading-grid',
    }));
  },

  backToSpreads: function backToSpreads() {
    this.setData(Object.assign(stageState('spreads'), {
      readingCards: [],
      revealedCount: 0,
      allRevealed: false,
    }));
  },

  revealOne: function revealOne(event) {
    const selectedIndex = Number(event.currentTarget.dataset.index);
    const cards = this.data.readingCards.map(function mapCard(card, index) {
      if (index !== selectedIndex || card.isRevealed) return card;
      return revealCard(card);
    });
    const revealedCount = cards.filter(function isRevealed(card) { return card.isRevealed; }).length;
    this.setData({
      readingCards: cards,
      revealedCount: revealedCount,
      allRevealed: revealedCount === cards.length,
      readingStatus: revealedCount === cards.length
        ? '所有牌已翻开，可以查看完整解读'
        : '轻触牌面 · 已翻开 ' + revealedCount + '/' + cards.length,
    });
  },

  revealAll: function revealAll() {
    const cards = this.data.readingCards.map(function mapCard(card) {
      return card.isRevealed ? card : revealCard(card);
    });
    this.setData({
      readingCards: cards,
      revealedCount: cards.length,
      allRevealed: true,
      readingStatus: '所有牌已翻开，可以查看完整解读',
    });
  },

  showFullReading: function showFullReading() {
    if (!this.data.allRevealed) {
      xhs.showToast({ title: '请先翻开全部牌', icon: 'none' });
      return;
    }
    const cards = this.data.readingCards;
    const majorCount = cards.filter(function isMajor(item) { return item.card.arcana === 'major'; }).length;
    const reversedCount = cards.filter(function isReversed(item) { return item.isReversed; }).length;
    this.setData(Object.assign(stageState('reveal'), {
      summary: buildSummary(cards, this.data.selectedSpread, this.data.selectedCategory),
      guidance: buildGuidance(cards),
      majorCount: majorCount,
      minorCount: cards.length - majorCount,
      reversedCount: reversedCount,
    }));
  },

  saveReading: function saveReading() {
    const record = {
      savedAt: new Date().toISOString(),
      category: this.data.selectedCategoryLabel,
      question: this.data.question,
      spread: this.data.selectedSpread.name,
      summary: this.data.summary,
      guidance: this.data.guidance,
      cards: this.data.readingCards.map(function mapCard(item) {
        return {
          position: item.positionLabel,
          name: item.card.name,
          orientation: item.orientationLabel,
          keywords: item.keywords,
          description: item.description,
        };
      }),
    };
    xhs.setStorage({
      key: 'solaris_luna_latest_reading',
      data: record,
      success: function onSuccess() {
        xhs.showToast({ title: '已保存到本机', icon: 'success' });
      },
      fail: function onFail() {
        xhs.showToast({ title: '保存失败，请稍后再试', icon: 'none' });
      },
    });
  },

  restart: function restart() {
    this.clearTimers();
    this.setData(Object.assign(stageState('intro'), {
      categories: this.data.categories.map(function resetCategory(category) {
        return Object.assign({}, category, { buttonClass: 'category-button' });
      }),
      selectedCategory: '',
      selectedCategoryLabel: '',
      question: '',
      canStartShuffle: false,
      startShuffleDisabled: true,
      shufflePhase: 'idle',
      shuffleMessage: '集中精神，默念你的问题',
      shuffleReady: false,
      selectedSpread: null,
      readingCards: [],
      revealedCount: 0,
      allRevealed: false,
      readingStatus: '',
      readingGridClass: 'reading-grid',
      summary: '',
      guidance: [],
      majorCount: 0,
      minorCount: 0,
      reversedCount: 0,
    }));
  },

  sharePayload: function sharePayload() {
    const firstCard = this.data.readingCards[0];
    const title = firstCard && firstCard.isRevealed
      ? '我的日月塔罗指引：' + firstCard.card.name
      : '日月塔罗｜给此刻的自己一张牌';
    return {
      title: title,
      path: '/pages/index/index',
      content: '抽一组牌，听见内心真实的声音。内容仅供自我探索与娱乐。',
    };
  },

  onShareAppMessage: function onShareAppMessage() {
    return this.sharePayload();
  },

  onShareTimeline: function onShareTimeline() {
    const payload = this.sharePayload();
    return { title: payload.title, query: '' };
  },

  onShareChat: function onShareChat() {
    return this.sharePayload();
  },
});
