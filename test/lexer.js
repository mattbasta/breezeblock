var assert = require('assert');

var lexer = require('../lib/lexer');


describe('Lexer', function() {

    describe('readUntil()', function() {

        it('should read until the first matched token', function() {

            var lex = lexer('123 456 789 foo 123');
            assert.equal(lex.readUntil(['identifier']), '123 456 789 ');
            assert.equal(lex.readUntil(['int']), 'foo ');

        });

    });

    describe('peek()', function() {

        it('should show the first matched token', function() {

            var lex = lexer('{{ {% if <');
            assert.equal(lex.peek().type, '{{');
            assert.equal(lex.peek().type, '{{');
            assert.equal(lex.peek().type, '{{');

        });

        it('should be cleared on next()', function() {

            var lex = lexer('{{ {% if <');
            assert.equal(lex.peek().type, '{{');
            assert.equal(lex.next().type, '{{');
            assert.equal(lex.peek().type, '{%if');

        });

    });

    describe('accept()', function() {

        it('should accept the first matched token', function() {

            var lex = lexer('{{ {% if <');
            assert.equal(lex.accept('int'), null);
            assert.equal(lex.accept('{{').type, '{{');

        });

    });

    describe('assert()', function() {

        it('should return the first token if it matches', function() {

            var lex = lexer('{{ {% if <');
            assert.equal(lex.assert('{{').type, '{{');

        });

        it('should return a syntax error if it does not match', function() {

            var lex = lexer('{{ {% if <');
            assert.throws(function() {
                lex.assert('}}');
            }, /SyntaxError/);

        });

    });

});
