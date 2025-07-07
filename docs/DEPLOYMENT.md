# Deployment Guide

Production deployment guide for the Vantage WebUI application with hosting recommendations and environment configuration.

## 🏗️ Production Build

### Building the Application

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Build Output

The production build creates optimized files in the `dist/` directory:

```
dist/
├── index.html          # Main HTML file
├── assets/
│   ├── index-[hash].js # Main JavaScript bundle
│   ├── index-[hash].css # Compiled CSS
│   └── [asset-hash].*  # Static assets (images, fonts)
└── vite.svg           # Favicon and static files
```

### Build Optimization

The build process includes:
- **Tree shaking** - Remove unused code
- **Code splitting** - Separate vendor and app code
- **Minification** - Compress JavaScript and CSS
- **Asset optimization** - Optimize images and fonts
- **Cache busting** - File hashing for cache invalidation

### Build Analysis

```bash
# Analyze bundle size (install bundle analyzer first)
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ]
})

# Build and analyze
npm run build
```

## 🔧 Environment Variables

### Production Environment Setup

Create environment-specific configuration files:

#### `.env.production`
```env
# Production API Configuration
VITE_API_URL=https://api.yourdomain.com

# Feature Flags
VITE_ENABLE_PROFILING=false
VITE_DEBUG_MODE=false

# Analytics (if implemented)
VITE_ANALYTICS_ID=your-analytics-id

# Error Reporting (if implemented)
VITE_SENTRY_DSN=your-sentry-dsn
```

#### `.env.staging`
```env
# Staging API Configuration
VITE_API_URL=https://staging-api.yourdomain.com

# Feature Flags
VITE_ENABLE_PROFILING=true
VITE_DEBUG_MODE=true

# Staging-specific settings
VITE_ENVIRONMENT=staging
```

### Environment Variable Categories

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.yourdomain.com` |

#### Optional Variables

| Variable | Description | Default | Production Value |
|----------|-------------|---------|------------------|
| `VITE_ENABLE_PROFILING` | Enable performance profiling | `false` | `false` |
| `VITE_DEBUG_MODE` | Enable debug features | `false` | `false` |
| `VITE_ENVIRONMENT` | Environment identifier | `production` | `production` |

#### Security Considerations

```bash
# ⚠️ NEVER include sensitive data in VITE_ variables
# These are exposed to the client-side code

# ✅ Good - Non-sensitive configuration
VITE_API_URL=https://api.yourdomain.com
VITE_APP_VERSION=1.0.0

# ❌ Bad - Sensitive data (use backend proxy instead)
VITE_API_SECRET=secret-key  # DON'T DO THIS
VITE_DATABASE_URL=...       # DON'T DO THIS
```

### Environment Loading Order

Vite loads environment variables in this order (later ones override earlier):
1. `.env`
2. `.env.local`
3. `.env.[mode]` (e.g., `.env.production`)
4. `.env.[mode].local`

## 🌐 Hosting Recommendations

### 1. Vercel (Recommended for JAMstack)

#### Advantages
- ✅ Zero-configuration deployment
- ✅ Automatic HTTPS and CDN
- ✅ Git integration with preview deployments
- ✅ Edge functions for API routes
- ✅ Excellent performance optimization

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Configure build settings in vercel.json
```

#### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Netlify

#### Advantages
- ✅ Simple drag-and-drop deployment
- ✅ Form handling and serverless functions
- ✅ Split testing and branch deployments
- ✅ Built-in CDN and asset optimization

#### Setup
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Docker Deployment

#### Advantages
- ✅ Consistent environment across deployments
- ✅ Easy scaling and orchestration
- ✅ Works with any cloud provider
- ✅ Isolated dependencies

#### `Dockerfile`
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### `nginx.conf`
```nginx
events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
  }
}
```

