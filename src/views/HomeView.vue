<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <img class="logo" src="@/assets/logo.png" alt="MediPoint Logo" />
        <div>
          <div class="title">藥點 MediPoint</div>
          <div class="tagline">看懂輿論風向，做對每次備貨</div>
        </div>
      </div>
      <div class="meta">
        <div class="week">每週摘要 · 2025-11-17</div>
        <button @click="init" class="btn small">重新整理</button>
      </div>
    </header>

    <main class="main">
      <section class="kpis card">
        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.label" class="kpi" :title="kpi.tooltip">
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-label">{{ kpi.label }}</div>
          </div>
        </div>
      </section>

      <section class="summary card">
        <div class="section-head">
          <h2>Top 議題與升降趨勢</h2>
          <div class="controls">
            <select v-model="selectedCategory" @change="renderTrends" class="select">
              <option value="all">全部品類</option>
              <option value="health">保健藥品</option>
              <option value="maternal">婦嬰用品</option>
              <option value="prescription">處方藥品</option>
            </select>
          </div>
        </div>

        <div class="trend-list">
          <div 
            v-for="topic in filteredTopics" 
            :key="topic.id" 
            class="trend"
            @click="handleTopicClick(topic.id)"
          >
            <div class="left">
              <div class="topic">{{ topic.topic }}</div>
              <div class="meta">{{ topic.snippetCount }} 篇摘錄 · score {{ topic.score }}</div>
            </div>
            <div class="right">
              <div class="badge" :class="topic.trend">{{ topic.delta }}</div>
            </div>
          </div>
        </div>

        <div class="cta-row">
          <button @click="scrollToSuggestions" class="btn">檢視備貨建議</button>
        </div>
      </section>

      <section class="suggestions card" ref="suggestionsCard">
        <div class="section-head">
          <h2>備貨建議（單頁）</h2>
          <div class="small-note">含替代方案與標準話術</div>
        </div>
        <div class="suggestion-table">
          <div 
            v-for="suggestion in MOCK_SUGGESTIONS" 
            :key="suggestion.sku"
            class="sugg-row"
            :data-topic="suggestion.topicId"
            :ref="el => { if (el) suggestionRefs[suggestion.topicId] = el }"
          >
            <div>
              <div class="title">{{ suggestion.title }}</div>
              <div class="meta-sub">
                <div class="meta-item">{{ suggestion.sku }}</div>
                <div class="meta-item">建議補貨: {{ suggestion.replenish }}</div>
                <div class="meta-item">建議量: {{ suggestion.qty }}</div>
              </div>
            </div>
            <div>
              <div class="alt">替代: {{ suggestion.alt.join('、') }}</div>
              <div class="alt">端架: {{ suggestion.shelf }}</div>
            </div>
            <div class="action">
              <button class="btn small" @click.stop="showTalk">話術</button>
            </div>
          </div>
        </div>
      </section>

      <section class="wall card">
        <div class="section-head">
          <h2>樣本牆（可追溯）</h2>
          <div class="filters">
            <div class="tag-cloud">
              <button
                v-for="tag in allTags"
                :key="tag"
                class="tag"
                :class="{ active: activeTag === tag }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
        <div class="sample-wall">
          <div 
            v-for="sample in filteredSamples" 
            :key="sample.id"
            class="sample"
          >
            <div class="meta">
              <span>{{ sample.source }}</span>
              <span>{{ sample.time }}</span>
            </div>
            <div class="content">{{ sample.text }}</div>
            <div class="meta">
              <span>標籤: {{ sample.labels.join('、') }}</span>
              <span><a :href="sample.url" target="_blank">原文</a></span>
            </div>
          </div>
          <div v-if="filteredSamples.length === 0" class="empty">
            沒有符合的樣本。
          </div>
        </div>
      </section>
    </main>

    <aside class="sidecard card">
      <div class="section-head">
        <h2>關鍵洞察圖表</h2>
      </div>
      <div ref="chartTopicScores" class="chart-container"></div>
      <div ref="chartSampleSources" class="chart-container"></div>
      <div ref="chartLabelDistribution" class="chart-container"></div>
    </aside>

    <footer class="footer">
      <div class="credits"></div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { MOCK_TOPICS, MOCK_SUGGESTIONS, MOCK_SAMPLES } from '@/data/mockdata.js'

const selectedCategory = ref('all')
const activeTag = ref(null)
const filterTopicId = ref(null)
const suggestionRefs = ref({})

const chartTopicScores = ref(null)
const chartSampleSources = ref(null)
const chartLabelDistribution = ref(null)
const suggestionsCard = ref(null)

const kpis = computed(() => {
  // 1. 輿論關注品項銷售占比
  // 計算上升中議題相關的樣本數 / 全部樣本數
  const risingTopicIds = MOCK_TOPICS.filter(t => t.trend === 'up').map(t => t.id)
  const risingTopicSamples = MOCK_SAMPLES.filter(s => risingTopicIds.includes(s.topicId))
  const publicAttentionRatio = ((risingTopicSamples.length / MOCK_SAMPLES.length) * 100).toFixed(1)
  
  // 2. 熱門缺貨風險品項數
  // 計算有建議補貨的 SKU 數量
  const stockRiskCount = MOCK_SUGGESTIONS.filter(s => s.replenish).length
  
  // 3. 輿論↑且銷量同步成長的品項
  // 目前使用 mock 數據，取一半的缺貨風險品項
  const trendingSalesGrowth = Math.ceil(stockRiskCount / 2)
  
  // 4. 輿論↑但銷售尚未放量的品項
  // 目前使用 mock 數據，取另一半的缺貨風險品項
  const trendingNotYetSelling = Math.floor(stockRiskCount / 2)
  
  return [
    { label: '輿論關注品項銷售占比', value: `${publicAttentionRatio}%`, tooltip: '上升議題相關樣本占比' },
    { label: '熱門缺貨風險品項數', value: stockRiskCount, tooltip: '需要優先補貨的 SKU 數' },
    { label: '輿論↑且銷量同步成長', value: trendingSalesGrowth, tooltip: '輿論與銷售雙增長品項' },
    { label: '輿論↑但銷售尚未放量', value: trendingNotYetSelling, tooltip: '潛力品項待啟動' }
  ]
})

