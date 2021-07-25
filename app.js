const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chúng ta sau này',
            singer: 'T.R.I',
            path: './assets/music/ChungTaSauNay-TRI.mp3',
            image: './assets/img/chung-ta-cua-sau-nay.jpg'
        },
        {
            name: '3107 2',
            singer: 'Duongg Nâu Wn',
            path: './assets/music/31072LofiVersion-DuonggNauWn.mp3',
            image: './assets/img/31072.jpg'
        },
        {
            name: 'Cầu Hôn',
            singer: 'Hòa Minzy, Hứa Kim Tuyền',
            path: './assets/music/Cau-Hon-Hoa-Minzy-Hua-Kim-Tuyen-XHTDRLX.mp3',
            image: './assets/img/cau-hon.jpg'
        },
        {
            name: 'Cho mình em',
            singer: 'BINZ, Đen Vâu',
            path: './assets/music/Cho-Minh-Em-Binz-Den.mp3',
            image: './assets/img/cho-minh-em.jpg'
        },
        {
            name: 'Older',
            singer: 'Sasha Sloan',
            path: './assets/music/Older-Sasha-Sloan.mp3',
            image: './assets/img/older.jpg'
        },
        {
            name: 'Perfect two',
            singer: 'Auburn',
            path: './assets/music/Perfect-Two-Acoustic-Auburn.mp3',
            image: './assets/img/perfect-two.jpg'
        },
        {
            name: 'Vây giữ',
            singer: 'Vương Tinh Vãn Không Mập',
            path: './assets/music/VayGiu-VuongTinhVanKhongMap.mp3',
            image: './assets/img/vay-giu.jpg'
        },
        {
            name: 'Thời không sai lệch',
            singer: 'Ngải Thần',
            path: './assets/music/ThoiKhongSaiLech-NgaiThan.mp3',
            image: './assets/img/thoi-khong-sai-lech.jpg'
        },
        {
            name: 'Nếu ngày ấy',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/Neu-Ngay-Ay-SOOBIN.mp3',
            image: './assets/img/neu-ngay-ay.jpg'
        },
        {
            name: 'Em ơi',
            singer: 'Vũ Cát Tường',
            path: './assets/music/Em-Oi-Vu-Cat-Tuong-Hakoota-Dung-Ha.mp3',
            image: './assets/img/em-oi.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,  //1000 = 1s
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        //Xử lý phóng to / thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        //Xử lý khi lick play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Khi song được play 
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song paused 
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi speek song
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //Xử lý next btn
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý prev btn
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý random btn
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }

        }

        //Xử lý  repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);
        }

        //Xử lý lick song
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = +songNode.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    start: function () {

        //gán cấu hình từ config vào app
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();

        //lắng nghe /xử lý sự kiện
        this.handleEvents();

        //tải bài hát đầu tiên vào UI khi chạy ứng dúng
        this.loadCurrentSong();
        //render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của btnRepeat và rando
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.isRandom);
    }

}

app.start();
