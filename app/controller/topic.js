const Controller = require('egg').Controller

class TopicController extends Controller {
  // 创建文章
  async create() {
    const { ctx, config } = this
    await ctx.render('/topic/add.tpl', {
      tabs: config.tabs
    })
  }

  // 文章展示
  async view() {
    const { ctx, service } = this
    const id = ctx.params.id
    const topic = await service.topic.getArticleById(id)
    console.log('view topic: ' + topic)
    await ctx.render('/topic/view.tpl', { data: topic})
  }

  // 文章修改展示
  async edit() {
    const { ctx, service } = this
    const id = ctx.params.id
    const topic = await service.topic.getArticleById(id)
    await ctx.render('/topic/edit.tpl', { data: topic})
  }

  async update() {
    const { ctx, service, config } = this
    let { id, title, tab, content } = ctx.request.body
    const topic = await service.topic.getArticleById(id)
    console.log('topicId: ' + topic.id)
    if (!topic) {
      ctx.status = 404
      ctx.message = '此话题不存在或已被删除'
      return
    }
    // 当user 为管理员的时候有权修改
    if (topic.authorId.toString() === ctx.user.id.toString()) {
      title = title.trim()
      tab = tab.trim()
      content = content.trim()
      // 验证
      let editError
      if (title === '') {
        editError = '标题不能为空'
      } else if (title.length < 5 || title.length > 100) {
        editError = '标题字数太多或太少'
      } else if (!tab) {
        editError = '必须选择一个版块。'
      } else if (content === '') {
        editError = '内容不能为空'
      }

      if (editError) {
        console.log('edit_error:' + editError)
        await ctx.redirect('/topic/note/'+id, {
          action: 'edit',
          edit_error: editError,
          topic_id: topic.id,
          content,
          tabs: config.tabs
        })
        return
      }

      // 保存话题
      await service.topic.save(
        id,
        title,
        content,
        tab
      )

      ctx.redirect('/topic/' + topic.id)
    } else {
      ctx.status = 403
      ctx.message = '对不起，你不能编辑此话题'
    }
  }

  
  // 发表主题帖
  async put() {
    const { ctx, service } = this
    const { tabs } = this.config
    const { body } = ctx.request
    const allTabs = tabs.map( item => item[0])
    // 内容验证
    console.log(allTabs)
    const RULE_CREATE = {
      title: {
        type: 'string',
        max: 100,
        min: 5
      },
      content: {
        type: 'string'
      },
      tab: {
        type: 'enum',
        values: allTabs
      }
    }
    const validate = ctx.validate(RULE_CREATE, ctx.request.body)
    if (!validate) {

    }
    // 数据库保存
    const topic = await service.topic.newAndSave(
      body.title,
      body.content,
      body.tab,
      ctx.user.id
    )
    console.log('topic: '+ topic)
    // 增加用户帖子发表数量 increaseArticleCount
    await service.user.increaseArticleCount(ctx.user.id, 5, 1)
    await ctx.render('/topic/'+ topic.insertId)
  }
}

module.exports = TopicController