// server/routes/api/[...].js
import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. 获取运行时配置 (读取 public 下的 apiTarget)
  const config = useRuntimeConfig()
  const apiTarget = config.public.apiTarget

  // 2. 拼接目标 URL (例如 https://www.eztripcn.com/api/...)
  const target = apiTarget + event.path

  // 3. 转发请求
  return proxyRequest(event, target, {
    fetchOptions: {
      headers: {
        // 强制覆盖关键 Header，确保 Cloudflare 放行
        'Host': new URL(apiTarget).host,
        'Origin': apiTarget,
        'Referer': apiTarget + '/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
  })
})