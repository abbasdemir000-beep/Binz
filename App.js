let stations=[
 {name:'محطة الشرقية',city:'كركوك',crowd:42},
 {name:'محطة عقبة بن نافع',city:'كركوك',crowd:72}
];

function openPage(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
 document.getElementById(id).classList.remove('hidden');
}

function render(){
 let box=document.getElementById('stations');
 box.innerHTML='';
 stations.forEach(s=>{
  let color=s.crowd<50?'green':s.crowd<60?'yellow':'red';
  box.innerHTML+=`<div class="station ${color}">${s.name} - ${s.crowd}%</div>`;
 });
}
render();
