//地図
let map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const mapQuantity = 81;
const mapLength = 11;

//地雷配置のための配列
let minemap = [
    [1, 1],[1, 2],[1, 3],[1, 4],[1, 5],[1, 6],[1, 7],[1, 8],[1, 9],
    [2, 1],[2, 2],[2, 3],[2, 4],[2, 5],[2, 6],[2, 7],[2, 8],[2, 9],
    [3, 1],[3, 2],[3, 3],[3, 4],[3, 5],[3, 6],[3, 7],[3, 8],[3, 9],
    [4, 1],[4, 2],[4, 3],[4, 4],[4, 5],[4, 6],[4, 7],[4, 8],[4, 9],
    [5, 1],[5, 2],[5, 3],[5, 4],[5, 5],[5, 6],[5, 7],[5, 8],[5, 9],
    [6, 1],[6, 2],[6, 3],[6, 4],[6, 5],[6, 6],[6, 7],[6, 8],[6, 9],
    [7, 1],[7, 2],[7, 3],[7, 4],[7, 5],[7, 6],[7, 7],[7, 8],[7, 9],
    [8, 1],[8, 2],[8, 3],[8, 4],[8, 5],[8, 6],[8, 7],[8, 8],[8, 9],
    [9, 1],[9, 2],[9, 3],[9, 4],[9, 5],[9, 6],[9, 7],[9, 8],[9, 9],
];
const mineLength = 10;

//カウントダウンタイマー
let TIMER;
function countdown(){
    document.getElementById('timer').innerHTML--;
    if(document.getElementById('timer').innerHTML === '0'){
        failed();
    }
};

//その他
const $button = document.getElementsByTagName('button');
const buttonLength = $button.length;
let OPENCOUNTER = 0;
let FLAGCOUNTER = 0;

//配列をシャッフルする関数
function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1));
      [array[i], array[rand]] = [array[rand], array[i]]
    }
    return array;
};

//地図を初期化
function mapinit(x, y){   
    minemap = shuffle(minemap);
    for(let i = 0, j = 0; j < mineLength; i++){
        if(minemap[i][0] !== x && minemap[i][1] !== y){
            map[minemap[i][0]][minemap[i][1]] = 1;
            j++;
        }
    }
};

//地雷かを判断
function check(x, y, id){
    if(map[x][y] === 1){
        document.getElementById(id).style.backgroundColor = 'red';
        document.getElementById(id).innerHTML = '💣';
        failed();
    }else{
        document.getElementById(id).innerHTML = calculate(x, y);
    }
};

//失敗した時
function failed(){
    for(let i = 0; i < mapLength; i++){
        for(let j = 0; j < mapLength; j++){
            if(map[i][j] === 1){
                document.getElementById(String(i) + String(j)).style.backgroundColor = 'red';
                document.getElementById(String(i) + String(j)).innerHTML = '💣';
            }else if(1 <= i && i <= 9 && 1 <= j && j <= 9){
                document.getElementById(String(i) + String(j)).innerHTML = calculate(i, j);
            }
        }   
    }
    clearInterval(TIMER);
};

//周囲の地雷の数を計算
function calculate(x, y){
    let minecounter = 0;
    if(map[x - 1][y - 1] === 1){    //左上
        minecounter++;
    }
    if(map[x][y - 1] === 1){        //上
        minecounter++;
    }
    if(map[x + 1][y - 1] === 1){    //右上
        minecounter++;
    }
    if(map[x - 1][y] === 1){        //左
        minecounter++;
    }
    if(map[x + 1][y] === 1){        //右
        minecounter++;
    }
    if(map[x - 1][y + 1] === 1){    //左下
        minecounter++;
    }
    if(map[x][y + 1] === 1){        //下
        minecounter++;
    }
    if(map[x + 1][y + 1] === 1){    //右下
        minecounter++;
    }
    return minecounter;
};

//ボタンが押されたら反応
let handlerIndex = 0;
while(handlerIndex < buttonLength){
    //左クリック
    $button[handlerIndex].addEventListener('click', function(e){
        document.getElementById(e.target.id).setAttribute("disabled", true);
        if(OPENCOUNTER === 0){
            mapinit(e.target.id[0], e.target.id[1]);
            TIMER = setInterval(countdown, 1000);
        }
        setTimeout(check(Number(e.target.id[0]), Number(e.target.id[1]), e.target.id), 100);
        OPENCOUNTER++;
        //終了判定
        if(OPENCOUNTER === mapQuantity - mineLength && FLAGCOUNTER === mineLength){
            clearInterval(TIMER);
            window.alert('クリア!')
        }
    });
    //右クリック
    $button[handlerIndex].addEventListener('contextmenu', function(e){
        if(document.getElementById(e.target.id).innerHTML !== '🚩'){
            document.getElementById(e.target.id).innerHTML = '🚩';
            FLAGCOUNTER++;
        }else{
            document.getElementById(e.target.id).innerHTML = '　';
            FLAGCOUNTER--;
        }
        //終了判定
        if(OPENCOUNTER === mapQuantity - mineLength && FLAGCOUNTER === mineLength){
            clearInterval(TIMER);
            window.alert('クリア!')
        }
    });
    handlerIndex++;
};