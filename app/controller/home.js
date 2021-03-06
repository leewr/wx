'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
  	const { ctx, service, app } = this
	const agent = ctx.request['headers']['user-agent'].toLowerCase()
  	if (agent.match(/iphone|ipod|ipad|android/)) {
		if (app.config.env == 'local') {
			await ctx.redirect('http://localhost:3000')
		} else {
			await ctx.redirect('http://m.leewr.com')
		}
		return
  	} else {
  		const topis = await service.topic.getArticleList()
    	await this.ctx.render('home/index.tpl', {data: topis.list})
  	}
  }
}

module.exports = HomeController;
