/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blow.ru',  // твой домен
  generateRobotsTxt: true,     // создаст robots.txt
  sitemapSize: 5000,           // разбивка sitemap при >5000 страницах
  changefreq: 'daily',
  priority: 0.7,
  outDir: 'public',            // куда положить файлы
};
