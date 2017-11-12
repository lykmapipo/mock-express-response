'use strict';

//dependencies
var path = require('path');
var ejs = require('ejs');
var expect = require('chai').expect;
var MockExpressResponse = require(path.join(__dirname, '..', 'index'));


describe('MockExpressResponse', function() {
    it('should be a function constructor', function(done) {
        expect(MockExpressResponse).to.be.a('function');
        done();
    });


    it('should be able to instantiate it', function(done) {
        var response = new MockExpressResponse();

        expect(response.statusCode).to.be.equal(200);
        expect(response.statusMessage).to.be.equal('OK');

        done();
    });


    it('should be able to set status `code`', function(done) {
        var response = new MockExpressResponse();
        response.status(404);

        expect(response.statusCode).to.be.equal(404);
        expect(response.statusMessage).to.be.equal('Not Found');

        done();
    });

    it('should be able to set Link header field with the given `links`', function(done) {
        var response = new MockExpressResponse();
        response.links({
            next: 'http://api.example.com/users?page=2',
            last: 'http://api.example.com/users?page=5'
        });

        expect(response._headers.link)
            .to.be.equal('<http://api.example.com/users?page=2>; rel="next", <http://api.example.com/users?page=5>; rel="last"');

        done();
    });


    it('should be able to set _Content-Type_ response header with `type` through `mime.lookup()`', function(done) {
        var response = new MockExpressResponse();
        response.type('json');

        expect(response.get('content-type')).to.be.equal('application/json; charset=utf-8');


        done();
    });


    it('should be able to send response', function(done) {

        var response = new MockExpressResponse();
        response.send('<p>some html</p>');

        expect(response._getString()).to.be.equal('<p>some html</p>');

        done();
    });


    it('should be able to send json response', function(done) {

        var response = new MockExpressResponse();
        response.json({
            user: {
                isActive: true
            }
        });

        expect(response._getJSON()).to.be.eql({
            user: {
                isActive: true
            }
        });

        done();
    });


    it('should be able to send jsonp response', function(done) {

        var response = new MockExpressResponse();
        response.jsonp({
            user: {
                isActive: true
            }
        });

        expect(response._getJSON()).to.be.eql({
            user: {
                isActive: true
            }
        });

        done();
    });


    it('should be able to send given HTTP status code', function(done) {
        var response = new MockExpressResponse();
        response.sendStatus(200);

        expect(response.statusCode).to.be.equal(200);
        expect(response.statusMessage).to.be.equal('OK');

        done();
    });


    it('should be able to respond to the Acceptable formats using an `obj` of mime-type callbacks', function(done) {
        var response = new MockExpressResponse();

        response.format({
            'text/plain': function() {
                response.send('hey');
            },

            'text/html': function() {
                response.send('<p>hey</p>');
            },

            'appliation/json': function() {
                response.send({
                    message: 'hey'
                });
            }
        });

        expect(response._getString()).to.be.equal('<p>hey</p>');

        done();
    });


    it('should be able to append additional header `field` with value `val`', function(done) {
        var response = new MockExpressResponse();
        response.append('Warning', '199 Miscellaneous warning');

        expect(response.get('Warning')).to.be.equal('199 Miscellaneous warning');

        done();
    });

    it('should be able to clear cookie `name`', function(done) {
        var response = new MockExpressResponse();

        response.cookie('rememberme', '1', {
            maxAge: 900000,
            httpOnly: true
        });

        expect(response.get('Set-Cookie')).to.contain('rememberme=1; Max-Age=900;');

        response.clearCookie();

        expect(response.get('Set-Cookie').toString())
            .to.be.contain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

        done();

    });


    it('should be able to Set cookie `name` to `val`, with the given `options`', function(done) {
        var response = new MockExpressResponse();

        response.cookie('rememberme', '1', {
            maxAge: 900000,
            httpOnly: true
        });

        expect(response.get('Set-Cookie')).to.contain('rememberme=1; Max-Age=900;');

        done();

    });

    it('should be able to Set the location header to `url`', function(done) {
        var response = new MockExpressResponse();
        response.location('http://example.com');

        expect(response.get('Location')).to.be.equal('http://example.com');

        done();
    });


    it('should be able to redirect to the given `url` with optional response `status` defaulting to 302.', function(done) {
        var response = new MockExpressResponse();
        response.redirect('/home');

        expect(response.statusCode).to.be.equal(302);
        expect(response.get('Location')).to.be.equal('/home');

        done();
    });


    it('should be able to set _Content-Disposition_ header to _attachment_ with optional `filename`', function(done) {
        var response = new MockExpressResponse();
        response.attachment('home.pdf');

        expect(response.get('content-type')).to.be.equal('application/pdf');
        expect(response.get('content-disposition'))
            .to.be.equal('attachment; filename="home.pdf"');

        done();
    });


    it('should be able to render `view` with the given `options` and optional callback `fn`', function(done) {
        var response = new MockExpressResponse();
        response.render('<p>Hi</p>');

        expect(response.get('content-type')).to.be.equal('text/html; charset=utf-8');
        expect(response._getString()).to.be.equal('<p>Hi</p>');

        //make use of template engine
        var _response = new MockExpressResponse({
            render: ejs.renderFile
        });

        _response.render(path.join(__dirname, 'template.ejs'), {
            name: 'Mock'
        });

        expect(_response._getString()).to.be.equal('<p>Hello Mock</p>');

        done();
    });


    it('should be able to transfer the file at the given `path`', function(done) {
        var response = new MockExpressResponse();
        response
            .sendFile(path.join(__dirname, 'template.ejs'), function(error, result) {
                console.log(error);
                console.log(result);
                // console.log(response);

                done();
            });
    });


    it('should be able to add `field` to Vary', function(done) {
        var response = new MockExpressResponse();
        response.vary('w');

        expect(response.get('vary')).to.be.equal('w');

        done();
    });


    it('should be able to set and get value for header `field`', function(done) {
        var response = new MockExpressResponse();

        response.set('Type', 'x');

        expect(response.get('Type')).to.be.equal('x');

        done();
    });


});
