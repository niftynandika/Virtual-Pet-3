var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedImg, gardenImg, washRoomImg;
var gameState;
var readState;

function preload(){
sadDog=loadImage("virtual pet images/Dog.png");
happyDog=loadImage("virtual pet images/happy dog.png");

bedImg = loadImage("virtual pet images/Bed Room.png");
gardenImg = loadImage("virtual pet images/Garden.png");
washRoomImg = loadImage("virtual pet images/Wash Room.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val()
  });
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

  currentTime = hour();
  if(currentTime ==(lastFed+1)){
    gameState = "Playing";
    updateGameState();
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    gameState = "Sleeping";
    updateGameState();
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    gameState = "Bathing";
    updateGameState();
    foodObj.washroom();
  }else{
    gameState = "Hungry";
    updateGameState();
    foodObj.display();
  }
  
  if(gameState!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function updateGameState(){
  
  database.ref('/').update({
    gameState:gameState
  })
}