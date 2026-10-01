(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = document.querySelector('.cursor-glow');
  const progress = document.querySelector('.progress');
  const video = document.querySelector('.hero-video');

  if (video && reduce) video.pause();

  // Cursor light + subtle scene parallax
  let mx = innerWidth / 2, my = innerHeight / 2;
  let cx = mx, cy = my;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    if (cursor) cursor.style.opacity = '1';
  }, {passive:true});
  addEventListener('pointerleave', () => { if(cursor) cursor.style.opacity='0'; });

  // Magnetic controls
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      if (reduce) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * .12;
      const y = (e.clientY - r.top - r.height/2) * .18;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  // Cards become tiny 3D surfaces instead of generic scroll reveals.
  document.querySelectorAll('.magnetic-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (reduce) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateX(${y*-4}deg) rotateY(${x*5}deg) translateZ(6px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // Scroll-linked motion: hero video and manifesto typography drift rather than "reveal".
  let raf = 0;
  function frame(){
    cx += (mx-cx)*.13; cy += (my-cy)*.13;
    if(cursor){
      cursor.style.left = cx+'px';
      cursor.style.top = cy+'px';
    }

    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max ? scrollY/max : 0;
    progress.style.transform = `scaleX(${p})`;

    const hero = document.querySelector('.hero-copy');
    if(hero && !reduce) hero.style.transform = `translate3d(${(cx-innerWidth/2)*.006}px,${scrollY*.12}px,0)`;

    const stage = document.querySelector('.orbit-stage');
    if(stage && !reduce) stage.style.transform = `translate3d(0,${scrollY*.08}px,0)`;

    const split = document.querySelector('.split-text');
    if(split && !reduce){
      const r = split.getBoundingClientRect();
      const amount = Math.max(-80, Math.min(80, (innerHeight*.65-r.top)*.08));
      split.style.transform = `translate3d(${amount*.15}px,${amount}px,0)`;
    }
    raf = requestAnimationFrame(frame);
  }
  if (!reduce) raf = requestAnimationFrame(frame);

  // Keep the video from becoming an accidental bandwidth hog on tiny screens.
  if (innerWidth < 600 && video) {
    video.preload = 'none';
  }
})();
