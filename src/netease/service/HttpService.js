import { Api } from "./Api";
let HttpManager ={}

  /**网易云音乐排行榜*/
  HttpManager.getMusicRankingList = function() {
    const url = Api.Music_Ranking_Url;
    return new Promise((resolve, reject) => {
      this.fetchNetData(url)
        .then(data => {
          resolve(data);
        })
        .catch(error => console.log(error))
    })
  }

  /**网易云音乐排行榜*/
  HttpManager.getMusicDetailList = function (id){
    const url = Api.Music_Detail_Url + '?id=' + id;
    console.log('url ' + url);
    return new Promise((resolve, reject) => {
      this.fetchNetData(url)
        .then(data => {
          console.log('data ' + data);
          resolve(data);
        })
        .catch(error => console.log(error))
    })
  }

  /**请求数据=本地加网络*/
  HttpManager.fetchNetData = function(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response)=>response.json())
        .then((responseData)=>{
          resolve(responseData);
        })
        .catch((error)=>{
          reject(error);
        })
        .done();
    })
  }


global.HttpManager = HttpManager;