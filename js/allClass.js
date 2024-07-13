import { ctx, propBox, endPage, pause } from "./index.js";
import { option, bulletAttribute, enemy, enemyBullet, property, aircraftAttribute } from "./config.js";
class Draw {//生成飞机类
    img = new Image();
    x = 0; y = 0; w = 0; h = 0;
    isLoad = false;
    transparency = 1;
    constructor(url) {
        this.url = url;
        this.createImg();
    }
    createImg() {//生成飞机的图片
        const myImg = new Image();
        myImg.src = require(`../image/${this.url}.png`);
        this.img = myImg;
    }
    draw() {//生成飞机
        ctx.globalAlpha = this.transparency;
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

//敌方飞机控制类
export class EnemyPlane extends Draw {
    static list = new Set();//保存所有敌方飞机
    blodSize = option.enemyBlodSize;
    transparencyTime = null;
    createBulletTime = null;
    constructor(enemyPlaneObj) {
        super(enemyPlaneObj.url);
        this.atk = enemyPlaneObj.atk;
        this._hp = enemyPlaneObj.hp;
        this.maxhp = enemyPlaneObj.hp;
        this.speedX = enemyPlaneObj.speed / 4;//敌方飞机X的移动速度
        this.speedY = enemyPlaneObj.speed / 5;//敌方飞机Y的移动速度
        this.scal = enemyPlaneObj.scal;
        this.prop = enemyPlaneObj.prop;

        this.w = option.enemyW * enemyPlaneObj.scal;
        this.init();
    }
    set hp(val) {
        this._hp = val;
        if (val <= 0) {
            this.bom();
            return;
        }
    }
    get hp() {
        return this._hp;
    }
    init() {
        EnemyPlane.list.add(this);
        this.setPosition();
        this.createBullet();
    }
    createBullet() {//生成子弹
        this.createBulletTime = setInterval(() => {
            if (this.atk) {
                new Bullet(enemyBullet[this.atk - 1], this.w, this.x, this.y, this.h, true);
            }
        }, option.enemyBulletTime)
    }
    setPosition() {
        //准备一个加载完毕的事件
        this.img.onload = () => {//敌方飞机的生成的位置
            this.isLoad = true;
            let w = this.img.width;
            let h = this.img.height;
            this.h = this.w * h / w;

            this.maxX = option.boxW - this.w;
            this.x = this.maxX * Math.random();
            this.y = 0;
            this.move();
        }
    }
    drawBlod() {//绘制敌方飞机血条
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'red';
        // 绘制圆角矩形
        ctx.roundRect(this.x, this.y - this.blodSize * 2.5, this.w * (this.hp / this.maxhp), this.blodSize, 10);
        ctx.fill();
        ctx.restore();
    }
    move() {//敌方飞机移动
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x >= this.maxX || this.x <= 0) {//敌方飞机超出X的判断
            this.speedX = -this.speedX;
        }
        if (this.y >= this.maxY) {//敌方飞机超出Y的判断
            this.destory();
        }
        this.ramTime = requestAnimationFrame(this.move.bind(this))
    }
    bom() {//敌方飞机爆炸
        new Bom('bom1', this.w, this.h, this.x, this.y);
        this.createprop();
        this.destory();
    }
    createprop() {//生成道具
        let prop = this.prop;
        for (let i = 0; i < prop.length; i++) {
            let num = Math.random() * 100;
            if (num < prop[i]) {
                new Prop(property[i], this.w, this.h, this.x, this.y);
            }
        }

    }
    destory() {//敌方飞机销毁
        cancelAnimationFrame(this.ramTime);
        clearInterval(this.createBulletTime);//敌方飞机子弹销毁
        this.img.onload = null;
        EnemyPlane.list.delete(this);
    }
    stop() {//暂停
        cancelAnimationFrame(this.ramTime);
        clearInterval(this.createBulletTime);
    }
    resume() {//继续
        this.move();
        this.createBullet();
    }
}

//我方飞机控制类
export class MyPlane extends Draw {
    MoveSpeed = option.planeMoveSpeed;
    w = option.myPlanew;
    t = false; b = false; l = false; r = false;

