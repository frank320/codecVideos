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
      "name": "冬爷爷来了",
      "id": "1498012351000"
    },
    {
      "name": "奇妙的我",
      "id": "1498012705000"
    },
    {
      "name": "落叶瓢飘",
      "id": "1498031602000"
    },
    {
      "name": "亲亲一家人",
      "id": "1498031722000"
    },
    {
      "name": "我上幼儿园啦",
      "id": "1498031867000"
    },
    {
      "name": "叭叭叭车来了",
      "id": "1498031970000"
    },
    {
      "name": "动物全家福",
      "id": "1498032034000"
    },
    {
      "name": "亲亲春姑娘",
      "id": "1498032125000"
    },
    {
      "name": "太阳火辣辣",
      "id": "1498032176000"
    },
    {
      "name": "谢谢你，帮助我",
      "id": "1498032291000"
    },
    {
      "name": "宠物列车",
      "id": "1498033208000"
    },
    {
      "name": "美食聚会",
      "id": "1498033538000"
    },
    {
      "name": "魔力小种子",
      "id": "1498033896000"
    },
    {
      "name": "小女巫交朋友",
      "id": "1498033967000"
    },
    {
      "name": "用品王国",
      "id": "1498034019000"
    },
    {
      "name": "交通海陆空",
      "id": "1498034086000"
    },
    {
      "name": "四季变变变",
      "id": "1498034138000"
    },
    {
      "name": "我家周围真热闹",
      "id": "1498034202000"
    },
    {
      "name": "小老鼠出海",
      "id": "1498034267000"
    },
    {
      "name": "走走走，去旅游",
      "id": "1498034321000"
    },
    {
      "name": "大声说爱",
      "id": "1498034380000"
    },
    {
      "name": "地球妈妈生病了",
      "id": "1498034439000"
    },
    {
      "name": "你好！电先生",
      "id": "1498034502000"
    },
    {
      "name": "我是健康小超人",
      "id": "1498034564000"
    },
    {
      "name": "远祖的朋友",
      "id": "1498034613000"
    },
    {
      "name": "长大真好",
      "id": "1498034658000"
    },
    {
      "name": "理财小达人",
      "id": "1498034736000"
    },
    {
      "name": "哇！机器人",
      "id": "1498035011000"
    },
    {
      "name": "向宇宙进发",
      "id": "1498035061000"
    },
    {
      "name": "小小气象员",
      "id": "1498035114000"
    },
    {
      "name": "信息大爆炸",
      "id": "1498035177000"
    },
    {
      "name": "再见，幼儿园",
      "id": "1498035227000"
    },
    {
      "name": "品格故事",
      "id": "1498035481000"
    },
    {
      "name": "英文儿歌",
      "id": "1498035576000"
    },
    {
      "name": "弟子规",
      "id": "1498035635000"
    },
    {
      "name": "三字经",
      "id": "1498035687000"
    },
    {
      "name": "生活习惯",
      "id": "1498035752000"
    },
    {
      "name": "唐诗",
      "id": "1498035896000"
    },
    {
      "name": "中文儿歌",
      "id": "1498035946000"
    },
    {
      "name": "睡前故事",
      "id": "1498036008000"
    },
    {
      "name": "神奇英语",
      "id": "1498036079000"
    },
    {
      "name": "孩子的周末",
      "id": "1498036220000"
    },
    {
      "name": "机构篇",
      "id": "1498036278000"
    },
    {
      "name": "家校关系",
      "id": "1498036334000"
    },
    {
      "name": "群访篇",
      "id": "1498036388000"
    },
    {
      "name": "人物篇",
      "id": "1498036462000"
    },
    {
      "name": "死亡教育",
      "id": "1498036513000"
    },
    {
      "name": "童言无忌",
      "id": "1498036570000"
    },
    {
      "name": "消费陷阱",
      "id": "1498036619000"
    },
    {
      "name": "叽里呱啦英语",
      "id": "1498036725000"
    },
    {
      "name": "巴布熊猫",
      "id": "1498036832000"
    },
    {
      "name": "巴布熊猫成语系列",
      "id": "1498036883000"
    },
    {
      "name": "up喵植物科普",
      "id": "1498037583000"
    },
    {
      "name": "木灵宝贝之重回帆智谷",
      "id": "1498037662000"
    },
    {
      "name": "木奇灵之绿影战灵",
      "id": "1498037715000"
    },
    {
      "name": "公益剧第二季",
      "id": "1498037809000"
    },
    {
      "name": "公益剧第三季",
      "id": "1498037853000"
    },
    {
      "name": "公益剧第一季",
      "id": "1498037901000"
    },
    {
      "name": "贺岁篇",
      "id": "1498037959000"
    },
    {
      "name": "社会主义核心价值观",
      "id": "1498038151000"
    },
    {
      "name": "童谣第二季",
      "id": "1498038324000"
    },
    {
      "name": "童谣第一季",
      "id": "1498038375000"
    },
    {
      "name": "文明旅游",
      "id": "1498038446000"
    },
    {
      "name": "雾霾篇",
      "id": "1498038501000"
    },
    {
      "name": "MOMOKING素质早教微课",
      "id": "1498039671000"
    },
    {
      "name": "毛毛王历险记",
      "id": "1498040023000"
    },
    {
      "name": "毛毛王星球寻宝",
      "id": "1498040082000"
    },
    {
      "name": "毛毛王之空间超能力",
      "id": "1498040124000"
    },
    {
      "name": "小小大英雄毛毛王",
      "id": "1498040169000"
    },
    {
      "name": "科学小子席德",
      "id": "1498040237000"
    },
    {
      "name": "1-2年级英语单词",
      "id": "1498040319000"
    },
    {
      "name": "3-4年级英语单词",
      "id": "1498040365000"
    },
    {
      "name": "5-6年级英语单词",
      "id": "1498040409000"
    },
    {
      "name": "趣学英文儿歌",
      "id": "1498040471000"
    },
    {
      "name": "教育中父母该如何配合",
      "id": "1498040555000"
    },
    {
      "name": "理解3-6岁孩子的成长",
      "id": "1498040618000"
    },
    {
      "name": "进击的机甲-圣戒飞陀",
      "id": "1498040663000"
    },
    {
      "name": "洛克王国大冒险1",
      "id": "1498040723000"
    },
    {
      "name": "洛克王国大冒险2-恩佐日记",
      "id": "1498040777000"
    },
    {
      "name": "童子传奇",
      "id": "1498040842000"
    },
    {
      "name": "童子传奇之大闹招财岛",
      "id": "1498040902000"
    },
    {
      "name": "童子传奇之招财岛总动员",
      "id": "1498040961000"
    },
    {
      "name": "蓝猫典典环游记",
      "id": "1499078259000"
    },
    {
      "name": "咪咪找妈妈",
      "id": "1499078340000"
    },
    {
      "name": "太阳城的故事",
      "id": "1499078402000"
    },
    {
      "name": "星史传说",
      "id": "1499078644000"
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

