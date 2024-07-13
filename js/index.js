//引入所有css样式
import '../css/bringin.css'
//引入飞机属性
import { aircraftAttribute, option, DPR } from './config.js'
import { myPlane, bullet, enemyPlane, bom, Prop, Geme } from './allClass.js'

let aPage = document.querySelectorAll('.gaembox > div')//获取开始，选择，结束页面
let initiateGame = aPage[0].querySelector('button')//获取开始游戏按钮
let aArrow = aPage[1].querySelectorAll('.arrow')//获取选择页面的左右箭头
let aButton = aPage[1].querySelectorAll('button')//获取选择页面的按钮
let choiceLi = aPage[1].querySelector('li')//获取飞机切换的li
let canvas = aPage[2].querySelector('canvas')//获取有游戏界面
export let propBox = aPage[2].querySelector('.propdetails')//获取游戏界面的属性
export let endPage = aPage[2].querySelector('.restartbox')//获取重新开始界面
let endPageBtn = aPage[2].querySelector('.restartbox .button')//获取重新开始界面的按钮
export let pause = aPage[2].querySelector('.pause')//获取暂停键

canvas.width = 500 * DPR//解决飞机模糊
canvas.height = 735 * DPR

let planeIndex = 0
export let ctx = canvas.getContext('2d')

// 基础事件的添加
initiateGame.addEventListener('click', function () {
  toggle(1)//切换到选择页面
  aeroplaneToggle(aircraftAttribute[planeIndex], choiceLi)
})

aButton[0].addEventListener('click', function () {
  toggle(2)//切换到游戏界面

  new Geme(planeIndex)
})
aButton[1].addEventListener('click', function () {
  toggle(0)//切换到开始页面
})

endPageBtn.addEventListener('click', function () {
  toggle(0)
  endPage.style.display = 'none'
})


//箭头切换
for (let i = 0; i < aArrow.length; i++) {
  aArrow[i].addEventListener('click', function () {
    i ? planeIndex++ : planeIndex--
    planeIndex = (planeIndex + aircraftAttribute.length) % aircraftAttribute.length

    aeroplaneToggle(aircraftAttribute[planeIndex], choiceLi)
  })
}

// 页面切换
function toggle(index) {
  for (let i = 0; i < aPage.length; i++) {
    aPage[i].style.display = i === index ? 'flex' : 'none'
  }
}

/**
 * 切换飞机状态函数
 * @param {Object} obj - 飞机属性对象，包含id、name、initHp、maxHP、initSpeed、maxSpeed、initAtk、maxAtk和url属性
 * @param {Object} oli - 生成li的节点
 *
 * 该函数用于根据飞机对象的属性，计算并生成飞机状态的HTML字符串。
 * 它不直接返回值，但通过字符串操作构造了表示飞机血量、速度和攻击力的进度条。
 */
// 飞机切换
function aeroplaneToggle(obj, oli) {
  // 解构赋值，从obj中提取飞机的属性
  let {
    name,
    initHp,
    maxHp,
    initSpeed,
    maxSpeed,
    initAtk,
    maxAtk,
    url
  } = obj

  // 计算飞机血量、速度和攻击力的百分比，并保留两位小数
  let hp = (initHp / maxHp * 100).toFixed(0)
  let speed = (initSpeed / maxSpeed * 100).toFixed(0)
  let atk = (initAtk / maxAtk * 100).toFixed(0)
  // 引入图片
  let img = require(`../image/${url}.png`)
  // 构造飞机状态的HTML字符串
  let str =
    `
    <h3 class="t-shadow">${name}</h3>
      <div class="aeroplane">
          <img src="${img}" alt="">
          <ol>
              <li>
                  <p>血量${initHp}/${maxHp}</p>
                  <div class="progressbar">
                      <p class="hp" style="width:${hp}%;">${hp}%</p>
                  </div>
              </li>
              <li>
                  <p>速度${initSpeed}/${maxSpeed}</p>
                  <div class="progressbar">
                      <p class="speed" style="width:${speed}%;">${speed}%</p>
                  </div>
              </li>
              <li>
                  <p>攻击力${initAtk}/${maxAtk}</p>
                  <div class="progressbar">
                      <p class="atk" style="width:${atk}%;">${atk}%</p>
                  </div>
              </li>
          </ol>
      </div>
    `
  oli.innerHTML = str
}