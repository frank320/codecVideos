## 天津视频ffmpeg转码参数

```
                  .videoBitrate('6800k')
                  .videoCodec('libx264')
                  .fps(25)
                  .audioBitrate('192k')
                  .audioCodec('mp2')
                  .audioFrequency(48000)
                  .outputOptions(['-keyint_min 50'])//设置最小关键帧间距

```

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
            '-vcodec libx264',
            '-x264opts keyint=50:qcomp=1.0:nal-hrd=cbr:threads=3:sliced_threads:qpmin=15:aud:force-cfr:b-pyramid=none',
            '-acodec mp2',
            '-ar 48000',
            '-b:a 192k'
          ])


```