const supabase = supabase.createClient(
 "https://dfvnefbxgayxqgjjgtrr.supabase.co",
 "sb_publishable_WypeFELCIlVDlqGY4PdWwA_snqoPUSE"
);

async function generate(){
 const data={
  name:name.value,
  phone:phone.value,
  email:email.value,
  address:address.value,
  image:image.value,
  offers:[offer1.value,offer2.value,offer3.value]
 };
 const id=Math.random().toString(36).slice(2,8);
 await supabase.from("cards").insert({id,data:JSON.stringify(data)});
 localStorage.setItem("lastCard",id);
 location.href="card.html?id="+id;
}
