const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const recipe_list = [
    {
        name: 'strozzapreti',
        address: 'https://www.giallozafferano.it/ricerca-ricette/strozzapreti/'
    },
    {
        name: 'Fusilli avellinesi',
        address: 'https://www.giallozafferano.it/ricerca-ricette/fusilli+avellinesi/'
    },
    {
        name: 'orecchiette',
        address: 'https://www.giallozafferano.it/ricerca-ricette/orecchiette/'
    },
    {
        name: 'cavatelli',
        address: 'https://www.giallozafferano.it/ricerca-ricette/cavatelli/'
    },
    {
        name: 'Gnocchetti Sardi',
        address: 'https://ricette.giallozafferano.it/ricette-con-gli-Gnocchetti-Sardi/'
    },
    {
        name: 'paccheri',
        address: 'https://www.giallozafferano.it/ricerca-ricette/paccheri/'
    },
    {
        name: 'calamarata',
        address: 'https://www.giallozafferano.it/ricerca-ricette/calamarata/'
    },
    {
        name: 'scialatielli',
        address: 'https://www.lamolisana.it/ricette/ricette-con-scialatielli'
    },
    {
        name: 'trofie',
        address: 'https://blog.giallozafferano.it/valeriaciccotti/primi-piatti-con-le-trofie/'
    },
    {
        name: 'Penne Rigate',
        address: 'https://ricette.giallozafferano.it/ricette-con-le-Penne-Rigate/'
    },
    {
        name: 'tagliatelle',
        address: 'https://www.giallozafferano.it/ricerca-ricette/tagliatelle'
    }
]

const recipes = []
let i = 1;

recipe_list.forEach(recipe => {
    axios.get(recipe.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('.gz-card.gz-card-vertical a', html).each(function () {
                const title = $(this).attr('title')
                const url = $(this).attr('href')

                recipes.push({
                    id: i++,
                    title: title,
                    url: url,
                    source: recipe.name
                })
            })
            $('.elementor-post__title a', html).each(function () {
                const title = $(this).text().trim()
                const url = $(this).attr('href')

                recipes.push({
                    id: i++,
                    title: title,
                    url: url,
                    source: recipe.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to Recipe Scraper API')
})

app.get('/recipes', (req, res) => {
    res.json(recipes)
})

app.get('/recipes/:recipeSource', (req, res) => {
    let recipeSource = parseInt(req.params.recipeSource)
    let specificRecipes
    if (isNaN(recipeSource)) {
        recipeSource = req.params.recipeSource
        specificRecipes = recipes.filter(recipe => recipe.source === recipeSource)
    } else {
        specificRecipes = recipes.filter(recipe => recipe.id === recipeSource)[0]
    }

    res.json(specificRecipes)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
