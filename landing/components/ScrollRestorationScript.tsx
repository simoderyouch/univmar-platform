export default function ScrollRestorationScript() {
  const script = `(function(){try{
var P="univmar:scroll:",B="univmar:back";
function path(){return location.pathname}
function save(y){try{sessionStorage.setItem(P+path(),String(Math.round(y!=null?y:scrollY)))}catch(e){}}
function read(){try{var v=sessionStorage.getItem(P+path());return v?parseInt(v,10):0}catch(e){return 0}}
function restore(){
  var y=read();if(!y)return;
  var t=Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight));
  scrollTo(0,t);
}
addEventListener("scroll",function(){save(scrollY)},{passive:true});
addEventListener("pagehide",function(){save(scrollY)});
addEventListener("popstate",function(){
  try{sessionStorage.setItem(B,"1")}catch(e){}
  setTimeout(restore,0);setTimeout(restore,80);setTimeout(restore,200);setTimeout(restore,500);
},true);
addEventListener("pageshow",function(e){
  if(!e.persisted)return;
  try{if(sessionStorage.getItem(B)==="1")restore()}catch(err){}
});
addEventListener("click",function(e){
  var a=e.target&&e.target.closest?e.target.closest("a"):null;
  if(!a||a.target==="_blank")return;
  var h=a.getAttribute("href");
  if(!h||h[0]==="#"||h.indexOf("mailto:")===0||h.indexOf("tel:")===0)return;
  save(scrollY);
},true);
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
