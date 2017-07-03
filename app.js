/**
 * Created by Frank on 2017/5/29.
 * 批量视频抽帧
 * originalDir: 目录层级 originalDir/剧集文件夹/单个视频文件夹/视频文件+[海报]
 * node app.js originalDir imgDir
 */
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
  ;
(function () {

  const args = process.argv.splice(2)
  const originalDir = args[0] //源文件目录
  const imgDir = args[1] || __dirname//存放图片目录
  if (!originalDir) {
    console.log('请输入需要抽帧的视频所在目录文件夹名称')
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

  //创建一个存放剧集海报的文件夹
  const BundlePosterFolder = path.join(imgDir, 'bundlePosters')
  if (!fs.existsSync(BundlePosterFolder)) {
    fs.mkdirSync(BundlePosterFolder)
  }

  const bundles = fs.readdirSync(originalDir) //获取源目录所有文件名
  async function screenShot() {
    try {
      for (let bundleDir of  bundles) {
        const bundleDirPath = path.join(originalDir, bundleDir)
        if (!isDir(bundleDirPath)) return
        //读取每个剧集的文件
        const bundleFiles = fs.readdirSync(bundleDirPath)

        //创建一个存放图片的剧集文件夹
        const imgBundleFolder = path.join(imgDir, bundleDir)
        if (!fs.existsSync(imgBundleFolder)) {
          fs.mkdirSync(imgBundleFolder)
        }

        //使用async函数控制流程 即 处理完一个视频后再处理下一个视频
        async function bundleVideoScreenShot(bundleFiles) {
          try {
            for (let videoDir of bundleFiles) {
              await new Promise(resolve=> {
                const VideoDirPath = path.join(bundleDirPath, videoDir)
                if (!isDir(VideoDirPath)) {
                  //拷贝剧集海报
                  fs.writeFileSync(path.join(BundlePosterFolder, videoDir), fs.readFileSync(VideoDirPath))
                  return resolve('success')
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
                  return resolve('success')
                }

                //set the ffmpeg, ffprobe and flvtool2/flvmeta binary paths manually by using the following API commands:
                //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
                //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))
                //ffmpeg.setFlvtoolPath('ffplay.exe')
                //抽帧
                const imgName = `${videoDir}_${videoName}.jpg`
                ffmpeg(videoFilePath)
                  .on('filenames', function (filenames) {
                    //console.log('Will generate ' + filenames.join(', '))
                  })
                  .on('end', function () {
                    console.log(videoName + ' 抽帧成功')
                    resolve('success')
                  })
                  .on('error', function (err) {
                    console.log('an error happened: ' + err.message + ' =>' + videoName + ' 抽帧失败')
                    resolve('fail')
                  })
                  .screenshots({
                    count: 1,
                    timestamps: ['40%'],
                    filename: imgName,
                    folder: imgBundleFolder,
                    size: '350x200'
                  })
              })
            }
          } catch (e) {
            //overlook error

          }
          console.log(`剧集:${bundleDir} 处理完毕！！！`)
          console.log('')
        }

        //处理单个剧集下的视频
        await bundleVideoScreenShot(bundleFiles)
      }
    } catch (e) {
      //overlook error
    }

    console.log(`${originalDir} 目录下所有视频处理完毕`)
  }

  screenShot()
  //bundles.forEach(function (bundleDir) {
  //
  //
  //  const bundleDirPath = path.join(originalDir, bundleDir)
  //  if (!isDir(bundleDirPath)) return
  //
  //  //读取每个剧集的文件
  //  const bundleFiles = fs.readdirSync(bundleDirPath)
  //
  //  //创建一个存放图片的剧集文件夹
  //  const imgBundleFolder = path.join(imgDir, bundleDir)
  //  if (!fs.existsSync(imgBundleFolder)) {
  //    fs.mkdirSync(imgBundleFolder)
  //  }
  //

  //bundleFiles.forEach(function (videoDir) {
  //  const VideoDirPath = path.join(bundleDirPath, videoDir)
  //  if (!isDir(VideoDirPath)) {
  //    //拷贝剧集海报
  //    fs.writeFileSync(path.join(BundlePosterFolder, videoDir), fs.readFileSync(VideoDirPath))
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
  //  //set the ffmpeg, ffprobe and flvtool2/flvmeta binary paths manually by using the following API commands:
  //  //ffmpeg.setFfmpegPath(path.join(__dirname, './ffmpeg/ffmpeg.exe'))
  //  //ffmpeg.setFfprobePath(path.join(__dirname, './ffmpeg/ffprobe.exe'))
  //  //ffmpeg.setFlvtoolPath('ffplay.exe')
  //  //抽帧
  //  const imgName = `${videoDir}_${videoName}.jpg`
  //  ffmpeg(videoFilePath)
  //    .on('filenames', function (filenames) {
  //      //console.log('Will generate ' + filenames.join(', '))
  //    })
  //    .on('end', function () {
  //      console.log('video: ' + videoName + ' 抽帧成功');
  //    })
  //    .on('error', function (err) {
  //      console.log('an error happened: ' + err.message + ' => video:' + videoName + ' 抽帧失败');
  //    })
  //    .screenshots({
  //      count: 1,
  //      timestamps: ['40%'],
  //      filename: imgName,
  //      folder: imgBundleFolder,
  //      size: '350x200'
  //    })
  //})
  //})
})()