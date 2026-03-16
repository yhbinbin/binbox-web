import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了以下路径：
  // - api (API 路由)
  // - _next (Next.js 内部路由)
  // - _vercel (Vercel 内部路由)
  // - 静态文件 (带扩展名的文件)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
