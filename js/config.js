export const DPR = window.devicePixelRatio || 1
export const option = {
    boxW: 500 * DPR,
    boxH: 735 * DPR,
    myPlanew: 50,//初始我方飞机大小
    planeMoveSpeed: 4,//初始飞机移动速度
    myBulletW: 6,//初始子弹大小
    myBulletMoveSpeed: 10,//初始我方子弹移动速度
    minCreateBulletTime: 100,//初始子弹创建的最小时间
    maxCreateBulletTime: 1500,//初始子弹创建的最大时间
    enemyW: 50,//初始敌方大小
    enemyBlodSize: 5,//初始敌方血量大小
    enemyBulletMoveSpeed: 5,//初始敌方子弹移动速度
    enemyBulletTime: 1500,//初始敌方子弹创建的频率
    propW: 25,//初始道具大小
    propMoveSpeed: 0.5,//初始道具移动速度
    // 敌方飞机等级
    enemyLv: [
        {
            lv: 1,
            score: 2500,
            maxEnemyLv: 3,
            time: 3000
        },
        {
            lv: 2,
            score: 5000,
            maxEnemyLv: 6,
            time: 2500
        },
        {
            lv: 3,
            score: 10000,
            maxEnemyLv: 9,
            time: 2000
        },
        {
            lv: 4,
            score: 20000,
            maxEnemyLv: 12,
            time: 1000
        },
        {
            lv: 5,
            score: 30000,
            maxEnemyLv: 13,
            time: 1000
        }
    ]
}

// 我方飞机属性
export const aircraftAttribute = [
    {
        id: 1,
        name: '雷霆战机',
        initHp: 3,
        maxHp: 30,
        initSpeed: 5,
        maxSpeed: 15,
        initAtk: 3,
        maxAtk: 14,
        url: 'a1'
    },
    {
        id: 2,
        name: '甜心战机',
        initHp: 5,
        maxHp: 60,
        initSpeed: 3,
        maxSpeed: 10,
        initAtk: 2,
        maxAtk: 14,
        url: 'a2'
    },
    {
        id: 3,
        name: '巨鲸战机',
        initHp: 20,
        maxHp: 100,
        initSpeed: 2,
        maxSpeed: 6,
        initAtk: 1,
        maxAtk: 14,
        url: 'a3'
    },
    {
        id: 4,
        name: '飓风战机',
        initHp: 3,
        maxHp: 40,
        initSpeed: 5,
        maxSpeed: 20,
        initAtk: 1,
        maxAtk: 14,
        url: 'a4'
    }
]

//我方子弹配置
export const bulletAttribute = [
    {
        id: 1,
        url: 'b1',
        atk: 1,
        scal: 1
    },
    {
        id: 2,
        url: 'b2',
        atk: 2,
        scal: 1
    },
    {
        id: 3,
        url: 'b3',
        atk: 3,
        scal: 1
    },
    {
        id: 4,
        url: 'b4',
        atk: 4,
        scal: 1
    },
    {
        id: 5,
        url: 'b5',
        atk: 5,
        scal: 1
    },
    {
        id: 6,
        url: 'b6',
        atk: 6,
        scal: 1
    },
    {
        id: 7,
        url: 'b7',
        atk: 7,
        scal: 1
    },
    {
        id: 8,
        url: 'b8',
        atk: 8,
        scal: 1
    },
    {
        id: 9,
        url: 'b9',
        atk: 9,
        scal: 1
    },
    {
        id: 10,
        url: 'b10',
        atk: 10,
        scal: 1
    },
    {
        id: 11,
        url: 'b11',
        atk: 11,
        scal: 1
    },
    {
        id: 12,
        url: 'b12',
        atk: 12,
        scal: 1
    },
    {
        id: 13,
        url: 'b13',
        atk: 13,
        scal: 1
    },
    {
        id: 14,
        url: 'b14',
        atk: 14,
        scal: 1
    }
]

