import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {createProxyMiddleware} from "http-proxy-middleware" 

const app = express();
const port = 3000;

//Middlewares

app.use(cors())
app.use(morgan("combined"))
app.disable("x-powered-by")

//Change when in production
const services = [
    {
        route: "/api",
        target: "http://localhost:5000"
    }
]

const rateLimit = 20;
const interval = 60 * 1000;

const requestsCounts = {}

setInterval(()=>{
    Object.keys(requestsCounts).forEach((ip) => {
        requestsCounts[ip] = 0
    })
}, interval)

function rateLimitAndTimeout(req,res,next){
    const ip = req.ip

    requestsCounts[ip] = (requestsCounts[ip] || 0) + 1;

    if (requestsCounts[ip] > rateLimit){
        return res.status(429).json({
            code: 429,
            status: "Error",
            message: "Rate Limit exceeded",
            data: null,
        })
    }

      req.setTimeout(15000, () => {
    // Handle timeout error
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.abort(); // Abort the request
  });

  next(); // Continue to the next middleware
}

// Apply the rate limit and timeout middleware to the proxy
app.use(rateLimitAndTimeout);

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  };

  // Apply rate limiting and timeout middleware before proxying
  app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

// Handler for route-not-found
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});