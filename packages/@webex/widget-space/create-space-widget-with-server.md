# Create Space Widget with Express _(@webex/widget-space)_

## Background

While it is possible to use widgets in standalone HTML pages on certain browsers, it is preferable to serve them in a web application to avoid [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) issues. 

## Get started

<p class="callout warning">Make sure you are using the latest <b>Node Long Term Support</b> and <b>Python 2.7</b>.

Install the *Express generator* globally. We will use this to quickly generate a web application.

```bash
npm install express-generator -g
```

Create your app with *Effective JavaScript templating (EJS)*. 

```bash
express --view=ejs myapp
```

<p class="callout info">Express ships with several great templating engines, but EJS is closest to HTML. It allows us to continue without learning another abstraction.</p>

Install the dependencies. 

```bash
cd myapp
npm install
```

Replace the contents of *views/index.ejs* with the following: 

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://code.s4d.io/widget-space/latest/main.css">
    <!-- Latest compiled and minified JavaScript -->
    <script src="https://code.s4d.io/widget-space/latest/bundle.js"></script>
  </head>
  <body>
    <div 
      id="my-webex-widget" 
      style="display:inline-block; height: 415px;" />
    <script>
      var widgetEl = document.getElementById('my-webex-widget');
      // Init a new widget
      webex.widget(widgetEl).spaceWidget({
        accessToken: 'REPLACE WITH YOUR ACCESS TOKEN',
        spaceId: 'REPLACE WITH SPARK SPACE ID'
      });
    </script>
  </body>
</html>
```

Your `accessToken` allows you to perform actions in Cisco Spark as yourself. Get your `accessToken` at https://developer.webex.com/docs/api/getting-started#accounts-and-authentication and replace the value of `accessToken` with it.

`spaceId` is the ID of the Spark space where you wish to read and send messages. Visit https://developer.webex.com/docs/api/v1/rooms/list-rooms to list the spaces (rooms) you have access to. Choose an ID from one of the spaces in the `items` array and replace the value of `spaceId` with it. 

Start the application. 

```bash
DEBUG=myapp:* npm start
```

:tada: Congratulations! You created your first widget. 

Type a message and send it to the space. You should see it reflected in both your widget and the Spark client. 

## References

1. Bender, Brian, et al. Spark Space Widget (@webex/Widget-Space). GitHub, 11 Apr. 2017, github.com/webex/react-widgets/blob/master/packages/@webex/widget-space/README.md.

## External links

- [Express > Installing](https://expressjs.com/en/starter/installing.html)
- [Express generator](https://expressjs.com/en/starter/generator.html)
- [Effective JavaScript templating](http://ejs.co/)
- [Comparing ejs vs. handlebars vs. jade vs. mustache vs. pug](https://npmcompare.com/compare/ejs,handlebars,jade,mustache,pug)

<style>
    .callout {
        border-radius: 4px; 
        border-style: solid;
        border-width: 1px;
        line-height: 21px;
        padding: 16px;
    }

    .info {
        background-color: #d9edf7;
        color: #31708f;
    }

    .warning {
        background-color: #fcf8e3;
        color: #8a6d3b;
    }
</style>