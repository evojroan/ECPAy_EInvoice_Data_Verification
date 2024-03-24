# 綠界 B2C 電子發票範例程式：前置作業與資料驗證

## 這是什麼？

在綠界科技的 B2C 電子發票功能中，「前置作業」功能有：

- 查詢財政部配號結果
- 字軌與配號設定
- 設定字軌號碼狀態
- 查查字軌

而「資料驗證」功能有：

- 統一編號驗證
- 手機條碼驗證
- 捐贈碼驗證

本範例程式可以快速使用上述總共七種功能，並得到結果。

## 如何使用？

1. 請先確定電腦可以執行 Node.js。
2. 安裝 Node.js 後，請再安裝 open 套件。
   ` npm install open`
3. 請打開本專案的 app.js 檔。
4. 於**「////////////////////////改以下參數即可////////////////////////」**區域修改參數即可。
   4.1 選擇要使用的帳號。若只是測試，可使用 2000132。
   4.2 於 actrion 參數選擇要使用的功能。
   4.3 根據 action 參數的值再修改下方對應的參數。
   4.4 若不確定參數如何輸入，可參考[B2C 電子發票技術文件](https://developers.ecpay.com.tw/?p=7809)。

5. 修改完後，執行本檔案 (VS Code 請按 F5)
6. 此時網頁瀏覽器會自動打開 output.html，並且顯示綠界系統的回傳內容。

## 本程式使用的技術

JavaScript、Node.js (18.18.0)、Axios、Restful API、URL 加解密、AES 加解密。

## 我想了解更多關於綠界科技的電子發票。

- [電子發票介紹網頁](https://www.ecpay.com.tw/Business/invoice)
- [B2C 電子發票技術文件](https://developers.ecpay.com.tw/?p=7809)
- [B2B 電子發票技術文件](https://developers.ecpay.com.tw/?p=24139)

## 本程式作者

Roan，專長是碎碎念。

- [Roan 的網誌](https://medium.com/@roan6903)
- [Roan 的 GitHub](https://github.com/evojroan)
