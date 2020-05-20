const express = require('express');

// database access using knex
const knex = require('../data/db-config.js');

const router = express.Router();

// This is the syntax similar to what I have been using. It still works with knex,
// but we will be using async and await (below) to learn that syntax as well
// 
// router.get('/', (req, res) => {
//     knex('posts')
//         .then(posts => {
//             res.json(posts);
//         })
//         .catch(err => {
//             console.log(err);
//             res.json(500).json({ message: 'problem with db', error:err });
//         })
// })

router.get('/', async (req, res) => {
    try {
        const posts = await knex('posts');
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'problem with db', error: err});
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const result = await knex('posts').where({id});
        if (result.length === 0) {
            return res.status(404).json({message: 'no post found'})
        } else {
        res.status(200).json(result);
        }
    } catch {
        res.status(500).json({ errorMessage: 'problem with db'})
    }
});


router.post('/', async (req, res) => {
    const postData = req.body;

    try {
        const numPosts = await knex('posts').insert(postData);
        res.status(200).json(numPosts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'problem with db', error:err});
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;
    
    try {
        const count = await knex('posts').update(updatedPost).where({id});
        if (count) {
            res.json({ updated: count});
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: "problem with db", error: err })
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try{
        const count = await knex('posts').del().where({ id });
        if (count) {
            res.status(200).json({ deleted: count });
        } else {
            res.status(404).json({ message: 'invalid id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ errorMessage: "problem with db", error: err })
    }
});

module.exports = router;