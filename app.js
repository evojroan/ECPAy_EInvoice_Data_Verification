const crypto = require("crypto");
const axios = require("axios");

//改以下就好
const MerchantID = "2000132";
const HashKey = "ejCk326UnaZWKisg"; //2000132
const HashIV = "q9jcZX8Ib9LM8wYk"; //2000132

const query = 0; //0：驗證統一編號；1：驗證手機條碼；2：驗證捐贈碼
const UnifiedBusinessNo = "97025978"; //要查詢的統一編號，僅限數字
const Barcode = ""; //要查詢的手機條碼。格式應為8碼字元，第1碼為『/』; 其餘7碼則由數字【0-9】、大寫英文【A-Z】與特殊符號【+】【-】【.】這39個字元組成;
const LoveCode = ""; //要查詢的捐贈碼
let isStage = true; //true：測試環境；false：正式環境

const PlatformID = ""; //這個參數是專為與綠界簽約的指定平台商所設計，只有在申請開通後才能使用。一般廠商，請在介接時將此參數欄位保留為空。

//以下不用改
const stage = isStage ? "-stage" : "";
const APIURL =
  query === 0
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/GetCompanyNameByTaxID`
    : query === 1
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/CheckBarcode`
    : query === 2
    ? `https://einvoice${stage}.ecpay.com.tw/B2CInvoice/CheckLoveCode`
    : "";
const algorithm = "aes-128-cbc";
const DataArray = {
  "MerchantID": MerchantID,
  "UnifiedBusinessNo": UnifiedBusinessNo,
  "Barcode": Barcode,
  "LoveCode": LoveCode
};
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

axios
  .post(APIURL, parameters)
  .then(response => {
    const ToBeDecrypted = response.data.Data;

    const decipher = crypto.createDecipheriv(algorithm, HashKey, HashIV);
    let DecryptedData = decipher.update(ToBeDecrypted, "base64", "utf8");
    DecryptedData += decipher.final("utf8");

    console.log(
      "綠界系統回傳：\n\n",
      JSON.stringify(response.data, null, 2),
      "\n\nData 解密後：\n\n",
      decodeURIComponent(DecryptedData)
    );
  })
  .catch(error => console.log(error));
