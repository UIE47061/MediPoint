export const MOCK_TOPICS = [
  { id: 't1', topic: '兒童維他命暴買', trend: 'up', delta: '+248%', category:'health', score: 92, snippetCount: 34 },
  { id: 't2', topic: '感冒藥價格比較', trend: 'flat', delta: '+5%', category:'prescription', score: 64, snippetCount: 12 },
  { id: 't3', topic: '乳液／尿布缺貨回報', trend: 'up', delta: '+78%', category:'maternal', score: 81, snippetCount: 21 },
  { id: 't4', topic: '退貨/副作用抱怨集中', trend: 'down', delta: '-22%', category:'health', score: 45, snippetCount: 9 }
];

export const MOCK_SUGGESTIONS = [
  { topicId:'t1', title:'兒童維他命 (咀嚼/軟糖)', sku:'VIT-KID-100', replenish:'高優先', qty: 120, alt: ['VIT-KID-50','VIT-GUMMY'], shelf:'兒童保健/端架A', talk: '為了滿足短期需求，可先進貨VIT-KID-50作為替代，並主動提示每日劑量。' },
  { topicId:'t3', title:'嬰兒尿布 (M號)', sku:'DIAPER-M-360', replenish:'中高', qty: 80, alt: ['DIAPER-M-300','DIAPER-L-360'], shelf:'婦嬰/端架B', talk: '目前地區缺貨，建議先補量並在櫃台準備替代尺寸供客人試穿。' },
  { topicId:'t2', title:'成人感冒藥 (速效型)', sku:'COLD-FAST-20', replenish:'中', qty: 40, alt: ['COLD-REG-20'], shelf:'處方外/端架C', talk: '比價議題上升時，可視價格促銷或包裝組合回應。' }
];

export const MOCK_SAMPLES = [
  { id:'s1',topicId:'t1',source:'FB 社團',text:'「哪款兒童維他命好？附近藥局都賣光了，家長們求推薦」', time:'2025-11-16 09:12', labels:['想買','缺貨','求知'], meta:{brand:'BrandA',ingredient:'VitC',symptom:'免疫'} , url:'https://fb.example/post/1' },
  { id:'s2',topicId:'t1',source:'PTT',text:'「小孩吃這個會不會有副作用？有人分享兒童劑量嗎？」', time:'2025-11-16 11:02', labels:['求知','抱怨'], meta:{brand:'BrandB',ingredient:'VitD',symptom:'營養'} , url:'https://ptt.example/article/22' },
  { id:'s3',topicId:'t3',source:'Dcard',text:'「我家附近藥妝缺尿布，求推薦替代品牌」', time:'2025-11-15 18:20', labels:['缺貨','想買'], meta:{brand:'BrandC',ingredient:'無',symptom:'更換'} , url:'https://dcard.example/thread/3' },
  { id:'s4',topicId:'t4',source:'臉書留言',text:'「吃了沒效又拉肚子，客服處理太慢」', time:'2025-11-14 14:05', labels:['抱怨'], meta:{brand:'BrandD',ingredient:'X藥',symptom:'副作用'} , url:'https://fb.example/post/9' }
];
