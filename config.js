const toggle = document.getElementById("mobile-menu-toggle");
const overlay = document.getElementById("mobile-menu-overlay");
const menu = document.getElementById("mobile-menu");
const html = document.documentElement;

let scrollY = 0;

toggle.addEventListener("click", () => {

  const isActive = menu.classList.contains("active");

  if (!isActive) {
    scrollY = window.scrollY;

    html.style.scrollBehavior = "auto";

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

  } else {

    document.body.style.position = "";
    document.body.style.top = "";

    window.scrollTo(0, scrollY);
    html.style.scrollBehavior = "smooth";
  }

  toggle.classList.toggle("active");
  overlay.classList.toggle("active");
  menu.classList.toggle("active");
});

overlay.addEventListener("click", () => {

  document.body.style.position = "";
  document.body.style.top = "";

  window.scrollTo(0, scrollY);
  html.style.scrollBehavior = "smooth";

  toggle.classList.remove("active");
  overlay.classList.remove("active");
  menu.classList.remove("active");
});


/* ================= NAVBAR SCROLL EFFECT ================= */
const hero = document.querySelector(".hero");
const navbar = document.querySelector(".navbar");

if(hero && navbar){
  const heroObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        navbar.classList.remove("scrolled");
      } else {
        navbar.classList.add("scrolled");
      }
    },
    {
      rootMargin: "-100px 0px 0px 0px"
    }

    
  );

  heroObserver.observe(hero);
}


/* ================= CARD IMAGE ANIMATION (REUSABLE) ================= */

const animatedImages = document.querySelectorAll(".animated-img");

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.4,
    rootMargin: "0px 0px -100px 0px"
  }
);

animatedImages.forEach(img => {
  imageObserver.observe(img);
});
document.addEventListener("DOMContentLoaded", () => {

  const slideShows = document.querySelectorAll(".slideshow-container");

  slideShows.forEach(container => {

    const slides = container.querySelectorAll(".slide");
    let current = 0;

    function runSlide() {

      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");

      const randomTime = 6000 + Math.random() * 6000;
      // hasilnya antara 4 – 8 detik

      setTimeout(runSlide, randomTime);
    }

    // delay awal juga random supaya start-nya nggak bareng
    const startDelay = Math.random() * 3000;
    setTimeout(runSlide, startDelay);

  });

});


function updateJam() {
  const tgl = new Date();

  const hari = "Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" ");
  const bulan = "Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" ");

  const teks =
    `${hari[tgl.getDay()]}, ${tgl.getDate()} ${bulan[tgl.getMonth()]} ${tgl.getFullYear()} | 
     ${String(tgl.getHours()).padStart(2,"0")}:
     ${String(tgl.getMinutes()).padStart(2,"0")}:
     ${String(tgl.getSeconds()).padStart(2,"0")}`;

  document.getElementById("realTime").innerHTML = teks;
}

setInterval(updateJam, 1000);
updateJam();

const canvas = document.getElementById("sandCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let lastMouse = {x:0,y:0,time:0};

window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.addEventListener("click", e => {

  const now = Date.now();
  const dx = e.clientX - lastMouse.x;
  const dy = e.clientY - lastMouse.y;
  const dt = now - lastMouse.time || 1;

  const speed = Math.sqrt(dx*dx + dy*dy) / dt;

  lastMouse = {x:e.clientX, y:e.clientY, time:now};

  const count = Math.min(120, Math.floor(30 + speed * 800));

  for(let i=0;i<count;i++){
    particles.push(createParticle(e.clientX,e.clientY,speed));
  }

});

function createParticle(x,y,speed){
  const angle = Math.random()*Math.PI*2;
  const power = Math.random()*speed*40 + 8;

  return{
    x,
    y,
    vx:Math.cos(angle)*power,
    vy:Math.sin(angle)*power,
    size:Math.random()*3  +2,
    rotation:Math.random()*360,
    vr:(Math.random()-0.5)*10,
    color:getSandColor(),
    life:100
  };
}

function getSandColor(){
  const colors=[
    "#C2A36B","#E6C78B","#D2B48C","#F5DEB3","#CBB279"
  ];
  return colors[Math.floor(Math.random()*colors.length)];
}

function updateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach((p,i)=>{

    p.vy += 0.05;
    p.vx *= 0.98;
    p.vy *= 0.98;

    p.x += p.vx;
    p.y += p.vy;

    if(p.y > canvas.height){
      p.y = canvas.height;
      p.vy *= -0.4;
    }

    p.rotation += p.vr;
    p.life--;

    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rotation*Math.PI/180);
    ctx.fillStyle=p.color;
    ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
    ctx.restore();

    if(p.life<=0) particles.splice(i,1);

  });

  requestAnimationFrame(updateParticles);
}

updateParticles();

document.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", function(e){

    const href = this.getAttribute("href");

    if (!href || this.target === "_blank") return;

    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    // ledakan partikel di titik klik
    for(let i=0;i<90;i++){
      particles.push(createParticle(x,y,2));
    }

    setTimeout(()=>{

      // 🔥 kalau anchor scroll
      if(href.startsWith("#")){
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:"smooth"});
        }
      }

      // 🔥 kalau pindah halaman
      else{
        window.location.href = href;
      }

    },300);

  });

});