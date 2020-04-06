# QUESTO E' UN ESEMPIO DI TOPIC PER ROKU.
## SYNC
Il sync avviene grazie al corretto autorun. E' necessario che il manifest.mf contenga tutti i file presenti in tutte le sotto app per poter permettere il sync correttamente.
## APPS
Le apps sono contenute in cartelle sullo stesso livello dell'index.js. E' necessario che ogni index.html delle applicazioni richiami la funzione main del file index.js per poter mettere la comunicazione via socket.io.
## INDEX.JS
Per ricompilare il bundle.js (index.js + moduli) il comando NPM è "npm run build".