    _score = 0;
    static plane = null;
    createBulletTime = null;
    createEnemyTime = null;
    moveTime = null;
    constructor(planeobj, geme) {
        super(planeobj.url);
        this.name = planeobj.name;
        this.initHp = planeobj.initHp;
        this.maxHp = planeobj.maxHp;
        this.initSpeed = planeobj.initSpeed;
        this.maxSpeed = planeobj.maxSpeed;
        this.initAtk = planeobj.initAtk;
        this.maxAtk = planeobj.maxAtk;
        this.geme = geme;

        this.init();
    }

    init() {
        MyPlane.plane = this;
        this.addKeyEvent();
        this.move();
        this.createBullet();
        this.setPosition();
        this.createEnemy();

        // 初始化属性  触发游戏属性的更新
        this.hp = this.initHp;
        this.speed = this.initSpeed;
        this.atk = this.initAtk;

    }

    get hp() {//获取血量
        return this.initHp;
    }
    set hp(val) {//设置血量
        if (val <= 0) {//游戏结束
            this.geme.gameOver();

            this.destory();
        }
        val = val <= this.maxHp ? val : this.maxHp;//血量不能超过最大值
        let hpDome = propBox.querySelector("li .hp");

        hpDome.style.width = `${100 * val / this.maxHp}%`;
        hpDome.innerHTML = `${val}/${this.maxHp}`;
        this.initHp = val;
    }
    get speed() {//获取速度
        return this.initSpeed;
    }
    set speed(val) {//设置速度

        val = val <= this.maxSpeed ? val : this.maxSpeed//速度不能超过最大值
        let speedDom = propBox.querySelector("li .speed");

        speedDom.style.width = `${100 * val / this.maxSpeed}%`;
        speedDom.innerHTML = `${val}/${this.maxSpeed}`;
        this.initSpeed = val;
    }
    get atk() {//获取攻击力
        return this.initAtk;
    }
    set atk(val) {//设置攻击力
        val = val <= this.maxAtk ? val : this.maxAtk//攻击力不能超过最大值
        let atkDome = propBox.querySelector("li .atk");

        atkDome.style.width = `${100 * val / this.maxAtk}%`;
        atkDome.innerHTML = `${val}/${this.maxAtk}`;
        this.initAtk = val;
    }
    get score() {//获取分数
        return this._score;
    }
    set score(val) {//设置分数
        let scroeDome = propBox.querySelector(".score p");
        scroeDome.innerHTML = val;
        this._score = val;
    }
    createBullet() {//生成子弹
        let minTime = option.minCreateBulletTime;//创建子弹的最小时间
        let maxTime = option.maxCreateBulletTime;//创建子弹的最大时间

        let interval = (maxTime - minTime) / 20;//创建子弹的时间间隔
        let time = 1500 - interval * (this.initSpeed - 1);//创建子弹的时间

        new Bullet(bulletAttribute[this.initAtk - 1], this.w, this.x, this.y);
        this.createBulletTime = setTimeout(this.createBullet.bind(this), time)
    }
    createEnemy() {//生成敌方飞机
        let createEnemy = option.enemyLv;
        let maxLv = 3;
        let time = 1000;
        //根据分数判断敌方飞机的等级
        for (let i = 0; i < createEnemy.length; i++) {
            let obj = createEnemy[i];
            if (this._score <= obj.score) {
                maxLv = obj.maxEnemyLv;
                time = obj.time;
                break;
            }
        }
        let index = Math.floor(Math.random() * maxLv);
        new EnemyPlane(enemy[index]);
        this.createEnemyTime = setTimeout(this.createEnemy.bind(this), time);
    }
    setPosition() {//设置飞机位置
        //准备一个加载完毕的事件
        this.img.addEventListener("load", () => {
            this.isLoad = true;
            let w = this.img.width;
            let h = this.img.height;
            this.h = this.w * h / w;

            this.maxX = option.boxW - this.w;
            this.x = this.maxX / 2;
            this.maxY = option.boxH - this.h;
            this.y = this.maxY;
        })
    }
    addKeyEvent() {//飞机移动
        document.onkeydown = (e) => {//设置移动键
            let key = e.key;
            if (key === 'w') {
                this.t = true;
            }
            if (key === 's') {
                this.b = true;
            }
            if (key === 'a') {
                this.l = true;
            }
            if (key === 'd') {
                this.r = true;
            }
        }

        document.onkeyup = (e) => {//抬起键
            let key = e.key;
            if (key === 'w') {
                this.t = false;
            }
            if (key === 's') {
                this.b = false;
            }
            if (key === 'a') {
                this.l = false;
            }
            if (key === 'd') {
                this.r = false;
            }
        }
    }
    move() {//飞机移动
        if (this.t) {
            this.y -= this.MoveSpeed;
            if (this.y <= 0) {
                this.y = 0;
            }
        }
        if (this.b) {
            this.y += this.MoveSpeed;
            if (this.y >= this.maxY) {
                this.y = this.maxY;
            }
        }
        if (this.l) {
            this.x -= this.MoveSpeed;
            if (this.x <= 0) {
                this.x = 0;
            }
        }
        if (this.r) {
            this.x += this.MoveSpeed;
            if (this.x >= this.maxX) {
                this.x = this.maxX;
            }
        }
        this.moveTime = requestAnimationFrame(this.move.bind(this))
    }
    destory() {//我方飞机死亡
        clearTimeout(this.createBulletTime);//停止创建子弹
        clearTimeout(this.createEnemyTime);//停止创建敌方飞机
        cancelAnimationFrame(this.moveTime);//停止移动
        document.onkeydown = null;
        document.onkeyup = null;
        MyPlane.plane = null;
    }
    stop() {//暂停
        cancelAnimationFrame(this.moveTime);

    }
    resume() {//继续
        this.move();
    }
}

// 爆炸类
export class Bom extends Draw {
    static list = new Set();
    transparencySpeend = 0.02;
    ramTime = null;
    constructor(url, w, h, x, y) {
        super(url);
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.init();
    }
    init() {
        Bom.list.add(this);
        this.setPosition();
        this.setOption();
        setTimeout(() => {
            this.destory();
        }, 800)
    }
    setPosition() {
        //准备一个加载完毕的事件
        this.img.onload = () => {
            this.isLoad = true;
        }
    }
    setOption() {//设置敌方死亡动画
        this.transparency -= this.transparencySpeend;
        if (this.transparency <= 0.1 || this.transparency >= 1) {
            this.transparencySpeend = -this.transparencySpeend;
        }
        this.ramTime = requestAnimationFrame(this.setOption.bind(this));
    }
    destory() {//敌方死亡销毁
        cancelAnimationFrame(this.ramTime);
        this.img.onload = null;
        Bom.list.delete(this);
    }
}

// 道具类
export class Prop extends Draw {
    static list = new Set();
    static direction = 0;//道具的方向
    constructor(obj, planeW, planeH, planeX, planeY) {
        super(obj.url);
        this.key = obj.key;
        this.num = obj.num;
        this.w = option.propW;

        this.planeW = planeW;
        this.planeH = planeH;
        this.planeX = planeX;
        this.planeY = planeY;
        this.speedX = option.propMoveSpeed;
        this.speedY = option.propMoveSpeed;
        this.init();

        let propMoveSpeed = option.propMoveSpeed + Math.random();
        if (Prop.direction == 0) {
            this.speedX = propMoveSpeed;
            this.speedY = propMoveSpeed;
        } if (Prop.direction == 1) {
            this.speedX = -propMoveSpeed;
            this.speedY = propMoveSpeed;
        } if (Prop.direction == 2) {
            this.speedX = -propMoveSpeed;
            this.speedY = -propMoveSpeed;
        } if (Prop.direction == 3) {
            this.speedX = propMoveSpeed;
            this.speedY = -propMoveSpeed;
        }
        Prop.direction = (Prop.direction + 1) % 4;
    }
    init() {
        this.setPosition();
        Prop.list.add(this);
    }
    setPosition() {
        //准备一个加载完毕的事件
        this.img.onload = () => {//道具的生成的位置
            this.isLoad = true;
            let w = this.img.width;
            let h = this.img.height;
            this.h = this.w * h / w;

            this.maxX = option.boxW - this.w;
            this.maxY = option.boxH - this.h;
            this.x = this.planeX + (this.planeW - this.w) / 2;
            this.y = this.planeY + (this.planeH - this.h) / 2;
            this.move();
        }
    }
    move() {//道具移动
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x >= this.maxX || this.x <= 0) {//道具超出X的判断
            this.speedX = -this.speedX;
        }
        if (this.y >= option.boxH || this.y <= 0) {//道具超出Y的判断
            this.speedY = -this.speedY;
        }
        this.ramTime = requestAnimationFrame(this.move.bind(this))
    }
    destory() {
        Prop.list.delete(this);
        this.img.onload = null;
        cancelAnimationFrame(this.ramTime);
    }
    stop() {//暂停
        cancelAnimationFrame(this.ramTime);
    }
    resume() {//继续
        this.move();
    }
}

