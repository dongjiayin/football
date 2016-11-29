// module.exports = {
//     rules:[
//         {
//             pattern:/\/api\/getLivelist.php\?rtype=origin$/,
//             respondwith:"./livelist.json"
//         },
//         {
//             pattern:/\/api\/getLiveDetail.php\?id=\d+$/,
//             respondwith:"./liveDetail.json"
//         },
//         {
//             pattern:/\/api\/getLivelist.php\?rtype=refresh$/,
//             respondwith:"./livelist-refresh.json"
//         },
//         {
//             pattern:/\/api\/getLivelist.php\?rtype=more$/,
//             respondwith:"./livelist-more.json"
//         }
//     ]
// }


module.exports = {
    rules:[
        {
            pattern:/\/api\/getlive.php\?action=origin$/,
            respondwith:'./livelist.json'
        },
        {
            pattern:/\/api\/getlive.php\?action=refresh$/,
            respondwith:'./livelist-refresh.json'
        },
        {
            pattern:/\/api\/getlive.php\?action=more$/,
            respondwith:'./livelist-more.json'
        }
    ]
}
