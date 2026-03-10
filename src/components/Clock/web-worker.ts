/* eslint-disable no-restricted-globals */
self.addEventListener('message', () => {
  // on démarre l'intervalle quand le thread principal nous demande
  const timer = setInterval(() => {
    // on envoie l'heure courante
    self.postMessage(new Date().toISOString());
  }, 1000);

  // on peut aussi écouter un message « stop » si besoin
  self.addEventListener('message', (e) => {
    if (e.data === 'stop') {
      clearInterval(timer);
    }
  });
});