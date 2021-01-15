function getPostData(ctx) {
  // 获取异步 post 的提交数据
  return new Promise((resolve, reject) => {
    try {
      let str = ''
      ctx.req.on('data', (dataChunk) => {
        str += dataChunk
      })
      ctx.req.on('end', () => {
        resolve(str)
      })
    } catch (error) {
      reject(error)
    }
  })
}


exports.getPostData = getPostData