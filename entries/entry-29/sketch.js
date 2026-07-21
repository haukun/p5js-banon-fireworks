// ============================================================
const TITLE = "ファイヤーダーツ";
const AUTHOR = "SnowEsamosc";
// ============================================================

f=0, cx=200, cy=300
function setup() {
  background(0);
 noStroke()
  colorMode(HSB,1)
}

function panoramaa(f){
  d=43
  for(x=0;x<400;x+=d){
  for(y=-x*1.15,t=1;y<800;y+=25,t*=-1){
    r=dist(x,y,cx,cy)
    if(r>300)continue;
    h=r/200%1
    fill(h,1,.7+noise(x,y)*.3,r<f*30?map((f*30-r)/6e3,0,1,(1-r/900),0,true):0)
    s=abs(sin(1+(r/5-f)/30))
    quad(x,y-25*t,x+d*t*s,y,x,y+25*t)
  }}
} 

function draw() {
  f++
  background(0)
  if(f<150){
    for(n=0;n<30;n++){
      y=800-(f-n)/100*500
      fill(1,(y-cy));
      circle(cx, y, 6-n/5)
    }
  }
  if(100<=f)panoramaa(f-100)
}
