

let canvas;
let ctx;//image 그리는 변수
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d") //ctx가 최종적으로 이미지를 그려주는 역할을 한다.
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas); //html body에다가 canvas를 붙여준다.

//이미지들 가져오기
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage
let gameover = false //true면 겜이 끝남, false이면 게임 안끝남
let score = 0
//우주선 좌표
let spaceshipX = canvas.width/2-40;
let spaceshipY = canvas.height-100;

let bulletList = [] //총알들을 저장하는 리스트
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){ //init은 초기화
        this.x = spaceshipX+24
        this.y = spaceshipY
        this.alive = true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this)
    };
    this.update = function(){
        this.y -= 7;
    };
    //점수 증가하는 식
    this.checkHit = function(){
        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40){
            //총알이 죽게됨 적군이 없어짐, 점수획득
                score++;
                this.alive = false; // 죽은 총알
                enemyList.splice(i, 1);
            }
        }
        
    }
}

//몬스터 좌표
function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}
let enemyList = []
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){ //init은 초기화
        this.x = generateRandomValue(0, canvas.width-64);
        this.y = 0;
        enemyList.push(this);
    };
    this.update = function(){
        this.y += 2;
        if (this.y >= canvas.height - 64) {
            gameover = true;
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/foggy.png";

    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupkeyboardListner(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;
        // console.log("키다운객체에 들어간 값은?", keysDown)
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.keyCode];
        // console.log("버튼 클릭후", keysDown);
        
        if(event.keyCode == 32){
            createBullet() //총알 생성
        }
    })
}

function createBullet(){
    console.log("총알생성");
    let b = new Bullet();
    b.init();
}

function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    }, 1000);
}

function update(){
    if( 39 in keysDown){ //오른쪽 버튼이 눌리면
        spaceshipX += 2;
    }
    if( 37 in keysDown){ //왼쪽 버튼이 눌리면
        spaceshipX -= 2; 
    }
    if(spaceshipX <= 0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-96){
        spaceshipX = canvas.width-96;
    }
    //우주선의 좌표값이 무한대가 아니고 경기장 안에서만 있게 하려면?

    //총알의 y좌표 업데이트 하는 함수 호출
    for (let i=0; i<bulletList.length; i++){
        if (bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    //몬스터 호출
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

//이미지를 보여주는 함수 
function render(){  //render는 ui를 그려주는
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY)
    ctx.fillText(`score:${score}`,20,20); // 점수판
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"

    for(let i=0; i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
        }
    }

    for(let i=0; i<enemyList.length;i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y)
    }
}

//백그라운드이미지 반복적으로 재생시키는 함수
function main(){
    if(!gameover){
        update(); //오른쪽 이동
        render(); //그려주고(이미지출력)
        // console.log("animation calls main function")
        requestAnimationFrame(main); //애니메이션처럼 어떤 프레임을 계속 미친듯이 호출해주는것
    }else{
        ctx.drawImage(gameOverImage, 10,100,300,380);
    }
}

//실행해라
loadImage();
setupkeyboardListner();
createEnemy();
main();

//총알만들기
//1. 스페이스바를 누르면 발사
//2. 총알이 발사 = 총알의 y값이 -된다 , 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표, 
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x, y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 해준다.

//적군 만들기
// x,y, init, update 총알만들기와 같은 원리