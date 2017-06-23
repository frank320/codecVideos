/**
 * Created by wikeLi on 2017/6/21.
 */
/**
 * Created by Frank on 2017/5/29.
 * 批量视频抽帧
 * originalDir: 目录层级 originalDir(剧集)/单个视频文件夹/视频文件+[海报]
 * imgDir：存放抽帧后的图片目录
 * node环境(6.x及以上)运行  node app.js  originalDir imgDir
 */
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
  ;
(function () {

  const args = process.argv.splice(2)
  const originalDir = args[0] //源文件目录
  const imgDir = args[1] || __dirname//存放图片目录
  if (!fs.existsSync(originalDir)) {
    console.log('请正确输入需要抽帧的视频所在目录文件夹名称')
    return
  }

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


  const bundleFiles = fs.readdirSync(originalDir) //获取源目录所有文件名


  //创建一个存放图片的剧集文件夹
  const bundleName = /\\([^\\]+)$/.exec(originalDir)[1]
  const imgBundleFolder = path.join(imgDir, bundleName)
  if (!fs.existsSync(imgBundleFolder)) {
    fs.mkdirSync(imgBundleFolder)
  }

  bundleFiles.forEach(function (videoDir) {
    const VideoDirPath = path.join(originalDir, videoDir)
    if (!isDir(VideoDirPath)) {

      return
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
      return
    }

    //set the ffmpeg, ffprobe and flvtool2/flvmeta binary paths manually by using the following API commands:
    ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
    ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))
    //ffmpeg.setFlvtoolPath('ffplay.exe')
    //抽帧
    const imgName = `${videoDir}_${videoName}.jpg`
    ffmpeg(videoFilePath)
      .on('filenames', function (filenames) {
        //console.log('Will generate ' + filenames.join(', '))
      })
      .on('end', function () {
        console.log('video: ' + videoName + ' 抽帧成功');
      })
      .on('error', function (err) {
        console.log('an error happened: ' + err.message + ' => video:' + videoName + ' 抽帧失败');
      })
      .screenshots({
        count: 1,
        timestamps: ['60%'],
        filename: imgName,
        folder: imgBundleFolder,
        size: '350x200'
      })
  })


})()