# 藥點 MediPoint - 商情備貨摘要系統

這是一個藥局商情分析與備貨建議的展示系統，使用純 HTML/CSS/JavaScript 開發。

## 功能特色

- 📊 **議題趨勢分析**：即時掌握熱門商品話題與升降趨勢
- 💡 **智能備貨建議**：根據市場需求提供具體補貨建議
- 🔍 **樣本追溯**：可追溯到原始社群討論來源
- 📈 **視覺化圖表**：使用 ECharts 呈現關鍵洞察數據

## 快速開始

### 方法 1: 使用 Python（推薦）

```bash
# 直接在專案目錄執行
python3 -m http.server 8080

# 然後在瀏覽器開啟
open http://localhost:8080
```

### 方法 2: 使用 Node.js

```bash
# 安裝 http-server
npm install -g http-server

# 執行
http-server -p 8080
```

### 方法 3: 直接開啟

如果瀏覽器支援 ES Modules，可以直接開啟 index.html。

## 專案結構

```
MediPoint/
├── index.html      # 主頁面
├── style.css       # 樣式表
├── app.js          # 主要邏輯
├── mockdata.js     # 模擬資料
├── package.json    # 專案設定
└── README.md       # 說明文件
```

## 技術棧

- **前端框架**：純 Vanilla JavaScript (ES6+)
- **圖表庫**：Apache ECharts 5.5.0
- **模組系統**：ES Modules (Import Maps)
- **樣式**：原生 CSS
- **工具**：nanoid (ID 生成)

## 主色配色

專案使用綠色作為主色調：
- 主色：#38a845 (RGB: 56, 168, 69)

## 開發說明

本專案不需要編譯步驟，所有依賴透過 CDN (esm.sh) 載入。
修改後直接重新整理瀏覽器即可看到變更。

## 授權

Private - 競賽用途
