module.exports = {
    // 发牌结束
    DEAL_BEGIN: 'DEAL_BEGIN',

    // 发牌结束
    DEAL_FINISH : 'DEAL_FINISH',

    // 发给自己
    DEAL_TO_SELF : 'DEAL_TO_SELF',

    // 发给上家
    DEAL_TO_LAST : 'DEAL_TO_LAST',

    // 发给下家
    DEAL_TO_NEXT : 'DEAL_TO_NEXT',

    // 玩家准备
    PLAYER_PREPARED : 'PLAYER_PREPARED',

    // 进入等待队列
    ENTER_SEARCH_LIST : 'ENTER_SEARCH_LIST',

    // 发牌信息
    DEAL_POKERS : 'DEAL_POKERS',

    // 叫地主
    CALL_LORDER : 'CALL_LORDER',

    // 叫地主
    C2S_CALL_LORDER: 'C2S_CALL_LORDER',

    // 抢地主
    GRAB_LORDER : 'GRAB_LORDER',

    // 抢地主
    C2S_GRAB_LORDER : 'C2S_GRAB_LORDER',

    // 状态同步
    STATE_SYNC : 'STATE_SYNC',

    // 加倍
    S2C_RAISE_BET : 'S2C_RAISE_BET',
    C2S_RAISE_BET : 'C2S_RAISE_BET',

    // 玩家操作
    S2C_PLAYER_HANDLE : 'S2C_PLAYER_HANDLE',
    C2S_PLAYER_HANDLE : 'C2S_PLAYER_HANDLE',

    // 牌局同步
    S2C_TABLE_SYNC : 'S2C_TABLE_SYNC',

    // 牌局结束
    S2C_GAME_END : 'S2C_GAME_END',

    // 错误代码
    S2C_ERROR_CODE : 'S2C_ERROR_CODE',
};