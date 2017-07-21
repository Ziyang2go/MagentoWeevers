var config = {
  paths: {
    claraplayer: "https://clara.io/js/claraplayer.min"
  },
  shim: {
    claraplayer: {
      exports: "claraplayer"
    }
  },
  map: {
    "*": {
      clara_player: "js/clara-player"
    }
  }
};
