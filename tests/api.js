import { getMarketPrice, getMarketPrices } from '../src/api';

describe('Api', () => {

    describe('fetch market price from coinmarketcap.com', () => {

        it('should fetch market price for NEO in USD', (done) => {
            getMarketPrice(1337, 'USD', 'neo').then((price) => {
                price.should.be.a('string');
                // should start with a $ sign
                price.substr(0,1).should.equal('$');

                done();
            })
        });

        it('should fetch market price for GAS in EUR', (done) => {
            getMarketPrice(1337, 'EUR', 'gas').then((price) => {
                price.should.be.a('string');
                //should end with a € sign
                price.substr(price.length-1,price.length).should.equal('€');

                done();
            })
        });

        it('should fetch market price for NEO and GAS in USD', (done) => {
            getMarketPrices({neo: 123, gas: 456}, 'USD').then((price) => {
                price.should.be.a('object');
                price.Neo.should.be.a('string');
                price.Gas.should.be.a('string');
                price.Neo.substr(0,1).should.equal('$');
                price.Gas.substr(0,1).should.equal('$');

                done();
            })
        });

        it('should fail because of unknown asset type', (done) => {
            getMarketPrice(1337, 'USD', 'DOESNOTEXIST').then(() => {
                // fail there
                throw new Error();
            }).catch( () => {
                done();
            })
        });

        it('should fail because of unknown currency code', (done) => {
            getMarketPrice(1337, 'XYZ', 'neo').then(() => {
                // fail here
                throw new Error();
            }).catch( () => {
                done();
            })
        });

    });

});
