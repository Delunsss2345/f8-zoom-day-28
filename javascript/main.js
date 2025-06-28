const musicPlayer = {
    musics: [
        {
            id: 1,
            img: "./images/image1.jpg",
            title: "交界-伴奏",
            artist: "陈嘉杰＆陳嘉傑",
            audio: "./audios/audio2.mp3"
        },
        {
            id: 2,
            img: "./images/image2.jpg",
            title: "思念刘德海",
            artist: "The Weeknd",
            audio: "./audios/audio3.mp3"
        },
        {
            id: 3,
            img: "./images/image3.jpg",
            title: "不入名贤传",
            artist: "Dua Lipa",
            audio: "./audios/audio4.mp3"
        },
        {
            id: 4,
            img: "./images/image4.jpg",
            title: "不做你的朋友",
            artist: "高旭-FelixBennett",
            audio: "./audios/audio1.mp3"
        },{
            id: 5,
            img: "./images/image5.jpg",
            title: "沉溺",
            artist: "你让我的心不再结冰",
            audio: "./audios/audio5.mp3"
        },
        {
            id: 6,
            img: "./images/image6.jpg",
            title: "Peaches",
            artist: "Drop-Zone Remix",
            audio: "./audios/audio6.mp3"
        },
        {
            id: 7,
            img: "./images/image7.jpg",
            title: "就忘了吧",
            artist: "架子鼓版",
            audio: "./audios/audio7.mp3"
        },
        {
            id: 8,
            img: "./images/image8.jpg",
            title: "If You",
            artist: "BigBang",
            audio: "./audios/audio8.mp3"
        }
    ],
    currentMusic: null,
    currentIndex: 0,
    isPlaying: false,
    isStopVolume : false ,
    dragging: false,
    stack : [] , 
    currentPos: { x: 0, deltaX: 0, deltaY: 40, scale: 1.06 },
    isRepeat : false ,
    getTouchX(e) {
        const touch = e.touches?.[0] || e.changedTouches?.[0];
        return touch?.clientX ?? e.clientX ?? 0;
    },

    createMusic(music, idx) {
        const musicItem = document.createElement('div');
        musicItem.className = "music-item";
        musicItem.dataset.musicId = idx;

        const thumbnail = document.createElement('div');
        thumbnail.className = "music-thumbnail";

        const image = document.createElement('img');
        image.src = music.img;
        image.alt = "Song Thumbnail";
        thumbnail.appendChild(image);

        const info = document.createElement('div');
        info.className = "music-info";

        const title = document.createElement('div');
        title.className = "music-title";
        title.textContent = music.title;

        const artist = document.createElement('div');
        artist.className = "music-artist";
        artist.textContent = music.artist;

        const musicPlay = document.createElement("figure") ; 
        const musicPlayImage = document.createElement('img');
        musicPlay.className = "music-playAvatar" ;
        musicPlayImage.src = music.img;
        musicPlayImage.alt = "Song Thumbnail";
        musicPlay.appendChild(musicPlayImage);

        const infoGroup = document.createElement('div') ; 
        infoGroup.className = "music-info-group" ;
        infoGroup.appendChild(title);
        infoGroup.appendChild(artist);


        info.appendChild(infoGroup);
        info.appendChild(musicPlay) ;


        musicItem.appendChild(thumbnail);
        musicItem.appendChild(info);
        return musicItem;
    },

    renderMusic() {
        this.musicList.innerHTML = "";
        this.musics.forEach((music, index) => {
            const el = this.createMusic(music, index);
            this.musicList.appendChild(el);
        });
        this.setCurrentMusic();
    },

    handlerOnTouchStart(e) {
        if (e.target.closest('.like') || e.target.closest('.dislike') || e.target.closest('.control-btn')) {
            return;
        }
        
        const target = e.target.closest(`[data-music-id="${this.currentIndex}"]`);
        if (!target) return;
        
        this.currentMusic = target;
        this.currentMusic.style.transition = "none" ; 
        this.dragging = true;
        this.currentPos = {
            x: this.getTouchX(e),
            deltaX: 0,
            deltaY: 40,
            scale: 1.06
        };
    },

    //Hàm gộp hiệu ứng
    handleButtonEffect(btn, status) {
        btn.style.transform = "scale(1.1)";
        btn.style.backgroundColor =   status === "like" ? "#00C897" : "#FF6B6B";
        btn.style.color = "#fff";

    },
    //Hàm kéo chuyển
    handlerOnTouchMove(e) {
        if (!this.dragging || !this.currentMusic) return;
        
        e.preventDefault();
        this.currentPos.deltaX = this.getTouchX(e) - this.currentPos.x;
        
        this.currentMusic.style.transition = "outline-color .2s";

        const rotate = (this.currentPos.deltaX / 190) * 15;
        this.currentPos.deltaX > 0 ? this.currentMusic.style.outlineColor = "green" : this.currentMusic.style.outlineColor = "red" ; 

        this.currentMusic.style.transform = 
            `translate(${this.currentPos.deltaX}px, ${-this.currentPos.deltaY}px) 
             rotate(${rotate}deg) scale(${this.currentPos.scale})`;

       if (rotate > 5) {
            this.currentMusic.style.outlineColor = "green";
        } else if (rotate < -5) {
            this.currentMusic.style.outlineColor = "red";
        } else {
            this.currentMusic.style.outlineColor = "transparent";
        }

           
    },

    //Hàm kéo kết thúc
    handlerOnTouchEnd(e) {
        if (!this.dragging || !this.currentMusic) return;
        
        this.dragging = false;
        const deltaX = this.getTouchX(e) - this.currentPos.x;

        if (Math.abs(deltaX) <= 50) {
            this.currentMusic.style.transition = "outline-color 0.2s, transform 0.2s ease";
            this.currentMusic.style.transform = "";
            this.currentMusic.style.outlineColor = "transparent";
            this.currentPos = {
                x: 0,
                deltaX: 0,
                deltaY: 40,
                scale: 1.06
            };
            return;
        }

        this.performSwipe(deltaX);
    },

    // Hàm bấm không kéo
    performSwipe(deltaX) {
        if (!this.currentMusic) return;

        const rotate = (deltaX / 190) * 15;
        
        this.currentMusic.style.transition = "opacity 0.3s, transform 0.3s";
        this.currentMusic.style.transform = 
            `translate(${deltaX}px, ${-this.currentPos.deltaY}px) 
             rotate(${rotate}deg) scale(${this.currentPos.scale})`;

        this.currentMusic.style.opacity = 0;
        
        if (rotate > 4) {
            this.currentMusic.style.outlineColor = "green";
           
        } else if (rotate < -4) {
           
            this.currentMusic.style.outlineColor = "red";
        }  else {
            this.currentMusic.style.outlineColor = "transparent";
        }

        this.stack.push(this.musics[this.currentIndex]);

        this.currentMusic.addEventListener('transitionend', () => {
            this.currentMusic.remove();
            this.currentPos = {
                x: 0,
                deltaX: 0,
                deltaY: 40,
                scale: 1.06
            };
        });

        setTimeout(() => {
            this.nextMusic();
        } , 400)
    },

    forceSwipe(deltaX) {
        if (!this.currentMusic || this.dragging) return;
        this.performSwipe(deltaX);
    },

    nextMusic() {
        this.isPlaying = true ;
        this.currentPlayAvatar.classList.remove("play-avatar") ;  
        if (this.currentIndex - 1 >= 0) {
            this.currentIndex = this.currentIndex - 1 ;
        } 
        else {
            this.currentIndex = this.currentIndex - 1 ;
            this.isPlaying = false ; 
            this.audio.pause() ; 
            return ;
        }
        this.setupMusic();
       
    },

    prevMusic() {
        this.isPlaying = true;
        this.currentPlayAvatar.classList.remove("play-avatar") ;  
        if (this.currentIndex < this.musics.length) {
            this.currentIndex = this.currentIndex + 1;
        } else {
            this.isPlaying = false;
            this.audio.pause();
            return;
        }
        this.setupMusic();
    },

    //Phát nhạc
    handlePlayPause() {
        if (this.currentIndex < 0 || this.currentIndex >= this.musics.length) return;
        if (this.audio.paused) {
            this.audio.play();
            this.currentPlayAvatar.classList.add("play-avatar") ;  
        } else {
            this.audio.pause();
            this.currentPlayAvatar.classList.remove("play-avatar") ;  
        }
    },

    //Prev lại
    handleBack(e) {
        e.preventDefault();
        e.stopPropagation(); //tránh bay qua nút khế bị tự tắt
        
        if (this.dragging) return;

        if(this.stack.length === 0) return ;  
        const stackItem = this.stack.pop(); 
        this.prevMusic();

        const returnMusic = this.createMusic(stackItem);
        returnMusic.dataset.musicId = this.currentIndex;

        this.musicList.appendChild(returnMusic);

    } ,

    handleRepeat(e) {
        e.preventDefault() ; 
        e.stopPropagation() ; 
        const repeat = e.target.closest('.repeat') ; 
        if(repeat) {
            this.isRepeat = !this.isRepeat ; 
            repeat.classList.toggle("active") ; 
        }
    } ,

    handleVolume(e) {
        e.preventDefault() ; 
        e.stopPropagation() ; 
        const volume = e.target.closest('.volume') ; 

      
        if(volume) {
            this.isStopVolume = !this.isStopVolume ; 
            if(this.isStopVolume) {
                this.btnVolumeIcon.classList.remove("fa-volume-high") ;
                this.btnVolumeIcon.classList.add("fa-volume-xmark") ;
                this.audio.volume = 0 ; 
            }else {
                this.btnVolumeIcon.classList.add("fa-volume-high") ;
                this.btnVolumeIcon.classList.remove("fa-volume-xmark") ;
                this.audio.volume = 0.75 ; 
            }
        }
    },
    handleShuffleMusic(e) {
        for (let i = this.musics.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.musics[i];
            this.musics[i] = this.musics[j];
            this.musics[j] = temp;
        }
        this.renderMusic() ; 
        this.currentIndex = this.musics.length - 1 ; 
        this.stack = [] ;
        this.setupMusic() ; 
    },
    // UpdateStyle thanh input range
    updateStyleRunnable() {
        const val = this.progress.value;
        progress.style.background = `linear-gradient(to right, #16161a ${val}%, #444 25%)`;
    },

    setupEventControls() {
        this.play.onclick = this.handlePlayPause.bind(this);
        this.btnRepeat.onclick = this.handleRepeat.bind(this) ;
        this.btnVolume.onclick = this.handleVolume.bind(this) ;
        this.btnBack.onclick = this.handleBack.bind(this) ; 
        this.btnShuffle.onclick = this.handleShuffleMusic.bind(this) ;

        this.audio.onplay = () => {
            this.isPlaying = true;
            this.playIcon.classList.remove("fa-play");
            this.playIcon.classList.add("fa-pause");
        };

        this.audio.onpause = () => {
            this.isPlaying = false;
            this.playIcon.classList.remove("fa-pause");
            this.playIcon.classList.add("fa-play");
        };
        ; 



        this.audio.ontimeupdate = () => {
            if (this.progress.seeking) return;
            const progressPercent = (this.audio.currentTime / this.audio.duration) *100;
            this.progress.value = progressPercent || 0;
            this.updateStyleRunnable() ; 
        };

        this.progress.onmousedown = () => {
            this.progress.seeking = true;
        };

        this.progress.onmouseup = () => {
            const targetPercent = +this.progress.value;
            const seekTime = (this.audio.duration / 100) * targetPercent;
            this.audio.currentTime = seekTime;
            this.updateStyleRunnable() ;
            this.progress.seeking = false;
        };

        this.audio.onended = () => {
            if(this.isRepeat) {
                this.audio.currentTime = 0 ; 
                setTimeout(() => {
                    this.audio.play() ; 
                },500)
                return ;
            }

            this.currentMusic.remove();
            this.stack.push(this.musics[this.currentIndex]);
            this.nextMusic();
        };
    },

    setCurrentMusic() {
        if (this.currentIndex >= 0) {
            setTimeout(() => {
                this.currentMusic = this.musicList.querySelector(`[data-music-id="${this.currentIndex}"]`);
                this.currentPlayAvatar = this.currentMusic.querySelector(".music-playAvatar") ;
                if (this.isPlaying) {
                    this.currentPlayAvatar.classList.add("play-avatar");
                } else {
                    this.currentPlayAvatar.classList.remove("play-avatar");
                }
            },500)
        } 

        this.audio.oncanplay = () => {
            if (this.isPlaying) {
                this.audio.play();
            }
        };
    },

    setupMusic() {
        if (this.currentIndex >= 0) {
            this.audio.src = this.musics[this.currentIndex].audio;
            this.setCurrentMusic();
        }
    },

    init() {
        this.musicList = document.querySelector('.music-list');
        this.btnVolume = document.querySelector('.control-btn.volume');
        this.btnVolumeIcon = document.querySelector('.control-btn.volume .fa-solid');
        this.btnRepeat = document.querySelector('.control-btn.repeat');
        this.btnShuffle = document.querySelector('.control-btn.shuffle')
        this.btnBack = document.querySelector('.control-btn.back') ; 
        
        this.progress = document.getElementById("progress");
        this.play = document.querySelector('.control-btn.play');
        this.playIcon = document.querySelector(".play-icon");
        this.audio = document.getElementById('audio');

        this.currentIndex = this.musics.length - 1;
        this.setupMusic();
        this.setupEventControls();
        this.renderMusic();
        
        document.addEventListener('touchstart', this.handlerOnTouchStart.bind(this));
        document.addEventListener('touchmove', this.handlerOnTouchMove.bind(this));
        document.addEventListener('touchend', this.handlerOnTouchEnd.bind(this));

        document.addEventListener('mousedown', this.handlerOnTouchStart.bind(this));
        document.addEventListener('mousemove', this.handlerOnTouchMove.bind(this));
        document.addEventListener('mouseup', this.handlerOnTouchEnd.bind(this));
    }
};

musicPlayer.init();