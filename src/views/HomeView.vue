<script setup>
import { ref, onMounted } from 'vue'

// --- 狀態管理 ---
const loading = ref(true)
const reportDate = ref('2025-10-30') 
const kpiData = ref({})
const alerts = ref([])
const suggestions = ref([])
const insights = ref([])

// 互動狀態
const showToast = ref(false) // 控制匯出成功提示
const showModal = ref(false) // 控制話術彈窗
const currentModalData = ref({}) // 彈窗內容

// --- 輔助函式 ---

// 計算毛利率顏色 (低毛利示警)
const getMarginColor = (margin) => {
  if (margin >= 30) return 'text-primary bg-primary-50 border-primary-100'
  if (margin >= 15) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

// 計算庫存燈號
const getStockStatus = (qty) => {
  if (qty <= 30) return { label: '庫存告急', color: 'text-red-600', dot: 'bg-red-500', text: '急需進貨' }
  if (qty <= 60) return { label: '庫存偏低', color: 'text-yellow-600', dot: 'bg-yellow-500', text: '觀察' }
  return { label: '庫存充足', color: 'text-primary', dot: 'bg-primary', text: '庫存高' }
}

// --- 互動功能 ---

// 1. 模擬匯出採購單
const handleExport = () => {
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000) // 3秒後消失
}

// 2. 開啟話術彈窗
const openScriptModal = (item) => {
  currentModalData.value = {
    title: item.topic,
    category: item.related_category,
    intro: item.talking_points,
    // 模擬 AI 生成的詳細指引
    checkpoints: [
      '詢問顧客症狀持續天數（區分一般感冒或流感）',
      '確認是否有藥物過敏史',
      '若為兒童，請依照體重計算劑量'
    ],
    upsell: '建議搭配：維他命 C 發泡錠（提升免疫力）'
  }
  showModal.value = true
}

// 關閉彈窗
const closeModal = () => {
  showModal.value = false
}

// --- 資料載入 ---
const fetchDashboard = async () => {
  loading.value = true
  
  setTimeout(() => {
    
    // 1. KPI 數據 (模擬 S001 門市 10/30 狀態)
    kpiData.value = {
      coverage_label: '熱門商品覆蓋率',
      coverage_value: '85%',        
      coverage_trend: '較上週 +5%',  
      coverage_progress: 85,         

      gross_profit: '4,148', 
      
      // 修正邏輯：毛利 9.8% 對藥局來說偏低，顯示橘色/紅色
      margin_rate: '9.8%',   
      margin_status: 'low', // low, medium, high
      
      top_category: '保健藥品'
    }

    // 2. 法規警示
    alerts.value = [
      { agency: 'CDC', type: '疫情速訊', title: '第 43 週流感併發重症案例上升，請加強衛教', risk_level: 'High' },
      { agency: 'TFDA', type: '藥品回收', title: '特定批號胃藥因包裝瑕疵啟動二級回收', risk_level: 'Medium' }
    ]

    // 3. 智慧備貨建議
    suggestions.value = [
      { 
        topic: '流感與呼吸道感染高峰', 
        action: 'Restock', 
        related_category: '感冒/退燒',
        reason: '輿情熱度上升 150% 且 CDC 發布警示，店內「退燒止痛」庫存低於安全水位。',
        items: [
          { 
            sku_id: 'SKU-保健-001', 
            name: '品牌A 退燒止痛 20入', 
            stock: 25, 
            margin: 34.1, 
            sales_7d: 14,
            status: 'Critical' 
          },
          { 
            sku_id: 'SKU-保健-014', 
            name: '品牌C 感冒成藥 20入', 
            stock: 43, 
            margin: 36.8, 
            sales_7d: 8,
            status: 'Warning'
          }
        ],
        talking_points: '這兩款都是針對發燒與喉嚨痛的熱銷款。品牌A目前庫存只夠賣 2 天，且它是高毛利商品，缺貨會影響利潤，建議盡快補貨。'
      },
      { 
        topic: '換季過敏潮', 
        action: 'Promotion', 
        related_category: '鼻噴劑/維他命',
        reason: 'PTT/Dcard 過敏討論增加，但店內鼻噴劑庫存過高，建議做促銷去化。',
        items: [
          { 
            sku_id: 'SKU-保健-015', 
            name: '品牌C 鼻噴劑 10入', 
            stock: 117, 
            margin: 36.0, 
            sales_7d: 5,
            status: 'Safe' 
          }
        ],
        talking_points: '雖然現在有人問，但我們庫存還有 117 盒 (庫存偏高)。建議擺在櫃台顯眼處，或搭配維他命做「換季防護組」促銷。'
      }
    ]

    // 4. 輿情列表
    insights.value = [
      { source: 'PTT', board: 'BabyMother', title: '小孩半夜發燒買不到藥怎麼辦？', content: '跑了兩家藥局都說退燒藥缺貨，最後只好去急診...', intent: 'Out_of_Stock', tags: ['缺貨', '兒童'] },
      { source: 'Dcard', board: 'Health', title: '最近流感是不是很強？喉嚨痛死', content: '吞口水像刀割一樣，有推薦的成藥嗎？吃了幾款都沒效。', intent: 'Ask', tags: ['流感', '推薦'] },
      { source: 'Google', board: 'Review', title: '藥師很親切，但想買的品牌A沒貨', content: '希望能多進一點... (3星)', intent: 'Complain', tags: ['庫存', '服務'] }
    ]
    
    loading.value = false
  }, 800) // 稍微加長一點點載入時間，讓 Loading 更有感
}

