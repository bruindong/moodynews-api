var qs         = require ('querystring');

var mysql      = require ('mysql');
var connection = mysql.createConnection({
    host     : 'moody-news.cf8ner8zdnyi.us-west-2.rds.amazonaws.com',
    user     : 'clientuser',
    password : 'clientuser',
    port     : '3306'
});
connection.connect(function(err) {
    if (err) {
      console.error('Databas connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
});


var appRouter = function (app)
{
    app.get ("/", function (req, res)
    {
        res.status(200).send ("Welcome to our restful API");
    });

    app.get ("/headlines", function (req, res)
    {
        var headlines = [];
        let sql = "SELECT h.hl_id, DATE_FORMAT(hl_datetime, '%l:%i %p') as hl_time, DATE_FORMAT(hl_datetime, '%m/%d/%y') as hl_date, h.hl_datetime, h.hl_headline, a.article_headline, a.article_url, a.article_source, a.article_description, a.article_favicon_url, a.article_thumbnail_url FROM newsDB.headlines AS h, newsDB.articles AS a WHERE h.hl_id = a.fk_hl_id ORDER BY h.hl_datetime DESC LIMIT 10";

        connection.query (sql, (error, results, fields) =>
        {
            if (error) { return console.error (error.message); }

            for (var i in results)
            {
                headlines.push ({
                  headline_id     : results[i].hl_id,
                  date            : results[i].hl_date,
                  time            : results[i].hl_time,
                  datetime        : results[i].hl_datetime,
                  headline        : results[i].hl_headline,
                  a_headline      : results[i].article_headline,
                  a_url           : results[i].article_url,
                  a_source        : results[i].article_source,
                  a_description   : results[i].article_description,
                  a_favicon_url   : results[i].article_favicon_url,
                  a_thumbnail_url : results[i].article_thumbnail_url
                });
            }

            res.status(200).send(headlines);
        })
    });

    app.get ("/headlines_with_moods", function (req, res)
    {
        var headlines = [];
        var sql = "SELECT h.hl_id, DATE_FORMAT(hl_datetime, '%l:%i %p') as hl_time, DATE_FORMAT(hl_datetime, '%m/%d/%y') as hl_date, h.hl_datetime, h.hl_headline, a.article_headline, a.article_url, a.article_source, a.article_description, a.article_favicon_url, a.article_thumbnail_url, m.fk_hl_id, m.mood_value, (SELECT AVG(mood_value) FROM newsDB.moods WHERE fk_hl_id = h.hl_id GROUP BY fk_hl_id) as avg_mood_value, (SELECT COUNT(mood_value) FROM newsDB.moods WHERE fk_hl_id = h.hl_id GROUP BY fk_hl_id) as count_mood_value FROM newsDB.headlines as h LEFT JOIN newsDB.articles as a ON h.hl_id = a.fk_hl_id LEFT JOIN newsDB.moods as m ON h.hl_id = m.fk_hl_id and m.user_udid = '";

        sql = sql + req.query.user_udid + "'"
        sql = sql + " ORDER BY h.hl_datetime DESC LIMIT 10"

        connection.query (sql, (error, results, fields) =>
        {
            if (error) { return console.error (error.message); }

            for (var i in results)
            {
                headlines.push ({
                  headline_id      : results[i].hl_id,
                  date             : results[i].hl_date,
                  time             : results[i].hl_time,
                  datetime         : results[i].hl_datetime,
                  headline         : results[i].hl_headline,
                  a_headline       : results[i].article_headline,
                  a_url            : results[i].article_url,
                  a_source         : results[i].article_source,
                  a_description    : results[i].article_description,
                  a_favicon_url    : results[i].article_favicon_url,
                  a_thumbnail_url  : results[i].article_thumbnail_url,
                  hl_id            : results[i].fk_hl_id,
                  mood_value       : results[i].mood_value,
                  avg_mood_value   : results[i].avg_mood_value,
                  count_mood_value : results[i].count_mood_value
                });
            }

            res.status(200).send(headlines);
        })
    });



    app.get ("/headlines_with_moods_date", function (req, res)
    {
        var headlines = [];
        var sql = "SELECT h.hl_id, DATE_FORMAT(hl_datetime, '%l:%i %p') as hl_time, DATE_FORMAT(hl_datetime, '%m/%d/%y') as hl_date, h.hl_datetime, h.hl_headline, a.article_headline, a.article_url, a.article_source, a.article_description, a.article_favicon_url, a.article_thumbnail_url, m.fk_hl_id, m.mood_value, (SELECT AVG(mood_value) FROM newsDB.moods WHERE fk_hl_id = h.hl_id GROUP BY fk_hl_id) as avg_mood_value, (SELECT COUNT(mood_value) FROM newsDB.moods WHERE fk_hl_id = h.hl_id GROUP BY fk_hl_id) as count_mood_value FROM newsDB.headlines as h LEFT JOIN newsDB.articles as a ON h.hl_id = a.fk_hl_id LEFT JOIN newsDB.moods as m ON h.hl_id = m.fk_hl_id and m.user_udid = '";

        sql = sql + req.query.user_udid + "'"

        sql = sql + " WHERE h.hl_datetime < '" + req.query.end_date   + "' AND "
        sql = sql + "       h.hl_datetime > '" + req.query.start_date + "'"

        sql = sql + " ORDER BY h.hl_datetime DESC LIMIT 10"


        connection.query (sql, (error, results, fields) =>
        {
            if (error) { return console.error (error.message); }

            for (var i in results)
            {
                headlines.push ({
                  headline_id      : results[i].hl_id,
                  date             : results[i].hl_date,
                  time             : results[i].hl_time,
                  datetime         : results[i].hl_datetime,
                  headline         : results[i].hl_headline,
                  a_headline       : results[i].article_headline,
                  a_url            : results[i].article_url,
                  a_source         : results[i].article_source,
                  a_description    : results[i].article_description,
                  a_favicon_url    : results[i].article_favicon_url,
                  a_thumbnail_url  : results[i].article_thumbnail_url,
                  hl_id            : results[i].fk_hl_id,
                  mood_value       : results[i].mood_value,
                  avg_mood_value   : results[i].avg_mood_value,
                  count_mood_value : results[i].count_mood_value
                });
            }

            res.status(200).send(headlines);
        })
    });

    app.post ("/add_headline", function (req,res)
    {
        var pHeadline        = req.body.headline;
        var pArticleHeadline = req.body.a_headline;
        var pArticleURL      = req.body.a_url;
        var pArticleSource   = req.body.a_source;

        let sql1 = "INSERT INTO newsDB.headlines (hl_datetime, hl_headline) VALUES (NOW(),?)";
        let val1 = [pHeadline];
        connection.query(sql1, val1, (error, results, fields) =>
        {
            if (error) { return console.error(error.message); }

            headline_id = results.insertId;
            console.log (headline_id);

            let sql2 = "INSERT INTO newsDB.articles (fk_hl_id, article_url, article_headline, article_source) VALUES (?,?,?,?)";
            let val2 = [headline_id, pArticleURL, pArticleHeadline, pArticleSource];
            connection.query(sql2, val2, (error, results, fields) =>
            {
                if (error) { return console.error(error.message); }

                console.log (results.insertId);
            });
        });

        res.status(200).send (1);
    });

    app.post ("/add_headline_og", function (req,res)
    {
        var pHeadline           = req.body.headline;
        var pArticleHeadline    = req.body.a_headline;
        var pArticleURL         = req.body.a_url;
        var pArticleSource      = req.body.a_source;

        var pArticleFavicon     = req.body.a_favicon;
        var pArticleThumbnail   = req.body.a_thumbnail;
        var pArticleDescription = req.body.a_description;


        let sql1 = "INSERT INTO newsDB.headlines (hl_datetime, hl_headline) VALUES (NOW(),?)";
        let val1 = [pHeadline];
        connection.query(sql1, val1, (error, results, fields) =>
        {
            if (error) { return console.error(error.message); }

            headline_id = results.insertId;
            console.log (headline_id);

            let sql2 = "INSERT INTO newsDB.articles (fk_hl_id, article_url, article_headline, article_source, article_description, article_favicon_url, article_thumbnail_url) VALUES (?,?,?,?,?,?,?)";
            let val2 = [headline_id, pArticleURL, pArticleHeadline, pArticleSource, pArticleDescription, pArticleFavicon, pArticleThumbnail];
            connection.query(sql2, val2, (error, results, fields) =>
            {
                if (error) { return console.error(error.message); }

                console.log (results.insertId);
            });
        });

        res.status(200).send (1);
    });

    app.post ("/update_mood", function (req,res)
    {
        var pHeadlineID = req.body.hl_id;
        var pUserUDID   = req.body.user_udid;
        var pMoodValue  = req.body.mood_value;


        let sql1 = "UPDATE newsDB.moods SET mood_value = ? WHERE fk_hl_id = ? AND user_udid = ?";
        //let sql1 = "UPDATE newsDB.moods SET mood_value = " + pMoodValue + " WHERE fk_hl_id = " + pHeadlineID + " AND user_udid = '" + pUserUDID + "'";
        let val1 = [pMoodValue, pHeadlineID, pUserUDID];
        connection.query(sql1, val1, (error, results, fields) =>
        //connection.query(sql1, (error, results) =>
        {
            if (error) { return console.error(error.message); }
        });

        res.status(200).send (1);
    });

    app.post ("/add_mood", function (req,res)
    {
        var pHeadlineID = req.body.hl_id;
        var pUserUDID   = req.body.user_udid;
        var pMoodValue  = req.body.mood_value;


        let sql1 = "INSERT INTO newsDB.moods (fk_hl_id, user_udid, mood_value) VALUES (?, ?, ?)";
        let val1 = [pHeadlineID, pUserUDID, pMoodValue];
        connection.query(sql1, val1, (error, results, fields) =>
        {
            if (error) { return console.error(error.message); }
        });

        res.status(200).send (1);
    });
}

module.exports = appRouter;
