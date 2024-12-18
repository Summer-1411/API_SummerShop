const Layout = (header, body) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <title>{{title}}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css"
            integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
        <style>
            body {
                background-color: #f7f7f7;
                color: #333333;
            }
    
            a {
                color: #156d6a;
            }
    
            h1 a,
            h2 a,
            h3 a {
                text-decoration: none;
            }
    
    
            #customers,
            #customers td,
            #customers th {
                border: 1px solid black;
                padding: 8px;
            }
    
            table,
            td,
            th {
                
                padding: 8px;
            }
    
            table {
                width: 100%;
                border-collapse: collapse;
            }
    
            #customers tr:nth-child(even) {
                background-color: #f2f2f2;
            }
    
            #customers tr:hover {
                background-color: #ddd;
            }
    
            #customers th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #3434c4;
                color: white;
            }
    
            .header {
                display: flex;
                justify-content: space-between;
            }
    
            .container {
                background-color: white;
                margin: 0 auto;
                padding: 50px;
            }
    
            .muted {
                color: #999999;
            }
    
            .bold {
                font-weight: bold;
            }
    
            .text-right {
                text-align: right;
            }
    
            .footer p {
                margin-top: 30px;
            }
    
            .success {
                background-color: #c0f5f3;
                color: #0d928d;
                padding: 10px;
            }
    
            .error {
                background-color: #f5c0c0;
                color: #792525;
                padding: 10px;
            }
            .row-item {
                margin-bottom: 10px;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
    
            <div>
                ${header}
                ${body}
            </div>
        </div>
        </div>
    </body>
    
    </html>`
}

module.exports = Layout