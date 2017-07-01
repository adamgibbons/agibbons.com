# agibbons.com

Static site generator built with [Metalsmith](http://www.metalsmith.io/) and [Bulma]().

## Usage

Note - you must have node installed.

```
git clone git@github.com:adamgibbons/agibbons

cd agibbons

npm install

make
```

The website is now compiled at `/build`, and you can view it locally by running a local/dev server. For example - 

```
cd build

python -m SimpleHTTPServer 4020
```

Your site should now be running at [http://localhost:4020](http://localhost:4020)!

## Deploying

You can ship the built site to an S3 bucket. First, you'll need to set local environmental variables specifying your AWS access key ID, secret key, and the name of the target bucket. These variables are pulled from an `.env` file which you can create by running:

```
cp .env/copy .env
```

Open your new `.env` file and replace the dummy values with your real ones.

To deploy, first make sure you've built the project and then run:

```
nmp run deploy
```