//敌方飞机配置
// prop道具属性
//[0]攻击力+1，[1]攻击力+5,[2]攻击力+max,[3]血量+1,[4]血量+5,
//[7]速度+1,[8]速度+5,[5]分数+100,[6]分数+1000
export const enemy = [
    {
        id: 1,
        url: 'enemy1',
        atk: 0,
        hp: 4,
        speed: 2.5,
        scal: 1,
        prop: [30, 1, 0, 20, 1, 2, 0, 5, 10]
    },
    {
        id: 2,
        url: 'enemy2',
        atk: 0,
        hp: 5,
        speed: 2.5,
        scal: 1.5,
        prop: [5, 2, 0, 30, 2, 2, 0, 50, 20]
    },
    {
        id: 3,
        url: 'enemy3',
        atk: 0,
        hp: 6,
        speed: 2.5,
        scal: 1.5,
        prop: [5, 1, 0, 5, 5, 50, 5, 5, 50]
    },
    {
        id: 4,
        url: 'enemy4',
        atk: 1,
        hp: 8,
        speed: 3,
        scal: 1.5,
        prop: [15, 1, 0, 15, 5, 15, 15, 5, 10]
    },
    {
        id: 5,
        url: 'enemy5',
        atk: 2,
        hp: 8,
        speed: 3,
        scal: 1.5,
        prop: [30, 5, 0, 5, 0, 0, 0, 100, 20]
    },
    {
        id: 6,
        url: 'enemy6',
        atk: 3,
        hp: 8,
        speed: 3,
        scal: 2,
        prop: [0, 0, 0, 50, 10, 0, 10, 100, 20]
    },
    {
        id: 7,
        url: 'enemy7',
        atk: 4,
        hp: 5,
        speed: 3.5,
        scal: 2,
        prop: [0, 0, 0, 0, 0, 100, 50, 60, 25]
    },
    {
        id: 8,
        url: 'enemy8',
        atk: 5,
        hp: 5,
        speed: 3.5,
        scal: 2,
        prop: [30, 10, 0, 30, 10, 100, 25, 30, 10]
    },
    {
        id: 9,
        url: 'enemy9',
        atk: 6,
        hp: 5,
        speed: 3.5,
        scal: 2.5,
        prop: [50, 10, 50, 10, 10, 50, 25, 35, 100]
    },
    {
        id: 10,
        url: 'enemy10',
        atk: 7,
        hp: 5,
        speed: 3.5,
        scal: 2.5,
        prop: [0, 0, 50, 25, 0, 100, 25, 5, 1]
    },
    {
        id: 11,
        url: 'enemy11',
        atk: 8,
        hp: 5,
        speed: 4,
        scal: 3,
        prop: [30, 1, 0, 5, 0, 50, 25, 100, 10]
    },
    {
        id: 12,
        url: 'enemy12',
        atk: 9,
        hp: 5,
        speed: 4,
        scal: 3,
        prop: [50, 10, 50, 50, 50, 50, 25, 25, 50]
    },
    {
        id: 13,
        url: 'enemy13',
        atk: 10,
        hp: 5,
        speed: 4,
        scal: 3,
        prop: [10, 10, 100, 15, 100, 25, 100, 25, 100]
    }
]
//敌方子弹配置
export const enemyBullet = [
    {
        id: 1,
        url: 'e1',
        atk: 1,
        scal: 1
    },
    {
        id: 2,
        url: 'e2',
        atk: 2,
        scal: 1
    },
    {
        id: 3,
        url: 'e3',
        atk: 3,
        scal: 1
    },
    {
        id: 4,
        url: 'e4',
        atk: 4,
        scal: 1
    },
    {
        id: 5,
        url: 'e5',
        atk: 5,
        scal: 1
    },
    {
        id: 6,
        url: 'e6',
        atk: 6,
        scal: 1
    },
    {
        id: 7,
        url: 'e7',
        atk: 7,
        scal: 1
    },
    {
        id: 8,
        url: 'e8',
        atk: 8,
        scal: 1
    },
    {
        id: 9,
        url: 'e9',
        atk: 9,
        scal: 1
    },
    {
        id: 10,
        url: 'e10',
        atk: 10,
        scal: 2
    }
]

//道具配置
export let property = [
    {
        id: 1,
        url: 'prpos1',
        key: 'atk',
        num: 1
    },
    {
        id: 2,
        url: 'prpos2',
        key: 'atk',
        num: 5
    },
    {
        id: 3,
        url: 'prpos3',
        key: 'atk',
        num: Infinity
    },
    {
        id: 4,
        url: 'prpos4',
        key: 'hp',
        num: 1
    },
    {
        id: 5,
        url: 'prpos5',
        key: 'hp',
        num: 5
    },
    {
        id: 6,
        url: 'prpos6',
        key: 'score',
        num: 100
    },
    {
        id: 7,
        url: 'prpos7',
        key: 'score',
        num: 1000
    },
    {
        id: 8,
        url: 'prpos8',
        key: 'speed',
        num: 1
    },
    {
        id: 9,
        url: 'prpos9',
        key: 'speed',
        num: 5
    }
]
