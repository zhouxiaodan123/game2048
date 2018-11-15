var board = new Array();//4*4格子
var score = 0;//分数

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
})

function prepareForMobile() {
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radio', 0.02*gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radio', 0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j))
			gridCell.css('left',getPosLeft(i,j))
		}
	}

	for (var i = 0; i < 4; i++) {
		//二维数组
		board[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
		}
	}

	updateBoardView();

}

function updateBoardView(){
	$('.number-cell').remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var numberCell = $('#number-cell-'+i+'-'+j);
			if(board[i][j]==0){
				numberCell.css('width','0px');
				numberCell.css('height','0px');
				numberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				numberCell.css('left',getPosLeft(i,j)+cellSideLength/2);

			}else{
				// numberCell.css('width','100px');
				// numberCell.css('height','100px');
				numberCell.css('width',cellSideLength);
				numberCell.css('height',cellSideLength);
				numberCell.css('top',getPosTop(i,j));
				numberCell.css('left',getPosLeft(i,j));
				numberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				numberCell.css('color', getNumberColor(board[i][j]));
				numberCell.text(board[i][j]);
			}
		}
	}

	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}


function generateOneNumber(){
	if(nospace(board)){
		return false;
	}
	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	while(true){
		if (board[randx][randy]==0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	//在随机位置显示随机数字
	board[randx][randy] = randNumber;

	showNumberWithAnimation(randx,randy,randNumber);

	return true;
}


$(document).keydown(function(event){
	event.preventDefault();
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 38://up
			if(moveUp()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 39://right
			if(moveRight()){
				generateOneNumber();
				isgameover();
			}
			break;
		case 40://down
			if(moveDown()){
				generateOneNumber();
				isgameover();
			}
			break;
		default:
			break;
	}
});


function moveLeft() {
	if(!canMoveLeft(board)){
		return false;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if(board[i][j]!=0){
				for (var k = 0; k < j; k++) {
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						continue;
					}
				}
				
			}
		}
	}

	setTimeout("updateBoardView()",200);

	return true;
}

function moveUp() {
	if(!canMoveUp(board)){
		return false;
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if(board[i][j]!=0){
				for (var k = 0; k < i; k++) {
					if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] *= 2;
						board[i][j] = 0;
						continue;
					}
				}
				
			}
		}
	}

	setTimeout("updateBoardView()",200);

	return true;
}

function moveRight() {
	if(!canMoveRight(board)){
		return false;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if(board[i][j]!=0){
				for (var k = 3; k > j; k--) {
					if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						continue;
					}
				}
				
			}
		}
	}

	setTimeout("updateBoardView()",200);

	return true;
}

function moveDown() {
	if(!canMoveDown(board)){
		return false;
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if(board[i][j]!=0){
				for (var k = 3; k > i; k--) {
					if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[i][k] *= 2;
						board[i][j] = 0;
						continue;
					}
				}
				
			}
		}
	}

	setTimeout("updateBoardView()",200);

	return true;
}
function isgameover(){
	if(nospace(board) && noMove(board)){
		gameover();
	}
}

function gameover() {
	alert('gameover')
}


document.addEventListener('touchstart',function(event){
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})

document.addEventListener('touchend',function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var deltax = endX - startX;
	var deltay = endY - startY;

	if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay < 0.3*documentWidth)){
		return;
	}

	//x
	if(Math.abs(deltax)>= Math.abs(deltay)){
		if(deltax > 0){
			//move right
			if(moveRight()){
				generateOneNumber();
				isgameover();
			}
		}else{
			//move left
			if(moveLeft()){
				generateOneNumber();
				isgameover();
			}
		}
	}
	//y
	else{
		if(deltay > 0){
			//move down
			if(moveDown()){
				generateOneNumber();
				isgameover();
			}
		}else{
			//move up
			if(moveUp()){
				generateOneNumber();
				isgameover();
			}
			
		}
	}
})


