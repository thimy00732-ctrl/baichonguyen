const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const PostLike = require('../models/PostLike');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Tạo bài viết
router.post('/', authenticate, async (req, res) => {
  try {
    const { category, title, content } = req.body;

    const post = new Post({
      authorId: req.user._id,
      category,
      title,
      content,
      status: 'Pending' // Chờ admin duyệt
    });

    await post.save();

    res.status(201).json({
      message: 'Post created (pending approval)',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Lấy danh sách bài viết đã duyệt
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: 'Approved' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('authorId', 'email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Lấy chi tiết bài viết
router.get('/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('authorId', 'email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'email');

    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
});

// Cập nhật bài viết (Author hoặc Admin)
router.put('/:postId', authenticate, async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user._id.toString() &&
        !req.user.roles.some(r => r.roleName === 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    post.category = category || post.category;
    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = new Date();

    await post.save();

    res.json({
      message: 'Post updated',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Bình luận vào bài viết
router.post('/:postId/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      postId: req.params.postId,
      userId: req.user._id,
      content
    });

    await comment.save();

    // Cập nhật số lượng bình luận
    post.commentCount += 1;
    await post.save();

    // Notify author
    if (post.authorId.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: post.authorId,
        title: 'New Comment',
        content: `Someone commented on your post: ${post.title}`,
        relatedId: comment._id,
        relatedType: 'Comment'
      });
    }

    res.status(201).json({
      message: 'Comment created',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

// Like bài viết
router.post('/:postId/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await PostLike.findOne({
      postId: req.params.postId,
      userId: req.user._id
    });

    if (existingLike) {
      // Unlike
      await PostLike.deleteOne({ _id: existingLike._id });
      post.likeCount -= 1;
    } else {
      // Like
      const like = new PostLike({
        postId: req.params.postId,
        userId: req.user._id
      });
      await like.save();
      post.likeCount += 1;
    }

    await post.save();

    res.json({
      message: existingLike ? 'Post unliked' : 'Post liked',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
});

module.exports = router;
