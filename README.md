# Music bot for Discord
 In the recent years Google has been declaring that it is against their ToS the use of bots to reproduce music in Discord, since 
 users are not allowed to profit from youtube music/videos. This lead to a lot of community bots going offline to avoid
 Google's lawyers fury.
 The owners of the aforementioned bots were "profiting" from premiums plans, and thus they were not allowed to keep the bots online. Those owners used the money to keep the servers running their bots.

# The problem
 This is not a problem of Google ToS, it stands to logic that they will try to protect their IPs from being used by bots, specially if other parties are making money from the bots that rely on Google's (YouTube) infrastructure.
 This is a problem of server centralization, which leads to bots running of expensive servers in order to provide a trivial functionality to the users. There would be no need of making profit with premium plans if we could just host our own personal use bot on our servers to reproduce wathever audio that is publicly available on internet.

 ## The solution?
  This is a bot created out of just joy and free time, probably not the bot that everyone needs, but it is a bot that can be used to reproduce music in Discord, as long as you host it and don't charge anything to anybody using it (otherwise you could be sued by Google). 
  It is not a optimized bot, it probably has bugs everywhere, but it could work as a basic template for your own bot.

# Usage
  To use this bot you should create a bot, get the token, and then use it in this `config.json` file.
  There are plenty of tutorials on how to create a bot and get the token out of it, go to check those.
  Also the ffmpeg binaries are needed to reproduce music. I can't distribute them because they are licenced, but you can download them from [here](https://ffmpeg.org/download.html).

  Once you have your bot in your server and token in the `config.json`, just run `node index.js` in your terminal and you should be good to go.
  The commands are:

    - `!play <search string>`: search in youtube the search string and plays the first occurrence.
    - `!play <url>`: plays the youtube url.
    - `!pause`: pauses the music.
    - `!resume`: resumes the music.
    - `!stop`: stops the music.
    - `!leave`: leaves the voice channel.

  The prefix `!` is the default one, but you can change it in the config.json file.