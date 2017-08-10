## 青岛广电ffmpeg视频转码参数

```
.outputOptions([
        '-b 6000000',
        '-bf 2',
        '-r 25',
        '-maxrate 6000000',
        '-minrate 6000000',
        '-bufsize 6400000',
        '-muxrate 8000000',
        '-max_delay 800000',
        '-acodec copy',
        '-vcodec libx264',
        '-x264opts keyint=25:qcomp=1.0:nal-hrd=cbr:threads=3:sliced_threads:qpmin=15:aud:force-cfr'
      ])

```