export const CHANGE_TEXT = 'CHANGE_TEXT';   //定义事件

export const changeText = (text1, text2) => {
    return{
        type:CHANGE_TEXT,
        text1,
        text2,
    }
}