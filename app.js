//綠界電子發票技術文件： https://developers.ecpay.com.tw/?p=7809
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");

////////////////////////改以下參數即可////////////////////////
//一、選擇帳號，是否為測試環境
const MerchantID = "2000132"; //必填
const HashKey = "ejCk326UnaZWKisg"; //2000132
const HashIV = "q9jcZX8Ib9LM8wYk"; //2000132
let isStage = true;
const PlatformID = "";

//二、選擇 何種 API 作業
const action = 2; // 0：查詢財政部配號結果； 1：字軌與配號設定； 2：設定字軌號碼狀態； 3：查詢字軌； 4：驗證統一編號；5：驗證手機條碼；6：驗證捐贈碼

//三、根據不同的 action 填寫以下作業的參數
//action = 0
const InvoiceYear0 = ""; //必填

//action = 1：字軌與配號設定(InvoiceCategory 已設定好，本處不用寫)
const InvoiceTerm = ""; //必填
const InvoiceYear1 = ""; //必填
const InvType = "07"; //必填
const InvoiceHeader = ""; //必填
const InvoiceStart = ""; //必填
const InvoiceEnd = ""; //必填

//action = 2：設定字軌號碼狀態
const TrackID = ""; //必填
const InvoiceStatus = ""; //必填

//action = 3：查詢字軌(InvoiceCategory 已設定好，本處不用寫)
const InvoiceYear3 = ""; //必填
const InvoiceTerm3 = ""; //必填
const UseStatus = "0"; //必填
const InvType3 = "07";
const InvoiceHeader3 = "";

//action = 4：統一編號驗證
const UnifiedBusinessNo = "97025978"; //必填

//action = 5：手機條碼驗證
const Barcode = ""; //必填

//action = 6：捐贈碼驗證
const LoveCode = ""; //必填

////////////////////////以下不用改////////////////////////
const stage = isStage ? "-stage" : "";
const APIURL =
  action === 0
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/GetGovInvoiceWordSetting`
    : action === 1
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/AddInvoiceWordSetting`
    : action === 2
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/UpdateInvoiceWordStatus`
    : action === 3
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/GetInvoiceWordSetting`
    : action === 4
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID`
    : action === 5
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/CheckBarcode`
    : action === 6
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/CheckLoveCode`
    : "";
const algorithm = "aes-128-cbc";
let DataArray = {
  "MerchantID": MerchantID
};
if (action === 0) {
  DataArray = {
    ...DataArray,
    "InvoiceYear": InvoiceYear0
  };
} else if (action === 1) {
  DataArray = {
    ...DataArray,
    "InvoiceTerm": InvoiceTerm,
    "InvoiceYear": InvoiceYear1,
    "InvType": InvType,
    "InvoiceCategory": 1,
    "InvoiceHeader": InvoiceHeader,
    "InvoiceStart": InvoiceStart,
    "InvoiceEnd": InvoiceEnd
  };
} else if (action === 2) {
  DataArray = {
    ...DataArray,
    "TrackID": TrackID,
    "InvoiceStatus": InvoiceStatus
  };
} else if (action === 3) {
  DataArray = {
    ...DataArray,
    "InvoiceYear": InvoiceYear3,
    "InvoiceTerm": InvoiceTerm3,
    "UseStatus": UseStatus,
    "InvoiceCategory": 1,
    "InvType": InvType3,
    "InvoiceHeader": InvoiceHeader3
  };
} else if (action === 4) {
  DataArray = {...DataArray, "UnifiedBusinessNo": UnifiedBusinessNo};
} else if (action === 5) {
  DataArray = {...DataArray, "Barcode": Barcode};
} else if (action === 6) {
  DataArray = {...DataArray, "LoveCode": LoveCode};
}

let URLEncoded = encodeURIComponent(JSON.stringify(DataArray));

const cipher = crypto.createCipheriv(algorithm, HashKey, HashIV);
let EncryptedData = cipher.update(URLEncoded, "utf8", "base64");
EncryptedData += cipher.final("base64");

const parameters = {
  "PlatformID": PlatformID,
  "MerchantID": MerchantID,
  "RqHeader": {
    Timestamp: Date.now()
  },
  "Data": EncryptedData
};

(async () => {
  const open = await import("open");

  axios
    .post(APIURL, parameters)
    .then(async response => {
      const ToBeDecrypted = response.data.Data;

      const decipher = crypto.createDecipheriv(algorithm, HashKey, HashIV);
      let DecryptedData = decipher.update(ToBeDecrypted, "base64", "utf8");
      DecryptedData += decipher.final("utf8");

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>顯示文本</title>
</head>
<body>
<h1>綠界回傳：</h1>
    <p>${JSON.stringify(response.data, null, 2)}</p>
<h1>Data 解密後：</h1>
<p>${decodeURIComponent(DecryptedData)}</p>
</body>
</html>
`;
      const filePath = "output.html";
      fs.writeFile(filePath, htmlContent, err => {
        if (err) throw err;

        console.log("HTML檔案已創建");
        open.default(filePath).catch(err => console.error(err));
      });
    })
    .catch(error => console.log(error));
})();
