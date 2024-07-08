  let index = song.indexOf(currentSong.src.split("/").slice(-1) [0])
if((index+1) > length){
playMusic(song[index+1])
}
