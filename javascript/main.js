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
        }
    ],
    currentMusic: null,
    currentIndex: 0,
    isPlaying: false,
    dragging: false,
    stack : [] , 
    currentPos: { x: 0, deltaX: 0, deltaY: 40, scale: 1.06 },

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

        info.appendChild(title);
        info.appendChild(artist);

        musicItem.appendChild(thumbnail);
        musicItem.appendChild(info);

        return musicItem;
    },

    resetButtons() {
        this.btnLike.style.transform = "scale(1)";
        this.btnDisLike.style.transform = "scale(1)";
        this.btnLike.style.backgroundColor = "#16161a";
        this.btnDisLike.style.backgroundColor = "#16161a";
        this.btnLike.style.color = "";
        this.btnDisLike.style.color = "";
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
        
        this.resetButtons();
        this.currentMusic.style.transition = "outline-color .2s";
        
        const rotate = (this.currentPos.deltaX / 190) * 15;
        this.currentPos.deltaX > 0 ? this.currentMusic.style.outlineColor = "green" : this.currentMusic.style.outlineColor = "red" ; 

        this.currentMusic.style.transform = 
            `translate(${this.currentPos.deltaX}px, ${-this.currentPos.deltaY}px) 
             rotate(${rotate}deg) scale(${this.currentPos.scale})`;

        if (rotate > 4) {
            this.handleButtonEffect(this.btnLike , "like") ;
        } else if (rotate < -4) {
            this.handleButtonEffect(this.btnDisLike , "dislike") ;
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
            this.resetButtons();
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
            this.btnLike.style.backgroundColor = "#00C897";
            this.btnLike.style.color = "#fff";

            this.currentMusic.style.outlineColor = "green";

        } else if (rotate < -4) {
            this.btnDisLike.style.backgroundColor = "#FF6B6B";
            this.btnDisLike.style.color = "#fff";

            this.currentMusic.style.outlineColor = "red";

        }  

        this.stack.push(this.musics[this.currentIndex]);

        this.currentMusic.addEventListener('transitionend', () => {
            this.currentMusic.remove();
            this.resetButtons();
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
        if (this.currentIndex <= this.musics.length) {
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
        } else {
            this.audio.pause();
        }
    },
    //Vote xem card music bay bên nào
    handleVote(direction) {
        return (e) => {
            e.preventDefault();
            e.stopPropagation(); //tránh bay qua nút khế bị tự tắt
            if (this.dragging || this.currentIndex < 0) return;

            this.forceSwipe(direction);
            this.audio.pause();
        };
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

    handleShuffleMusic(e) {
        for (let i = this.musics.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.musics[i];
            this.musics[i] = this.musics[j];
            this.musics[j] = temp;
        }
        this.renderMusic() ; 
        this.currentIndex = this.musics.length - 1 ; 
        this.setupMusic() ; 
    },
    // UpdateStyle thanh input range
    updateStyleRunnable() {
        const val = this.progress.value;
        progress.style.background = `linear-gradient(to right, #16161a ${val}%, #444 25%)`;
    },

    setupEventControls() {
        this.play.onclick = this.handlePlayPause.bind(this);
        this.btnLike.onclick = this.handleVote.call(this , 100);
        this.btnDisLike.onclick = this.handleVote.call(this , -100);
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
            this.currentMusic.remove();
            this.stack.push(this.musics[this.currentIndex]);
            this.nextMusic();
        };
    },

    setCurrentMusic() {
        if (this.currentIndex >= 0) {
            this.currentMusic = this.musicList.querySelector(`[data-music-id="${this.currentIndex}"]`);
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
        this.btnLike = document.querySelector('.like');
        this.btnDisLike = document.querySelector('.dislike');
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