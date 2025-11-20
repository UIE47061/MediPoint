# 藥點 MediPoint — 前端戰情室 (Frontend Dashboard)

> **Tagline:** 看懂輿論風向，做對每次備貨
> **Core Value:** 結合「社群輿情」與「ERP 庫存」的智慧採購決策系統。

## 📖 專案簡介

**藥點 MediPoint** 是一個針對藥局通路設計的 B2B SaaS 儀表板。解決藥局「備貨滯後」與「庫存積壓」的痛點。

前端介面模擬了真實的決策場景，將爬蟲抓取的網路趨勢（PTT/Dcard）與內部 ERP 數據（庫存/毛利）進行交叉比對，提供一鍵式的備貨建議。

### ✨ 核心功能 (Key Features)

1.  **全覽戰情儀表板**：
    *   即時監控「熱門商品覆蓋率」與「營收毛利」。
    *   整合 CDC/TFDA 官方疫情與回收警示跑馬燈。
2.  **AI 智慧備貨建議 (Action Cards)**：
    *   **庫存/毛利交叉分析**：自動標示高毛利且庫存告急的商品 (紅燈警示)。
    *   **決策輔助**：提供具體的「補貨」或「促銷」建議。
3.  **藥師 AI 衛教助手**：
    *   互動式彈窗，提供針對特定病症（如流感）的銷售話術與衛教檢查點 (Checkpoints)。
4.  **輿情脈絡牆**：
    *   展示佐證資料，讓採購人員了解網路討論趨勢（來源：PTT, Dcard, Google Reviews）。

---

## 🛠️ 技術堆疊 (Tech Stack)

*   **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN & Config)
*   **Icons**: Heroicons (SVG)
*   **HTTP Client**: Axios (Prepared for API integration)
