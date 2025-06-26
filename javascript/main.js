const musicPlayer = {
    musics: [
        {
            id: 1,
            img: "./images/image1.jpg",
            title: "交界-伴奏",
            artist: "陈嘉杰＆陳嘉傑",
            audio: "./audios/audio1.mp3"
        },
        {
            id: 2,
            img: "./images/image2.jpg",
            title: "Blinding Lights",
            artist: "The Weeknd",
            audio: "./audios/audio2.mp3"
        },
        {
            id: 3,
            img: "./images/image3.jpg",
            title: "不入名贤传",
            artist: "Dua Lipa",
            audio: "./audios/audio3.mp3"
        },
        {
            id: 4,
            img: "./images/image4.jpg",
            title: "不做你的朋友",
            artist: "高旭-FelixBennett",
            audio: "./audios/audio4.mp3"
        }
    ],
    liked: [],
    disliked: [],
    currentMusic: null,
    currentIndex: 0,
    isPlaying: false,
    dragging: false,
    queue : [] , 
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
        this.dragging = true;
        this.currentPos = {
            x: this.getTouchX(e),
            deltaX: 0,
            deltaY: 40,
            scale: 1.06
        };
    },

    handlerOnTouchMove(e) {
        if (!this.dragging || !this.currentMusic) return;
        
        e.preventDefault();
        this.currentPos.deltaX = this.getTouchX(e) - this.currentPos.x;
        
        this.resetButtons();
        this.currentMusic.style.transition = "none";
        
        const rotate = (this.currentPos.deltaX / 190) * 15;
        this.currentMusic.style.transform = 
            `translate(${this.currentPos.deltaX}px, ${-this.currentPos.deltaY}px) 
             rotate(${rotate}deg) scale(${this.currentPos.scale})`;

        if (rotate > 4) {
            this.btnLike.style.transform = "scale(1.1)";
            this.btnLike.style.backgroundColor = "#00C897";
            this.btnLike.style.color = "#fff";
            this.currentMusic.style.outlineColor = "green";
        } else if (rotate < -4) {
            this.btnDisLike.style.transform = "scale(1.1)";
            this.btnDisLike.style.backgroundColor = "#FF6B6B";
            this.btnDisLike.style.color = "#fff";
            this.currentMusic.style.outlineColor = "red";
        } else {
            this.currentMusic.style.outlineColor = "transparent";
        }
    },

    handlerOnTouchEnd(e) {
        if (!this.dragging || !this.currentMusic) return;
        
        this.dragging = false;
        const deltaX = this.getTouchX(e) - this.currentPos.x;

        if (Math.abs(deltaX) <= 50) {
            this.currentMusic.style.transition = "outline-color 0.2s, transform 0.2s ease";
            this.currentMusic.style.transform = "";
            this.currentMusic.style.outlineColor = "transparent";
            this.resetButtons();
            return;
        }

        this.performSwipe(deltaX);
    },

    performSwipe(deltaX) {
        if (!this.currentMusic) return;

        const rotate = (deltaX / 190) * 15;
        
        this.currentMusic.style.transition = "opacity 0.3s, transform 0.3s";
        this.currentMusic.style.transform = 
            `translate(${deltaX}px, ${-this.currentPos.deltaY}px) 
             rotate(${rotate}deg) scale(${this.currentPos.scale})`;
        this.currentMusic.style.opacity = 0;

        const music = this.musics[this.currentIndex];
        
        
        if (rotate > 4) {
            this.btnLike.style.transform = "scale(1.1)";
            this.btnLike.style.backgroundColor = "#00C897";
            this.btnLike.style.color = "#fff";
            this.currentMusic.style.outlineColor = "green";
        } else if (rotate < -4) {
            this.btnDisLike.style.transform = "scale(1.1)";
            this.btnDisLike.style.backgroundColor = "#FF6B6B";
            this.btnDisLike.style.color = "#fff";
            this.currentMusic.style.outlineColor = "red";
        } else {
            this.currentMusic.style.outlineColor = "transparent";
        }
        this.queue.push(this.musics[this.currentIndex]);

        console.log(this.queue) ; 
        this.currentMusic.ontransitionend = () => {
            this.currentMusic.remove();
            this.resetButtons();
        };
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
            this.isPlaying = false ; 
            this.audio.pause() ; 
            return ;
        }
        this.setupMusic();
       
    },

    handlePlayPause() {
        if (this.currentIndex < 0 || this.currentIndex >= this.musics.length) return;
        
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    },

    handleLike(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.dragging) return; 
        this.forceSwipe(150);
        this.audio.pause() ; 
    },

    handleDislike(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.dragging) return; 
        this.forceSwipe(-150);
        this.audio.pause() ; 
    },

    handleBack(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.dragging) return; 
        const queIdx = this.queue.length - 1 ; 
        const queueItem = this.queue[queIdx];

       
        const returnMusic = this.createMusic(queueItem);

        this.queue.splice(queIdx, 1);
        returnMusic.dataset.musicId = this.currentIndex + 1;
        this.currentIndex++;
        this.musicList.appendChild(returnMusic);
    } ,
    setupEventControls() {
        this.play.onclick = this.handlePlayPause.bind(this);
        this.btnLike.onclick = this.handleLike.bind(this);
        this.btnDisLike.onclick = this.handleDislike.bind(this);
        this.btnBack.onclick = this.handleBack.bind(this) ; 

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

        this.audio.onended = () => {
            this.currentMusic.remove();
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
        this.btnBack = document.querySelector('.control-btn.back') ; 
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