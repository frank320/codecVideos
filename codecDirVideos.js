/**
 * Created by Frank on 2017/7/1.
 * 批量转码一个文件下的所有视频
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
      for (let [index,video] of contentFiles.entries()) {
        await new Promise((resolve, reject)=> {
          const VideoPath = path.join(originalDir, video)
          if (isDir(VideoPath)) {
            console.log('目录下不能出现文件夹')
            return resolve('not file')
          }
          const videoName = getNoneExtFileName(video)

          //开始转码
          //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
          //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))

          new ffmpeg({source: VideoPath})
            .withVideoBitrate('512k')
            .size('1280x720')
            .withVideoCodec('libx264')
            .withAudioBitrate('96k')
            .audioCodec('aac')
            .audioFrequency(48000)
            .audioChannels(2)
            .saveToFile(path.join(bundleDir, `${videoName}.mp4`))
            .on('error', function (err) {
              console.log(`${bundleName}  ${videoName} 转码失败 (${index + 1}/${totalCount})====>${err}`)
              resolve('fail')
            })
            .on('end', function () {
              console.log(`${bundleName}  ${videoName} 转码成功  (${index + 1}/${totalCount})`)
              resolve('success')
            })
        })
      }
    } catch (e) {
      //overlook this fault
    }
    console.log(`${bundleName}  转码完毕`)
    console.log(`-----------------------------------------------`)
  }

  codecVideos()
  // 遍历转码
  //contentFiles.forEach(function (video) {
  //  const VideoPath = path.join(originalDir, video)
  //  if (isDir(VideoPath)) {
  //    return console.log('目录下不能出现文件夹')
  //  }
  //  const videoName = getNoneExtFileName(video)
  //
  //  //开始转码
  //  //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
  //  //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))
  //
  //  new ffmpeg({source: VideoPath})
  //    .withVideoBitrate('512k')
  //    .size('1280x?')
  //    .withVideoCodec('libx264')
  //    .withAudioBitrate('96k')
  //    .saveToFile(path.join(bundleDir, `${videoName}.mp4`))
  //    .on('error', function (err) {
  //      console.log(`${bundleName}  ${videoName} 转码失败====>${err}`)
  //    })
  //    .on('end', function () {
  //      console.log(`${bundleName}  ${videoName} 转码成功`)
  //    })
  //})
})()