onMounted(() => {
  fetchDashboard()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
    
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <img src="@/assets/logo.png" alt="藥點 MediPoint" class="h-8 md:h-10 w-auto object-contain" />
            <div class="hidden md:block border-l border-slate-300 pl-3 ml-1">
              <h1 class="text-lg font-bold text-slate-900 tracking-tight leading-tight">藥點 MediPoint</h1>
              <p class="text-[10px] text-slate-500 leading-none">ERP 智慧商情系統</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium border border-slate-200">
              門市：S001 大安和平店
            </span>
            <div class="text-right hidden sm:block">
              <p class="text-xs text-slate-400">資料更新時間</p>
              <p class="text-sm font-bold text-slate-700">{{ reportDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Alerts Ticker -->
    <div v-if="alerts.length" class="bg-orange-50 border-b border-orange-100">
      <div class="max-w-7xl mx-auto px-4 py-2 overflow-hidden">
        <div class="flex gap-6 animate-marquee whitespace-nowrap">
          <div v-for="(alert, idx) in alerts" :key="idx" class="flex items-center gap-2 text-sm text-orange-800">
            <span class="bg-orange-200 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded">
              {{ alert.agency }}
            </span>
            <span class="font-medium">{{ alert.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- 1. KPI Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <!-- 卡片 1: 商品覆蓋率 -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start">
            <p class="text-xs text-slate-500 font-medium">{{ kpiData.coverage_label }}</p>
            <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Top 20</span>
          </div>
          <div class="flex items-end gap-2 mt-1">
            <span class="text-2xl font-bold text-slate-900">{{ kpiData.coverage_value }}</span>
            <span class="text-xs font-bold mb-1 text-primary">{{ kpiData.coverage_trend }}</span>
          </div>
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div class="bg-primary h-1.5 rounded-full transition-all duration-1000" :style="`width: ${kpiData.coverage_progress}%`"></div>
          </div>
        </div>

        <!-- 卡片 2 -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-xs text-slate-500 font-medium">今日毛利額</p>
          <div class="flex items-end gap-2 mt-1">
            <span class="text-2xl font-bold text-slate-900">${{ kpiData.gross_profit }}</span>
          </div>
        </div>

        <!-- 卡片 3: 平均毛利率 (修正顏色邏輯) -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-xs text-slate-500 font-medium">平均毛利率</p>
          <div class="flex items-end gap-2 mt-1">
            <!-- 如果是 low，顯示橘色；否則顯示綠色 -->
            <span :class="`text-2xl font-bold ${kpiData.margin_status === 'low' ? 'text-orange-500' : 'text-primary'}`">
              {{ kpiData.margin_rate }}
            </span>
            <span class="text-xs text-slate-400 mb-1">偏低</span>
          </div>
        </div>

        <!-- 卡片 4 -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-xs text-slate-500 font-medium">熱銷品類</p>
          <div class="flex items-end gap-2 mt-1">
            <span class="text-xl font-bold text-slate-900">{{ kpiData.top_category }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- 2. 左側：智慧備貨建議 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span class="w-2 h-6 bg-primary rounded-full"></span>
              AI 備貨與行動建議
            </h2>
            <!-- 互動按鈕 -->
            <button 
              @click="handleExport"
              class="text-xs bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-all active:scale-95 shadow-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              匯出採購單
            </button>
          </div>

          <div v-if="loading" class="p-12 text-center text-slate-400">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <p>AI 正在分析 ERP 與輿情數據...</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Action Card Loop -->
            <div v-for="(item, index) in suggestions" :key="index" 
                 class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
              
              <!-- Card Header -->
              <div class="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span :class="`px-2.5 py-1 rounded-md text-xs font-bold ${item.action === 'Restock' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`">
                      {{ item.action === 'Restock' ? '建議補貨' : '行銷推廣' }}
                    </span>
                    <h3 class="text-base font-bold text-slate-800">{{ item.topic }}</h3>
                  </div>
                  <p class="text-sm text-slate-600">{{ item.reason }}</p>
                </div>
                <div class="text-right">
                   <span class="text-xs text-slate-400 block mb-1">關聯品類</span>
                   <span class="text-sm font-medium text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                     {{ item.related_category }}
                   </span>
                </div>
              </div>

              <!-- Card Body: SKU Table -->
              <div class="p-5">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left">
                    <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th class="px-2 py-2">商品名稱 (SKU)</th>
                        <th class="px-2 py-2">當前庫存</th>
                        <th class="px-2 py-2">毛利率</th>
                        <th class="px-2 py-2 text-right">狀態</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr v-for="sku in item.items" :key="sku.sku_id" class="hover:bg-slate-50 transition-colors">
                        <td class="px-2 py-3 font-medium text-slate-800">
                          {{ sku.name }}
                          <span class="block text-[10px] text-slate-400 font-normal">{{ sku.sku_id }}</span>
                        </td>
                        <td class="px-2 py-3">
                          <div class="flex items-center gap-2">
                            <span :class="`w-2 h-2 rounded-full ${getStockStatus(sku.stock).dot}`"></span>
                            <span :class="getStockStatus(sku.stock).color + ' font-bold'">{{ sku.stock }}</span>
                            <span class="text-[10px] text-slate-400">/ 盒</span>
                          </div>
                        </td>
                        <td class="px-2 py-3">
                          <span :class="`px-2 py-0.5 rounded text-xs font-medium border ${getMarginColor(sku.margin)}`">
                            {{ sku.margin }}%
                          </span>
                        </td>
                        <td class="px-2 py-3 text-right">
                           <span :class="`text-xs font-bold ${getStockStatus(sku.stock).color}`">
                             {{ getStockStatus(sku.stock).text }}
                           </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Speaking Tips (可點擊互動) -->
                <div 
                  @click="openScriptModal(item)"
                  class="mt-4 bg-primary-50 rounded-lg p-3 flex gap-3 items-start cursor-pointer hover:bg-green-100 transition-colors border border-transparent hover:border-primary-200">
                  <span class="text-lg">💡</span>
                  <div class="w-full">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-primary-700 uppercase">藥師銷售話術 (點擊查看詳情)</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <p class="text-sm text-green-800 mt-1 leading-relaxed">
                      {{ item.talking_points }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. 右側：輿情脈絡 -->
        <div class="lg:col-span-1 space-y-6">
          <h2 class="text-lg font-bold text-slate-900">輿情脈絡 (證據)</h2>
          
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-fit max-h-[800px] overflow-y-auto custom-scrollbar">
            <div class="space-y-6">
              <div v-for="(insight, idx) in insights" :key="idx" class="relative pl-4 border-l-2 border-slate-200 hover:border-primary transition-colors group">
                <div class="mb-1 flex justify-between items-center">
                  <span :class="`text-[10px] font-bold px-2 py-0.5 rounded ${insight.source === 'PTT' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`">
                    {{ insight.source }} / {{ insight.board }}
                  </span>
                  <span class="text-[10px] text-slate-400">今日</span>
                </div>
                <h4 class="text-sm font-bold text-slate-800 mb-1 leading-snug hover:text-primary cursor-pointer transition-colors">
                  {{ insight.title }}
                </h4>
                <p class="text-xs text-slate-500 line-clamp-3 mb-2 group-hover:text-slate-700 transition-colors">
                  {{ insight.content }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="tag in insight.tags" :key="tag" class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">#{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 趨勢圖 -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
             <h3 class="text-sm font-bold text-slate-800 mb-3">熱門關鍵字趨勢</h3>
             <div class="h-32 flex items-end gap-2 px-2">
                <div class="w-1/5 bg-green-100 h-[40%] rounded-t transition-all hover:bg-green-200"></div>
                <div class="w-1/5 bg-green-200 h-[60%] rounded-t transition-all hover:bg-green-300"></div>
                <div class="w-1/5 bg-green-300 h-[50%] rounded-t transition-all hover:bg-green-400"></div>
                <div class="w-1/5 bg-green-400 h-[80%] rounded-t relative group transition-all hover:bg-green-500 cursor-pointer">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        +150%
                    </div>
                </div>
                <div class="w-1/5 bg-primary h-[90%] rounded-t transition-all hover:bg-green-700 cursor-pointer"></div>
             </div>
             <div class="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>10/26</span>
                <span>10/30</span>
             </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Toast Notification (匯出成功提示) -->
    <div 
      v-if="showToast"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-500 z-50 animate-bounce-in">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <div>
        <p class="text-sm font-bold">採購單匯出成功</p>
        <p class="text-xs text-gray-400">檔案已傳送至您的信箱</p>
      </div>
    </div>

    <!-- Script Modal (話術彈窗) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity" @click.self="closeModal">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100">
        <div class="bg-primary px-6 py-4 flex justify-between items-center">
          <h3 class="text-white font-bold text-lg flex items-center gap-2">
            <span class="text-xl">🎓</span> 藥師 AI 衛教助手
          </h3>
          <button @click="closeModal" class="text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wide">主題</span>
            <h4 class="text-xl font-bold text-slate-900">{{ currentModalData.title }}</h4>
            <span class="text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
              {{ currentModalData.category }}
            </span>
          </div>

          <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <h5 class="text-sm font-bold text-slate-700 mb-2">🩺 問診檢查點 (Checklist)</h5>
            <ul class="space-y-2">
              <li v-for="(point, idx) in currentModalData.checkpoints" :key="idx" class="flex items-start gap-2 text-sm text-slate-600">
                <span class="text-primary mt-0.5">✔</span> {{ point }}
              </li>
            </ul>
          </div>

          <div>
            <h5 class="text-sm font-bold text-slate-700 mb-1">💬 建議話術</h5>
            <p class="text-sm text-slate-600 leading-relaxed bg-white border border-primary-100 p-3 rounded-lg shadow-sm">
              "{{ currentModalData.intro }}"
            </p>
          </div>

          <div class="pt-2 border-t border-slate-100">
             <p class="text-xs font-bold text-orange-600 flex items-center gap-1">
               <span>🔥</span> {{ currentModalData.upsell }}
             </p>
          </div>

          <button @click="closeModal" class="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            我知道了
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.animate-marquee {
  animation: marquee 20s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* 簡單的進場動畫 */
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounceIn {
  0% { opacity: 0; transform: translate(-50%, 20px); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}
</style>