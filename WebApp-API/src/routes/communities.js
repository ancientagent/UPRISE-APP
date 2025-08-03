const Router = require('express').Router();

/**
 * @swagger
 * /communities/cities-autocomplete:
 *   get:
 *     summary: Provides city/state autocomplete suggestions
 *     description: Returns a list of cities and states matching the search query.
 *     tags:
 *       - Onboarding
 *       - Communities
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query for the city.
 *         example: aust
 *     responses:
 *       '200':
 *         description: A JSON array of city objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         example: "Austin"
 *                       state:
 *                         type: string
 *                         example: "Texas"
 *                       full_name:
 *                         type: string
 *                         example: "Austin, Texas"
 */
Router.get('/cities-autocomplete', (req, res) => {
    const { q } = req.query;
    
    const allCities = [
        { city: "Austin", state: "Texas", full_name: "Austin, Texas" },
        { city: "Austin", state: "Minnesota", full_name: "Austin, Minnesota" },
        { city: "Boston", state: "Massachusetts", full_name: "Boston, Massachusetts" },
        { city: "Augusta", state: "Georgia", full_name: "Augusta, Georgia" },
    ];

    if (!q) {
        return res.json({ cities: [] });
    }

    const filteredCities = allCities.filter(c => 
        c.full_name.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ cities: filteredCities });
});

module.exports = Router; 