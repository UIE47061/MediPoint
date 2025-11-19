import apiClient from './client'

/**
 * MediPoint API 服務
 * 所有的 API 請求都定義在這裡
 */
export const medipointAPI = {
  // ========== KPI 相關 ==========
  
  /**
   * 獲取首頁 KPI 數據
   * @returns {Promise} KPI 數據
   */
  getKPISummary() {
    return apiClient.get('/kpi/summary')
  },

  // ========== 議題相關 ==========
  
  /**
   * 獲取議題列表
   * @param {Object} params - 查詢參數
   * @param {string} params.category - 品類篩選 (all, health, maternal, prescription)
   * @param {number} params.limit - 返回數量限制
   * @param {string} params.sort - 排序方式
   * @returns {Promise} 議題列表
   */
  getTopics(params = {}) {
    return apiClient.get('/topics', { params })
  },

  /**
   * 獲取單一議題詳情
   * @param {string} topicId - 議題 ID
   * @returns {Promise} 議題詳情
   */
  getTopicById(topicId) {
    return apiClient.get(`/topics/${topicId}`)
  },

  // ========== 備貨建議相關 ==========
  
  /**
   * 獲取備貨建議列表
   * @param {Object} params - 查詢參數
   * @param {string} params.topicId - 按議題篩選
   * @param {string} params.priority - 優先級篩選 (high, medium, low)
   * @returns {Promise} 備貨建議列表
   */
  getSuggestions(params = {}) {
    return apiClient.get('/suggestions', { params })
  },

  /**
   * 獲取單一備貨建議詳情
   * @param {string} suggestionId - 建議 ID
   * @returns {Promise} 建議詳情
   */
  getSuggestionById(suggestionId) {
    return apiClient.get(`/suggestions/${suggestionId}`)
  },

  // ========== 樣本相關 ==========
  
  /**
   * 獲取輿論樣本列表
   * @param {Object} params - 查詢參數
   * @param {string} params.topicId - 按議題篩選
   * @param {string} params.label - 按標籤篩選
   * @param {string} params.source - 按來源篩選
   * @param {number} params.limit - 返回數量
   * @param {number} params.offset - 分頁偏移
   * @returns {Promise} 樣本列表
   */
  getSamples(params = {}) {
    return apiClient.get('/samples', { params })
  },

  /**
   * 獲取單一樣本詳情
   * @param {string} sampleId - 樣本 ID
   * @returns {Promise} 樣本詳情
   */
  getSampleById(sampleId) {
    return apiClient.get(`/samples/${sampleId}`)
  },

  // ========== 圖表數據相關 ==========
  
  /**
   * 獲取議題熱度分數排行數據
   * @returns {Promise} 議題分數數據
   */
  getChartTopicScores() {
    return apiClient.get('/charts/topic-scores')
  },

  /**
   * 獲取樣本來源分佈數據
   * @returns {Promise} 來源分佈數據
   */
  getChartSampleSources() {
    return apiClient.get('/charts/sample-sources')
  },

  /**
   * 獲取標籤頻次數據
   * @param {number} limit - 返回前 N 個標籤
   * @returns {Promise} 標籤頻次數據
   */
  getChartLabelFrequency(limit = 5) {
    return apiClient.get('/charts/label-frequency', { params: { limit } })
  },

  // ========== ERP 銷售數據相關 ==========
  
  /**
   * 獲取品項銷售趨勢數據
   * @param {Array<string>} skus - SKU 清單
   * @param {string} period - 統計週期 (7d, 30d, 90d)
   * @returns {Promise} 銷售趨勢數據
   */
  getSalesTrends(skus, period = '7d') {
    return apiClient.get('/erp/sales-trends', {
      params: {
        skus: Array.isArray(skus) ? skus.join(',') : skus,
        period
      }
    })
  },

  /**
   * 獲取庫存資訊
   * @param {Array<string>} skus - SKU 清單
   * @returns {Promise} 庫存資訊
   */
  getStockInfo(skus) {
    return apiClient.get('/erp/stock', {
      params: {
        skus: Array.isArray(skus) ? skus.join(',') : skus
      }
    })
  }
}

/**
 * 使用範例：
 * 
 * import { medipointAPI } from '@/api/medipoint'
 * 
 * // 獲取 KPI 數據
 * const kpiData = await medipointAPI.getKPISummary()
 * 
 * // 獲取議題列表
 * const topics = await medipointAPI.getTopics({ category: 'health', limit: 20 })
 * 
 * // 獲取備貨建議
 * const suggestions = await medipointAPI.getSuggestions({ priority: 'high' })
 */
