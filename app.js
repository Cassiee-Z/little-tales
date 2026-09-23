const video = document.getElementById('story-video');
const message = document.getElementById('player-message');
function showMessage(text) { message.textContent = text; message.hidden = false; }
video.addEventListener('playing', () => { message.hidden = true; });
video.addEventListener('error', () => {
  message.replaceChildren(document.createTextNode('视频暂未加载成功。请刷新页面重试，或'));
  const direct = document.createElement('a');
  direct.href = 'assets/story.mp4'; direct.textContent = '直接打开视频';
  message.append(direct, document.createTextNode('。')); message.hidden = false;
});
document.querySelectorAll('[data-seek]').forEach(button => {
  button.addEventListener('click', async () => {
    const time = Number(button.dataset.seek);
    document.getElementById('watch').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center'});
    try {
      if (video.readyState < 1) {
        showMessage('正在加载故事片段…');
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => { cleanup(); reject(new Error('metadata timeout')); }, 15000);
          const done = () => { cleanup(); resolve(); };
          const fail = () => { cleanup(); reject(new Error('media load error')); };
          const cleanup = () => { clearTimeout(timer); video.removeEventListener('loadedmetadata', done); video.removeEventListener('error', fail); };
          video.addEventListener('loadedmetadata', done, {once:true}); video.addEventListener('error', fail, {once:true}); video.load();
        });
      }
      video.currentTime = time;
      await video.play();
      video.focus({preventScroll:true});
    } catch (error) {
      showMessage('片段已选择，请点击播放器上的播放按钮；若网络较慢，请稍后重试。');
    }
  });
});
