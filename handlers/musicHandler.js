const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');
const player = createAudioPlayer();

const queue = new Map();

module.exports = {
    name: "musicHandler",
    description: "Song handler for YouTube",

    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send("You need to be in a voice channel to play music!");
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);

        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        if (!args.length) {
            return message.channel.send("I can't reproduce nothingness!");
        }

        //Get the existing songqueue
        songQueue = queue.get(message.guild.id);
        let connection;
        if (!songQueue) {
            //If there is no songqueue, create a new connection and a new queue
            connection = await joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false
            })
            songQueue = {
                songs: [],
                connection: connection,
            };
            queue.set(message.guild.id, songQueue);
        } else {
            connection = songQueue.connection;
        }

        //Search for the song
        const videoFinder = async (query) => {
            //check if the query is a url
            if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
                return query;
            }
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0].url : null;
        }
        const input = args.join(" ");
        const video = await videoFinder(input);
        if (video) {
            //Add the song to the queue
            songQueue.songs.push(video);
            if (player.state.status === AudioPlayerStatus.Idle || player.state.status === AudioPlayerStatus.AutoPaused) {
                //If the player is idle, play the next song
                playNext(message);
            } else {
                //Show a message that the song is added to the queue
                message.channel.send(`The song ${video} has been added to the queue!`);
            }
        } else {
            return message.channel.send(`Youtube says that ${input} doesn't exists!`);
        }
    },

    skip() {
        player.stop();
    },
    pause() {
        player.pause();
    },
    resume() {
        player.unpause();
    },

    isPlayingMusic() {
        return player.state.status === AudioPlayerStatus.Playing;
    },

    leave(message) {
        songQueue = queue.get(message.guild.id);
        if (songQueue) {
            songQueue.songs = [];
            player.stop();
            songQueue.connection.disconnect();
            queue.delete(message.guild.id);
        }
    }
}
async function playNext(message) {
    //Get the next song
    nextSong = queue.get(message.guild.id).songs[0];

    //Create a stream from the song
    const stream = ytdl(nextSong, { filter: "audioonly", highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

    //Play the song
    player.play(resource);
    songQueue.connection.subscribe(player);

    //Show message that the song is playing
    message.channel.send(`You are listening to: ${nextSong}`);

    //Remove the song from the queue
    queue.get(message.guild.id).songs.shift();

    //When the song ends, play the next one
    player.on(AudioPlayerStatus.Idle, () => {
        songQueue = queue.get(message.guild.id);
        if (songQueue.songs.length > 0) {
            playNext(message);
        }
    });
}
