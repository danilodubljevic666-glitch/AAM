// Sklanja brendirani preloader iz index.html — ali tek kad sajt zaista vrijedi pogledati:
// kad su fontovi tu (da ogromni Anton naslovi ne poskoče) i kad React iscrta prvi ekran.
//
// CAP je gornja granica čekanja: spor font ili loša mreža ne smiju da drže korisnika
// pred preloaderom. (U index.html postoji i druga brana od 5s, ako JS pukne prije ovoga.)
const CAP = 2500

// Dva uzastopna frejma = prvi iscrtani ekran je stvarno na ekranu
const afterPaint = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

export function hidePreloader() {
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
  const cap = new Promise((resolve) => setTimeout(resolve, CAP))

  Promise.race([Promise.all([fonts, afterPaint()]), cap]).then(() => window.__aamReady?.())
}