//子弹类
export class Bullet extends Draw {
    static myBulletList = new Set();//我方子弹
    static enemyBulletList = new Set();//敌方子弹
    moveTime = null;
    MoveSpeed = option.myBulletMoveSpeed;//子弹移动速度
    constructor(obj, w, x, y, h, isEnemy) {
        super(obj.url);
        this.atk = obj.atk;
        this.scal = obj.scal;
        this.isEnemy = isEnemy;
        this.w = option.myBulletW * obj.scal;

        this.planeW = w;
        this.planeH = h;
        this.planeX = x;
        this.planeY = y;

        this.MoveSpeed = isEnemy ? option.enemyBulletMoveSpeed : option.myBulletMoveSpeed;
        this.init();
    }
    init() {
        if (this.isEnemy) {
            Bullet.enemyBulletList.add(this);
        } else {
            Bullet.myBulletList.add(this);
        }
        this.setPosition();
    }
    setPosition() {//设置子弹的位置
        //准备一个加载完毕的事件
        this.img.onload = () => {
            this.isLoad = true;
            let w = this.img.width;
            let h = this.img.height;
            this.h = this.w * h / w;

            this.maxY = option.boxH - this.h;
            this.x = this.planeX + this.planeW / 2 - this.w / 2;
            this.y = this.planeY + (this.isEnemy ? this.planeH : -this.h);
            this.maxH = option.boxH;
            this.move();
        }
    }
    move() {
        if (this.isEnemy) {
            this.y += this.MoveSpeed;
            if (this.y >= this.maxH) {
                this.destory();
                return;
            }
        } else {
            this.y -= this.MoveSpeed;
            if (this.y <= 0) {
                this.destory();
                return;
            }
        }
        this.moveTime = requestAnimationFrame(this.move.bind(this))
    }
    destory() {
        this.img.onload = null;
        if (this.isEnemy) {
            Bullet.enemyBulletList.delete(this);
        } else {
            Bullet.myBulletList.delete(this);
        }
    }
    stop() {//暂停
        cancelAnimationFrame(this.moveTime);
    }
    resume() {//继续
        this.move();
    }
}

