const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const fs = require('fs')

chai.use(chaiHttp)

describe('API ENDPOINT TESTING', () => {
    it('GET Landing Page', (done) => {
        chai.request(app).get('/api/v1/member/landing-page').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('hero')
            expect(res.body.hero).to.have.all.keys('travellers', 'treasures', 'cities')
            expect(res.body).to.have.property('mostPicked')
            expect(res.body.mostPicked).to.have.an('array')
            expect(res.body).to.have.property('category')
            expect(res.body.category).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            done()
        })
    })

    it('GET Detail Page', (done) => {
        chai.request(app).get('/api/v1/member/detail-page/6076c5de03fc573fa0874d77').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('country')
            expect(res.body).to.have.property('is_popular')
            expect(res.body).to.have.property('unit')
            expect(res.body).to.have.property('sum_booking')
            expect(res.body).to.have.property('image_id')
            expect(res.body.image_id).to.have.an('array')
            expect(res.body).to.have.property('feature_id')
            expect(res.body.feature_id).to.have.an('array')
            expect(res.body).to.have.property('activity_id')
            expect(res.body.activity_id).to.have.an('array')
            expect(res.body).to.have.property('_id')
            expect(res.body).to.have.property('title')
            expect(res.body).to.have.property('price')
            expect(res.body).to.have.property('city')
            expect(res.body).to.have.property('description')
            expect(res.body).to.have.property('__v')
            expect(res.body).to.have.property('bank')
            expect(res.body.bank).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            done()
        })
    })

    it('POST Booking Page', (done) => {
        const image = __dirname + '/buktibayar.jpeg'
        const dataSample = {
            image,
            id_item: '6076c5de03fc573fa0874d77',
            duration: 2,
            bookingStartDate: '4-17-2021',
            bookingEndDate: '4-19-2021',
            firstName: 'Mason',
            lastName: 'Mount',
            email: 'mason.mount@chelsea.com',
            phoneNumber: '08123456789',
            accountHolder: 'Mason Mount',
            bankFrom: 'BCA'
        }

        chai.request(app).post('/api/v1/member/booking-page')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('id_item', dataSample.id_item)
        .field('duration', dataSample.duration)
        .field('bookingStartDate', dataSample.bookingStartDate)
        .field('bookingEndDate', dataSample.bookingEndDate)
        .field('firstName', dataSample.firstName)
        .field('lastName', dataSample.lastName)
        .field('email', dataSample.email)
        .field('phoneNumber', dataSample.phoneNumber)
        .field('accountHolder', dataSample.accountHolder)
        .field('bankFrom', dataSample.bankFrom)
        .attach('image', fs.readFileSync(dataSample.image), 'buktibayar.jpeg')
        .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(201)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('message')
            expect(res.body.message).to.equal('Booking success.')
            expect(res.body).to.have.property('booking')
            expect(res.body.booking).to.have.all.keys('payments', '_id', 'invoice', 'bookingStartDate', 'bookingEndDate', 'total', 'item_id', 'member_id', '__v')
            expect(res.body.booking.payments).to.have.all.keys('status', 'proofPayment', 'bankFrom', 'accountHolder')
            expect(res.body.booking.item_id).to.have.all.keys('_id', 'title', 'price', 'duration')
            console.log(res.body.booking)
            done()
        })
    })
})