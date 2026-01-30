const supabase = supabase.createClient(
 "https://dfvnefbxgayxqgjjgtrr.supabase.co",
 "sb_publishable_WypeFELCIlVDlqGY4PdWwA_snqoPUSE"
);

let id=new URLSearchParams(location.search).get("id");
if(!id){
 id=localStorage.getItem("lastCard");
 if(id) location.href="card.html?id="+id;
}

supabase.from("cards").select().eq("id",id).then(r=>{
 const d=JSON.parse(r.data[0].data);
 pimg.src=d.image;
 pname.innerText=d.name;
 pphone.innerText=d.phone;
 pemail.innerText=d.email;
 paddress.innerText=d.address;
 d.offers.forEach(o=>{
  if(o){
   offers.innerHTML+=`
   <div class="offer">
   ${o}
   <button onclick="wa('${o}')">Get on WhatsApp</button>
   </div>`;
  }
 });
});

function wa(text){
 location.href="https://wa.me/?text="+encodeURIComponent(text);
}

function share(){
 navigator.share({url:location.href});
}
