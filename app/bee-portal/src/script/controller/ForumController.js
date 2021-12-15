import { ForumThread } from '../model/ForumThread.js'
import { CourseController } from './coursecontroller.js'
import { UserController } from './UserController.js'
import { ClassController } from './ClassController.js'
import { ForumReply } from '../model/ForumReply.js'
import { dialogs, yesNoDialogs } from '../util/Utility.js'
//singleton
export const ForumController = (function () {
  var instance
  function create() {
    return {
      getAllForumThread: function (classId) {
        return ForumThread.getAll(classId)
      },

      getForumThread: function (id) {
        return ForumThread.get(id)
      },

      getAllForumReply: function (forumId) {
        return ForumReply.getAll(forumId)
      },

      showForumDetailPage: async function (forumId, userId) {
        const forum = await this.getForumThread(forumId)

        let container = document.getElementById('container')
        let template = document.getElementById('forum-template')

        let clone = template.content.cloneNode(true)

        const c = await ClassController.getInstance().getClassById(forum.classId)
        clone.querySelector('#class-code').textContent = c.classCode

        const course = await CourseController.getInstance().getCourseById(c.courseCode)
        clone.querySelector('#course-name').textContent = course.courseCode + ' - ' + course.name

        const user = await UserController.getInstance().getUserById(forum.userId)
        clone.querySelector('#forum-user').textContent = user.name
        if (user.role == 'Lecturer') clone.querySelector('#forum-user').textContent += ' • Lecturer'

        clone.querySelector('#forum-title').textContent = forum.title

        clone.querySelector('#forum-content').textContent = forum.content

        clone.querySelector('#forum-date').textContent = new Date(forum.postDate.seconds * 1000).toLocaleString()
        // console.log(forum.postDate)

        let div = clone.querySelector('#manage-forum-div')
        if (userId == forum.userId) {
          div.querySelector('#delete-forum-btn').addEventListener('click', async () => {
            //reply" nya gak langsung ke delete
            this.deleteThread(forum.forumId)
          })
          div.querySelector('#update-forum-btn').addEventListener('click', async () => {
            // alert('click u')
            this.showUpdateForumForm(forum.forumId)
          })
        } else {
          div.remove()
        }

        if (!forum.isReplyHidden) {
          const replies = await this.getAllForumReply(forumId)
          replies.forEach(async (r) => {
            let replyContainer = clone.querySelector('#reply-container')
            let replyTemplate = clone.querySelector('#reply-template')
            let replyClone = replyTemplate.content.cloneNode(true)

            const u = await UserController.getInstance().getUserById(r.userId)

            replyClone.querySelector('#reply-user').textContent = u.name
            if (u.role == 'Lecturer') replyClone.querySelector('#reply-user').textContent += ' • Lecturer'
            replyClone.querySelector('#reply-date').textContent = new Date(r.replyDate.seconds * 1000).toLocaleString()
            replyClone.querySelector('#reply-content').textContent = r.content

            div = replyClone.querySelector('#manage-reply-div')
            if (userId == r.userId) {
              div.querySelector('#delete-reply-btn').addEventListener('click', async () => {
                // alert('delete click')
                this.deleteReply(r.replyId)
              })
              div.querySelector('#update-reply-btn').addEventListener('click', async () => {
                this.showUpdateReplyForm(r.replyId)
              })
            } else {
              div.remove()
            }

            replyContainer.appendChild(replyClone)
          })
        } else {
          let i = document.createElement('i')
          i.setAttribute('class', 'far fa-eye-slash mr-3')

          clone.getElementById('reply-lbl').textContent = 'Replies to this thread are hidden.'
          clone.getElementById('reply-lbl').prepend(i)
        }

        container.appendChild(clone)
        document.querySelector('#loading-spinner').remove()
      },

      insertReply: async function (forumId, userId, content) {
        if (content.length < 5) {
          dialogs.alert('Reply must be at least 5 characters!')
          return
        }
        const r = new ForumReply('', forumId, userId, content)

        const success = await r.insert()

        if (success) {
          dialogs.alert('Reply Success!', () => {
            location.reload()
          })
        } else {
          dialogs.alert('Reply error!')
        }

        return success
      },
      insertForumThread: async function (classId, userId, title, content, isReplyHidden) {
        if (title.length < 5) {
          dialogs.alert('Title must be at least 5 characters!')
          return
        }
        if (content.length < 5) {
          dialogs.alert('Content must be at least 5 characters!')
          return
        }
        const f = new ForumThread('', classId, userId, title, content, false, isReplyHidden)

        const success = await f.insert()

        if (success) {
          let c = await ClassController.getInstance().getClassById(classId)
          console.log(c)

          let u = await UserController.getInstance().getUserById(userId)

          // console.log(userId != c.lecturerId)
          if (userId != c.lecturerId) {
            UserController.getInstance().notify(u.name + ' has created a new Forum Thread on ' + c.classCode + ' - ' + c.courseCode, c.lecturerId)
          }

          c.studentIds.forEach((s) => {
            if (userId != s)
              UserController.getInstance().notify(u.name + ' has created a new Forum Thread on ' + c.classCode + ' - ' + c.courseCode, s)
            //  has replied to your forum thread on  -
          })

          dialogs.alert('Post Success!', () => {
            history.back()
          })
        } else {
          dialogs.alert('Post error!')
        }

        return success
      },
      showInsertForumPage: async function (classId) {
        const c = await ClassController.getInstance().getClassById(classId)
        const course = await CourseController.getInstance().getCourseById(c.courseCode)
        console.log(c.classCode)

        let container = document.getElementById('container')
        let template = document.getElementById('forum-template')

        let clone = template.content.cloneNode(true)

        clone.querySelector('#course-name').textContent = course.courseCode + ' - ' + course.name
        clone.querySelector('#class-code').textContent = c.classCode

        container.appendChild(clone)

        document.querySelector('#loading-spinner').remove()
      },
      deleteReply(replyId) {
        dialogs.confirm('Are you sure want to delete this reply?', async (conf) => {
          console.log(conf)
          if (conf) {
            let r = await ForumReply.get(replyId)
            if (r) {
              let success = await r.delete()
              if (success) {
                dialogs.alert('Delete Success!', () => {
                  location.reload()
                })
                return
              }
            }
            dialogs.alert('Delete failed!')
          }
        })
      },

      deleteThread(forumId) {
        dialogs.confirm('Are you sure want to delete this thread?', async (conf) => {
          console.log(conf)
          if (conf) {
            let f = await ForumThread.get(forumId)
            if (f) {
              let success = await f.delete()
              if (success) {
                dialogs.alert('Delete Success!', () => {
                  history.back()
                })
                return
              }
            }
            dialogs.alert('Delete failed!')
          }
        })
      },

      async showUpdateReplyForm(replyId) {
        let r = await ForumReply.get(replyId)

        dialogs.prompt('Update thread reply', r.content, async (text) => {
          if (text != null) {
            if (text.length < 5) {
              dialogs.alert('Content must be at least 5 characters')
            } else {
              r.content = text
              let success = await r.update()
              if (success) {
                dialogs.alert('Update success!', () => {
                  location.reload()
                })
              } else {
                dialogs.alert('Update error!')
              }
            }
          }
        })
      },
      async showUpdateForumForm(forumId) {
        let f = await ForumThread.get(forumId)

        dialogs.prompt('Update thread title', f.title, (title) => {
          if (title != null) {
            if (title.length < 5) {
              dialogs.alert('Title must be at least 5 characters')
            } else {
              f.title = title
              dialogs.prompt('Update thread content', f.content, (content) => {
                if (content != null) {
                  f.content = content

                  yesNoDialogs.confirm('Do you want to hide replies?', (hide) => {
                    f.isReplyHidden = hide ? true : false
                    dialogs.confirm('Confirm update?', async (conf) => {
                      if (conf) {
                        let success = await f.update()
                        if (success) {
                          dialogs.alert('Update success!', () => {
                            location.reload()
                          })
                        } else {
                          dialogs.alert('Update error!')
                        }
                      }
                    })
                  })
                }
              })
              // r.content = text
              // let success = await r.update()
              // if (success) {
              //   dialogs.alert('Update success!', () => {
              //     location.reload()
              //   })
              // } else {
              //   dialogs.alert('Update error!')
              // }
            }
          }
        })
      },
      // updateReply(replyId, content) {},
    }
  }

  return {
    getInstance: function () {
      if (!instance) instance = create()
      return instance
    },
  }
})()
