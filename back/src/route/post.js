//підключаємо технологію express для back-end  сервера
const express = require("express")
//створюємо роутер-місце, куди ми підключаємо ендпоінти
const router = express.Router()

const { Post } = require("../class/post")

//=================================

//router.get створює нам один ендпоінт

//тут вводимо шлях (PATH) до сторінки

router.post("/post-create", function (req, res) {
    try {
        const { username, text, postId } = req.body

        if (!username || !text) {
            return res.status(400).json({
                message:
                'Потрібно передати всі данні для створення поста',
            })
        }

        let post = null

        console.log(postId, 'postId')

        if (postId) {
            post = Post.getById(Number(postId))
            console.log('post', post)

            if (!post) {
                return res.status(400).json({
                    message: 'Пост з таким ID не існує',
                })
            }
        }

        const newPost = Post.create(username, text, post)

        return res.status(200).json({
            post: {
                id: newPost.id,
                text: newPost.text,
                username: newPost.username,
                date: newPost.date,
            },
        })
    } catch (e) {
        return res.status(400).json({
            message:e.message,
        })
    }
})

router.get('/post-list', function (req, res) {
    try {
        const list = Post.getList()

        if (list.length === 0) {
            return res.status(200).json({
                list: [],
            })
        }

        return res.status(200).json({
            list: list.map(({ id, username, text, date }) => ({
                id,
                username,
                text,
                date,
            })),
        })
    } catch (e) {
        return res.status(400).json({
            message:e.message,
        })
    }
})

router.get('/post-item', function (req, res) {
    try {
        const { id } = req.query

        if (!id) {
            return res.status(400).json({
                message: 'Потрібно передати ID посту',
            })
        }

        const post = Post.getById(Number(id))

        if (!post) {
            return res.status(400).json({
                message: 'Пост з таким ID не існує',
            })
        }
//Щоб отримувати інформацію про певний пост
        return res.status(200).json({
            post: {
                id: post.id,
                text: post.text,
                username: post.username,
                date: post.date,

                reply: post.reply.map((reply) => ({
                    id: reply.id,
                    text: reply.text,
                    username: reply.username,
                    date: reply.date,
                })),
            },
        })
    } catch (e) {
        return res.status(400).json({
            message: e.message,
        })
    }
})

//Підключаємо роутер до back-end
module.exports = router