//游戏类
export class Geme {
    drawPageTime = null;
    gameIsStart = false;//游戏是否开始
    isPause = false;//游戏是否暂停


    constructor(planeIndex) {
        this.planeIndex = planeIndex;
        this.init();
    }
    init() {
        this.gameIsStart = true;
        this.startGame();
        this.addEvent();
    }
    startGame() {//开始游戏
        this.myPlane = new MyPlane(aircraftAttribute[this.planeIndex], this);
        this.drawPage();
    }
    //绘制飞机,并实现飞机移动
    drawPage() {
        if (this.isPause) {
            return;
        }
        ctx.clearRect(0, 0, option.boxW, option.boxH);//每次清除飞机
        if (!this.gameIsStart) {
            return;
        }

        let myBulletList = Bullet.myBulletList;//获取我军子弹
        let enemyBulletList = Bullet.enemyBulletList;//获取敌方子弹
        let enemyList = EnemyPlane.list;//获取敌方飞机
        let bomList = Bom.list;//获取爆炸类
        let propList = Prop.list;//获取道具类
        let myPlane = MyPlane.plane;

        //生成我军飞机
        myPlane && myPlane.draw();
        //生成我军子弹
        for (let s of myBulletList) {
            s.isLoad && s.draw();
        }
        //生成敌方子弹
        for (let s of enemyBulletList) {
            s.isLoad && s.draw();
        }
        //生成敌方飞机
        for (let s of enemyList) {
            s.isLoad && s.draw();
            s.isLoad && s.drawBlod();
        }
        //生成爆炸效果
        for (let s of bomList) {
            s.isLoad && s.draw();
        }
        //生成道具
        for (let s of propList) {
            s.isLoad && s.draw();
        }

        // 我军子弹与敌方飞机的碰撞检测
        for (let s of myBulletList) {
            for (let t of enemyList) {
                //确保子弹和敌方飞机都加载完成并未死亡的状态下进行碰撞检测
                if (s.isLoad && t.isLoad) {
                    let bool = this.collisionDetection(s, t);
                    if (bool) {
                        s.destory();
                        t.hp -= s.atk;
                    }
                }
            }
        }

        // // 敌方飞机子弹与我方碰撞检测
        for (let s of enemyBulletList) {
            if (s.isLoad) {
                let bool = this.collisionDetection(s, myPlane);
                if (bool) {
                    myPlane.hp -= s.atk;
                    s.destory();
                }
            }
        }

        // 与敌方飞机碰撞检测
        for (let s of enemyList) {
            if (s.isLoad) {
                let bool = this.collisionDetection(s, myPlane);
                if (bool) {
                    s.isLoad && s.bom();
                    myPlane.hp -= s.hp;
                }
            }

        }

        //收取道具
        for (let s of propList) {
            if (s.isLoad) {
                let bool = this.collisionDetection(s, myPlane);
                if (bool) {
                    myPlane[s.key] += s.num;
                    s.destory();
                }
            }
        }

        this.drawPageTime = requestAnimationFrame(this.drawPage.bind(this));
    }
    //飞机碰撞检测
    collisionDetection(a, b) {
        return a.x >= b.x - a.w && a.x <= b.x + b.w && a.y >= b.y - a.h && a.y <= b.y + b.h;
    }
    //游戏结束
    gameOver() {
        this.gameIsStart = false;
        endPage.style.display = 'flex';
        endPage.querySelector('.name').innerHTML = `您使用的战机是:${this.myPlane.name}`;
        endPage.querySelector('.end-score').innerHTML = `本次得分:${this.myPlane.score}`;
        cancelAnimationFrame(this.drawPageTime);
        window.onblur = null;
        document.onvisibilitychange = null;
        let allSet = [
            this.myPlane,//获取我军飞机
            ...Bullet.myBulletList,//获取我军子弹
            ...Bullet.enemyBulletList,//获取敌方子弹
            ...EnemyPlane.list,//获取敌方飞机
            ...Prop.list//获取道具类
        ];

        for (let s of allSet) {
            s.destory();
        }
    }
    gamePause() {
        let bool = this.isPause;
        pause.style.display = bool ? 'block' : 'none';
        let fnKey = bool ? 'stop' : 'resume';
        bool || this.drawPage();
        let allSet = [
            this.myPlane,//获取我军飞机
            ...Bullet.myBulletList,//获取我军子弹
            ...Bullet.enemyBulletList,//获取敌方子弹
            ...EnemyPlane.list,//获取敌方飞机
            ...Prop.list//获取道具类
        ];

        for (let s of allSet) {
            s[fnKey]();
        }
    }
    addEvent() {
        document.addEventListener('keydown', e => {
            if (e.keyCode === 32) {
                this.isPause = !this.isPause;
                this.gamePause();
            }
        })
        window.onblur = () => {
            if (this.isPause) {
                return;
            }
            this.isPause = true;
            this.gamePause();
        }
        document.onvisibilitychange = () => {
            if (this.isPause) {
                return;
            }
            let pageVisibi = document.visibilityState;
            if (pageVisibi === 'hidden') {
                this.isPause();
                this.gamePause();
            }
        }
    }
}

