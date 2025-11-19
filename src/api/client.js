import axios from 'axios'

// API 基礎 URL，可以透過環境變數配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://uie47061-medipoint.hf.space'

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 請求攔截器 - 可以在這裡加入 Token
apiClient.interceptors.request.use(
  config => {
    // 如果有 token，加入到 header
    const token = localStorage.getItem('medipoint_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 回應攔截器 - 統一處理錯誤
apiClient.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 統一錯誤處理
    const message = error.response?.data?.error?.message || '請求失敗'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export default apiClient
