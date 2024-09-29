const express = require("express");
const router = express.Router();
const Poll = require('../Models/poll');
const User = require('../Models/user')
const { validateToken} = require("../Middleware/jwt")


router.post("/poll", validateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const tagsArray = [];
        if (req.body.tagNames && Array.isArray(req.body.tagNames)) {
            req.body.tagNames.forEach((tagName, index) => {
                tagsArray.push({ [`tag${index + 1}`]: tagName });
            });
        }

        const optionsArray = [];
        if (req.body.optionNames && Array.isArray(req.body.optionNames)) {
            req.body.optionNames.forEach((optionName, index) => {
                optionsArray.push({ [`option${index + 1}`]: optionName });
            });
        }

        const poll = new Poll({
            question: req.body.question,
            options: optionsArray,
            votes: req.body.votes || 0,
            expireDate: req.body.expireDate,
            expireTime: req.body.expireTime,
            isActive: req.body.isActive || false,
            category: req.body.category,
            description: req.body.description,
            tags: tagsArray,
            resultsVisibility: req.body.resultsVisibility || true,
            allowMultiple: req.body.allowMultiple || false,
            userHasVoted: req.body.userHasVoted || false,
            author: userId 
        });

        const savedPoll = await poll.save();
        req.user.polls = req.user.polls || [];
        req.user.polls.push(savedPoll._id);
        await req.user.save();
        res.status(201).json(savedPoll);
    } catch (err) {
        console.error('Error saving poll:', err);
        res.status(500).json({ error: 'Server error while saving poll' });
    }
});



router.get('/all', (req, res) => {
    Poll.find()
        .then((results) => {
            res.send(results)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put("/update-poll/:id", async (req, res) => {
    try {
        const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).send(poll)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
