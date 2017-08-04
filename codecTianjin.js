/**
 * Created by frank on 2017/7/7.
 * 转码天津视频
 */
/**
 * Created by Frank on 2017/5/29.
 * 批量视频转码
 * originalDir: 目录层级 originalDir/剧集文件夹/单个视频文件夹/视频文件+[海报]
 * node app.js originalDir imgDir
 */
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
  ;
//剧集元数据
const bundleMeta = [
    {
      "name": "孩子的周末",
      "id": "1501491822000"
    },
    {
      "name": "机构篇",
      "id": "1501491909000"
    },
    {
      "name": "家校关系",
      "id": "1501491984000"
    },
    {
      "name": "健康成长",
      "id": "1501492028000"
    },
    {
      "name": "节日篇",
      "id": "1501492075000"
    },
    {
      "name": "群访篇",
      "id": "1501492116000"
    },
    {
      "name": "人物篇",
      "id": "1501492161000"
    },
    {
      "name": "童言无忌",
      "id": "1501492204000"
    },
    {
      "name": "消费陷阱",
      "id": "1501492256000"
    },
    {
      "name": "有养",
      "id": "1501492297000"
    }
  ]


  ;
(function () {

  const args = process.argv.splice(2)
  const originalDir = args[0] //源文件目录
  const targetDir = args[1] || __dirname//存放图片目录
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


  const bundles = fs.readdirSync(originalDir) //获取源目录所有文件名
  async function codecBundles() {
    try {
      for (let bundleDir of  bundles) {
        //获取剧集id
        const bundleObj = bundleMeta.find(v=>v.name === bundleDir)
        if (!bundleObj) {
          console.log('=========================================')
          console.log(`剧集${bundleDir}id值不存在`)
          console.log('=========================================')
          continue
        }
        const bundleId = bundleObj.id
        const bundleDirPath = path.join(originalDir, bundleDir)
        if (!isDir(bundleDirPath)) {
          console.log(`${bundleDir}文件夹`)
          continue
        }
        //读取每个剧集的文件
        const contentFiles = fs.readdirSync(bundleDirPath)
        const totalCount = contentFiles.length
        //创建一个存放剧集文件夹
        const bundleFolder = path.join(targetDir, bundleDir)
        const saveVideoDir = path.join(bundleFolder, 'TXJY' + bundleId)
        if (!fs.existsSync(bundleFolder)) {
          fs.mkdirSync(bundleFolder)
        }
        if (!fs.existsSync(saveVideoDir)) {
          fs.mkdirSync(saveVideoDir)
        }
        //使用async函数控制流程 即 处理完一个视频后再处理下一个视频
        async function codecVideos(contentFiles) {
          try {
            for (let [index,videoDir] of contentFiles.entries()) {
              await new Promise(resolve=> {
                const VideoDirPath = path.join(bundleDirPath, videoDir)
                if (!isDir(VideoDirPath)) {
                  //拷贝剧集海报
                  fs.writeFileSync(path.join(bundleFolder, videoDir), fs.readFileSync(VideoDirPath))
                  console.log(`${bundleDir} 海报拷贝成功 (${index + 1}/${totalCount})`)
                  return resolve('not dir')
                }
                //读取视频文件夹下的视频文件
                const videoFiles = fs.readdirSync(VideoDirPath)
                var videoFilePath = null
                var videoName = null
                if (videoFiles.length === 1) {
                  //只有视频
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
                //以集数命名单个视频 如001 002
                const singleVideoName = (1000 + parseInt(videoDir) + '').slice(1)
                //创建存放单个视频的文件夹
                //const saveVideoDir = path.join(BundleFolder, videoDir)
                //if (!fs.existsSync(saveVideoDir)) {
                //  fs.mkdirSync(saveVideoDir)
                //}

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
                    '-x264opts keyint=50:qcomp=1.0:nal-hrd=cbr:threads=3:sliced_threads:qpmin=15:aud:force-cfr:b-pyramid=none',
                    '-acodec mp2',
                    '-ar 48000',
                    '-b:a 192k'
                  ])
                  .saveToFile(path.join(saveVideoDir, `${singleVideoName}.ts`))
                  .on('error', function (err) {
                    console.log(`${bundleDir} 第${videoDir}集 ${videoName} 转码失败 (${index + 1}/${totalCount})====>${err}`)
                    resolve('fail')
                  })
                  .on('end', function () {
                    console.log(`${bundleDir} 第${videoDir}集 ${videoName} 转码成功  (${index + 1}/${totalCount})`)
                    resolve('success')
                  })
              })
            }

          } catch (e) {
            //over look error
          }
          console.log(`${bundleDir}  转码完毕`)
          console.log(`-----------------------------------------------`)
        }

        //处理单个剧集下的视频
        await codecVideos(contentFiles)
      }
    } catch (e) {
      //overlook error
    }

    console.log(`${originalDir} 目录下所有视频处理完毕`)
  }

  codecBundles()
})()