#### Docker Commands
```bash
# Build image
docker build -t vantage-webui .

# Run container
docker run -d -p 8080:80 --name vantage-webui vantage-webui

# Docker Compose
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4. AWS S3 + CloudFront

#### Advantages
- ✅ High availability and scalability
- ✅ Global CDN with edge locations
- ✅ Cost-effective for high traffic
- ✅ Integration with AWS services

#### Setup Steps

1. **Create S3 Bucket**
```bash
# Create bucket
aws s3 mb s3://your-app-bucket

# Enable static website hosting
aws s3 website s3://your-app-bucket --index-document index.html --error-document index.html

# Upload build files
aws s3 sync dist/ s3://your-app-bucket --delete
```

2. **CloudFront Distribution**
```json
{
  "Origins": [{
    "DomainName": "your-app-bucket.s3.amazonaws.com",
    "Id": "S3-your-app-bucket",
    "S3OriginConfig": {
      "OriginAccessIdentity": ""
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-app-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "CachePolicyId": "managed-CachingOptimized"
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponseCode": 200,
    "ResponsePagePath": "/index.html"
  }]
}
```

### 5. GitHub Pages

#### Advantages
- ✅ Free hosting for public repositories
- ✅ Automatic deployment from GitHub Actions
- ✅ Custom domain support

#### GitHub Actions Workflow
`.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔒 Security Considerations

### Content Security Policy (CSP)

Add CSP headers to prevent XSS attacks:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourdomain.com;
  font-src 'self';
">
```

### HTTPS Configuration

Always use HTTPS in production:

```bash
# Nginx SSL configuration
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/certificate.crt;
  ssl_certificate_key /path/to/private.key;
  
  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
}
```

### Environment Secrets

Use secure secret management:

```bash
# Use CI/CD secret management
# GitHub Actions Secrets
# Vercel Environment Variables
# AWS Secrets Manager
# Azure Key Vault
```

## 📊 Monitoring and Analytics

### Performance Monitoring

```typescript
// Performance monitoring (add to main.tsx)
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0]
    console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart)
  })
}
```

### Error Tracking

```typescript
// Error boundary for production
import * as Sentry from '@sentry/react'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT
  })
}
```

### Health Checks

```typescript
// Health check endpoint for monitoring
// Add to Express server or serverless function
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/ci-cd.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linting
      run: npm run lint
      
    - name: Run tests
      run: npm run test -- --coverage
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: Deploy to production
      run: |
        # Add your deployment script here
        echo "Deploying to production..."
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit
```

#### Environment Variable Issues
```bash
# Verify environment variables are loaded
console.log('Environment:', import.meta.env)

# Check for missing VITE_ prefix
# ❌ API_URL=... (won't work)
# ✅ VITE_API_URL=... (works)
```

#### Routing Issues (SPA)
```nginx
# Ensure catch-all routing for SPAs
location / {
  try_files $uri $uri/ /index.html;
}
```

#### CORS Issues
```typescript
// Configure API base URL correctly
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Ensure backend CORS headers are set
```

### Performance Issues

#### Bundle Size Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Use dynamic imports for code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'))
```

#### Caching Issues
```bash
# Clear CDN cache after deployment
# Set proper cache headers for assets
# Use versioned asset names (automatic with Vite)
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Run tests (`npm run test`)
- [ ] Run linting (`npm run lint`)
- [ ] Build successfully (`npm run build`)
- [ ] Test production build locally (`npm run preview`)
- [ ] Verify environment variables
- [ ] Check API endpoints are accessible
- [ ] Review security headers

### Post-deployment
- [ ] Verify application loads correctly
- [ ] Test core functionality
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Verify analytics tracking
- [ ] Test on different devices/browsers
- [ ] Confirm HTTPS certificate

### Rollback Plan
- [ ] Keep previous version deployable
- [ ] Document rollback procedures
- [ ] Test rollback process
- [ ] Monitor application after rollback

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment Best Practices](https://create-react-app.dev/docs/deployment/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Performance Best Practices](https://web.dev/performance/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Remember**: Always test deployments in a staging environment before production! 🚀
