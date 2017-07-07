/**
 * Created by frank on 2017/6/13.
 * 视频转码
 * 操作  当前目录下打开控制台(cmd)输入  node transferVideo.js 待转码剧集目录名称 转码后视频存放目录名称
 */


;
(function () {
  const ffmpeg = require('fluent-ffmpeg')
  const path = require('path')
  const fs = require('fs')
  //常用方法
  function isDir(pathName) {//pathName为文件的绝对路径
    const stat = fs.lstatSync(pathName)
    return stat.isDirectory()
  }

  function isImg(fileName) {
    return /\.(jpg|png|gif|jepg)$/i.test(fileName)
  }

  //获取无后缀文件名
  function getNoneExtFileName(fileName) {
    return /(.+)\.\w+$/.exec(fileName)[1]
  }


  const args = process.argv.splice(2)
  const originalDir = args[0] //源视频文件目录
  const targetDir = args[1] //存放转码后的文件目录

  if (args.length !== 2 || !fs.existsSync(originalDir) || !fs.existsSync(targetDir)) {
    console.log('请输入正确的文件路径')
    return
  }


  const contentFiles = fs.readdirSync(originalDir)
  const bundleName = /\\([^\\]+)$/.exec(originalDir)[1]
  const totalCount = contentFiles.length
  //创建存放转码之后的剧集文件夹
  const bundleDir = path.join(targetDir, bundleName)
  if (!fs.existsSync(bundleDir)) {
    fs.mkdirSync(bundleDir)
  }

  //使用async函数控制流程 即 处理完一个视频后再处理下一个视频
  async function codecVideos() {
    try {
      for (let [index,videoDir] of contentFiles.entries()) {
        await new Promise(resolve=> {
          const VideoDirPath = path.join(originalDir, videoDir)
          if (!isDir(VideoDirPath)) {
            //拷贝剧集海报
            fs.writeFileSync(path.join(bundleDir, videoDir), fs.readFileSync(VideoDirPath))
            console.log(`${bundleName} 海报拷贝成功 (${index + 1}/${totalCount})`)
            return resolve('not dir')
          }
          //读取视频文件夹下的视频文件
          const videoFiles = fs.readdirSync(VideoDirPath)
          var videoFilePath = null
          var videoName = null
          if (videoFiles.length === 1) {
            //只有视频 直接抽帧
            videoFilePath = path.join(VideoDirPath, videoFiles[0])
            videoName = getNoneExtFileName(videoFiles[0])
          }
          if (videoFiles.length === 2) {
            //若有海报
            const video = isImg(videoFiles[0]) ? videoFiles[1] : videoFiles[0]
            videoFilePath = path.join(VideoDirPath, video)
            videoName = getNoneExtFileName(video)
          }
          if (!videoFilePath) {
            console.log(bundleDir + videoDir + '视频文件不存在')
            return resolve('no exist file')
          }

          //创建存放单个视频的文件夹
          const saveVideoDir = path.join(bundleDir, videoDir)
          if (!fs.existsSync(saveVideoDir)) {
            fs.mkdirSync(saveVideoDir)
          }

          //开始转码
          //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
          //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))

          new ffmpeg({source: videoFilePath})
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
              '-x264opts keyint=25:qcomp=1.0:nal-hrd=cbr:threads=3:sliced_threads:qpmin=15:aud:force-cfr',
              '-acodec mp2',
              '-ar 48000',
              '-b:a 192k'
            ])
            .saveToFile(path.join(saveVideoDir, `${videoName}.ts`))
            .on('error', function (err) {
              console.log(`${bundleName} 第${videoDir}集 ${videoName} 转码失败 (${index + 1}/${totalCount})====>${err}`)
              resolve('fail')
            })
            .on('end', function () {
              console.log(`${bundleName} 第${videoDir}集 ${videoName} 转码成功  (${index + 1}/${totalCount})`)
              resolve('success')
            })
        })
      }

    } catch (e) {
      //over look error
    }
    console.log(`${bundleName}  转码完毕`)
    console.log(`-----------------------------------------------`)
  }

  codecVideos()
  // 遍历转码
  //contentFiles.forEach(function (videoDir) {
  //  const VideoDirPath = path.join(originalDir, videoDir)
  //  if (!isDir(VideoDirPath)) {
  //    //拷贝剧集海报
  //    fs.writeFileSync(path.join(bundleDir, videoDir), fs.readFileSync(VideoDirPath))
  //    return
  //  }
  //
  //  //读取视频文件夹下的视频文件
  //  const videoFiles = fs.readdirSync(VideoDirPath)
  //  var videoFilePath = null
  //  var videoName = null
  //  if (videoFiles.length === 1) {
  //    //只有视频 直接抽帧
  //    videoFilePath = path.join(VideoDirPath, videoFiles[0])
  //    videoName = getNoneExtFileName(videoFiles[0])
  //  }
  //  if (videoFiles.length === 2) {
  //    //若有海报
  //    const video = isImg(videoFiles[0]) ? videoFiles[1] : videoFiles[0]
  //    videoFilePath = path.join(VideoDirPath, video)
  //    videoName = getNoneExtFileName(video)
  //  }
  //  if (!videoFilePath) {
  //    console.log(bundleDir + videoDir + '视频文件不存在')
  //    return
  //  }
  //
  //  //创建存放单个视频的文件夹
  //  const saveVideoDir = path.join(bundleDir, videoDir)
  //  if (!fs.existsSync(saveVideoDir)) {
  //    fs.mkdirSync(saveVideoDir)
  //  }
  //
  //  //开始转码
  //  //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
  //  //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))
  //
  //
  //  new ffmpeg({source: videoFilePath})
  //    .withVideoBitrate('8000k')
  //    .withVideoCodec('mpeg2video')
  //    .withAudioBitrate('192k')
  //    //.withAudioCodec('aac')
  //    .duration(1)
  //    .outputOptions(['-vtag DIVX'])
  //    .saveToFile(path.join(saveVideoDir, `${videoName}.ts`))
  //    .on('error', function (err) {
  //      console.log(`${bundleName} 第${videoDir}集 ${videoName} 转码失败====>${err}`)
  //    })
  //    .on('end', function () {
  //      console.log(`${bundleName} 第${videoDir}集 ${videoName} 转码成功`)
  //    })
  //})
})()