const filteredTopics = computed(() => {
  return MOCK_TOPICS.filter(t => 
    selectedCategory.value === 'all' ? true : t.category === selectedCategory.value
  )
})

const allTags = computed(() => {
  const tags = new Set()
  MOCK_SAMPLES.forEach(s => s.labels.forEach(l => tags.add(l)))
  return Array.from(tags)
})

const filteredSamples = computed(() => {
  let list = MOCK_SAMPLES.slice()
  if (filterTopicId.value) {
    list = list.filter(s => s.topicId === filterTopicId.value)
  }
  if (activeTag.value) {
    list = list.filter(s => s.labels.includes(activeTag.value))
  }
  return list
})

function renderTrends() {
  // Category filter is handled by computed property
}

function handleTopicClick(topicId) {
  filterTopicId.value = topicId
  activeTag.value = null
  highlightSuggestions(topicId)
}

function highlightSuggestions(topicId) {
  nextTick(() => {
    const el = suggestionRefs.value[topicId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.animate(
        [
          { boxShadow: '0 0 0 0 rgba(56,168,69,0.12)' },
          { boxShadow: '0 12px 30px rgba(56,168,69,0.08)' }
        ],
        { duration: 600, iterations: 1 }
      )
    }
  })
}

function toggleTag(tag) {
  activeTag.value = activeTag.value === tag ? null : tag
  filterTopicId.value = null
}

function scrollToSuggestions() {
  suggestionsCard.value?.scrollIntoView({ behavior: 'smooth' })
}

function showTalk() {
  alert('開啟話術')
}

function prepareChartData() {
  const topicScores = MOCK_TOPICS.sort((a, b) => b.score - a.score).map(t => ({
    name: t.topic,
    value: t.score
  }))

  const sourceCounts = MOCK_SAMPLES.reduce((acc, s) => {
    acc[s.source] = (acc[s.source] || 0) + 1
    return acc
  }, {})
  const sampleSources = Object.keys(sourceCounts).map(key => ({
    name: key,
    value: sourceCounts[key]
  }))

  const labelCounts = {}
  MOCK_SAMPLES.forEach(s => s.labels.forEach(l => {
    labelCounts[l] = (labelCounts[l] || 0) + 1
  }))
  const labelFrequency = Object.keys(labelCounts)
    .map(key => ({ name: key, value: labelCounts[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return { topicScores, sampleSources, labelFrequency }
}

function renderCharts() {
  const { topicScores, sampleSources, labelFrequency } = prepareChartData()

  const chartBaseConfig = {
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: '20%' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    textStyle: { fontFamily: '-apple-system, BlinkMacSystemFont, "Noto Sans TC", "Helvetica Neue", Helvetica, Arial' },
    color: ['#38a845', '#4a90e2', '#f5a623', '#bd10e0', '#7ed321']
  }

  // Chart 1: Topic Scores
  const chart1 = echarts.init(chartTopicScores.value)
  const topicOption = {
    ...chartBaseConfig,
    title: { text: '議題熱度分數 (Top)', left: 'center', top: '5%', textStyle: { fontSize: 14 } },
    xAxis: { type: 'value' },
    yAxis: {
      type: 'category',
      data: topicScores.map(t => t.name).reverse(),
      axisLabel: { interval: 0, rotate: 0 }
    },
    series: [{
      name: '分數',
      type: 'bar',
      data: topicScores.map(t => t.value).reverse(),
      itemStyle: { borderRadius: [0, 5, 5, 0] }
    }]
  }
  chart1.setOption(topicOption)

  // Chart 2: Sample Sources
  const chart2 = echarts.init(chartSampleSources.value)
  const sourceOption = {
    title: { text: '樣本來源分佈', left: 'center', top: '5%', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' },
    legend: { orient: 'horizontal', bottom: '0%', data: sampleSources.map(s => s.name) },
    series: [{
      name: '來源',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: sampleSources.map(s => ({ value: s.value, name: s.name })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
      label: { formatter: '{b}\n{d}%' }
    }],
    color: chartBaseConfig.color
  }
  chart2.setOption(sourceOption)

  // Chart 3: Label Distribution
  const chart3 = echarts.init(chartLabelDistribution.value)
  const labelOption = {
    ...chartBaseConfig,
    title: { text: '關鍵標籤頻次 (Top 5)', left: 'center', top: '5%', textStyle: { fontSize: 14 } },
    xAxis: {
      type: 'category',
      data: labelFrequency.map(l => l.name),
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: { type: 'value' },
    series: [{
      name: '頻次',
      type: 'bar',
      data: labelFrequency.map(l => l.value),
      itemStyle: { borderRadius: [5, 5, 0, 0] }
    }]
  }
  chart3.setOption(labelOption)

  window.addEventListener('resize', () => {
    chart1.resize()
    chart2.resize()
    chart3.resize()
  })
}

function init() {
  nextTick(() => {
    renderCharts()
  })
}

onMounted(() => {
  init()
})
</script>
