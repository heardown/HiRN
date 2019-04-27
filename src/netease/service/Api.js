/**基础链接头*/
const BaseUrl ="http://123.56.221.77/musicApi";

const Api = {
  /**网易云音乐排行版*/
  Music_Ranking_Url: BaseUrl + '/toplist/detail',
  /**网易云音乐排行榜歌曲*/
  Music_Detail_Url: BaseUrl + '/playlist/detail',
  /**网易云音频地址*/
  Music_Mp3_Url: 'https://music.163.com/song/media/outer/url?id={id}.mp3'
}

export { Api };