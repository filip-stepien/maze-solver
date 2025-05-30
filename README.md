# 🔍 Labirynth solver 🔍

## Demo

[![asciicast](https://asciinema.org/a/jhVzuSV5jFYmajLJPxfZvDxyQ.svg)](https://asciinema.org/a/jhVzuSV5jFYmajLJPxfZvDxyQ)

## Usage


```sh
# install dependencies
npm i

```

### CLI interface 

```sh
npm run main -- --help
```

### web interface 

```sh
# run app
npm start
```

Alternatywnie, możliwe jest uruchomienie aplikacji w trybie _development_:

```sh
npm run dev
```

Wówczas wprowadzenie zmiany w plikach spowoduje _hot reload_.

Aby wyświetlać zmiany pliku HTML bez konieczności odświeżania strony w przeglądarce można np. wykorzystać [wtyczkę dla VSCode](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

> [!NOTE]  
> _Live server_ powinien być uruchomiony w taki sposób aby odświeżał plik HTML w katalogu `/dist`, tworzonym po uruchomieniu projektu, a nie plik z katalogu `/src`.
