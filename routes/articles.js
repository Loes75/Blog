const express = require('express');
const Article = require('./../models/article');
const { render } = require('ejs');

const router = express.Router();


router.get('/new',(req,res)=>{
    res.render('articles/new', {article : new Article()});
});

router.get('/edit/:id', async(req,res)=>{
    const article =  await Article.findById(req.params.id);
    res.render('articles/edit', {article : article});
});
router.post('/', async (req,res,next)=>{
  req.article = new Article();  
  next();
}, createOrUpdatedArticle('new'));

router.put('/:id', async(req,res,next)=>{
    req.article = await Article.findById(req.params.id);
    next();
},createOrUpdatedArticle('edit'));

router.get('/:slug', async (req,res)=>{
    try{
        let article = await Article.findOne({slug : req.params.slug});
        res.render('articles/show',{article : article});
    } catch (e){
        res.redirect('/');
    }
   
})


router.delete('/:id', async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function createOrUpdatedArticle (path){
    return async(req,res)=>{
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        
        try {
           article = await article.save();
           res.redirect(`/articles/${article.slug}`);
        } catch(e){
            console.log(e);
            res.render(`articles/${path}`,{article : article});
        }
    }
}

module.exports = router;